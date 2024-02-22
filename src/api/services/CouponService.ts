import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { VendorCouponRepository } from '../repositories/CouponRepository';
// import { CouponProductsService } from './CouponProductsService';
import { getConnection } from 'typeorm';
import { Coupon } from '../models/Coupon';
import { CouponProduct } from '../models/CouponProduct';
// import { CouponUsersService } from './CouponUserService';
// import { CouponUsers } from '../models/CouponUsers';
import { CartService } from './CartService';
// import { CouponUser } from '../models/CouponUser';
// import { CouponUsage } from '../models/CouponUsage';
// import { CouponUsageService } from './CouponUsageService';
// import { CouponUser } from '../models/CouponUser';

interface ProcessCouponFuncInerface {
    couponCode: string,
    siteId: number,
    userId: number,
    products: any[]
}
@Service()
export class VendorCouponService {

    constructor(
        @OrmRepository() private vendorCouponRepository: VendorCouponRepository,
        // private couponProductsService :CouponProductsService,
        
        private cartService: CartService,
        // private couponUsersService: CouponUsersService,
        // private couponUsageService: CouponUsageService,
        
        
    ) {}

    public async create(data: any): Promise<any> {
        return this.vendorCouponRepository.save(data);
    }

    public findOne(data: any): Promise<any> {
        return this.vendorCouponRepository.findOne(data);
    }

    public update(data: any): Promise<any> {
        return this.vendorCouponRepository.save(data);
    }
    public async validateCoupon(couponCode: string, siteId: number, userId: number): Promise<any> {
        const selects = [
            'coupon.couponId as couponId',
            'coupon.vendorId as vendorId',
            'coupon.couponCode as couponCode',
            'coupon.type as couponType',
            'coupon.valueType as valueType',
            'coupon.maxUsage as maxUsage',
            'coupon.value as value',
            'coupon.startDate as startDate',
            'coupon.endDate as endDate',
            'coupon.minOrderAmount as minOrderAmount',
            'coupon.maxDiscount as maxDiscount',
            'coupon.userBased as userBased',
            `(SELECT COUNT(couponUsage.user_id) FROM coupon_usage as couponUsage WHERE couponUsage.coupon_id = coupon.id AND couponUsage.user_id = ${userId}) as couponUsage`,
            `(SELECT GROUP_CONCAT(couponUsers.user_id) FROM coupon_users as couponUsers WHERE couponUsers.coupon_id = coupon.id) as couponUsersIds`,
            '(SELECT GROUP_CONCAT(couponProducts.product_id) From coupon_products as couponProducts where couponProducts.coupon_id = coupon.id) as productIds'
        ];
        const coupon: any = await getConnection().getRepository(Coupon).createQueryBuilder('coupon')
        .select(selects)
        .where('(coupon.startDate <= NOW() AND coupon.endDate >= NOW())')
        .andWhere('BINARY coupon.couponCode = :couponCode', { couponCode })
        .andWhere('coupon.isActive = :isActive', { isActive: 1 })
        .andWhere('coupon.siteId = :siteId', { siteId })
        .getRawOne();
        if (!coupon) {
            return { status: 0, message: 'Coupon Expired or Invalid!', data: {}};
        }
        if (coupon.maxUsage <= coupon.couponUsage) {
            return { status: 0, message: 'Coupon Expired. Maximum usage of this coupon exceeded!', data: {}};
        }
        return { status: 1, message: 'Coupon validated Successfully', data: coupon };
    }

