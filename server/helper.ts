import { LeanDocument } from 'mongoose';
import CryptoJS from 'crypto-js';
import { IPost } from './api/post/post';
import { IUser } from './api/user/user';
import { EPost, EPrivacy } from './types/post';
import imagekit from './utils/imageKit';
import { passphrase } from './config';

const generateUrl = (filename: string): string => {
  return imagekit.url({
    path: `/${filename}`,
  });
};

const formatUrl = (arr: LeanDocument<IPost>[]): LeanDocument<IPost>[] => {
  return arr.map((item) => {
    if (item.privacy !== EPrivacy.PUBLIC) {
      item.content = decryptWithAES(item.content);
    }
    if (item.media.length > 0) {
      for (let i = 0; i < item.media.length; i++) {
        item.media[i].src = generateUrl(item.media[i].fileName);
      }
    }
    if (item.parentID && isIPost(item.parentID) && item.type === EPost.SHARE) {
      for (let i = 0; i < item.parentID.media.length; i++) {
        item.parentID.media[i].src = generateUrl(
          item.parentID.media[i].fileName
        );
      }
    }
    return item;
  });
};

const comparer = (otherArray: any) => {
  return (current: any) => {
    return (
      otherArray.filter(function (other: any) {
        delete other.src;
        delete current.src;
        return other.fileName === current.fileName;
      }).length === 0
    );
  };
};

const isIPost = (object: any): object is IPost => {
  return 'media' in object;
};

const isIUser = (object: any): object is IUser => {
  return '_id' in object;
};

const encryptWithAES = (text: string) => {
  return CryptoJS.AES.encrypt(JSON.stringify({ text }), passphrase).toString();
};

const decryptWithAES = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase).toString(
    CryptoJS.enc.Utf8
  );
  return JSON.parse(bytes).text ?? bytes;
};

export {
  generateUrl,
  formatUrl,
  comparer,
  isIPost,
  isIUser,
  encryptWithAES,
  decryptWithAES,
};
