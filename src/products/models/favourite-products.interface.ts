import { Document } from 'mongoose';
import { User } from 'src/user/models/user';
import { Product } from './product.interface';

export interface FavouriteProducts extends Document {
  user: User;
  products: Array<Product>;
}
