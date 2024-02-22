import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { UserAddressesRepository } from '../repositories/UserAddressesRepository';
import { UserAddresses } from '../models/UserAddresses';
import { AddressType } from '../models/AddressType';
import { getConnection  } from 'typeorm';
@Service()
export class UserAddressesService {

    constructor(
        @OrmRepository() private userAddressesRepository: UserAddressesRepository,
        @Logger(__filename) private log: LoggerInterface) {
    }
    
    public async create(address: UserAddresses): Promise<any> {
        this.log.info('Create a new address ');
        return this.userAddressesRepository.save(address);
    }

    public async findOne(address: any): Promise<any> {
        return this.userAddressesRepository.findOne(address);
    }

    public async findOneRawQuery(addressId: number, userId: number): Promise<any> {
        const selects = [
            'UA.addressId as addressId',
            'UA.name as name',
            'UA.userId as userId',
            'UA.countryId as countryId',
            'UA.stateId as stateId',
            'UA.cityId as cityId',
            'UA.userTypeId as userTypeId',
            'UA.type as type',
            'UA.Lineaddr1 as Lineaddr1',
            'UA.Lineaddr2 as Lineaddr2',
            'UA.Lineaddr3 as Lineaddr3',
            'UA.zipcode as zipcode',
            'UA.isDefault as isDefault',
            'UA.createdAt as createdAt',
            'UA.updateAt as updateAt',
            'UA.isActive as isActive',
            'T.name as typeName'
        ];
        return await getConnection().getRepository(UserAddresses).createQueryBuilder('UA').select(selects)
        .leftJoin(AddressType, 'T', 'T.type = UA.type')
        .where('UA.addressId = :addressId', { addressId })
        .andWhere('UA.userId = :userId', { userId })
        .getRawOne();
    }

    public update(id: number, address: UserAddresses): Promise<any> {
        address.addressId = id;
        return this.userAddressesRepository.save(address);
    }

    public async delete(id: number): Promise<any> {
        return await this.userAddressesRepository.delete(id);

    }

    public find(address: any): Promise<any> {
        return this.userAddressesRepository.find(address);
    }

    public async userAddress(userId: number, addressId?: number): Promise<any> {
        const selects = [
            'UA.name as name',
            'UA.addressId as addressId',
            'UA.Lineaddr1 as lineaddr1',
            'UA.Lineaddr2 as lineaddr2',
            'UA.Lineaddr3 as lineaddr3',
            'UA.userId as customerId',
            'UA.isDefault as isDefault',
            'UA.zipcode as zipcode',
            'UA.userTypeId as userTypeId',
            'UA.type as type',
            'UA.stateId as stateId',
            'UA.cityId as cityId',
            'UA.countryId as countryId',
            '(SELECT countries.name FROM countries WHERE countries.id = UA.countryId) as country',
            '(SELECT states.name FROM states WHERE states.id = UA.stateId) as state',
            '(SELECT cities.name FROM cities WHERE cities.id = UA.cityId) as city',
        ];
        const query: any = await getConnection().getRepository(UserAddresses).createQueryBuilder('UA')
        .where('UA.userId = :userId', { userId })
        .orderBy('UA.isDefault', 'DESC')
        .select(selects);
        if (addressId) {
            return query.andWhere('UA.addressId = :addressId', { addressId }).getRawOne();
        }
        return query.getRawMany();

    }
}
