import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { IsNotEmpty } from 'class-validator';

@Entity('sites')
export class Sites {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'country_id' })
    public countryId: number;

    @Column({ name: 'iso1' })
    public iso1: string;

    @Column({ name: 'zipcode_formate' })
    public zipcodeFormate: number;

    @Column({ name: 'fb_link' })
    public fbLink: string;

    @Column({ name: 'insta_link' })
    public instaLink: string;

    @Column({ name: 'twitter_link' })
    public twitterLink: string;

    @Column({ name: 'linkedin_link' })
    public linkedinLink: string;

    @Column({ name: 'youtube_link' })
    public youtubeLink: string;

    @Column({ name: 'pinterest_link' })
    public pinterestLink: string;

    @Column({ name: 'favicon' })
    public favicon: string;

    @Column({ name: 'logo' })
    public logo: string;

    @Column({ name: 'currency_symbol' })
    public currencySymbol: string;

    @Column({ name: 'website_link' })
    public websiteLink: string;

    @Column({ name: 'seller_website_link' })
    public sellerWebsiteLink: string;

    @Column({ name: 'bucket_base_url' })
    public bucketBaseUrl: string;

    @Column({ name: 'play_store_app_url' })
    public playStoreAppUrl: string;

    @Column({ name: 'apple_store_app_url' })
    public appleStoreAppUrl: string;

    @Column({ name: 'qr_code_play_store_app' })
    public QRCodePlayStoreApp: string;

    @Column({ name: 'qr_code_apple_store_app' })
    public QRCodeAppleStoreApp: string;
    
    @Column({ name: 'buyer_api_url' })
    public buyerApiUrl: string;

    @Column({ name: 'email_credentials' })
    public email_credentials: string;

    @Column({ name: 'jwt_secret' })
    public jwt_secret: string; 	
    
    @Column({ name: 'contact_info' })
    public contactInfo: string; 

    @Column({ name: 'new_homepage' })
    public newHomepage : string;

    @Column({ name: 'top_header_info' })
    public topHeaderInfo : string;

}
