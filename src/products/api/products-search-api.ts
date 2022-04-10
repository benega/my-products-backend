import { ProductDto } from '../dto/product.dto';

export interface ProductsSearchApi {
  search(query: string): Promise<ProductDto[]>;
}
