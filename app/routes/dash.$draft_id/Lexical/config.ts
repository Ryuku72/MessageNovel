import { ListItemNode, ListNode } from '@lexical/list';
import { OverflowNode } from '@lexical/overflow';
import { InitialConfigType } from '@lexical/react/LexicalComposer';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { EditorThemeClasses } from 'lexical';

const theme: EditorThemeClasses = {
  // Theme styling goes here
  ltr: 'text-left',
  rtl: 'text-right',
  placeholder: 'text-gray-400',
  paragraph: 'text-base',
  quote: 'editor-quote',
  heading: {
    h1: 'text-6xl',
    h2: 'text-4xl',
    h3: 'text-2xl'
  },
  list: {
    nested: {
      listitem: 'editor-nested-listitem'
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    checklist: 'editor-checklist',
    listitem: 'editor-listitem',
    listitemChecked: 'editor-listItemChecked',
    listitemUnchecked: 'editor-listItemUnchecked'
  },
  link: 'editor-link',
  text: {
    bold: 'text-semibold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    underlineStrikethrough: 'underline_line-through',
    code: 'editor-text-code'
  },
  codeHighlight: {
    atrule: 'editor-tokenAttr',
    attr: 'editor-tokenAttr',
    boolean: 'editor-tokenProperty',
    builtin: 'editor-tokenSelector',
    cdata: 'editor-tokenComment',
    char: 'editor-tokenSelector',
    class: 'editor-tokenFunction',
    'class-name': 'editor-tokenFunction',
    comment: 'editor-tokenComment',
    constant: 'editor-tokenProperty',
    deleted: 'editor-tokenProperty',
    doctype: 'editor-tokenComment',
    entity: 'editor-tokenOperator',
    function: 'editor-tokenFunction',
    important: 'editor-tokenVariable',
    inserted: 'editor-tokenSelector',
    keyword: 'editor-tokenAttr',
    namespace: 'editor-tokenVariable',
    number: 'editor-tokenProperty',
    operator: 'editor-tokenOperator',
    prolog: 'editor-tokenComment',
    property: 'editor-tokenProperty',
    punctuation: 'editor-tokenPunctuation',
    regex: 'editor-tokenVariable',
    selector: 'editor-tokenSelector',
    string: 'editor-tokenSelector',
    symbol: 'editor-tokenProperty',
    tag: 'editor-tokenProperty',
    url: 'editor-tokenOperator',
    variable: 'editor-tokenVariable'
  }
};

function onError(error: Error) {
  // eslint-disable-next-line no-console
  console.error(error);
}
export function InitialConfig(namespace: string, value: string | null): InitialConfigType {
  return {
    theme,
    onError,
    editorState: value || null,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      OverflowNode,
      HorizontalRuleNode
    ],
    namespace
  };
}
