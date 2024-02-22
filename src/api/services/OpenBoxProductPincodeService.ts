import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { OpenBoxProductRepository } from "../repositories/OpenBoxProductPincodeRepository";

@Service()
export class OpenBoxProductPincodeService {
    constructor(
        @OrmRepository() private repo: OpenBoxProductRepository
    ) { }


    public async getPincodesByProductId(productId: number, vendorId: number) {
        let pincodes = await this.repo.createQueryBuilder('OP').where('product_id = :pid AND vendor_id = :vid', { pid: productId, vid: vendorId })
            .select('OP.pincode').getRawMany();

        return pincodes;
    }
}