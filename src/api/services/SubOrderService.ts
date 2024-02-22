import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { SubOrderRepository } from '../repositories/SubOrderRepository';
import { SubOrder } from '../models/SubOrder';
import { Users } from '../models/Users';
import { VendorProduct } from '../models/VendorProduct';
import { UserAddresses } from '../models/UserAddresses';
import { ProductRating } from '../models/ProductRating';
import { SubOrderTracking } from '../models/SubOrderTracking';
import { getConnection  } from 'typeorm';
import { ProductRatingImageService } from './ProductRatingImageService';
import { SubOrderLogService } from './SubOrderLogService';
import { SiteSettingsService } from './SiteSettingsService';
import { AppLevelDateTimeFormat, formatPrice, getRegion, OrderStatusEnum } from '../utils';
import { VendorStoreProfile } from '../models/VendorStoreProfile';
import { OrderInfo } from '../models/OrderInfo';
import { OrderStatusesMl } from '../models/OrderStatusML';
import { OrderStatuses } from '../models/OrderStatuses';
import moment from 'moment-timezone';

interface SubOrderFuncInterface {
    orderId?: number,
    userId?: number,
    subOrderId?: number,
    statusId?: number,
    limit?: number,
    offset?: number,
    langId: number
}
@Service()
export class SubOrderService {

    constructor(
        @OrmRepository() private repo: SubOrderRepository,
        private productRatingImageService: ProductRatingImageService,
        private subOrderLogService: SubOrderLogService,
        private siteSettingsService: SiteSettingsService,
        
        
    ) {}

    public async create(result: any): Promise<any> {
        return this.repo.save(result);
    }
    public async findAll(condition: any): Promise<any> {
        return await this.repo.find(condition);
    }
    public update(id: any, data: any): Promise<any> {
        data.id = id;
        return this.repo.save(data);
    }
    public async findOne(condition: any): Promise<any> {
        return this.repo.findOne(condition);
    }
    public async totalAmountsbyVendors(orderId: number): Promise<any> {
        return this.repo.totalAmountsbyVendors( orderId );
    }
    public orderPlacedInLastSetMins(suborder: any, setMinutes:any, siteId: any) {
        // check if order has been placed from last 30 minutes then user cannot cancel order
        const region = getRegion(siteId);
        const then = moment(suborder.createdAt).tz(region).format(AppLevelDateTimeFormat);
        const now = moment.tz(region).format(AppLevelDateTimeFormat);
        const ms = moment(now, AppLevelDateTimeFormat).diff(moment(then, AppLevelDateTimeFormat));
        const duration = moment.duration(ms);
        const seconds = duration.asSeconds();
        const minutes = seconds / 60;
        console.log(minutes, setMinutes)
        if (Math.floor(minutes) > setMinutes) {
            return {
                can_cancel_order: 0,
                cancel_order_time_remaining: 0
            }
        } else {
            return {    
                can_cancel_order: 1,
                cancel_order_time_remaining: parseInt(setMinutes) - Math.floor(minutes) < 0 ? 0 : parseInt(setMinutes) - Math.floor(minutes)
            };
        }
    }

