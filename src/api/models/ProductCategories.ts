import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('product_categories')
export class Productcategories {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'product_id' })
    public productId: number;

    @IsNotEmpty()
    @Column({ name: 'is_active' })
    public isActive: number;

    @IsNotEmpty()
    @Column({ name: 'category_id' })
    public catId: number;
}
