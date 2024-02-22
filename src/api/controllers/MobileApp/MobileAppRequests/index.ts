import 'reflect-metadata';
import { IsNotEmpty, MaxLength, MinLength, IsIn } from 'class-validator';

export class MobileAppLoginRequest {
    @MinLength(8, { message: 'password must contain minimum 8 character' })
    @IsNotEmpty({ message: 'password is required' })
    public password: string;

    @MaxLength(32, { message: 'emailId should be maximum 96 character' })
    @IsNotEmpty({ message: 'emailId is required' })
    // @Matches(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)
    public emailId: string;
}

export class MobileAppResendOTPRequest {
    @MaxLength(32, { message: 'emailId should be maximum 96 character' })
    @IsNotEmpty({ message: 'emailId is required' })
    // @Matches(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)
    public emailId: string;
}

export class ProductListingRequest {

    @IsNotEmpty({ message: 'limit is required in body' })
    public limit: number;

    @IsNotEmpty({ message: 'offset is required in body' })
    public offset: number;
    
    @IsNotEmpty({ message: 'siteId is required in body' })
    public siteId: number;

    @IsIn(['all', 'todayDeals', 'isFeatured', 'topRated'])
    public ptype: string;
}