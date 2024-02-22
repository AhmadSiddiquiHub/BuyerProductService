import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { SameDayGlobalPincodes } from "../models/SameDayGlobalPincodes";
import { SameDayGlobalPincodesRepository } from "../repositories/SameDayGlobalPincodesRepository";


@Service()
export class SameDayGlobalPincodesService {

    constructor(
        @OrmRepository() private repo: SameDayGlobalPincodesRepository,
        @Logger(__filename) private log: LoggerInterface

    ) { }


    public async create(sameDayGlobalPincode: SameDayGlobalPincodes) {

        this.log.info('Creating Same Day');
        return await this.repo.save(sameDayGlobalPincode);
    }

    public async bulkCreate(vendorId, pincodes) {
        const rows = [];
        pincodes.forEach(pincode => rows.push({ vendorId, pincode }));
        return await this.repo.createQueryBuilder('SDG').insert().into(SameDayGlobalPincodes)
            .values(rows).execute();
    }
    public async getPincodesByVendorId(vendorId: number) {

        let result = await this.repo.createQueryBuilder('SG').where('vendor_id = :id', { id: vendorId })
            .select('SG.pincode as pincode').getRawMany(); //find({ select: ["pincode"], where: { vendorId } });
        const pincodes = [];
        result.forEach(o => pincodes.push(o.pincode));
        return pincodes;
    }

    public async findAll() {

        this.log.info('Retreving all pincodes');
        return await this.repo.find();
    }

}