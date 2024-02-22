import 'reflect-metadata';
import { IsArray, IsIn, IsInt, IsNotEmpty, Matches, MaxLength, MinLength, ValidateIf, IsNumber, IsString, IsDateString, NotEquals, ValidateNested, ArrayMinSize, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { AddToCartRequest } from './buyer';
const validateEmailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/

export class CountryListRequest {

    @IsNumber()
    @IsNotEmpty({ message: 'limit is required' })
    public limit: number;

    @IsNumber()
    @IsNotEmpty({ message: 'offset is required' })
    public offset: number;

    public keyword: string;
}

export class CampaignProductsListRequest {

    @IsNumber()
    @IsNotEmpty({ message: 'limit is required' })
    public limit: number;

    @IsNumber()
    @IsNotEmpty({ message: 'offset is required' })
    public offset: number;

    public keyword: string;

    @IsString()
    @IsNotEmpty({ message: 'slug is required' })
    public slug: string;
}

export class RelatedProductListingRequest {

    @IsNumber()
    @IsNotEmpty({ message: 'limit is required' })
    public limit: number;

    @IsNumber()
    @IsNotEmpty({ message: 'offset is required' })
    public offset: number;

    @IsString()
    @IsNotEmpty({ message: 'slug is required' })
    public slug: string;
}

export class ProductReviewsListingRequest {

    @IsNumber()
    @IsNotEmpty({ message: 'limit is required' })
    public limit: number;

    @IsNumber()
    @IsNotEmpty({ message: 'offset is required' })
    public offset: number;

    @IsNotEmpty({ message: 'slug is required' })
    public slug: string;
}

export class NewsLetterRequest {
    @IsNotEmpty({ message: 'email is required' })
    public email: string;
}

export class UnsubscribeNewsLetterRequest {
    @IsNotEmpty({ message: 'key is required' })
    public key: string;
}

export class ChangePassword {

    @IsNotEmpty({ message: 'oldPassword is required' })
    public oldPassword: string;

    @MinLength(8, { message: 'newPassword must contain minimum 8 character' })
    @IsNotEmpty({ message: 'newPassword is required' })
    public newPassword: string;
}

export class GoogleLoginRequest {

    @IsString()
    @IsNotEmpty({ message: 'email is required' })
    @Matches(validateEmailRegex)
    public email: string;

    @IsString()
    @IsNotEmpty({ message: 'fullName is required' })
    public fullName: string;

    @IsString()
    @IsNotEmpty({ message: 'token is required' })
    public token: string;
}

export class FacebookLoginRequest {

    @IsString()
    @IsNotEmpty({ message: 'email is required' })
    @Matches(validateEmailRegex)
    public email: string;

    @IsString()
    @IsNotEmpty({ message: 'fullName is required' })
    public fullName: string;

    @IsString()
    @IsNotEmpty({ message: 'token is required' })
    public token: string;
}

export class CreateAddressGiftRequest {

    @IsString()
    @IsNotEmpty({ message: 'firstName is required' })
    public firstName: string;

    @IsString()
    @IsNotEmpty({ message: 'lastName is required' })
    public lastName: string;

    @IsString()
    @IsNotEmpty({ message: 'email is required' })
    @Matches(validateEmailRegex)
    public email: string;

    @IsString()
    @IsNotEmpty({ message: 'phone is required' })
    public phone: string;

    @IsNumber()
    @IsNotEmpty({ message: 'stateId is required' })
    public stateId: number;

    @IsNumber()
    @IsNotEmpty({ message: 'cityId is required' })
    public cityId: number;

    @IsString()
    @MaxLength(128, { message: 'address should be maximum 128 characters' })
    @IsNotEmpty({ message: 'address is required' })
    public address: string;

    @IsString()
    @MaxLength(128, { message: 'nearby should be maximum 128 characters' })
    @ValidateIf(n => n.nearby !== '')
    public nearby: string;

    // @MaxLength(10, { message: 'postcode should be maximum 6 characters' })
    @IsNumber()
    @ValidateIf(o => o.postcode !== '')
    public postcode: number;

    @IsNotEmpty()
    @IsString()
    public type: string;
}

export class CreateCouponRequest {

    @MaxLength(255, {
        message: 'coupon name should be maximum 255 characters',
    })
    @IsNotEmpty({
        message: 'coupon name is required',
    })
    public couponName: string;
    @MaxLength(30, {
        message: 'coupon code should be maximum 32 characters',
    })
    @IsNotEmpty({
        message: 'coupon code is required',
    })
    public couponCode: string;

    @IsInt()
    @IsNotEmpty({
        message: 'coupon type is required  1-> percentage 2 -> amount',
    })
    public couponType: number;

    @IsNotEmpty({
        message: 'discount is required',
    })
    public discount: number;

    @IsNotEmpty({
        message: 'coupon Description is required',
    })
    public couponDescription: string;

    @IsNumber()
    public maxUsage: number;

    @IsNotEmpty({ message: 'start_date is required' })
    @IsDateString()
    public startDate: string;

    @IsNotEmpty({ message: 'end_date is required' })
    @IsDateString()
    public endDate: string;

    @IsArray()
    public productIds: [];

    @IsNotEmpty({
        message: 'userType is required',
    })
    @IsString()
    public userType: string;
}

export class CreateCustomer {

    @IsNotEmpty()
    public customerGroupId: number;

    @IsNotEmpty()
    public username: string;

    @MaxLength(96, { message: 'email should be maximum 96 characters' })
    @IsNotEmpty()
    @Matches(validateEmailRegex)
    public email: string;

    @MaxLength(15, {
        message: 'mobile number should be maximum 15 characters',
    })
    @IsNotEmpty({
        message: 'mobile number is required',
    })
    @MinLength(6, {
        message: 'mobile number should be minimum 6 character',
    })
    public mobileNumber: number;

    @MinLength(8, {
        message: 'password must contain minimum 8 character',
    })
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])((?=.*?[0-9])|(?=.*?[#?!@$%^&*-])).{8,}$/, { message: 'Password must contain at least one number or one symbol and one uppercase and lowercase letter, and at least 8 or more characters' })
    @IsNotEmpty({
        message: 'password is required',
    })
    public password: string;

    @MinLength(8, {
        message: 'confirm password must contain minimum 8 character',
    })
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])((?=.*?[0-9])|(?=.*?[#?!@$%^&*-])).{8,}$/, { message: 'Password must contain at least one number or one symbol and one uppercase and lowercase letter, and at least 8 or more characters' })
    @IsNotEmpty({
        message: 'confirm password is required',
    })
    public confirmPassword: string;
    public avatar: string;

    public newsletter: number;

    @IsNotEmpty()
    public mailStatus: number;

    @IsNotEmpty()
    public status: number;
}
export class CreateQuestion {

    @IsNotEmpty({ message: 'question is required' })
    public question: string;

    @IsNotEmpty({ message: 'productSlug is required' })
    public productSlug: string;
}

export class AddTopUpRequest {

    @IsNumber()
    @NotEquals(0)
    @IsNotEmpty({ message: 'amount is required' })
    public amount: number;

    @IsNumber()
    @IsNotEmpty({ message: 'paymentMethodId is required' })
    public paymentMethodId: number;
}
export class UserAddressesreq {

    @MaxLength(128, { message: 'address1 should be maximum 128 characters' })
    @IsNotEmpty({ message: 'address1 is required' })
    public address1: string;

    public address2: string;

    @IsNotEmpty({ message: 'cityId is required' })
    public cityId: any;

    @IsNotEmpty({ message: 'stateId is required' })
    public stateId: any;

    @IsIn(['H', 'W'])
    @IsNotEmpty({ message: 'type is required' })
    public type: string;

    @IsNotEmpty({ message: 'isDefault is required' })
    public isDefault: number;

    @IsNotEmpty({ message: 'address name is required' })
    public name: any;

    @ValidateIf(o => o.zipcode !== '')
    public postcode: number;

}
export class UserChangeEmailPhoneRequest {
    @Matches(validateEmailRegex)
    @IsNotEmpty({ message: 'emailId is required' })
    public emailId: string;

    @IsIn(['email', 'phone'])
    @IsNotEmpty({ message: 'type is required' })
    public type: string;

    @IsNotEmpty({ message: 'update_value is required' })
    public update_value: string;
}
@ValidatorConstraint()
export class IsAddToCartRequestArray implements ValidatorConstraintInterface {
    public async validate(authData: AddToCartRequest[], args: ValidationArguments) {
        return Array.isArray(authData) && authData.reduce((a, b) => a && (typeof b.productId === "number") && typeof b.productVariantId === "number" && typeof b.vendorId === "number" && typeof b.quantity === "number", true);
    }
}
export class CustomerLogin {
    @IsNotEmpty({ message: 'emailOrPhone is required' })
    public emailOrPhone: string;

    @ValidateIf(response => response.loginType !== 'Facebook' && response.loginType !== 'Gmail')
    @IsNotEmpty({ message: 'password is required' })
    public password: string;

    @ValidateIf(response => response.browserId !== undefined)
    @IsString()
    public browserId: string;

    @IsArray()
    @IsNumber({}, { each: true })
    public user_product_browsing_history: number[];

    @IsArray()
    @IsNumber({}, { each: true })
    public wishlist: number[];

    @IsArray()
    @ValidateNested({ each: true })
    @Validate(IsAddToCartRequestArray, {
        message: "Invalid Cart Array",
    })
    @Type(() => AddToCartRequest)
    public cart: AddToCartRequest[];

    @IsIn(['Facebook', 'Gmail', 'Normal'])
    @IsNotEmpty({ message: 'login type is required' })
    public loginType: string;

    @ValidateIf(response => response.loginType === 'Facebook' && response.loginType === 'Gmail')
    @IsNotEmpty({ message: 'fullName is required' })
    public fullName: string;

    @ValidateIf(response => response.loginType === 'Facebook' && response.loginType === 'Gmail')
    @IsString()
    public token: string;
}

export class CustomerRegisterRequest {

    @IsNotEmpty({ message: 'fullName is required' })
    public fullName: string;

    @IsNotEmpty({ message: 'emailOrPhone is required' })
    public emailOrPhone: string;

    @ValidateIf(response => response.loginType !== 'Facebook' && response.loginType !== 'Gmail')
    @MinLength(8, { message: 'password must contain minimum 8 character' })
    @IsNotEmpty({ message: 'password is required' })
    public password: string;

    @ValidateIf(response => response.loginType !== 'Facebook' && response.loginType !== 'Gmail')
    @IsNotEmpty({ message: 'confirmPassword is required' })
    public confirmPassword: string;

    @IsIn(['Facebook', 'Gmail', 'Normal'])
    @IsNotEmpty({ message: 'login type is required' })
    public loginType: string;

    // @MaxLength(96, { message: 'email should be maximum 96 character' })
    // @IsNotEmpty({ message: 'Email is required' })
    // @Matches(validateEmailRegex, { message: 'email is invalid' })
    // public emailId: string;

    // @IsOptional()
    // public phoneNumber: string;
    @ValidateIf(response => response.browserId !== undefined)
    @IsString()
    public browserId: string;

    @ValidateIf(response => response.loginType === 'Facebook' && response.loginType === 'Gmail')
    @IsString()
    public token: string;
}
export class UpdateCouponRequest {

    @MaxLength(255, { message: 'coupon name should be maximum 255 characters' })
    @IsNotEmpty({ message: 'coupon name is required' })
    public couponName: string;

    @MaxLength(30, { message: 'coupon code should be maximum 32 characters' })
    @IsNotEmpty({ message: 'coupon code is required' })
    public couponCode: string;

    @IsInt()
    @IsNotEmpty({ message: 'coupon type is required  1-> percentage 2 -> amount' })
    public couponType: number;

    @IsNotEmpty({ message: 'discount is required' })
    public discount: number;

    @IsNotEmpty({ message: 'coupon Description is required' })
    public couponDescription: string;


    public maxUsage: number;


    @IsNotEmpty({ message: 'start_date is required' })
    @IsDateString()
    public startDate: string;

    @IsNotEmpty({ message: 'end_date is required' })
    @IsDateString()
    public endDate: string;

    @IsArray()
    public productIds: [];

    @IsNotEmpty({ message: 'userType is required' })
    public userType: string;

}

export class EditUserProfileEmail {
    @IsNotEmpty({ message: 'emailOrPhone is required' })
    public emailOrPhone: string;

    @IsIn(['Email', 'Phone'])
    @IsNotEmpty({ message: 'type is required' })
    public type: string;
}

export class VerifyOTPCodeUpdateProfileEmail {
    @IsNumber()
    @IsNotEmpty({ message: 'otp is required' })
    public otp: string;

    @IsNotEmpty({ message: 'emailOrPhone is required' })
    public emailOrPhone: string;

    @IsIn(['Email', 'Phone'])
    @IsNotEmpty({ message: 'type is required' })
    public type: string;
}

export class WebBasedUserEditProfileRequest {
    public fullName: string;
    public image: string;
    public email: string;
}

export class UpdateProfileRequest {
    @ValidateIf(response => response.fullName !== undefined)
    @IsString()
    public fullName: string;

    public image: string;

    public imageType: string;

    @ValidateIf(response => response.emailOrPhone !== undefined)
    @IsString()
    public emailOrPhone: string;
    // acascasd
}
// export class UserEditProfileRequest {
//     // @IsString()
//     // @MaxLength(32, { message: 'firstName should be maximum 32 character' })
//     @IsNotEmpty({ message: 'firstName is required' })
//     public firstName: string;

//     // @MaxLength(32, { message: 'lastName should be maximum 32 character' })
//     public lastName: string;

//     @MaxLength(96, { message: 'email should be maximum 96 character' })
//     @IsNotEmpty({ message: 'emailId is required' })
//     @Matches(validateEmailRegex)
//     public emailId: string;

//     @ValidateIf(o => o.phoneNumber !== '')
//     @MaxLength(15, { message: 'phoneNumber should be maximum 15 character' })
//     public phoneNumber: number;

//     public image: string;
// }

export class ForgetPasswordRequest {
    @IsNotEmpty({ message: 'emailOrPhone is required' })
    public emailOrPhone: string;
}

export class ResendOTPRequest {
    @IsNotEmpty({ message: 'emailOrPhone is required' })
    public emailOrPhone: string;
}
export class VerifyOtpRequest {
    @IsNotEmpty({ message: 'emailOrPhone is required' })
    public emailOrPhone: string;

    @IsNumber()
    @IsNotEmpty({ message: 'otpCode is required' })
    public otpCode: number;

    @IsNumber()
    @IsNotEmpty({ message: 'requireOtp is required' })
    public requireOtp: number;

    // @IsNotEmpty({ message: 'browserId is required' })
    public browserId: string;

    @ValidateIf(o => o.flag !== undefined)
    @IsIn(['update-profile'])
    public process: string
}
export class VendorProfile {
    @IsString()
    @IsNotEmpty({ message: 'vendorId is required' })
    public vendor: string;
}

export class VendorProfileReviewsListing {

    @IsNumber()
    @IsNotEmpty({ message: 'limit is required' })
    public limit: number;

    @IsNumber()
    @IsNotEmpty({ message: 'offset is required' })
    public offset: number;

    @IsString()
    @IsNotEmpty({ message: 'vendor is required' })
    public vendor: string;
}

class CouponProductDetailObject {
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
export class ApplyCouponRequest {

    @IsNotEmpty({ message: 'couponCode is required' })
    @IsString()
    public couponCode: string;

    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => CouponProductDetailObject)
    public productDetail: CouponProductDetailObject[];
}

export class ContactUsRequest {
    @IsString()
    @IsNotEmpty({ message: 'name is required' })
    public name: string;

    @IsString()
    @IsNotEmpty({ message: 'email is required' })
    @Matches(validateEmailRegex)
    public email: string;

    @IsString()
    @IsNotEmpty({ message: 'phone is required' })
    public phone: string;

    @IsString()
    @IsNotEmpty({ message: 'description is required' })
    public description: string;
}

export interface sameDayOptionsRequest {
    vendorId: string | number,
    productId: string | number,
    pincode: string | number,
    price: string | number
}
