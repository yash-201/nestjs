import { Inject, Injectable } from '@nestjs/common';
import { products } from './fake-db';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class AppService {

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) { }

  getProducts() {
    return products;
  }

  async getProductsWithCache() {
    const cachedProducts = await this.cacheManager.get('products');
    if (cachedProducts) {
      return cachedProducts;
    }
    await this.cacheManager.set('products', products, 60 * 1000);
    return products;
  }

  async getCache() {
    const cache = await this.cacheManager.get('cache');
    if (cache) {
      return { message: 'Cache hit', data: cache };
    }
    return { message: 'Cache miss' };
  }

  async setCache() {
    await this.cacheManager.set('cache', 'cache value');
    return { message: 'Cache set' };
  }

  async getProductWithCache(id: string) {
    const cachedProducts = await this.cacheManager.get(`product:${id}`);
    console.log("cachedProducts ", cachedProducts)
    if (cachedProducts) {
      return cachedProducts;
    }
    const product = products.find(p => p.id === Number(id));
    if (product) {
      await this.cacheManager.set(`product:${id}`, product, 60 * 1000);
    }
    return product;
  }

  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
