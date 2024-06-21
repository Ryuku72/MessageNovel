import { RealtimeChannel } from '@supabase/realtime-js';
import { REALTIME_LISTEN_TYPES } from '@supabase/realtime-js/src/RealtimeChannel';
import { SupabaseClient } from '@supabase/supabase-js';
import debug from 'debug';
import EventEmitter from 'events';
import * as awarenessProtocol from 'y-protocols/awareness';
import * as Y from 'yjs';
import { ActiveUserProfile } from '~/routes/dash.page.$page_id/components/PageRichTextEditor';

export interface SupabaseProviderConfig {
  channel: string;
  tableName: string;
  columnName: string;
  id: string | number;
  awareness?: awarenessProtocol.Awareness;
  resyncInterval?: number | false;
  enableLogger?: boolean;
  disableSave?: boolean;
  userData: ActiveUserProfile;
}

export default class SupabaseProvider extends EventEmitter {
  public awareness: awarenessProtocol.Awareness;
  public connected = false;
  private channel: RealtimeChannel | null = null;
  private _synced: boolean = false;
  protected logger: debug.Debugger;
  public readonly id: number;
  private resyncInterval: NodeJS.Timeout | undefined;
  public readonly channelName: string;
  public version: number = 0;
  private debounceUpdate: (update: Uint8Array) => void;

  isOnline(online?: boolean): boolean {
    if (!online && online !== false) return this.connected;
    this.connected = online;
    return this.connected;
  }

  onDocumentUpdate(update: Uint8Array, origin: unknown) {
    if (origin !== this) {
      this.debounceUpdate(update);
    }
  }

