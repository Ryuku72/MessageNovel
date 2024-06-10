import { useState } from 'react';

import { Comment, Thread } from '../helpers';
import { StickyIcon, TrashIcon } from '../svg';
import CommentsComposer from './CommentComposer';
import { DeletePopupModal } from './DeletePopUpModal';

export function CommentsPanelList({
  comment,
  deleteComment,
  thread,
  rtf
}: {
  comment: Comment;
  deleteComment: (
    commentOrThread: Comment | Thread,
    // eslint-disable-next-line no-shadow
    thread?: Thread
  ) => void;
  rtf: Intl.RelativeTimeFormat;
  thread?: Thread;
}): JSX.Element {
  const seconds = Math.round((comment.timeStamp - performance.now()) / 1000);
  const minutes = Math.round(seconds / 60);
  const [showModal, setShowModal] = useState(false);

  return (
    <li
      data-id="CommentPlugin_CommentsPanel_List_Comment"
      className="flex flex-col w-full py-2 first:py-3 first:pl-1 pl-3 first:border-l-0 border-l-[5px] ml-2 first:ml-0  border-gray-200 pr-0 relative transition-[all_200ms_linear] group">
      <div className="w-full flex flex-row flex-wrap gap-4 relative">
        <p
          data-id="CommentPlugin_CommentsPanel_List_Details"
          className="text-gray-600 flex gap-1 text-sm w-full pr-[45px]">
          <span className="font-bold capitalize">{comment.author}</span>
          <span className="text-gray-400">&#8226; {seconds > -10 ? 'Just now' : rtf.format(minutes, 'minute')}</span>
        </p>
        <button
          type="button"
          title="delete comment"
          onClick={() => setShowModal(true)}
          className={
            comment.deleted
              ? 'hidden'
              : 'flex absolute -top-1 right-0 rounded cursor-pointer w-[40px] h-[30px] py-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100'
          }>
          <TrashIcon className="w-4 h-auto" uniqueId="Comment-delete" />
        </button>
      </div>
      <p className={`text-gray-700 pb-2 text-sm font-light ${comment.deleted ? 'opacity-50' : 'opacity-100'}`}>
        {comment.content}
      </p>
      <DeletePopupModal
        open={showModal}
        close={() => setShowModal(false)}
        commentOrThread={comment}
        deleteCommentOrThread={deleteComment}
        thread={thread}
        title="Delete Comment"
      />
    </li>
  );
}

export function CommentThread({
  handleClickThread,
  commentOrThread,
  rtf,
  markNodeMapHasId,
  activeIdExists,
  setShowModal,
  showModal,
  deleteCommentOrThread,
  submitAddComment,
  author
}: {
  author: string;
  handleClickThread: () => void;
  commentOrThread: Thread;
  rtf: Intl.RelativeTimeFormat;
  setShowModal: (state: boolean) => void;
  showModal: boolean;
  deleteCommentOrThread: (commentOrThread: Comment | Thread, thread?: Thread) => void;
  submitAddComment: (commentOrThread: Comment | Thread, isInlineComment: boolean, thread?: Thread) => void;
  markNodeMapHasId: boolean;
  activeIdExists: boolean;
}) {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <li
      data-id="CommentPlugin_CommentsPanel_List_Thread"
      className={`p-0 m-0 border-y-gray-200 first:border-t-transparent last:border-b-transparent relative transition-all duration-200 ease-linear backdrop-blur-sm pt-4 pb-2 ${
        markNodeMapHasId ? 'cursor-pointer' : 'cursor-default'
      } ${activeIdExists ? 'bg-white' : 'bg-[#fafafa] ml-3 rounded-l-md'}`}
      onClick={() => handleClickThread()}>
      <div data-id="CommentPlugin_CommentsPanel_List_Thread_QuoteBox" className="pt-3 pr-[35px] relative group">
        <blockquote data-id="CommentPlugin_CommentsPanel_List_Thread_Quote" className="mx-3 text-gray-300 font-medium">
          {'> '}
          <span
            className={`text-gray-700 p-1 pl-0.5 font-bold ${activeIdExists ? 'bg-[rgba(255,_212,_0,_0.141)] border-b-2 border-b-[rgba(255,_212,_0,_0.5)]' : 'border-b-2 border-b-[rgba(255,_212,_0,_1)] bg-[rgba(255,_212,_0,_0.502)]'}`}>
            {commentOrThread.quote}
          </span>
        </blockquote>
        {/* INTRODUCE DELETE THREAD HERE*/}
        <button
          type="button"
          title="delete quote"
          onClick={() => setShowModal(true)}
          className="absolute flexCenter top-0 right-2 rounded cursor-pointer w-[40px] h-[40px] py-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 flex whitespace-pre">
          <StickyIcon className="w-3 h-auto rotate-45" uniqueId="Comment-sticky" />
          <TrashIcon className="w-4 h-auto translate-y-2" uniqueId="Comment-quote" />
        </button>
        <DeletePopupModal
          open={showModal}
          close={() => setShowModal(false)}
          title="Delete Thread"
          commentOrThread={commentOrThread}
          deleteCommentOrThread={deleteCommentOrThread}
        />
      </div>
      <ul data-id="CommentPlugin_CommentsPanel_List_Thread_Comments" className="pl-3 list-none">
        {commentOrThread.comments.map(comment => (
          <CommentsPanelList
            key={comment.id}
            comment={comment}
            deleteComment={deleteCommentOrThread}
            thread={commentOrThread}
            rtf={rtf}
          />
        ))}
      </ul>
      <div data-id="CommentPlugin_CommentsPanel_List_Thread_Editor" className="relative pt-5">
        <CommentsComposer
          submitAddComment={submitAddComment}
          thread={commentOrThread}
          placeholder="Reply to comment..."
          author={author}
        />
      </div>
    </li>
  );
}
