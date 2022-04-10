import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductsSearchFacade } from './api/products-search-facade';
import { Product } from './models/product.interface';
import { FavouriteProducts } from './models/favourite-products.interface';
import { User } from 'src/user/models/user';
import { ProductDto } from './dto/product.dto';

const parseDto = (product: Product, isFavourited = false) => ({
  name: product.name,
  pictureUrl: product.pictureUrl,
  price: product.price,
  isFavourited,
});

@Injectable()
export class ProductsService {
  constructor(
    private productsSearch: ProductsSearchFacade,
    @InjectModel('FavouriteProducts')
    private readonly favouriteProductsModel: Model<FavouriteProducts>,
    @InjectModel('Product')
    private readonly productModel: Model<Product>,
  ) {}

  async search(user: User, query: string): Promise<ProductDto[]> {
    const products = await this.productsSearch.search(query);
    const favourites = (await this.getFavouritesByUser(user))?.products || [];
    products.forEach((p) => {
      p.isFavourited = favourites.some((f) => f.name === p.name);
    });
    return products;
  }

  async getByName(user: User, name: string): Promise<ProductDto> {
    const encodedName = encodeURI(name);
    const res = await this.search(user, encodedName);
    return res.find((p) => encodeURI(p.name) == encodedName);
  }

  async searchFavourites(user: User, name?: string): Promise<ProductDto[]> {
    const favouriteProducts = await this.getFavouritesByUser(user);
    const products = favouriteProducts?.products || [];
    return name
      ? products.filter((p) => p.name === name).map((p) => parseDto(p, true))
      : products.map((p) => parseDto(p, true));
  }

  async makeFavourite(user: User, productDto: ProductDto): Promise<void> {
    const product = await this.getOrUpdateProductFromDB(productDto);
    let favouriteProducts = await this.getFavouritesByUser(user);

    if (!favouriteProducts) {
      favouriteProducts = new this.favouriteProductsModel({
        user,
        products: [product],
      });
    } else {
      favouriteProducts.products.push(product);
    }

    favouriteProducts.save();
  }

  async removeFavourite(user: User, productDto: ProductDto): Promise<void> {
    const favouriteProducts = await this.getFavouritesByUser(user);

    if (favouriteProducts) {
      favouriteProducts.products = favouriteProducts.products.filter(
        (p) => p.name !== productDto.name,
      );
      favouriteProducts.save();
    }
  }

  async getOrUpdateProductFromDB(productDto: ProductDto): Promise<Product> {
    let product = await this.productModel.findOne({
      name: productDto.name,
    });

    if (!product || !product._id) {
      product = new this.productModel(productDto);
      product.save();
    }

    return product;
  }

  private async getFavouritesByUser(user: User): Promise<FavouriteProducts> {
    if (!user) return null;
    return this.favouriteProductsModel.findOne({ user }).populate('products');
  }
}
