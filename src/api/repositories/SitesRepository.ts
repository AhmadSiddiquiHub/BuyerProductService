import { EntityRepository, Repository } from 'typeorm';
import { Sites } from '../models/Sites';
import { Countries } from '../models/Countries';
import { SiteUser } from '../models/SiteUser';
import { SiteContactInfo } from '../models/SiteContactInfo';

@EntityRepository(Sites)
export class SitesRepository extends Repository<Sites>  {
    public async getSites(): Promise<any> {
        const selects = [
            'site.id as id',
            'site.iso1 as countryCode',
            'site.zipcodeFormate as zipcodeFormate',
            'site.fbLink as facebook',
            'site.instaLink as instagram',
            'site.twitterLink as twitter',
            'site.linkedinLink as linkedin',
            'site.youtubeLink as youtube',
            'site.pinterestLink as pinterest',
            'site.favicon as favicon',
            'site.logo as logo',
            'site.websiteLink as websiteLink',
            'site.countryId as countryId',
            'site.bucketBaseUrl as bucketBaseUrl',
            'site.playStoreAppUrl as playStoreAppUrl',
            'site.appleStoreAppUrl as appleStoreAppUrl',
            'site.QRCodePlayStoreApp as QRCodePlayStoreApp',
            'site.QRCodeAppleStoreApp as QRCodeAppleStoreApp',
            'country.name as name',
            'country.numericCode as numericCode',
            'country.iso2 as iso2',
            'country.iso3 as iso3',
            'country.phonecode as phonecode',
            'country.currency as currency',
            'country.currencyName as currencyName',
            'country.currencySymbol as currencySymbol',
            'country.svgIcon as svgIcon',
            'contactInfo.phoneNumber as phoneNumber',
            'contactInfo.phoneOfc as phoneOfc',
            'contactInfo.phoneHome as phoneHome',
            'contactInfo.emailOfc as emailOfc',
            'contactInfo.emailPersonal as emailPersonal',
        ];
        const query: any = await this.manager.createQueryBuilder(Sites, 'site');
        query.select(selects);
        query.leftJoin(Countries, 'country', 'country.countriesId = site.countryId');
        query.leftJoin(SiteContactInfo, 'contactInfo', 'contactInfo.siteId = site.id AND contactInfo.isActive = 1');
        return query.getRawMany();
    }
    public async vendorMarketplaces(userId: number): Promise<any> {
        const selects = [
            'S.id as id',
            'S.iso1 as countryCode',
            'S.zipcodeFormate as zipcodeFormate',
            // 'S.fbLink as facebook',
            // 'S.instaLink as instagram',
            // 'S.twitterLink as twitter',
            // 'S.linkedinLink as linkedin',
            // 'S.youtubeLink as youtube',
            // 'S.pinterestLink as pinterest',
            // 'S.favicon as favicon',
            // 'S.logo as logo',
            // 'S.websiteLink as websiteLink',
            'C.name as name',
            // 'C.numericCode as numericCode',
            // 'C.iso2 as iso2',
            // 'C.iso3 as iso3',
            'C.phonecode as phonecode',
            // 'C.currency as currency',
            // 'C.currencyName as currencyName',
            'C.currencySymbol as currencySymbol',
            'C.svgIcon as svgIcon',
        ];
        const query: any = await this.manager.createQueryBuilder(Sites, 'S');
        query.select(selects);
        query.innerJoin(SiteUser, 'SU', 'SU.siteId = S.id');
        query.innerJoin(Countries, 'C', 'C.countriesId = S.countryId');
        query.where('SU.userId = :userId AND SU.isActive = 1', { userId });
        return query.getRawMany();
    }
    public async siteDataForFooterApiHomePage(siteId: number): Promise<any> {
        const selects = [
            'S.QRCodeAppleStoreApp as QRCodeAppleStoreApp',
            'S.QRCodePlayStoreApp as QRCodePlayStoreApp',
            'S.appleStoreAppUrl as appleStoreAppUrl',
            // 'S.bucketBaseUrl as bucketBaseUrl',
            // 'S.buyerApiUrl as buyerApiUrl',
            // 'S.countryId as countryId',
            'S.currencySymbol as currencySymbol',
            'S.favicon as favicon',
            'S.fbLink as fbLink',
            'S.id as id',
            'S.instaLink as instaLink',
            'S.iso1 as iso1',
            'S.linkedinLink as linkedinLink',
            'S.logo as logo',
            'S.pinterestLink as pinterestLink',
            'S.playStoreAppUrl as playStoreAppUrl',
            'S.twitterLink as twitterLink',
            'S.websiteLink as websiteLink',
            'S.youtubeLink as youtubeLink',
            // 'S.zipcodeFormate as zipcodeFormate'
        ];
        const query: any = await this.manager.createQueryBuilder(Sites, 'S');
        query.select(selects).where('S.id = :id', { id: siteId });
        return query.getRawOne();
    }
}
