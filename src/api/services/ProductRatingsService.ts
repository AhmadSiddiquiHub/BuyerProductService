import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { ProductRating } from '../models/ProductRating';
import { Users } from '../models/Users';
import { ProductRatingsRepository } from '../repositories/ProductRatingsRepository';
import {  getConnection, In, Like } from 'typeorm';
import { ProductRatingImageService } from './ProductRatingImageService';
import { ProductRatingVideoService } from './ProductRatingVideoService';
import { VendorProductService } from './VendorProductService';
import { ProductService } from './ProductService';
import { VendorService } from './VendorService';
import { orderBy } from 'lodash';

interface ProductRatingListingInterface {
    productId?: number,
    siteId: number,
    limit: number,
    offset: number,
    count: boolean,
    vendorId?: number
}
@Service()
export class ProductRatingsService {

    constructor(
        @OrmRepository() private ratingsRepository: ProductRatingsRepository,
        @Logger(__filename) private log: LoggerInterface,
        private productRatingImageService: ProductRatingImageService,
        private productRatingVideoService: ProductRatingVideoService,
        private vendorProductService: VendorProductService,
        private productService: ProductService,
        private vendorService: VendorService
        
        
    ) {}

    // find one condition
    public findOne(rating: any): Promise<any> {
        return this.ratingsRepository.findOne(rating);
    }

    // find all rating
    public findAll(rating: any): Promise<any> {
        this.log.info('Find all rating');
        return this.ratingsRepository.find(rating);
    }

    // rating list
    public list(limit: number, offset: number, select: any = [], relation: any = [], whereConditions: any = [], count: number | boolean): Promise<any> {
        const condition: any = {};

        if (select && select.length > 0) {
            condition.select = select;
        }

        if (relation && relation.length > 0) {
            condition.relations = relation;
        }

        condition.where = {};

        if (whereConditions && whereConditions.length > 0) {
            whereConditions.forEach((item: any) => {
                const operator: string = item.op;
                if (operator === 'where' && item.value !== undefined) {
                    condition.where[item.name] = item.value;
                } else if (operator === 'andWhere' && item.value !== undefined) {
                    condition.andWhere[item.name] = item.value;
                } else if (operator === 'like' && item.value !== undefined) {
                    condition.where[item.name] = Like('%' + item.value + '%');
                }
            });
        }

        condition.order = {
            createdAt: 'DESC',
        };

        if (limit && limit > 0) {
            condition.take = limit;
            condition.skip = offset;

        }
        if (count) {
            return this.ratingsRepository.count(condition);
        } else {
            return this.ratingsRepository.find(condition);
        }
    }

    public async listRatings(limit: number, offset: number, select: any = [], relation: any = [], whereConditions: any = [], count: number | boolean): Promise<any> {
        const query = this.ratingsRepository.createQueryBuilder('ratings');
      
        if (whereConditions && whereConditions.length > 0) {
          whereConditions.forEach((item: any) => {
            const operator: string = item.op;
            if (operator === 'where' && item.value !== undefined) {
              query.andWhere(`${item.name} = :${item.name}`, { [item.name]: item.value });
            } else if (operator === 'like' && item.value !== undefined) {
              query.andWhere(`${item.name} LIKE :${item.name}`, { [item.name]: `%${item.value}%` });
            } else if (operator === 'andWhere' && item.value !== undefined) {
              query.andWhere(`${item.name} = :${item.name}`, { [item.name]: item.value });
            }
          });
        }
        
        query.andWhere('ratings.is_approved = :isApproved', { isApproved: 1 });
        
        query.orderBy('ratings.createdAt', 'DESC');
      
        if (limit && limit > 0) {
          query.take(limit).skip(offset);
        }
      
        if (count) {
          return query.getCount();
        } else {
          return query.getMany();
        }
      }
      
      

    // create rating
    public async create(productRating: ProductRating): Promise<ProductRating> {
        const newRating = await this.ratingsRepository.save(productRating);
        return newRating;
    }

    // update rating
    public update(id: any, productRating: ProductRating): Promise<ProductRating> {
        this.log.info('Update a rating');
        // productRating.ratingId = id;
        return this.ratingsRepository.save(productRating);
    }

