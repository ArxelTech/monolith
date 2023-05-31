/* eslint-disable @typescript-eslint/no-var-requires */
import * as cloudinary from 'cloudinary';
require('dotenv').config();

const Cloudinary = cloudinary.v2;

Cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export default Cloudinary;
