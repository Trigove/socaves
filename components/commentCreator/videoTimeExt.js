import { Node, mergeAttributes } from '@tiptap/core';
import { addSeconds, format } from 'date-fns';
//https://next.tiptap.dev/guide/node-views/js/#render-a-node-view-with-javascript

export default Node.create({
  name: 'videoTime',

  inline: true,

  group: 'inline',

  content: 'inline*',

  selectable: false,

  atom: true,

  addAttributes() {
    return {
      dataTime: {
        default: 0,
      },
      dataId: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'a[data-video-time]',
      },
    ];
  },

  // addCommands() {
  //   return {
  //     addVideoTime: () => ({ commands }) => {
  //       return commands.insertContent('<h1>Example Text</h1>');
  //     },
  //   };
  // },

  renderHTML({ node }) {
    return [
      'a',
      mergeAttributes(this.options.HTMLAttributes, {
        'data-video-time': '',
        'data-time': node.attrs.dataTime,
        'data-id': node.attrs.dataId,
      }),
      formatTime(node.attrs.dataTime),
    ];
  },

  renderText({ node }) {
    return formatTime(node.attrs.dataTime);
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('a');

      //Sec to MM:SS

      dom.setAttribute('data-video-time', '');
      dom.setAttribute('data-time', node.attrs.dataTime);
      dom.setAttribute('data-id', node.attrs.dataId);

      dom.innerHTML = formatTime(node.attrs.dataTime);

      return {
        dom,
      };
    };
  },
});

function formatTime(sec) {
  const helperDate = addSeconds(new Date(0), sec);
  return format(helperDate, 'mm:ss');
}
