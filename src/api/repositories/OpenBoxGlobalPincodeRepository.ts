import { Repository, EntityRepository } from "typeorm";
import { OpenBoxGlobalPincodes } from "../models/OpenBoxGlobalPincodes";

@EntityRepository(OpenBoxGlobalPincodes)
export class OpenBoxGlobalRepository extends Repository<OpenBoxGlobalPincodes>{ }