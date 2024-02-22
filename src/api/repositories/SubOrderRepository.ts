import { EntityRepository, Repository } from 'typeorm';
import { SubOrder } from '../models/SubOrder';

@EntityRepository(SubOrder)
export class SubOrderRepository extends Repository<SubOrder>  {
    public async totalAmountsbyVendors(orderId: number): Promise<any> {
        const selects = [
            'sub_orders.vendorId',
            'SUM(sub_orders.totalAmount) as totalAmount',
            'SUM(sub_orders.discount) as discount',
            // 'SUM(sub_orders.tax) as tax',
        ];
        const query: any = await this.manager.createQueryBuilder(SubOrder, 'sub_orders');
        query.select(selects);
        query.where('sub_orders.orderId = :orderId', { orderId });
        query.groupBy('sub_orders.vendorId');
        query.orderBy('sub_orders.vendorId', 'ASC');
        return query.getRawMany();
    }

}