  onAwarenessUpdate({ added, updated, removed }: { added: number[]; updated: number[]; removed: number[] }) {
    const changedClients = added.concat(updated).concat(removed);
    const awarenessUpdate = awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients);
    this.emit('awareness', awarenessUpdate);
  }

  removeSelfFromAwarenessOnUnload() {
    if (this.doc === undefined) return;
    awarenessProtocol.removeAwarenessStates(this.awareness, [this.doc.clientID], 'window unload');
  }

  async save() {
    if (this.config.disableSave) return;
    const content = Array.from(Y.encodeStateAsUpdate(this.doc));
    if (JSON.stringify([0, 0]) === JSON.stringify(content)) return;

    const { error } = await this.supabase
      .from(this.config.tableName)
      .update({ [this.config.columnName]: content })
      .match({ id: this.config.id });

    if (error) throw error;
    this.emit('save', this.version);
  }

  private async onConnect() {
    this.logger(`${this.channelName}: ` + 'connected');
    const { data, error, status } = await this.supabase
      .from(this.config.tableName)
      .select<string, { [key: string]: number[] }>(`${this.config.columnName}`)
      .match({ id: this.config.id })
      .single();
    this.logger(`${this.channelName}: ` + 'retrieved data from supabase', status);
    if (error) {
      this.logger('error fetching data');
      this.emit('error', error);
    }
    if (data && data[this.config.columnName]) {
      this.logger(`${this.channelName}: ` + 'applying update to yjs');
      try {
        this.applyUpdate(Uint8Array.from(data[this.config.columnName]));
      } catch (error) {
        this.logger(`${this.channelName}: ` + 'error - ', error);
      }
    }

    this.logger(`${this.channelName}: setting connected flag to true`);
    this.isOnline(true);
    this.resync();

    this.emit('status', { status: 'connected' });

    if (this.awareness.getLocalState() !== null) {
      const awarenessUpdate = awarenessProtocol.encodeAwarenessUpdate(this.awareness, [this.doc.clientID]);
      this.emit('awareness', awarenessUpdate);
    }
  }

  private applyUpdate(update: Uint8Array, origin?: SupabaseProvider) {
    if (JSON.stringify([0, 0]) === JSON.stringify(update)) return;
    this.version++;
    Y.applyUpdate(this.doc, update, origin);
  }

  private disconnect() {
    if (!this.channel) return;
    this.supabase.removeChannel(this.channel);
    this.channel = null;
  }

  public connect() {
    const channel = this.supabase.channel(this.config.channel);
    if (!channel) return;
    channel
      .on(REALTIME_LISTEN_TYPES.BROADCAST, { event: 'message' }, ({ payload }) => {
        this.onMessage(Uint8Array.from(payload));
      })
      .on(REALTIME_LISTEN_TYPES.BROADCAST, { event: 'awareness' }, ({ payload }) => {
        this.onAwareness(Uint8Array.from(payload));
      })
      .on(REALTIME_LISTEN_TYPES.PRESENCE, { event: 'sync' }, () => {
        /** Get the presence state from the channel, keyed by realtime identifier */
        const presenceState = channel.presenceState();
        /** transform the presence */
        const users = Object.keys(presenceState)
          .map(presenceId => {
            const presences = presenceState[presenceId] as unknown as {
              data: ActiveUserProfile;
            }[];
            return presences.map(presence => ({
              [presence.data.userId]: {
                userId: presence.data.userId,
                username: presence.data.username,
                color: presence.data.color,
                avatar: presence.data.avatar
              }
            }));
          })
          .flat();
        /** sort and set the users */
        this.emit('online users', users);
      })
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          channel.track({ data: this.config.userData });
          this.emit('connect', this);
        }

        if (status === 'CHANNEL_ERROR') {
          this.logger(`${this.channelName}: ` + 'CHANNEL_ERROR', err);
          this.emit('error', this);
        }

        if (status === 'TIMED_OUT') {
          this.emit('disconnect', this);
        }

        if (status === 'CLOSED') {
          this.emit('disconnect', this);
        }
      });
    this.channel = channel;
  }

  private resync() {
    if (this.config.resyncInterval || typeof this.config.resyncInterval === 'undefined') {
      if (this.config.resyncInterval && this.config.resyncInterval < 3000) {
        throw new Error('resync interval of less than 3 seconds');
      }
      this.logger(
        `${this.channelName}: setting resync interval to every ${(this.config.resyncInterval || 5000) / 1000} seconds`
      );
      this.resyncInterval = setInterval(() => {
        this.logger(`${this.channelName}: ` + 'resyncing (resync interval elapsed)');
        this.emit('message', Y.encodeStateAsUpdate(this.doc));
        if (this.channel !== null && this.channel.state === 'joined') {
          this.channel.send({
            type: 'broadcast',
            event: 'message',
            payload: Array.from(Y.encodeStateAsUpdate(this.doc))
          });
        }
      }, this.config.resyncInterval || 5000);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
    let timeout: ReturnType<typeof setTimeout> | null;
    return (...args: Parameters<T>): Promise<ReturnType<T>> => {
      const later = () => {
        timeout = null;
        return func(...args);
      };
      clearTimeout(timeout!);
      timeout = setTimeout(later, wait);
      return new Promise(resolve => {
        if (!timeout) {
          resolve(func(...args));
        }
      });
    };
  }

  constructor(
    private doc: Y.Doc,
    private supabase: SupabaseClient,
    private config: SupabaseProviderConfig
  ) {
    super();

    this.awareness = this.config.awareness || new awarenessProtocol.Awareness(doc);
    this.config = config || {};
    this.id = doc.clientID;
    this.channelName = config.channel;
    this.supabase = supabase;

    this.on('connect', this.onConnect);
    this.on('disconnect', this.onDisconnect);
    this.on('error', this.onDisconnect);

    this.logger = debug('y-' + doc.clientID);
    // turn on debug logging to the console
    this.logger.enabled = config.enableLogger as boolean;

    this.logger(`${this.channelName}: constructor initializing`);
    this.logger(`${this.channelName}: connecting to Supabase Realtime`, doc.guid);

    this.debounceUpdate = this.debounce((update: Uint8Array) => {
      this.logger(`${this.channelName}: document updated locally, broadcasting update to peers`, this.isOnline());
      this.emit('message', update);
      this.logger('saving document');
      this.save();
    }, 500);

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.removeSelfFromAwarenessOnUnload);
    } else if (typeof process !== 'undefined') {
      process.on('exit', () => this.removeSelfFromAwarenessOnUnload);
    }
    this.on('awareness', update => {
      if (this.channel !== null && this.channel.state === 'joined')
        this.channel.send({
          type: 'broadcast',
          event: 'awareness',
          payload: Array.from(update)
        });
    });
    this.on('message', update => {
      if (this.channel !== null && this.channel.state === 'joined')
        this.channel.send({
          type: 'broadcast',
          event: 'message',
          payload: Array.from(update)
        });
    });

    this.connect();
    this.doc.on('update', this.onDocumentUpdate.bind(this));
    this.awareness.on('update', this.onAwarenessUpdate.bind(this));
  }

  get synced() {
    return this._synced;
  }

  set synced(state) {
    if (this._synced !== state) {
      this.logger(`${this.channelName}: setting sync state to ${state}`);
      this._synced = state;
      this.emit('synced', [state]);
      this.emit('sync', [state]);
    }
  }

  public onConnecting() {
    this.logger(`${this.channelName}: connecting`);
    this.emit('status', { status: 'connecting' });
    this.connect();
  }

  public onDisconnect() {
    this.logger(`${this.channelName}: disconnected`);
    if (this.resyncInterval) {
      clearInterval(this.resyncInterval);
      this.resyncInterval = undefined;
    }
    this.synced = false;
    this.isOnline(false);
    this.logger(`${this.channelName}: ` + 'set connected flag to false');
    this.emit('status', { status: 'disconnected' });

    // update awareness (keep all users except local)
    // FIXME? compare to broadcast channel behavior
    const states = Array.from(this.awareness.getStates().keys()).filter(client => client !== this.doc.clientID);
    awarenessProtocol.removeAwarenessStates(this.awareness, states, this);
  }

  public onMessage(message: Uint8Array) {
    if (!this.isOnline()) return;
    try {
      this.applyUpdate(message, this);
    } catch (err) {
      this.logger(`${this.channelName}: ` + 'error - ', err);
    }
  }

  public onAwareness(message: Uint8Array) {
    awarenessProtocol.applyAwarenessUpdate(this.awareness, message, this);
  }

  destroy() {
    this.logger(`${this.channelName}: ` + 'destroying');
    if (this.resyncInterval) {
      clearInterval(this.resyncInterval);
      this.resyncInterval = undefined;
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', this.removeSelfFromAwarenessOnUnload);
    } else if (typeof process !== 'undefined') {
      process.off('exit', () => this.removeSelfFromAwarenessOnUnload);
    }

    this.awareness.off('update', this.onAwarenessUpdate);
    this.doc.off('update', this.onDocumentUpdate);

    if (this.channel !== null && this.channel.state === 'joined') this.disconnect();
  }
}
