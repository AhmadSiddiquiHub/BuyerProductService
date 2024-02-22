import 'reflect-metadata';
import { JsonController, Res, Req, Post, Get } from 'routing-controllers';
import { SitesService } from '../services/SitesService';
import { HomeService } from '../services/HomeService';
import { SiteSettingsService } from '../services/SiteSettingsService';
@JsonController('/home')
export class HomeController {
    constructor(
        private sitesService: SitesService,
        private homeService: HomeService,
        private siteSettingsService: SiteSettingsService,
    ) {}

    // /api/buyer/products/home/banner-list
    @Get('/banner-list')
    public async bannerList(@Res() response: any, @Req() request: any): Promise<any> {
        const showBanner = await this.siteSettingsService.findOne({where: { keyName: 'showFullWidthBanner' }}) 
        const mainBanners = await this.homeService.banners(request.siteId, 'HFB');
        console.log(showBanner, 'show main banner')
        console.log(mainBanners, 'mainBanners')
        if(showBanner.value == 1) {
            return response.status(200).send({ status: 1,message: 'success',  data: { sliderBanners: mainBanners, rightSideBanners: [], leftSideBanners: [], bottomSideBanners: []  } });
        }
        const sliderBanners = await this.homeService.banners(request.siteId, 'HMS');
        const rightSideBanners = await this.homeService.banners(request.siteId, 'HTR');
        const leftSideBanners = await this.homeService.banners(request.siteId, 'HTL');
        const bottomSideBanners = await this.homeService.banners(request.siteId, 'HBS');
        return response.status(200).send({ status: 1,message: 'success', data: { sliderBanners, rightSideBanners, leftSideBanners, bottomSideBanners  } });
    }

    // /api/buyer/products/home/banner-list
    @Get('/homepage-banner')
    public async homepageBanner(@Res() response: any, @Req() request: any): Promise<any> {
        const homepageBanners = await this.homeService.banners(request.siteId, request.query.type);
        return response.status(200).send({ status: 1,message: 'success', data: { homepageBanners } });
    }

    // /api/buyer/products/home/home-call-1
    @Post('/home-call-1')
    public async homeCallOne(@Res() response: any, @Req() request: any): Promise<any> {
        const siteId = request.siteId;
        const langId = 1;
        const homepageMiddleSection = await this.homeService.homepageMiddleSectionBanners(siteId);
        const topCategoriesOfMonth = await this.homeService.topCategoriesofMonth(siteId, langId);
        const featuredCategories = await this.homeService.featuredCategories(siteId, langId);
        const popularBrands = await this.homeService.popularBrands(request);
        // remove this categoricalProductsView function. it is not being used on website homepage.
        const categoricalProductsView = await this.homeService.categoricalProductsView();
        const data = {
            topCategoriesOfMonth,
            featuredCategories,
            categoricalProductsView,
            homepageMid: homepageMiddleSection,
            popularBrands
        };
        return response.status(200).send({ status: 1, message: 'success', data });
    }

    // /api/buyer/products/home/choicecategories
    @Post('/choice-categories')
    public async choiceCategories(@Res() response: any, @Req() request: any): Promise<any> {
        const siteId = request.siteId;
        const langId = 1;
        const featuredCategories = await this.homeService.featuredCategories(siteId, langId);
        const data = {
            featuredCategories,
        };
        return response.status(200).send({ status: 1, message: 'success', data });
    }

    // /api/buyer/products/home/footer-data
    @Post('/footer-data')
    public async siteFooterData(@Req() request: any, @Res() response: any): Promise<any> {
        const data = await this.sitesService.siteDataForFooterApiHomePage(request.siteId);
        if (!data) {
            return response.status(400).send({ status: 0, message: 'Invalid request', data: {}});
        }
        return response.status(200).send({ status: 1, message: '', data });
    }

    // /api/buyer/products/home/site-list
    @Post('/site-list')
    public async siteList(@Res() response: any): Promise<any> {
        let sites = await this.sitesService.getSites();
        sites = sites.map((item, index) => {
            if (item.id === 1) {
                const docs = [
                    { label: 'National Id Card', value: 'NationalIdCard', issueDate: true, expiryDate: true, required: true },
                    { label: 'Passport', value: 'Passport', issueDate: true, expiryDate: true, required: false },
                ];
                const a = {
                    documents: docs,
                };
                item = Object.assign(item, a);
            }
            if (item.id === 2) {
                const docs = [
                    { label: 'Adhar Card', value: 'AdharCard', issueDate: false, expiryDate: true, required: false },
                    { label: 'Rashan Card', value: 'RashanCard', issueDate: false, expiryDate: true, required: false },
                    { label: 'National Id Card', value: 'NationalIdCard', issueDate: true, expiryDate: true, required: true },
                ];
                const a = {
                    documents: docs,
                };
                item = Object.assign(item, a);
            }
            if (item.id === 3) {
                const docs = [
                    { label: 'Driving Lisence', value: 'DrivingLisence', issueDate: true, expiryDate: true, required: false },
                    { label: 'LPR', value: 'LPR', issueDate: false, expiryDate: false, required: true },
                    { label: 'Non Immregrant and Others', value: 'Non_Immregrant_and_Others', issueDate: false, expiryDate: false, required: false },
                ];
                const a = {
                    documents: docs,
                };
                item = Object.assign(item, a);
            }
            return item;
        });
        return response.status(200).send({ status: 1, data: { sites } });
    }

    // /api/buyer/products/home/call-1
    @Post('/call-1')
    public async homecall__1(@Res() response: any, @Req() request: any): Promise<any> {
        const data = await this.homeService.categoricalProductsView();
        return response.status(200).send({ status: 1, message: 'success', data });
    }

    // /api/buyer/products/home/tracking-list
    @Get('/tracking-list')
    public async tracking_List(@Res() response: any, @Req() request: any): Promise<any> {
        const data = await this.homeService.trackingList(request);
        return response.status(200).send({ status: 1, message: 'success', data });
    }

    // /api/buyer/products/home/blog-list
    @Get('/blog-list')
    public async blogList(@Res() response: any, @Req() request: any): Promise<any> {
        const data = await this.homeService.blogList(request);
        return response.status(200).send({ status: 1, message: 'success', data });
    }

    // /api/buyer/products/home/menus
    @Get('/menus')
    public async menus(@Res() response: any, @Req() request: any): Promise<any> {
        const data = await this.homeService.menus(request);
        return response.status(200).send({ status: 1, message: 'success',count: data.length, data });
    }

    // /api/buyer/products/home/sections
    @Get('/sections')
    public async sections(@Res() response: any, @Req() request: any): Promise<any> {
        const data = await this.homeService.homepageSections(request);
        return response.status(200).send({ status: 1, message: 'success',count: data.length, data });
    }

    // /api/buyer/products/home/homepage-top-header
    @Get('/homepage-top-header')
    public async homepageTopHeader(@Res() response: any, @Req() request: any): Promise<any> {
        const data = await this.siteSettingsService.find({ where: { siteId: request.siteId, settingInterface: 'B' }});
        return response.status(200).send({ status: 1, message: 'success',count: data.length, data });
    }
    // /api/buyer/products/home/homepage-FC
    @Get('/homepage-FC')
    public async homepageFeaturedCategories(@Res() response: any, @Req() request: any): Promise<any> {
        if(!request.query.section_id){
            return response.status(400).send({ status: 0, message: 'Provide section id', data: {}});
        }
        const data = await this.homeService.homepageFeaturedCategories(request);
        return response.status(200).send({ status: 1, message: 'success',count: data.length, data });
    }

}
