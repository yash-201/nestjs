import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

// we can implment via useguard in controller
@Injectable()
export class RateLimitGuard implements CanActivate {
    private readonly MAX_REQUESTS = 5;
    private readonly WINDOW_SECONDS = 10;

    constructor(
        private readonly redisService: RedisService,
    ) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const clientIp =
            request.ip || request.connection?.remoteAddress || 'unknown';

        const routePath = request.route?.path || request.originalUrl;

        const redisKey = `rate-limit:${clientIp}`;

        // Get the current request count from Redis
        const currentCount = Number(await this.redisService.get(redisKey)) || 0;

        // Block requests that exceed the configured limit
        if (currentCount >= this.MAX_REQUESTS) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.TOO_MANY_REQUESTS,
                    message: 'Too many requests. Please try again later.',
                },
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        // Increment the request count and set the expiration window
        await this.redisService.set(
            redisKey,
            currentCount + 1,
            this.WINDOW_SECONDS,
        );

        console.log(
            `[RateLimitGuard] IP: ${clientIp} | Route: ${routePath} | Requests: ${currentCount + 1}/${this.MAX_REQUESTS}`,
        );

        // Allow the request to continue
        return true;
    }
}