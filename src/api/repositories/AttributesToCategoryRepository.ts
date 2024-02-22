import { EntityRepository, Repository } from 'typeorm';
import { AttributesToCategory } from '../models/AttributesToCategory';
import { Attributes } from '../models/Attributes';
import { AttributeValues } from '../models/AttributeValues';

@EntityRepository(AttributesToCategory)
export class AttributesToCategoryRepository extends Repository<AttributesToCategory>  {

    public async getProductAttributes(catId: number): Promise<any> {
        const selects = [
            // product attributes columns
            'PA.productAttributesId as productAttributesId',
            'PA.label as label',
            'PA.formName as formName',
            'PA.value as value',
            'PA.options as options',
            'PA.description as description',
            'PA.attributeType as attributeType',
            // product attributes of category columns
            'PCA.type as type',
            'PCA.isRequired as isRequired',
            'PCA.isCommon as isCommon',

            '(Select GROUP_CONCAT(pav.id) From product_attributes_values pav where pav.product_attribute_id = PCA.productAttributeId AND pav.category_id = PCA.categoryId) as valueIds'
        ];
        const query: any = await this.manager.createQueryBuilder(AttributesToCategory, 'PCA')
        .innerJoin(Attributes, 'PA', 'PA.productAttributesId = PCA.productAttributeId')
        .orderBy('PCA.sortOrder', 'ASC')
        .where('PCA.categoryId = :catId', { catId })
        .select(selects);
        return query.getRawMany();
    }

    public async getProductAttributes_Values(ids: string): Promise<any> {
        const selects = [
            'PAV.productAttrValuesId as value',
            'PAV.productAttributeId as productAttributeId',
            'PAV.name as label',
        ];
        const query: any = await this.manager.createQueryBuilder(AttributeValues, 'PAV');
        query.where('PAV.productAttrValuesId IN (' + ids + ')');
        query.select(selects);
        return query.getRawMany();
    }

    public async getDistinctAttributes_ByCategory(categoryId: number): Promise<any> {
        const selects = [
            'PAV.productAttrValuesId as id',
            'PAV.productAttributeId as productAttributeId',
            'PAV.name as name',
            'PA.label as label'
        ];
        // const query: any = await this.manager.createQueryBuilder(ProductAttrValues, 'PAV');
        // query.innerJoin(ProductAttributes, 'PA', 'PA.productAttributesId = PAV.productAttributeId');
        // query.where('PAV.categoryId = :categoryId', { categoryId });
        // query.select(selects);
        // return query.getRawMany();
        const query: any = await this.manager.createQueryBuilder(AttributesToCategory, 'PATC');
        query.innerJoin(Attributes, 'PA', 'PA.productAttributesId = PATC.productAttributeId');
        query.innerJoin(AttributeValues, 'PAV', 'PAV.productAttributeId = PATC.productAttributeId');
        query.where('PATC.categoryId = :categoryId', { categoryId });
        query.andWhere('PATC.showOnCatalogFilters = 1');
        query.select(selects);
        return query.getRawMany();
    }
}
