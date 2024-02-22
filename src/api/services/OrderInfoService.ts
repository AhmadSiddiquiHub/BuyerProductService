import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { OrderInfoRepository } from '../repositories/OrderInfoRepository';
import { OrderInfo } from '../models/OrderInfo';
import { getConnection  } from 'typeorm';
@Service()
export class OrderInfoService {

    constructor(
        @OrmRepository() private repo: OrderInfoRepository) {
    }
    public async create(result: any): Promise<any> {
        return this.repo.save(result);
    }
    public async orderShipping(orderId: number): Promise<any> {
        const selects = [
            'SUM(CAST(OrderInfo.shippingCharges AS decimal(10,2)))  as shippingCharges',
        ];
        const query: any = await getConnection().getRepository(OrderInfo).createQueryBuilder('OrderInfo')
        .where('OrderInfo.orderId = :orderId', { orderId })
        .select(selects);
        return query.getRawOne();
    }
}
