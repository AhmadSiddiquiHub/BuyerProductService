import { EntityRepository, Repository } from 'typeorm';
import { UserAddressGift } from '../models/UserAddressGift';
// import { Users } from '../models/Users';

@EntityRepository(UserAddressGift)
export class UserAddressGiftRepository extends Repository<UserAddressGift>  {

    // public async list2(list2: any): Promise<any> {       ye m bd m use kr sakta agrr m nay approach change krni ho
    //     const query: any = await this.manager.createQueryBuilder(UserAddressGift, 'userAddressGift');
    //     query.select(['userAddressGift.userId']);
    //     query.innerJoin(Users, 'user', 'user.id = userAddressGift.userId');
    //     query.where('userAddressGift.userId= :id', {id: list2});
    //     return query.getRawMany();
    // }

}
