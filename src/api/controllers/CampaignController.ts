import 'reflect-metadata';
import { JsonController, Res, Req, Post, Body } from 'routing-controllers';
import { ProductService } from '../services/ProductService';
import { CampaignProductsListRequest } from './requests';
import { CampaignService } from '../services/CampaignService';

@JsonController('/campaign')
export class CommonListController {
    constructor(
        private productService: ProductService,
        private campaignService: CampaignService
    ) {}

    // /api/buyer/campaign/campaign-products
    @Post('/campaign-products')
    public async campaignProductListing(@Body({ validate: true }) params: CampaignProductsListRequest, @Res() response: any, @Req() request: any): Promise<any> {
        const campaign = await this.campaignService.activeCampaign(params.slug);
        if (!campaign) {
            return response.status(400).send({ status: 0, message: 'Invalid Slug!', data: {} });
        }
        request.body.count = 1;
        request.body.campaignId = campaign.id;
        let totalProducts = await this.productService.listing(request);
        request.body.count = 0;
        let productList: any = await this.productService.listing(request);
        productList = await this.productService.productListing_ResponseStructure(productList, request);
        totalProducts = totalProducts / request.body.limit; 
        totalProducts = Math.ceil(totalProducts);
        const successResponse: any = {
            status: 1,
            message: 'campaign listing',
            length: productList.length,
            pages: totalProducts,
            data: productList,
        };
        return response.status(200).send(successResponse);
    }

    // /api/buyer/campaign/campaign/:slug
    @Post('/campaign/:slug')
    public async getActiveCampaign(@Res() response: any, @Req() request: any): Promise<any> {
        const campaign = await this.campaignService.activeCampaign(request.params.slug);
        if (!campaign) {
            return response.status(400).send({ status: 0, message: 'Invalid Slug!', data: {} });
        }
        const data = {
            ...campaign,
            title: campaign.metaTitle,
            keyword: campaign.metaKeyword,
            description: campaign.metaDescription,
            
        }
        return response.status(200).send({ status: 1, message: '', data });
    }
}
