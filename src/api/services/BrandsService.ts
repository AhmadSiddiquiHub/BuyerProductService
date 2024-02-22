import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { BrandsRepository } from '../repositories/BrandsRepository';
import { getConnection  } from 'typeorm';
import { Brands } from '../models/Brands';
import { SiteBrands } from '../models/SiteBrand';
import { CategoryBrand } from '../models/CategoryBrand';
interface Parameters {
    limit: number;
    offset: number;
    siteId: number;
    isFeatured?: number;
}
@Service()
export class BrandsService {

    constructor(
        @OrmRepository() private brandsRepository: BrandsRepository) {
    }
    public async create(result: any): Promise<any> {
        return this.brandsRepository.save(result);
    }
    public async save(result: any): Promise<any> {
        return this.brandsRepository.save(result);
    }
    public async findOne(condition: any): Promise<any> {
        return this.brandsRepository.findOne(condition);
    }
    public async find(condition: any): Promise<any> {
        return this.brandsRepository.find(condition);
    }
    public async listing({ limit, offset, isFeatured = 0, siteId }: Parameters): Promise<any> {
        const selects = [
            'Brand.name as name',
            'Brand.image as image',
            'Brand.id as id',
            'Brand.slug as slug',
        ];
        const query: any = await getConnection().getRepository(SiteBrands).createQueryBuilder('SiteBrands')
        .innerJoin(Brands, 'Brand', 'Brand.id = SiteBrands.brandId')
        .where('SiteBrands.siteId = :siteId', { siteId })
        .andWhere('SiteBrands.isActive = 1')
        .select(selects);
        if (isFeatured === 1) {
            query.andWhere('SiteBrands.isFeatured = 1');
        }
        if (limit && limit > 0) {
            query.limit(limit).offset(offset);
        }
        return query.getRawMany();
    }

    public async findOneBySlug(slug: string, siteId: number): Promise<any> {
        const selects = [
            'Brand.name as name',
            'Brand.image as image',
            'Brand.id as id',
            'Brand.slug as slug',
        ];
        const query: any = await getConnection().getRepository(SiteBrands).createQueryBuilder('SiteBrands');
        query.innerJoin(Brands, 'Brand', 'Brand.id = SiteBrands.brandId');
        query.where('Brand.slug = :slug', { slug });
        query.select(selects);
        return query.getRawOne();
    }
    public async findByCategoryId(catId: number, siteId: number): Promise<any> {
        const selects = [
            'B.name as name',
            'B.image as image',
            'B.id as id',
            'B.slug as slug',
        ];
        const query: any = await getConnection().getRepository(SiteBrands).createQueryBuilder('SB');
        query.innerJoin(Brands, 'B', 'B.id = SB.brandId');
        query.innerJoin(CategoryBrand, 'CB', 'CB.catId = :catId AND CB.siteId = :siteId', { catId, siteId });
        query.select(selects);
        return query.getRawMany();
    }
}
