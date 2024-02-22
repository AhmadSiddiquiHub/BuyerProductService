import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { OrderRepository } from '../repositories/OrderRepository';
import { Order } from '../models/Order';
import { OrderStatuses } from '../models/OrderStatuses';
import { Plugins } from '../models/Plugin';
import { Countries } from '../models/Countries';
import { States } from '../models/States';
import { Cities } from '../models/Cities';
import { Users } from '../models/Users';
import { getConnection } from 'typeorm';
import { SubOrderService } from './SubOrderService';
import { WalletHistoryService } from './WalletHistoryService';
interface OrderDetailsFuncInterface {
    orderId: number,
    userId?: number
}
@Service()
export class OrderService {

    constructor(
        @OrmRepository() private orderRepository: OrderRepository,
        private subOrderService: SubOrderService,
        private walletHistoryService: WalletHistoryService,
    ) {}

    public async create(result: any): Promise<any> {
        return this.orderRepository.save(result);
    }

    public findOne(condition: any): Promise<any> {
        return this.orderRepository.findOne(condition);
    }

    public findAll(): Promise<any> {
        return this.orderRepository.find();
    }

    public find(condition: any): Promise<any> {
        return this.orderRepository.find(condition);
    }

    public update(order: any): Promise<any> {
        return this.orderRepository.save(order);
    }

    public async listing(request: any): Promise<any> {
        const { status, limit, offset, count = 0 } = request.body;
        const userId = request.user.userId;
        const selects = [
            // Order columns
            'O.orderId as orderId',
            'O.userId as userId',
            'O.orderNo as orderNo',
            'O.createdAt as createdAt',
            'O.name as name',
            'O.lineAddress1 as lineAddress1',
            'O.lineAddress2 as lineAddress2',
            'O.lineAddress3 as lineAddress3',
            'O.zipcode as zipcode',
            'O.coupon as coupon',
            'O.discount as discount',
            'O.totalAmount as totalAmount',
            // 'O.rewardPoints as rewardPoints',
            // 'O.tax as tax',
            'O.addrType as addrType',
            'O.paymentStatus as paymentStatus',
            'O.statusId as statusId',
            // Order Status columns
            'OS.name as status',
            'OS.colorCode as colorCode',
            // Plugin columns
            'P.pluginName as paymentMethod',
            'P.pluginAvatarPath as pluginAvatarPath',
            'P.pluginAvatar as pluginAvatar',
            'Country.name as country',
            'State.name as state',
            'City.name as city',
            // User columns
            'User.firstName as firstName',
            'User.lastName as lastName',
            'User.mobileNumber as mobileNumber',
            'User.email as email',
        ];
        const query: any = await getConnection().getRepository(Order).createQueryBuilder('O')
        .leftJoin(OrderStatuses, 'OS', 'OS.id = O.statusId')
        .leftJoin(Plugins, 'P', 'P.id = O.paymentMethodId')
        .leftJoin(Countries, 'Country', 'Country.countriesId = O.countryId')
        .leftJoin(States, 'State', 'State.id = O.stateId')
        .leftJoin(Cities, 'City', 'City.id = O.cityId')
        .leftJoin(Users, 'User', 'User.userId = O.userId')
        .select(selects)
        .orderBy('O.orderId', 'DESC');
        if (userId) {
            query.andWhere('O.userId = :userId', { userId });
        }
        if (status !== 0) {
            query.andWhere('O.statusId = :status', { status });
        }
        if (count === 1) {
            return query.getCount();
        }
        return query.limit(limit).offset(offset).getRawMany();
        // const query: any = await getConnection().getRepository(Order).createQueryBuilder('Order')
        // .select(this.selects)
        // .where('Order.userId = :userId', { userId })
        // .orderBy('Order.orderId', 'DESC');
        
        // if (status !== 0) {
        //     query.andWhere('Order.statusId = :status', { status });
        // }
        // if (count === 1) {
        //     return query.getCount();
        // }
        // query.limit(limit).offset(offset);
        // return query.getRawMany();
        // whereConditions.forEach((item: any) => {
        //     if (item.op === 'where') {
        //         query.where(item.name + ' = ' + item.value);
        //     }
        //     if (item.op === 'andWhere') {
        //         query.andWhere(item.name + ' = ' + item.value);
        //     }
        //     if (item.op === 'orWhere') {
        //         query.orWhere(item.name + ' = ' + item.value);
        //     }
        //     if (item.op === 'IN') {
        //         query.andWhere(item.name + ' IN (' + item.value + ')');
        //     }
        //     if (item.op === 'raw') {
        //         query.andWhere(item.name + ' ' + item.sign + ' \'' + item.value + '\'');
        //     }
        // });
    }

