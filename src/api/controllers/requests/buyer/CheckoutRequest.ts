import 'reflect-metadata';
import { IsNotEmpty, IsIn, IsArray, IsNumber, ValidateNested, ArrayMinSize, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';


class ProductDetail {
    @IsNumber()
    @IsNotEmpty({ message: 'productId is required' })
    public productId: number;

    @IsNumber()
    @IsNotEmpty({ message: 'productVariantId is required' })
    public productVariantId: number;

    @IsNumber()
    @IsNotEmpty({ message: 'vendorId is required' })
    public vendorId: number;

    @IsNumber()
    @IsNotEmpty({ message: 'shippingChargesId is required' })
    public shippingChargesId: number;

    @IsNumber()
    @IsNotEmpty({ message: 'quantity is required' })
    public quantity: number;
    
    @IsNumber()
    @IsNotEmpty({ message: 'productDiscountId is required' })
    public productDiscountId: number;
}

export class CheckoutRequest {

    @IsNumber()
    @IsNotEmpty({ message: 'paymentMethod is required' })
    public paymentMethod: number;

    public couponCode: string;

    @IsNumber()
    @IsNotEmpty({ message: 'addressId is required' })
    public addressId: number;

    @IsNumber()
    @IsIn([0, 1])
    @IsNotEmpty({ message: 'isWallet is required' })
    public isWallet: number;

    @IsNumber()
    @IsIn([0, 1])
    @IsNotEmpty({ message: 'isGift is required' })
    public isGift: number;

    @ValidateIf(response => typeof response.productDetails === undefined)
    @IsNotEmpty({ message: 'productDetail is required' })
    public productDetail: string;

    @ValidateIf(response => response.productDetail === undefined)
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => ProductDetail)
    public productDetails: ProductDetail[];
}