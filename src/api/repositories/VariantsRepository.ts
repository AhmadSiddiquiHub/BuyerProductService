import { EntityRepository, Repository } from 'typeorm';
import { Variants } from '../models/Variants';

@EntityRepository(Variants)
export class VariantsRepository extends Repository<Variants>  {

    public async findByIds(array: [number]): Promise<any> {
        const selects = [
            'Variants.id as id',
            'Variants.type as type',
            'Variants.name as name',
        ];
        const query = await this.manager.createQueryBuilder(Variants, 'Variants');
        query.select(selects);
        query.andWhere('Variants.id IN (' + array + ')');
        return query.getRawMany();
    }
}
