
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { createClient } from "redis"
@Injectable()
export class RedisService implements OnModuleInit {

    public client = createClient({
        url: "redis://localhost:6379"
    })
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) { }

    async onModuleInit() {
        await this.client.connect().then(() => {
            console.log("Redis connected");
        }).catch((err) => {
            console.log(err);
        });
    }

    async get(key: string) {
        return await this.cacheManager.get(key);
    }
    async set(key: string, value: any, ttl?: number) {
        await this.cacheManager.set(key, value, ttl);
    }
    async del(key: string) {
        await this.cacheManager.del(key);
    }
    async clear() {
        await this.cacheManager.reset();
    }
}