    // delete rating
    public async delete(id: any): Promise<any> {
        this.log.info('Delete a rating');
        const newRating = await this.ratingsRepository.delete(id);
        return newRating;
    }

    // getting consolidated rating
    public async consolidateRating(id: number): Promise<any> {
        return await this.ratingsRepository.ratingConsolidate(id);
    }

    // getting consolidated rating
    public async consolidateRatingForVendor(id: number): Promise<any> {
        return await this.ratingsRepository.ratingConsolidateForVendor(id);
    }


    public async storeVendorProductRating(vp:any): Promise<any> {
        const productId = vp.productId
        for (let stars = 1; stars <= 5; stars++) {
            const WhereConditions = [
                { name: 'rating', op: 'where', value: stars },
                { name: 'productId', op: 'where', value: productId },
            ];
            const starCount = await this.list(0, 0, 0, 0, WhereConditions, true);
            if (stars === 1) {
                vp.OneStarRatingCount = starCount;
            }
            if (stars === 2) {
                vp.TwoStarRatingCount = starCount;
            }
            if (stars === 3) {
                vp.ThreeStarRatingCount = starCount;
            }
            if (stars === 4) {
                vp.FourStarRatingCount = starCount;
            }
            if (stars === 5) {
                vp.FiveStarRatingCount = starCount;
            }
            await this.vendorProductService.update(vp.id,vp);
        }
        const w = [
            { name: 'productId', op: 'where', value: productId },
        ];
        const totalReviews = await this.list(0, 0, 0, 0, w, true);
        vp.reviewCount = totalReviews;
        const ratings = await this.productService.productRatignCalculations(vp);
        vp.avgRating = ratings.avgRating
        await this.vendorProductService.update(vp.id,vp);
    }
    public async storeRating(vendorId): Promise<any> {
        const vendorProduct = await this.vendorProductService.find({ where: { vendorId } });
        let vendor = await this.vendorService.findOne({ where: { userId: vendorId }});
        const pids = vendorProduct.map((el) => {
            return el.productId;
        });
        console.log('llllllllllllll',vendor);
        console.log('pids',pids)
        let products = await this.productService.find({ where: { id: In(pids) }});
        // console.log("products",products)
        for (let stars = 1; stars <= 5; stars++) {
            
            if (stars === 1) {
                const arr = [];
                products.forEach(p => {
                    Object.entries(p).forEach((entry, index) => {
                        if (entry[0] == 'OneStarRatingCount') {
                            if (entry[1] && entry[1] !== 0) {
                                arr.push({ [entry[0]]: entry[1] });
                            }
                        }
                    })
                });
                console.log('arrrr',arr)
                vendor.OneStarRatingCount = arr.length > 0 ? arr[0].OneStarRatingCount : 0
            }
            if (stars === 2) {
                const arr = [];
                products.forEach(p => {
                    Object.entries(p).forEach((entry, index) => {
                        if (entry[0] == 'TwoStarRatingCount') {
                            if (entry[1] && entry[1] !== 0) {
                                arr.push({ [entry[0]]: entry[1] });
                            }
                        }
                    })
                });
                console.log('arrrr',arr)
                vendor.TwoStarRatingCount = arr.length > 0 ?  arr[0].TwoStarRatingCount : 0;
            }
            if (stars === 3) {
                const arr = [];
                products.forEach(p => {
                    Object.entries(p).forEach((entry, index) => {
                        if (entry[0] == 'ThreeStarRatingCount') {
                            if (entry[1] && entry[1] !== 0) {
                                arr.push({ [entry[0]]: entry[1] });
                            }
                        }
                    })
                });
                console.log('arrrr',arr)
                vendor.ThreeStarRatingCount = arr.length > 0 ? arr[0].ThreeStarRatingCount : 0;
            }
            if (stars === 4) {
                const arr = [];
                products.forEach(p => {
                    Object.entries(p).forEach((entry, index) => {
                        if (entry[0] == 'FourStarRatingCount') {
                            if (entry[1] && entry[1] !== 0) {
                                arr.push({ [entry[0]]: entry[1] });
                            }
                        }
                    })
                });
                console.log('arrrr',arr)
                vendor.FourStarRatingCount = arr.length > 0 ? arr[0].FourStarRatingCount : 0;
            }
            if (stars === 5) {
                const arr = [];
                products.forEach(p => {
                    Object.entries(p).forEach((entry, index) => {
                        if (entry[0] == 'FiveStarRatingCount') {
                            if (entry[1] && entry[1] !== 0) {
                                arr.push({ [entry[0]]: entry[1] });
                            }
                        }
                    })
                });
                console.log('arrrr',arr)
                vendor.FiveStarRatingCount = arr.length > 0 ? arr[0].FiveStarRatingCount : 0;
            }
        await this.vendorService.update(vendor);
        }
        const w = [
            { name: 'vendorId', op: 'where', value: vendorId },
        ];
        const totalReviews = await this.list(0, 0, 0, 0, w, true);
        vendor.reviewCount = totalReviews;
        console.log(vendor)
        const ratings = await this.productService.productRatignCalculations(vendor);
        console.log('ratings',ratings);
        vendor.avgRating = ratings.avgRating
        await this.vendorService.update(vendor);
    }

