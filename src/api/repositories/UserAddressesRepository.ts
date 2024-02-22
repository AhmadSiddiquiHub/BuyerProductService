import { EntityRepository, Repository } from 'typeorm';
import { UserAddresses } from '../models/UserAddresses';

@EntityRepository(UserAddresses)
export class UserAddressesRepository extends Repository<UserAddresses>  {

}
