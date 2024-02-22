import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { OpenBoxGlobalRepository } from "../repositories/OpenBoxGlobalPincodeRepository";
import { OpenBoxGlobalPincodes } from "../models/OpenBoxGlobalPincodes";

@Service()
export class OpenBoxGlobalPincodeService {
    constructor(
        @OrmRepository() private repo: OpenBoxGlobalRepository
    ) { }

    public async bulkCreate(vendorId, pincodes) {
        const rows = [];
        pincodes.forEach(pincode => rows.push({ vendorId, pincode }));
        return await this.repo.createQueryBuilder('OBG').insert().into(OpenBoxGlobalPincodes)
            .values(rows).execute();
    }

    public async getPincodesByVendorId(vendorId) {
        let result = await this.repo.createQueryBuilder('OG').where('vendor_id = :id', { id: vendorId })
            .select('OG.pincode as pincode').getRawMany();
        console.log(result)
        let pincodes = [];
        result.forEach(o => pincodes.push(o.pincode))
        return pincodes
    }
}