import { Service } from 'typedi';
import { getConnection } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Product } from '../models/Product';
import { VendorProductVariants } from '../models/VendorProductVariants';
import { ProductVariants } from '../models/ProductVariants';
import { VendorProductVariantsRepository } from '../repositories/VendorProductVariantsRepository';
import { ProductDiscount } from '../models/ProductDiscount';
import { ProductShippingInfo } from '../models/ProductShippingInfo';
import { ProductVariantImages } from '../models/ProductVariantImages';
import { VendorProduct } from '../models/VendorProduct';

@Service()
export class VendorProductVariantsService {

    constructor(@OrmRepository() private repo: VendorProductVariantsRepository) {
    }

    public async create(data: any): Promise<any> {
        return this.repo.save(data);
    }
    public async find(condition: any): Promise<any> {
        return this.repo.find(condition);
    }
    public async findOne(condition: any): Promise<any> {
        return this.repo.findOne(condition);
    }
    public async checkoutValidate(VPV_ArrayString: any): Promise<any> {
        const selects = [
            'P.name as name',
            'PVI.image as image',
            'PV.productVariantValuesId as productVariantValuesId',
            'VPV.vendorId as vendorId',
            'VPV.productId as productId',
            'VPV.productVariantId as productVariantId',
            'VPV.price as price',
            'VPV.quantity as varaintQuantity',
            'VPV.id as vendorProductVariantId',
            'VPV.outOfStock as outOfStock',
            'PD.price as variantDiscountPrice',
            'PD.id as variantDiscountId',
            'PD.startDate as variantDiscountStartDate',
            'PD.endDate as variantDiscountEndDate',
        ];
        return await getConnection().getRepository(VendorProductVariants).createQueryBuilder('VPV')
        .where('(VPV.vendorId, VPV.productId, VPV.productVariantId, VPV.siteId) IN (' + VPV_ArrayString + ')')
        .select(selects)
        .innerJoin(Product, 'P', 'P.id = VPV.productId')
        .innerJoin(ProductVariants, 'PV', 'PV.id = VPV.productVariantId')
        .leftJoin(ProductVariantImages, 'PVI', 'PVI.productVariantsId = VPV.productVariantId AND PVI.isDefault = 1')
        .leftJoin(ProductDiscount, 'PD', 'PD.vendorProductVariantId = VPV.id')
        .getRawMany();
    }


    public async checkoutProductDetailsParamInfo(products: any[], siteId: any): Promise<any> {
        let VPV_ArrayString = '(0,0,0,0),';
        products.forEach((e: any) => {
            VPV_ArrayString += `(${e.vendorId},${e.productId},${e.productVariantId},${siteId}),`
        });
        VPV_ArrayString += '(0,0,0,0)';
        let results = await this.checkoutValidate(VPV_ArrayString);
        if (results.length !== products.length) {
            return { status: 0 };
        }
        // validate all productDiscountId in checkout product details array
        const discountsFromDb = results.filter(r => r.variantDiscountId !== null);
        const discountIdsFromRequest = products.filter(p => p.productDiscountId !== 0);
        if (discountsFromDb.length !== discountIdsFromRequest.length) {
            return { status: 0 };
        }
        // validate all shippingChargesId in checkout product details array
        let PSI_ArrayString = '(0,0,0,0),';
        products.forEach((e: any) => {
            PSI_ArrayString += `(${e.shippingChargesId},${e.vendorId},${e.productId},${siteId}),`
        });
        PSI_ArrayString += '(0,0,0,0)';
        const shippingArray = await getConnection().getRepository(ProductShippingInfo).createQueryBuilder('PSI').where('(PSI.id, PSI.vendorId, PSI.productId, PSI.siteId) IN (' + PSI_ArrayString + ')').getMany();
        if (shippingArray.length !== products.length) {
            // return { status: 0 };
        }
        results = results.map(item => {
            const cartItem = products.find(p => p.productVariantId === item.productVariantId);
            return {
                siteId,
                ...item,
                quantity: cartItem.quantity,
                shippingChargesId: cartItem.shippingChargesId,
            }
        });
        results = results.map(item => {
            const shipping = shippingArray.find(i => i.id === item.shippingChargesId);
            return {
                ...item,
                shippingDays: shipping.days,
                shippingCharges: shipping.charges,
                shippingType: shipping.type,
            }
        });

        return results;
    }
    // update variant
    public update(id: any, variant: any): Promise<any> {
        variant.id = id;
        return this.repo.save(variant);
    }

    public async getAllVendorVariants(vendorId: number, productId: number): Promise<any> {
        const selects = [
            'VPV.id as vendorProductVariantId',
            'VPV.vendorId as vendorId',
            'VPV.productId as productId',
            'VPV.siteId as siteId',
            'VPV.price  as price',
            'VPV.outOfStock as outOfStock',
            'VPV.available as available',
            'VPV.isActive as isActive',
            'VPV.quantity as varaintQuantity',
            'VPV.productVariantId as productVariantId',
            'VPV.is_default as is_default',
            'VP.statusId as statusId',
            'PV.productVariantValuesId as productVariantValuesId',
            'PV.isActive as pvIsActive',
            'PD.price as variantDiscountPrice',
            'PD.id as variantDiscountId',
            'PD.startDate as variantDiscountStartDate',
            'PD.endDate as variantDiscountEndDate',
        ];
        return await getConnection().getRepository(VendorProductVariants).createQueryBuilder('VPV')
        .select(selects)
        .where('VPV.vendorId = :vendorId AND VPV.productId = :productId', { vendorId, productId })
        .andWhere('VPV.isActive = 1')
        .innerJoin(VendorProduct, 'VP', 'VP.productId = VPV.productId AND VP.vendorId = :vendorId', { vendorId })
        .innerJoin(Product, 'P', 'P.id = VPV.productId')
        .innerJoin(ProductVariants, 'PV', 'PV.id = VPV.productVariantId AND PV.isActive = 1')
        .leftJoin(ProductDiscount, 'PD', 'PD.vendorProductVariantId = VPV.id AND PD.startDate <= NOW()')
        .orderBy('VPV.outOfStock', 'ASC')
        .addOrderBy('VPV.id', 'DESC')
        .getRawMany();
    }

}
