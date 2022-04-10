import * as mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  pictureUrl: String,
});