    public checkIfOrderDispached(subOrder: any) {
        if(subOrder.statusId < OrderStatusEnum.Shipped){
            return {
                can_cancel_order: 1,
                cancel_order_time_remaining: 0
            }
         } else {
            return {
                can_cancel_order: 0,
                cancel_order_time_remaining: 0
            }
        }
    }
    public async subOrderTotalsByOrderId(orderId: number): Promise<any> {
        const selects = [
            'SUM(CAST(SO.shippingCharges AS decimal(10,2))) as shippingCharges',
            'SUM(CAST(SO.totalAmount AS decimal(10,2))) as totalAmount',
            'SUM(CAST(SO.discount AS decimal(10,2))) as discount',
        ];
        const result: any = await getConnection().getRepository(SubOrder).createQueryBuilder('SO')
        .where('SO.orderId = :orderId', { orderId }).select(selects).getRawOne();
        return {
            shippingCharges: parseFloat(result.shippingCharges),
            totalAmount: parseFloat(result.totalAmount),
            discount: parseFloat(result.discount),
        }
    }
    public async subOrderDetailedInformation(orderId: number, langId: number, siteId: any, subOrderId?: number, userId?: number): Promise<any> {
        const orderCancelSetting = await this.siteSettingsService.findOne({ where: { keyName: 'Order_Cancellation_Duration_For_Buyer' }});
        let subOrders = await this.subOrderQuery({ orderId, subOrderId, userId ,langId });
        subOrders = subOrders.map(async (item, index) => {
            const images = await this.productRatingImageService.find({ where: { productRatingId: item.ratingId } });
            const logs = await this.subOrderLogService.trackingLogsBySubOrderId(item.subOrderId);
            let cco: any;
            if (orderCancelSetting.value[0] == '1'){
                const setMins = orderCancelSetting.value.split("_")[1];
                cco = this.orderPlacedInLastSetMins(item, setMins, siteId)
            } else {
                cco = this.checkIfOrderDispached(item)
            }
            const courierTracking: any = {
                courierId: 0,
                trackingNo: '',
                shippedOn: '',
                comments: '',
                courierServiceName: '',
            };
            const buyerCourierTracking: any = {
                buyerCourierId: 0,
                buyerTrackingNo: '',
                buyerShippedOn: '',
                buyerComments: '',
                buyerCourierServiceName: '',
            };
            if (item.courierId) {
                const courierService = await this.subOrderLogService.getCourier(item.courierId);
                courierTracking.courierId = item.courierId;
                courierTracking.trackingNo = item.trackingNo;
                courierTracking.shippedOn = item.shippedOn;
                courierTracking.comments = item.comments ? item.comments : '';
                courierTracking.courierServiceName = courierService.name;
            }
            if (item.buyerCourierId) {
                const courierService = await this.subOrderLogService.getCourier(item.buyerCourierId);
                buyerCourierTracking.buyerCourierId = item.buyerCourierId;
                buyerCourierTracking.buyerTrackingNo = item.buyerTrackingNo;
                buyerCourierTracking.buyerShippedOn = item.buyerShippedOn;
                buyerCourierTracking.buyerComments = item.buyerComments ? item.buyerComments : '';
                buyerCourierTracking.buyerCourierServiceName = courierService.name;
            }
            const obj: any = {
                storeSlug: item.storeSlug,
                vendorId: item.vendorId,
                storeName: item.storeName,
                subOrderId: item.subOrderId,
                name: item.productName,
                image: item.productImage,
                productSlug: item.productSlug,
                quantity: item.quantity,
                price: formatPrice(siteId,item.totalAmount),
                subOrdershippingCharges: item.subOrdershippingCharges,
                status: item.status,
                statusId: item.statusId,
                statusColor: item.status_color,
                rating: item.rating,
                review: item.review,
                variant: JSON.parse(item.variant),
                ratingImages: images,
                tracking: logs,
                returnAble: 0,
                can_cancel_order: cco.can_cancel_order,
                cancel_order_time_remaining: Math.ceil(cco.cancel_order_time_remaining),
                courierTracking,
                buyerCourierTracking: buyerCourierTracking,
                reasonDescription: '',
                reason: '',
                proposal: '',
                proposalMessage: '',
                proposalAmount: '0'
            };
            if (item.statusId === OrderStatusEnum.Cancelled) {
                const reason = logs.find((l, i) => l.statusId === OrderStatusEnum.Cancelled);
                obj.reason = reason.reason;
                obj.reasonDescription = reason.description;
            }
            if (item.statusId === OrderStatusEnum.ReturnPending || item.statusId === OrderStatusEnum.ReturnRequestApproved || item.statusId === OrderStatusEnum.Returned) {
                const reason = logs.find((l, i) => l.statusId === OrderStatusEnum.ReturnPending);
                obj.reason = reason.reason;
                obj.reasonDescription = reason.description;
            }
            if (item.statusId === OrderStatusEnum.ReturnPending) {
                obj.proposalMessage = 'Your request has been submitted, please wait for seller response.';
                obj.proposal = 'Return and Refund';
                obj.proposalAmount = item.totalAmount;

            }
            if (item.statusId === OrderStatusEnum.ReturnRequestApproved) {
                obj.proposalMessage = 'Your return request has been accepted. Dispatch product to seller to get refund of product amount.';
                obj.proposal = 'Return and Refund';
                obj.proposalAmount = item.totalAmount;

            }
            if (item.statusId === OrderStatusEnum.Returned) {
                obj.proposal = 'Return and Refund';
                obj.proposalAmount = item.totalAmount;
            }
            if (item.statusId >= OrderStatusEnum.Delivered) {
                obj.can_cancel_order = 0;
            }
            if (item.returnTillDate) {
                if (moment(moment()).diff(moment(item.returnTillDate)) >= 0) {
                    obj.returnAble = 1;
                }
            }
            return obj;
        });
        subOrders = await Promise.all(subOrders);
        return subOrders;
        // if (whereConditions && whereConditions.length > 0) {
        //     whereConditions.forEach((item: any) => {
        //         if (item.op === 'where') {
        //             query.where(item.name + ' = ' + item.value);
        //         }
        //         if (item.op === 'andWhere') {
        //             query.andWhere(item.name + ' = ' + item.value);
        //         }
        //         if (item.op === 'daysfilter') {
        //             query.andWhere(item.name + ' ' + item.sign + ' now() - INTERVAL ' + item.value + ' day');
        //         }
        //         if (item.op === 'orWhere') {
        //             query.orWhere(item.name + ' = ' + item.value);
        //         }
        //         if (item.op === 'IN') {
        //             query.andWhere(item.name + ' IN (' + item.value + ')');
        //         }
        //         if (item.op === 'raw') {
        //             query.andWhere(item.name + ' ' + item.sign + ' \'' + item.value + '\'');
        //         }
        //         if (item.op === 'like' && item.value !== '' && item.value !== undefined) {
        //             query.andWhere(
        //                 new Brackets((qb) => {
        //                     qb.where(item.name2 + ' like ' + '\'%' + item.value + '%\'').orWhere(item.name1 + ' like ' + '\'%' + item.value + '%\'').orWhere(item.name3 + ' like ' + '\'%' + item.value + '%\'');
        //                 })
        //             );
        //         }
        //     });
        // }
        // if (groupBy && groupBy.length > 0) {
        //     let i = 0;
        //     groupBy.forEach((item: any) => {
        //         if (i === 0) {
        //             query.groupBy(item.name);
        //         } else {
        //             query.addGroupBy(item.name);
        //         }
        //         i++;
        //     });
        // }
    }

