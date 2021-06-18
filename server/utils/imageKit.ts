import ImageKit from 'imagekit';
import { ikConfig } from '../config';

const imagekit = new ImageKit({
  publicKey: ikConfig.PUBLIC_KEY,
  privateKey: ikConfig.PRIVATE_KEY,
  urlEndpoint: ikConfig.ENDPOINT,
});

export default imagekit;
