import { EntityRepository, Repository } from 'typeorm';
import { Interfaces } from '../models/Interfaces';

@EntityRepository(Interfaces)
export class InterfacesRepository extends Repository<Interfaces>  {
}