    public async ratingStatistics(productId: any): Promise<any> {
        return await this.ratingsRepository.ratingStatistics(productId);
    }

    public async PRQuery({ productId, siteId, limit, offset, count, vendorId }: ProductRatingListingInterface): Promise<any> {
        const selects = [
            'PR.id as ratingId',
            'PR.productId as productId',
            'PR.createdAt as createdAt',
            // 'PR.siteId as siteId',
            // 'PR.vendorId as vendorId',
            'PR.userId as userId',
            'PR.rating as rating',
            'PR.review as review',
            'PR.fakeUserPic as fakeUserPic',
            'PR.fakeUserName as fakeUserName',
            'U.firstName as firstname',
            'U.lastName as lastname',
            'U.avatar as avatar',
            'U.path as path',
            'U.email as email',
        ];
        const query: any = await getConnection().getRepository(ProductRating).createQueryBuilder('PR').select(selects)
        .leftJoin(Users, 'U', 'U.id = PR.userId')
        .where('PR.isActive = 1 AND PR.isApproved = 1')
        // .andWhere('PR.siteId = :siteId', { siteId });
        if (productId) {
            query.andWhere('PR.productId = :productId', { productId });
        }
        if (vendorId) {
            query.andWhere('PR.vendorId = :vendorId', { vendorId });
        }
        if (count) {
            return query.getCount();
        }
        if (limit && limit > 0) {
            query.limit(limit).offset(offset);
        }
        let reviews = await query.getRawMany();
        reviews = orderBy(reviews, ['createdAt'], ['desc'])
        return reviews
    }
    public async prodcutRatingListing({ productId, siteId, limit, offset, count, vendorId }: ProductRatingListingInterface): Promise<any> {
        let reviews = await this.PRQuery({ productId, siteId, limit, offset, count, vendorId });
        if (count) {
            return reviews;
        }
        reviews = reviews.map(async (r: any) => {
            const i = await this.productRatingImageService.find({ where: { productRatingId: r.ratingId } });
            const images = i.map((item, index) => item.image);
            const productRatingVideos = await this.productRatingVideoService.find({ where: { productRatingId: r.ratingId } });
            const videos = productRatingVideos.map((item, index) => item.videoPath);
            return {
                ...r,
                images,
                videos
            };
        });
        reviews = await Promise.all(reviews);
        reviews = reviews.map((item, index) => {
            const obj = {
                rating: item.rating,
                userName: item.firstname,
                userAvatar: item.path + item.avatar,
                createdAt: item.createdAt,
                description: item.review,
                gallery: item.images,
                videoGalley: item.videos
            };
            if (item.fakeUserName) {
                obj.userName = item.fakeUserName;
            }
            if (item.fakeUserPic) {
                obj.userAvatar = item.fakeUserPic;
            }
            return obj;
        });
        return reviews;
    }
}

