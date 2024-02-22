import { Service } from 'typedi';
import * as redis from 'redis';
const client = redis.createClient();
client.connect();
const EXPIRETION_TIME = 86400;

// const a = await radisClient.get('catList');
// radisClient.setEx(redisKeys.catlist, DEFAULT_EXPIRATION, JSON.stringify(result));

@Service()
export class RedisService {
    constructor(
        // private userService: UserService,
        // private userOtpService: UserOtpService
    ) {
    }
    public async get(key: any): Promise<any> {
       const a = await client.get(key);
        return a;
    }

    public async set(key: any, data: any): Promise<any> {
       const a = await client.setEx(key, EXPIRETION_TIME, data);
        return a;
    }
}
