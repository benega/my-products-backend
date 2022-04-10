import { Injectable } from '@nestjs/common';
import { ProductDto } from '../dto/product.dto';
import { ProductsSearchApi } from './products-search-api';
import { SephoraApi } from './sephora-api';

@Injectable()
export class ProductsSearchFacade {
  private apis: ProductsSearchApi[];

  constructor() {
    this.apis = [new SephoraApi()];
  }

  async search(query: string): Promise<ProductDto[]> {
    const res = await Promise.all(this.apis.map((api) => api.search(query)));
    return res.flatMap((prods) => prods);
  }

  async getByName(name: string): Promise<ProductDto> {
    const res = await this.search(name);
    return res.find((p) => p.name == name);
  }
}
