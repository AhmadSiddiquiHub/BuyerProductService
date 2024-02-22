import 'reflect-metadata';
import {IsNotEmpty, MinLength, Matches, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
export class SellerCouponListingRequest {

    @IsNotEmpty({ message: 'limit is required' })
    public limit: number;

    @IsNotEmpty({ message: 'offset is required' })
    public offset: number;

    @IsNotEmpty({ message: 'status is required' })
    public status: string;

    public keyword: string;
}

export class SellerLoginRequest {

    @IsNotEmpty({ message: 'email is required' })
    public email: string;

    @MinLength(8, { message: 'password must contain minimum 8 character' })
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])((?=.*?[0-9])|(?=.*?[#?!@$%^&*-])).{8,}$/, {message: 'Password must contain at least one number or one symbol and one uppercase and lowercase letter, and at least 8 or more characters'})
    @IsNotEmpty({ message: 'password is required' })
    public password: string;
}

export class SellerRegisterRequest {

    // @IsNotEmpty({ message: 'firstName is required' })
    // public firstName: string;

    // @IsNotEmpty({ message: 'lastName is required' })
    // public lastName: string;

    @IsNotEmpty({ message: 'email is required' })
    public email: string;

    // @MaxLength(15, { message: 'mobile number should be maximum 15 characters' })
    // @IsNotEmpty({ message: 'mobileNumber is required' })
    public mobileNumber: string;

    @MinLength(8, { message: 'password must contain minimum 8 character' })
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])((?=.*?[0-9])|(?=.*?[#?!@$%^&*-])).{8,}$/, {message: 'Password must contain at least one number or one symbol and one uppercase and lowercase letter, and at least 8 or more characters'})
    @IsNotEmpty({ message: 'password is required' })
    public password: string;

    @MinLength(8, { message: 'confirmPassword must contain minimum 8 character' })
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])((?=.*?[0-9])|(?=.*?[#?!@$%^&*-])).{8,}$/, {message: 'confirmPassword must contain at least one number or one symbol and one uppercase and lowercase letter, and at least 8 or more characters'})
    @IsNotEmpty({ message: 'confirmPassword is required' })
    public confirmPassword: string;
}

class DocumentObj {
    @IsNotEmpty({ message: 'name is required' })
    name: string;
    @IsNotEmpty({ message: 'value is required' })
    value: string;

    issueDate: string;

    expiryDate: string;
  }
export class SellerSetupProfileRequest {

    @IsNotEmpty({ message: 'firstName is required' })
    public firstName: string;

    @IsNotEmpty({ message: 'lastName is required' })
    public lastName: string;

    @IsNotEmpty({ message: 'countryOfCitizen is required' })
    public countryOfCitizen: number;

    @IsNotEmpty({ message: 'countryOfBirth is required' })
    public countryOfBirth: number;

    @IsNotEmpty({ message: 'dateOfBirth is required' })
    public dateOfBirth: string;

    @IsNotEmpty({ message: 'siteId is required' })
    public siteId: number;

    @IsArray()
    @IsNotEmpty({ message: 'documents are required' })
    @ValidateNested({ each: true })
    @Type(() => DocumentObj)
    public documents: [];
}

export class SellerSetupBusinessAdressRequest {

    @IsNotEmpty({ message: 'line_address_1 is required' })
    public line_address_1: string;

    @IsNotEmpty({ message: 'line_address_2 is required' })
    public line_address_2: string;

    public line_address_3: string;

    public zipcode: number;

    @IsNotEmpty({ message: 'stateId is required' })
    public stateId: number;

    @IsNotEmpty({ message: 'cityId is required' })
    public cityId: number;
    @IsNotEmpty({ message: 'siteId is required' })
    public siteId: number;

}
export class SellerVerifyOTPRequest {
    public email: string;
    public mobile_otp: number;
    public email_otp: number;
    public browserId: string;
    public requireOtp: number;
    public appProcess: string;
}


export class CreatProductTax {
    public productId: number;
    public siteId: number;
    public identifier: string;
    public countryId: number;
    public stateId: number;
    public cityId: number;
    public rate: number;
}

export class EditProductTax {
    public identifier: string;
    public productId: number;
    public countryId: number;
    public stateId: number;
    public cityId: number;
    public rate: number;
    public minZipCode: number;
    public maxZipCode: number;
}

export class DeleteProductTax {
    public identifier: string;
}

export class ListQuotationRequest {
    public userId: number;
    public siteId: any;
}


export class ViewQuotationRequest {
    public quotationId: number;
    public siteId: any;
    public sellerRply: string;
}