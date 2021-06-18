import path from 'path';
import { Request, Response, NextFunction } from 'express';
import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { nanoid } from 'nanoid';
import { awsConfig } from '../config';

interface MulterRequest extends Request {
  body: any;
}

// setup s3
export const s3 = new aws.S3({
  accessKeyId: awsConfig.awsAccessKeyId,
  secretAccessKey: awsConfig.awsSecretAccessKey,
});

// setup multer
const uploadS3 = multer({
  storage: multerS3({
    s3,
    bucket: 'socave0',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata(req: MulterRequest, _file, cb) {
      const isPrivate = req.body.post.includes('"privacy":"PUBLIC"')
        ? 'false'
        : 'true';
      cb(null, { isprivatefile: isPrivate });
    },
    // return key(edited filename) in req.files object
    key: (_req, file, cb) => {
      cb(
        null,
        Date.now().toString() + '-' + nanoid() + path.extname(file.originalname)
      );
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 200,
  },
}).array('media', 10); // .array means multiple upload and max upload is 10 files

const awsS3 = {
  uploadTen(req: Request, res: Response, next: NextFunction) {
    uploadS3(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          message: 'Number of media is limit up to 10',
          error: err,
        });
      } else if (err) {
        return res.status(500).json({
          message: 'Error uploading media',
          error: err,
        });
      } else {
        let canUpload = true;
        // @ts-ignore
        req.files?.forEach((file: any) => {
          if (
            file.size >= 15 * 1024 * 1024 &&
            file.mimetype.split('/')[0] === 'image'
          ) {
            canUpload = false;
          }
          if (
            file.size >= 200 * 1024 * 1024 &&
            file.mimetype.split('/')[0] === 'video'
          ) {
            canUpload = false;
          }
        });

        if (canUpload) {
          next();
        } else {
          return res.status(500).json({
            message: 'Error: media too large',
          });
        }
      }
    });
  },
};

export default awsS3;
