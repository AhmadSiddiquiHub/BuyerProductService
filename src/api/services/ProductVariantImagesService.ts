
import { Service } from 'typedi';
import { Like } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { ProductVariantImages } from '../models/ProductVariantImages';
import { ProductVariantImagesRepository } from '../repositories/ProductVariantImagesRepository';

@Service()
export class ProductVariantImagesService {

    constructor(@OrmRepository() private repo: ProductVariantImagesRepository) {
    }

    public async create(data: any): Promise<any> {
        return this.repo.save(data);
    }
    public async find(condition: any): Promise<any> {
        return this.repo.find(condition);
    }
    public findOne(productVariantImage: any): Promise<ProductVariantImages> {
        return this.repo.findOne(productVariantImage);
    }

    // find all product images
    public findAll(productVariantImage: any): Promise<any> {
        return this.repo.find(productVariantImage);
    }

    // update product images
    public update(id: any, productVariantImage: ProductVariantImages): Promise<ProductVariantImages> {
        productVariantImage.id = id;
        return this.repo.save(productVariantImage);
    }
    // ProductVariantImages List
    public list(limit: any, offset: any, select: any = [], search: any = [], whereConditions: any = [], count: number | boolean): Promise<any> {
        const condition: any = {};

        if (select && select.length > 0) {
            condition.select = select;
        }
        condition.where = {};

        if (whereConditions && whereConditions.length > 0) {
            whereConditions.forEach((item: any) => {
                condition.where[item.name] = item.value;
            });
        }

        if (search && search.length > 0) {
            search.forEach((table: any) => {
                const operator: string = table.op;
                if (operator === 'where' && table.value !== '') {
                    condition.where[table.name] = table.value;
                } else if (operator === 'like' && table.value !== '') {
                    condition.where[table.name] = Like('%' + table.value + '%');
                }
            });
        }

        if (limit && limit > 0) {
            condition.take = limit;
            condition.skip = offset;
        }
        if (count) {
            return this.repo.count(condition);
        } else {
            return this.repo.find(condition);
        }
    }
    // delete product image
    public async delete(id: any): Promise<any> {
        return await this.repo.delete(id);
    }

    // delete product image
    public async findActiveImage(data: any): Promise<any> {
        return await this.repo.findActiveImage(data);
    }
    
    public async findImagesByProductVariantIdsArray(data: any): Promise<any> {
        return await this.repo.findImagesByProductVariantIdsArray(data);
    }

    // delete product
    public async deleteProductVariantsImage(id: number): Promise<any> {
        return await this.repo.delete({ id: id });
    }
}
