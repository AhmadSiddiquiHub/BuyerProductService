import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { SameDayProductPincodes } from "../models/SameDayProductPincodes";
import { SameDayProductPincodesRepository } from "../repositories/SameDayProductPincodesRepository";


@Service()
export class SameDayProductPincodesService {

    constructor(
        @OrmRepository() private repo: SameDayProductPincodesRepository,
        @Logger(__filename) private log: LoggerInterface

    ) { }


    public async create(sameDayProductPincode: SameDayProductPincodes) {
        this.log.info('Creating SameDayProductPincode');
        return await this.repo.save(sameDayProductPincode);
    }

    public async findPincodesByProductId(productId: number, vendorId: number) {

        const result = await this.repo.createQueryBuilder('SDP').where('product_id = :pid AND vendor_id = :vid', { pid: productId, vid: vendorId }).select('SDP.pincode as pincode').getRawMany();
        let pincodes = []
        result.forEach(o => pincodes.push(o.pincode))
        return pincodes;
    }

    public async findPincodesByProductIdBulk(productIds: number[]) {

        const result = await this.repo.createQueryBuilder('SDP')
            .where('product_id IN (:...pid)', { pid: productIds }).select('SDP.pincode as pincode').getRawMany();
        let pincodes = [];
        result.forEach(o => pincodes.push(o.pincode));
        return pincodes;
    }

    public async findAll() {

        this.log.info('Retreiving all Pincodes');

        return await this.repo.find();
    }

}