import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FavouriteProductsSchema } from './models/favourite-products.schema';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsSearchFacade } from './api/products-search-facade';
import { ProductSchema } from './models/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'FavouriteProducts', schema: FavouriteProductsSchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  providers: [ProductsService, ProductsSearchFacade],
  controllers: [ProductsController],
})
export class ProductsModule {}
