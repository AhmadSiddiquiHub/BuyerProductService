import { EntityRepository, Repository } from 'typeorm';
import { Modules } from '../models/Modules';

@EntityRepository(Modules)
export class ModulesRepository extends Repository<Modules>  {
}
