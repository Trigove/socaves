//Auto transfer text links to <a> tags
//https://soapbox.github.io/linkifyjs/docs/linkify-html.html
import Vue from 'vue';
import Autolinker from 'autolinker';

const autolinker = new Autolinker({
  urls: {
    schemeMatches: true,
    wwwMatches: true,
    tldMatches: true,
  },
  email: true,
  phone: true,
  mention: 'twitter',
  hashtag: false,
  stripPrefix: true,
  newWindow: true,
  truncate: {
    length: 0,
    location: 'end',
  },
  className: '',

  replaceFn(match) {
    // console.log('href = ', match.getAnchorHref());
    // console.log('text = ', match.getAnchorText());
    // console.log('text = ', match);

    switch (match.getType()) {
      case 'url': {
        const url = match.getUrl();
        return `<a target="_blank" rel="noopener noreferrer" href="${url}">${url}</a>`;
      }

      case 'email':
        return true;

      case 'phone':
        return true;

      case 'mention':
        // console.log('Mention: ', match.getMention());
        // console.log('Mention Service Name: ', match.getServiceName());
        return `<a class="mention"
         href="/profile/${match.getMention()}">@${match.getMention()}</a>`;

      // case 'hashtag':
      //   console.log('Hashtag: ', match.getHashtag());

      //   return (
      //     '<a href="http://newplace.to.link.hashtag.handles.to/">' +
      //     match.getHashtag() +
      //     '</a>'
      //   );
    }
  },
});

Vue.prototype.$Autolinker = (input) => {
  return autolinker.link(input);
};