    public async processCoupon({ couponCode, siteId, userId, products, }: ProcessCouponFuncInerface): Promise<any> {
        products = products.map(item => {
            return { ...item, couponDiscount: 0 }
        });
        // check coupon is valid
        let coupon = await this.validateCoupon(couponCode, siteId, userId);
        if (coupon.status === 0) {
            return coupon;
        }
        // if (coupon.maxUsage < coupon.couponUsage) {
        //     const errResponse: any = { status: 0, message: 'Maximum usage of this coupon exceeded'};
        //     return errResponse;
        // }
        coupon = coupon.data;
        console.log("coupon.couponUsage",coupon.couponUsage)
        console.log("coupon.couponUsage",coupon.couponUsersIds)
        if (coupon.maxUsage < 1) {
            const errResponse: any = { status: 0, message: 'Maximum usage of this coupon exceeded'};
            return errResponse;
        }
        if(coupon.couponUsage > 0){
            const errResponse: any = { status: 0, message: 'you have already used this coupon'};
            return errResponse;
        }
        if(coupon.userBased === 1){
            let couponUsersIdsStr = coupon.couponUsersIds.split(',')
            let couponUsersIds = couponUsersIdsStr.map(str => { return Number(str);});
            if (couponUsersIds.length > 0) {
                    if (!(couponUsersIds.indexOf(Number(userId)) > -1)) { //contains this or not'
                        const inValidUser: any = { status: 0, message: 'This is user specific coupon and is Invalid coupon for you' };
                        return inValidUser;
                    }
            }
        }
         // validate coupon is attached with productId and vendorId coming in request
        const vendorProducts = products.filter(p => p.vendorId === coupon.vendorId);
        const totalOfVendorProducts = vendorProducts.map((item, index) => parseFloat(item.price) * item.quantity).reduce((a, b) => a + b, 0).toString();
        if (vendorProducts.length === 0) {
            return { status: 0, message: 'This coupon is not valid for the selected products.' };
        }
        console.log("coupon",coupon);
        // console.log("products", products);
        // console.log("pids",coupon.productIds)
        if(coupon.couponType === 'product_based'){
            let couponProductIdsStr = coupon.productIds.split(',')
            let couponProductIds = couponProductIdsStr.map(str => {
                return Number(str);
              });
            let eligibleProducts: any = products;
            if (couponProductIds.length > 0) {
                eligibleProducts = products.filter(e => {
                    if (couponProductIds.indexOf(Number(e.productId)) > -1) { //contains this or not'
                        return true;
                    }
                    return false;

                });
            }
            console.log("eligibleProducts",eligibleProducts)

            if (eligibleProducts.length === 0) {
                const inValidProduct: any = { status: 0, message: 'Invalid coupon for this products' };
                return inValidProduct;
            }
            const pd = await this.couponFunc(products, totalOfVendorProducts,vendorProducts, coupon, userId);
            return pd;
        }
        else if (coupon.couponType === 'open' ){
            const a = await this.couponFunc(products, totalOfVendorProducts,vendorProducts, coupon, userId);
            return a;
        }
    }