    public async orderDetails({ orderId, userId }: OrderDetailsFuncInterface): Promise<any> {
        const selects = [
            // Order columns
            'O.orderId as orderId',
            'O.userId as userId',
            'O.orderNo as orderNo',
            'O.createdAt as createdAt',
            'O.name as name',
            'O.lineAddress1 as lineAddress1',
            'O.lineAddress2 as lineAddress2',
            'O.lineAddress3 as lineAddress3',
            'O.zipcode as zipcode',
            'O.coupon as coupon',
            'O.discount as discount',
            'O.totalAmount as totalAmount',
            'O.addrType as addrType',
            'O.paymentStatus as paymentStatus',
            'O.statusId as statusId',
            'O.shippingCharges as shippingCharges',
            'O.invoice as invoice',
            // Order Status columns
            'OS.name as status',
            'OS.colorCode as colorCode',
            // Plugin columns
            'P.pluginName as paymentMethod',
            'P.pluginAvatarPath as pluginAvatarPath',
            'P.pluginAvatar as pluginAvatar',
            'Country.name as country',
            'State.name as state',
            'City.name as city',
            // User columns
            'User.firstName as firstName',
            'User.lastName as lastName',
            'User.mobileNumber as mobileNumber',
            'User.email as email',
        ];
        const query: any = await getConnection().getRepository(Order).createQueryBuilder('O')
        .innerJoin(OrderStatuses, 'OS', 'OS.id = O.statusId')
        .innerJoin(Plugins, 'P', 'P.id = O.paymentMethodId')
        .innerJoin(Countries, 'Country', 'Country.countriesId = O.countryId')
        .innerJoin(States, 'State', 'State.id = O.stateId')
        .innerJoin(Cities, 'City', 'City.id = O.cityId')
        .innerJoin(Users, 'User', 'User.userId = O.userId')
        .select(selects)
        .where('O.orderId = :orderId', { orderId });
        if (userId) {
            query.andWhere('O.userId = :userId', { userId });
        }
        // query.orderBy('O.orderId','DESC')
        return query.getRawOne();
    }
    
    public async orderReceipt(orderId: number, langId: number): Promise<any> {
        const order = await this.orderDetails({ orderId });
        const subOrders = await this.subOrderService.subOrderQuery({ orderId ,langId });
        const productDetail = subOrders.map((x, y) => {
          return {
            quantity: x.quantity,
            price: x.productPrice,
            total: x.totalAmount,
            image: x.productImage,
            name: x.productName,
            variant: JSON.parse(x.variant),
            sku: x.sku,
          };
        });
        const subtotal = productDetail.map((item, index) => item.total).reduce((a, b) => parseFloat(a) + parseFloat(b), 0).toString();
        const orderTotalAmount = parseFloat(order.totalAmount);
        let orderGrandTotal = orderTotalAmount;
        let walletAmountUsed = '0';
        const walletUsage = await this.walletHistoryService.findOne({ where: { orderId }});
        if(walletUsage){
            walletAmountUsed = walletUsage.amount;
        }
        const robj = {
          details: {
            orderId,
            invoice: order.invoice ? order.invoice : '',
            paymentMethodIcon: order.pluginAvatarPath + order.pluginAvatar,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            datetime: order.createdAt,
            orderPrefixId: order.orderNo,
            shippingCharges: order.shippingCharges,
            totalDiscount: order.discount,
            couponAmount: order.discount,
            salesTax: "0.00",
            walletAmountUsed,
            subtotal,
            total: orderGrandTotal,
            productDetail,
            shipping: {
                name: order.name,
                zipcode: order.zipcode,
                lineAddress1: order.lineAddress1,
                lineAddress2: order.lineAddress2,
                lineAddress3: order.lineAddress3,
                addrType: order.addrType,
                country: order.country,
                state: order.state,
                city: order.city,
            },
          },
        };
        return robj;
    }

    // public orderPlacedInLast30Mins(order: any) {
    //     // check if order has been placed from last 30 minutes then user cannot cancel order
    //     const now = moment().format(AppLevelDateTimeFormat);
    //     const then = moment(order.createdAt).format(AppLevelDateTimeFormat);
    //     const ms = moment(now, AppLevelDateTimeFormat).diff(moment(then, AppLevelDateTimeFormat));
    //     const duration = moment.duration(ms);
    //     const seconds = duration.asSeconds();
    //     const minutes = seconds / 60;
    //     if (Math.floor(minutes) > 30) {
    //         order = { ...order, can_cancel_order: 0, cancel_order_time_remaining: 0 };
    //         // Object.assign(checkOrder, { can_cancel_order: 0, cancel_order_time_remaining: 0 });
    //     } else {
    //         order = { ...order, can_cancel_order: 1, cancel_order_time_remaining: minutes };
    //         // Object.assign(checkOrder, { can_cancel_order: 1, cancel_order_time_remaining: seconds });
    //     }
    //     return order;
    // }

    // public checkIfOrderDispached(order: any) {
    //     return order;
    // }
}
