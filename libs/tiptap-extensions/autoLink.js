import { markInputRule } from 'tiptap-commands';
import { Link } from 'tiptap-extensions';

/**
 * Plugin for the tiptap editor that sets link targets as blank and allows
 * to manually enter URLs as text and auto set the link when space is pressed
 *
 * @see https://github.com/heyscrumpy/tiptap/blob/master/packages/tiptap-extensions/src/marks/Link.js
 */
export default class AutoLink extends Link {
  get schema() {
    return {
      ...super.schema,
    };
  }

  inputRules({ type }) {
    return [
      markInputRule(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-zA-Z]{2,}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)[\s\n]$/g,
        type,
        (matches) => {
          return { href: matches[0] };
        }
      ),
    ];
  }
}
