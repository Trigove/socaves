import crypto from 'crypto';
import { EPrivacy } from '@/server/types/post';
import { ikConfig } from '@/server/config';

const oneDay = 24 * 60 * 60;

export default {
  methods: {
    withQuery(src, privacy, opt) {
      // console.log(src);
      if (privacy === EPrivacy.PUBLIC) {
        return src;
      }

      // Assume we have an image URL
      const imageUrl = src + opt;

      // This is our endpoint
      let urlEndpoint = ikConfig.ENDPOINT;

      // Make sure urlEndpoint has a trailing slash (/)
      if (urlEndpoint[urlEndpoint.length - 1] !== '/') {
        urlEndpoint = urlEndpoint + '/';
      }

      // Let's say we want to expire image in 1 day, so expireTimestamp (UTC timestamp) would be
      const expiryTimestamp =
        parseInt(new Date().getTime() / 1000, 10) + oneDay;

      // Remove the urlEndpoint from image URL
      let str = imageUrl.replace(urlEndpoint, '');

      // Append the expiryTimestamp in above str
      str = str + expiryTimestamp;

      // Calcualte the signature using your priviate key
      const signature = crypto
        .createHmac('sha1', ikConfig.PRIVATE_KEY)
        .update(str)
        .digest('hex');

      // Add ik-t and ik-s query parameters in the url
      const finalImageUrl =
        imageUrl + '?ik-t=' + expiryTimestamp + '&ik-s=' + signature;

      return finalImageUrl;
    },
  },
};
