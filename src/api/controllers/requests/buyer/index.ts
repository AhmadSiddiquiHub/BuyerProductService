import 'reflect-metadata';
import { IsNotEmpty, IsIn, IsArray, IsNumber, IsString, /*ValidateNested, ArrayMinSize,*/ ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
// import { userType } from '../../../models/ProductAnswers';

export class AddProductToWishlist {
    @IsNotEmpty({ message: 'productId is required' })
    public productId: number;
}

export class BrowsingHistoryRequest {
    @IsNotEmpty({ message: 'Limit is required' })
    public limit: number;

    @IsNotEmpty({ message: 'offset is required' })
    public offset: number;

    @IsString()
    public keyword: string;

    @IsIn(['ASC', 'DESC', 'price_desc', 'price_asc'])
    public order: string;

    public siteId: number;

}
export class GetCitiesRequest {
    // @IsNumber()
    @IsNotEmpty({ message: 'stateId is required' })
    public stateId: number;
}

export class GetTaxRateRequest {
    @IsNumber()
    @IsNotEmpty({ message: 'siteId is required' })
    public stateId: number;

    @IsNumber()
    @IsNotEmpty({ message: 'countryId is required' })
    public countryId: number;

    @IsNumber()
    @IsNotEmpty({ message: 'cityId is required' })
    public cityId: number;
}

export class GetPaymentSettingRequest {
    @IsNotEmpty({ message: 'keyword is required' })
    public keyword: string;

    @IsNumber()
    @IsNotEmpty({ message: 'country code is required' })
    public country_code: number;
    
    @IsNumber()
    @IsNotEmpty({ message: 'siteId is required' })
    public siteId: number;

}

export class GetQuestionListRequest {
    @IsNumber()
    @IsNotEmpty({ message: 'Limit is required' })
    public limit: number;

    @IsNumber()
    @IsNotEmpty({ message: 'offset is required' })
    public offset: number;

    @IsNotEmpty({ message: 'slug is required' })
    public slug: string;

    @IsString()
    public keyword: string;
}
export class AddAnswerRequest {
    @IsNotEmpty({ message: 'question Id is required' })
    public productQuestionId: number;

    @IsNotEmpty({ message: 'answer is required' })
    public answer: number;

    @IsNumber()
    @IsNotEmpty({ message: 'limit is required' })
    public limit: number;

    @IsNumber()
    @IsNotEmpty({ message: 'offset is required' })
    public offset: number;


}

export class OrderCancelRequest {
    @IsNotEmpty({ message: 'reasonId is required' })
    public reasonId: string;

    @IsNumber()
    @IsNotEmpty({ message: 'subOrderId is required' })
    public subOrderId: number;

    @IsNotEmpty({ message: 'description is required' })
    public description: string;
}

export class OrderReturnRequest {

    @IsNotEmpty({ message: 'reasonId is required' })
    public reasonId: string;

    @IsNumber()
    @IsNotEmpty({ message: 'subOrderId is required' })
    public subOrderId: number;

    @IsNotEmpty({ message: 'description is required' })
    public description: string;
}

export class SpecificCategoryListRequest {

    @IsNotEmpty()
    @IsString()
    public categorySlug: string;

}

export class CatalogFilterRequestRequest {

    @IsNotEmpty()
    @IsString()
    public categorySlug: string;

}
export class SubmitOrderRatingRequest {
    
    @IsNumber()
    @IsNotEmpty({ message: 'subOrderId is required' })
    public subOrderId: number;

    @IsNotEmpty({ message: 'reviews is required' })
    public reviews: string;

    @IsNumber()
    @IsNotEmpty({ message: 'rating is required' })
    public rating: number;

    @IsArray()
    @IsString({ each: true })
    public images: string[];
}

export class SubOrderDetailsRequest {
    @IsNumber()
    @IsNotEmpty({ message: 'subOrderId is required' })
    public subOrderId: number;
}

export class AddTrackingByBuyerRequest {
    @IsNumber()
    @IsNotEmpty({ message: 'courierId is required' })
    public courierId: number;

    @IsNumber()
    @IsNotEmpty({ message: 'subOrderId is required' })
    public subOrderId: number;

    @IsString()
    @IsNotEmpty({ message: 'trackingNo is required' })
    public trackingNo: string;
}

export class WalletListRequest {
    @IsNumber()
    @IsNotEmpty({ message: 'limit is required in body' })
    public limit: number;

    @IsNumber()
    @IsNotEmpty({ message: 'offset is required in body' })
    public offset: number;
}

export class WalletDetailsRequest {
    @IsNumber()
    @IsNotEmpty({ message: 'id is required in body' })
    public id: number;
}

export class AddQuotationRequest {
    @IsNumber()
    public productId: number;
    @IsNumber()
    public quantity: number;
    @IsNumber()
    public discount: number;
    @IsString()
    public description: string;
    @IsNumber()
    public vendorId: number;
    @IsNumber()
    public siteId: number;
}

export class AddToCartRequest {

    @IsNumber()
    @IsNotEmpty({ message: 'productId is required in body' })
    public productId: number;

    @IsNumber()
    @IsNotEmpty({ message: 'productVariantId is required in body' })
    public productVariantId: number;

    @IsNumber()
    @IsNotEmpty({ message: 'vendorId is required in body' })
    public vendorId: number;

    @IsNumber()
    @IsNotEmpty({ message: 'quantity is required in body' })
    public quantity: number;
    
}

export class RemoveCartItemRequest { 

    @IsNotEmpty({ message: 'productId is required in body' })
    @IsNumber()
    public productId: number;

    @IsNotEmpty({ message: 'productVariantId is required in body' })
    @IsNumber()
    public productVariantId: number;

    @IsNotEmpty({ message: 'vendorId is required in body' })
    @IsNumber()
    public vendorId: number;
    
}
export class RemoveCartRequest {
    @ValidateIf(response => typeof response.cart === undefined)
    @IsNotEmpty({ message: 'cartItems is required' })
    public cartItems: string;

    @ValidateIf(response => response.cartItems === undefined)
    // @IsArray()
    // @ValidateNested({ each: true })
    // @ArrayMinSize(1)
    @Type(() => RemoveCartItemRequest)
    public cart: RemoveCartItemRequest[];
}

export class OrderListRequest {

    // @IsInt()
    @IsNotEmpty({ message: 'limit is required in body' })
    public limit: number;

    // @IsInt()
    @IsNotEmpty({ message: 'offset is required in body' })
    public offset: number;

    // @IsInt()
    @IsNotEmpty({ message: 'status is required in body' })
    public status: number;
}

export class OrderDetailRequest {

    @IsNumber()
    @IsNotEmpty({ message: 'orderId is required in body' })
    public orderId: number;
}

export class DownloadOrderInvoiceRequest {
    @IsNumber()
    @IsNotEmpty({ message: 'orderId is required in body' })
    public orderId: number;
}

export class PrintReturnLabelRequest {
    @IsNumber()
    @IsNotEmpty({ message: 'subOrderId is required in body' })
    public subOrderId: number;
}



