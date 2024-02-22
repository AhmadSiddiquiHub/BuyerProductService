import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { OpenBoxSubscription } from "../models/OpenBoxSubscription";
import { OpenBoxSubscriptionRepository } from "../repositories/OpenBoxSubscriptionRepository";

@Service()
export class OpenBoxSubscriptionService {
    constructor(
        @OrmRepository() private repo: OpenBoxSubscriptionRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async create(openBoxSubscription: OpenBoxSubscription) {
        this.log.info('Create New Subscription');
        return await this.repo.save(openBoxSubscription);
    }

    public async findByUserId(userId: number) {
        this.log.info('Retreiving User Subscription Info');

        let i = await this.repo.findOne({ where: { userId } });
        console.log(i)
        return i;
    }


    public async removeSubscription(userId: number) {
        this.log.info('Removing Subscription');

        return await this.repo.update({ isActive: 0, isSubscribed: 0 }, { userId });
    }



}