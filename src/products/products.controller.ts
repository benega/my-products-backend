import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/models/user';
import { ProductDto } from './dto/product.dto';
import { ProductsService } from './products.service';

const getUserFromReq = (req: any): User => {
  return req.user;
};

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get('/public')
  async publicSearchProducts(@Query('query') query: string) {
    return this.productsService.search(null, query);
  }

  @Get('/public/:name')
  async publicGetByName(@Param('name') name: string) {
    return this.productsService.getByName(null, name);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async searchProducts(@Req() req: any, @Query('query') query: string) {
    return this.productsService.search(getUserFromReq(req), query);
  }

  @Get('/name/:name')
  @UseGuards(AuthGuard('jwt'))
  async getByName(@Req() req: any, @Param('name') name: string) {
    return this.productsService.getByName(getUserFromReq(req), name);
  }

  @Get('/favourite')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async searchFavourites(@Req() req: any, @Query('name') name: string) {
    return this.productsService.searchFavourites(getUserFromReq(req), name);
  }

  @Post('/favourite')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async makeFavourite(@Req() req: any, @Body() productDto: ProductDto) {
    return this.productsService.makeFavourite(getUserFromReq(req), productDto);
  }

  @Delete('/favourite')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async removeFavourite(@Req() req: any, @Body() productDto: ProductDto) {
    return this.productsService.removeFavourite(
      getUserFromReq(req),
      productDto,
    );
  }
}