    public async subOrderQuery({ orderId, userId, subOrderId, statusId, limit, offset, langId }: SubOrderFuncInterface): Promise<any> {
        const selects = [
            'SO.id as subOrderId',
            'SO.createdAt as createdAt',
            // vendor cols
            'VendorAddress.Lineaddr1 as sellerAddress',
            'VendorAddress.type as addressType',
            'VendorAddress.name as addresstblseName',
            'VendorAddress.user_id as addresstblseuserId',
            'Vendor.email as sellerEmail',
            'Vendor.firstName as sellerName',
            'Vendor.mobileNumber as sellerPhone',
            // Suborder columns
            'SO.productId as productId',
            'SO.productVariantId as productVariantId',
            'SO.productName as productName',
            'SO.productImage as productImage',
            'SO.variant as variant',
            'SO.quantity as quantity',
            'SO.productPrice as productPrice',
            'SO.discount as discount',
            'SO.shippingCharges as shippingCharges',
            'SO.returnTillDate as returnTillDate',
            // 'SO.tax as tax',
            'SO.totalAmount as totalAmount',
            // 'SO.status as status',
            'OML.name as status',
            'SO.statusId as statusId',
            'OrderStatuses.colorCode as status_color',
            'SO.vendorId as vendorId',
            'SO.orderId as orderId',
            'SO.viewReturnLabel as viewReturnLabel',
            'PR.rating as rating',
            'PR.review as review',
            'PR.id as ratingId',
            'VP.slug as productSlug',
            // SubOrderTracking columns
            'Tracking.id as subOrderTrackingId',
            'Tracking.trackingNo as trackingNo',
            'Tracking.courierId as courierId',
            'Tracking.comments as comments',
            'Tracking.createdAt as trackingCreatedAt',
            'Tracking.shippedOn as shippedOn',
            // BuyerTracking columns
            'BuyerTracking.id as buyerSubOrderTrackingId',
            'BuyerTracking.trackingNo as buyerTrackingNo',
            'BuyerTracking.courierId as buyerCourierId',
            'BuyerTracking.comments as buyerComments',
            'BuyerTracking.createdAt as buyerCreatedAt',
            'BuyerTracking.shippedOn as buyerShippedOn',
            // VendorStoreProfile columns
            'VendorStoreProfile.storeName as storeName',
            'VendorStoreProfile.slug as storeSlug',
            // OrderInfo columns
            'OrderInfo.shippingCharges as subOrdershippingCharges',

        ];
        const query: any = await getConnection().getRepository(SubOrder).createQueryBuilder('SO').select(selects)
        .leftJoin(ProductRating, 'PR', 'PR.subOrderId = SO.id')
        .leftJoin(OrderStatusesMl, 'OML', 'OML.orderStatusId = SO.statusId AND OML.lang_id = :langId', { langId })
        .leftJoin(OrderStatuses, 'OrderStatuses', 'OrderStatuses.id = SO.statusId')
        .leftJoin(Users, 'Vendor', 'Vendor.id = SO.vendorId')
        .leftJoin(VendorProduct, 'VP', 'VP.vendorId = SO.vendorId AND VP.productId = SO.productId')
        .leftJoin(UserAddresses, 'VendorAddress', 'VendorAddress.userId = SO.vendorId AND VendorAddress.type = :type', { type: 'BL' }) // BL for Business Location
        .leftJoin(SubOrderTracking, 'Tracking', 'Tracking.subOrderId = SO.id AND Tracking.shippedBy = SO.vendorId')
        .leftJoin(SubOrderTracking, 'BuyerTracking', 'BuyerTracking.subOrderId = SO.id AND BuyerTracking.shippedBy = :userId', { userId })
        .leftJoin(VendorStoreProfile, 'VendorStoreProfile', 'VendorStoreProfile.userId = SO.vendorId')
        .leftJoin(OrderInfo, 'OrderInfo', 'OrderInfo.subOrderId = SO.id')
        if (orderId) {
            query.where('SO.orderId = :orderId', { orderId });
        }        
        if (userId) {
            query.andWhere('SO.userId = :userId', { userId });
        }
        if (subOrderId) {
            query.andWhere('SO.id = :subOrderId', { subOrderId });
        }
        if (statusId && statusId !== 0) {
            query.andWhere('SO.statusId = :statusId', { statusId });
        }
        if (limit && limit > 0) {
            query.limit(limit).offset(offset);
        }
        query.orderBy('SO.orderId','DESC')
        return query.getRawMany();
    }
}
