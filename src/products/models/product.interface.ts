import { Document } from 'mongoose';

export interface Product extends Document {
  name: string;
  price: number;
  pictureUrl: string;
}
