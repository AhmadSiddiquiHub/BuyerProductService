import { EntityRepository, Repository } from 'typeorm';
import { OpenBoxProductPincodes } from "../models/OpenBoxProductPincodes";

@EntityRepository(OpenBoxProductPincodes)
export class OpenBoxProductRepository extends Repository<OpenBoxProductRepository> {

}