    public async couponFunc(products,totalOfVendorProducts, vendorProducts,coupon, userId): Promise<any>{
        // check coupon do have min order amount
        if (coupon.minOrderAmount) {
            // here if the coupon is qualified by the minOrderAmount of vendor then the couponDiscount varianble in products array in the start of the 
            // function will be updated otherwise it will be 0
            if (totalOfVendorProducts >= coupon.minOrderAmount) {
                // update the couponDiscount of first product of vendor in products array
                products = products.map(item => {
                    if (vendorProducts[0].vendorId === item.vendorId) {
                        if (coupon.valueType == 1) {    
                            return { ...item, couponDiscount: coupon.value }
                        } else {
                            // if coupon.valueType = 2
                            const valueInPercentage = (parseFloat(coupon.value) / 100) * parseFloat(totalOfVendorProducts);
                            if(valueInPercentage > coupon.maxDiscount){
                                return { ...item, couponDiscount: coupon.maxDiscount }
    
                            }
                            return { ...item, couponDiscount: valueInPercentage }
                        }
                    }
                    return item;
                });
            }
        }
        // if there is no min order amount
        if (!coupon.minOrderAmount) {
            // update the couponDiscount of first product of vendor in products array
            products = products.map(item => {
                if (vendorProducts[0].vendorId === item.vendorId) {
                    if (coupon.valueType == 1) {
                        return { ...item, couponDiscount: coupon.value }
                    } else {
                        // if coupon.valueType = 2
                        const valueInPercentage = (parseFloat(coupon.value) / 100) * parseFloat(totalOfVendorProducts);
                        if(valueInPercentage > coupon.maxDiscount){
                            return { ...item, couponDiscount: coupon.maxDiscount }

                        }
                        return { ...item, couponDiscount: valueInPercentage }
                    }
                }
                return item;
            });
        }
        return {
                products,
                coupon 
        };
    }
    public async couponsAccordingToUserCart(userId: number): Promise<any> {
        const cart = await this.cartService.find({ where: { userId }});
        const vendorIds = cart.map(i => i.vendorId)
        console.log('vendorids',vendorIds);
        if (vendorIds.length === 0) {
            return [];
        }
        const selects = [
            'Coupon.couponId as couponId',
            'Coupon.vendorId as vendorId',
            'Coupon.couponCode as couponCode',
            'Coupon.type as couponType',
            'Coupon.valueType as valueType',
            'Coupon.maxUsage as maxUsage',
            'Coupon.value as value',
            'Coupon.startDate as startDate',
            'Coupon.endDate as endDate',
            'Coupon.isStackable as isStackable',
            'Coupon.minOrderAmount as minOrderAmount',
            // 'CP.couponId as couponId',
            'CP.productId as productId',
        ];
        let coupons: any = await getConnection().getRepository(Coupon).createQueryBuilder('Coupon')
        .select(selects)
        .leftJoin(CouponProduct, 'CP', 'Coupon.couponId = CP.couponId')
        // .leftJoin(CouponUser, 'CU', `Coupon.couponId = CU.couponId AND CU.userId = ${userId}`)
        .where('(Coupon.startDate <= NOW() AND Coupon.endDate >= NOW())')
        .andWhere('Coupon.vendorId IN (' + vendorIds + ')')
        .andWhere('Coupon.isActive = :isActive', { isActive: 1 })
        .groupBy('Coupon.couponId')
        .getRawMany();
        coupons = coupons.map(coupon => {
            return { ...coupon, statement: '' }
        });
        coupons = coupons.map(coupon => {
            const { value, minOrderAmount } = coupon;
            if (coupon.valueType == 1) {
                coupon.statement = `Get ${value} OFF`;
            }
            if (coupon.valueType == 2) {
                coupon.statement = `Get ${value}% OFF`;
            }
            if (minOrderAmount) {
                coupon.statement += ` on order amount of ${minOrderAmount}`;
            }
            return {
                ...coupon
            }
        });
        return coupons;
    }

    public async couponListing(vendorIds: any): Promise<any> {
     
        const nowDate = new Date();
        const today = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate() + ' ' + nowDate.getHours() + ':' + nowDate.getMinutes() + ':00' 
        console.log('todayyyyyyyyyyyyyyyyyyyyyyyyyyyy,',today)
        const selects = [
            'coupon.couponName as couponName',
            'coupon.value as value', 
            'coupon.valueType as valueType',
            'coupon.couponCode as couponCode', 
            'coupon.type as couponType',
            'coupon.startDate as couponStartDate',
            'coupon.endDate as couponEndDate'
        ];
        const query: any = await await getConnection().getRepository(Coupon).createQueryBuilder('coupon');
        query.select(selects)
        if(vendorIds.length == 0){
            vendorIds.push(0);
        }
        query.where('coupon.vendorId IN (' + vendorIds + ')');
        query.andWhere('(coupon.startDate <= :today AND coupon.endDate >= :today)', { today });
        query.andWhere('coupon.isActive = :isActive', { isActive: 1 });
        return query.getRawMany();

    }

}
