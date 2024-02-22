import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import moment = require('moment');
import { ProductVariantImages } from './ProductVariantImages';
import { Product } from './Product';
import { AppLevelDateTimeFormat } from '../utils';
@Entity('product_variants')
export class ProductVariants {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'product_id' })
    public productId: number;

    @Column({ name: 'product_variant_values_id' })
    public productVariantValuesId: string;

    @Column({ name: 'is_active' })
    public isActive: number;

    @Column({ name: 'created_at' })
    public createdAt: string;

    @Column({ name: 'updated_at' })
    public updatedAt: string;

    @OneToMany(type => ProductVariantImages, productVariantImages => productVariantImages.productVariants)
    public productVariantImages: ProductVariantImages[];

    @ManyToOne(type => Product, product => product.productVariants)
    @JoinColumn({ name: 'product_id' })
    public product: Product;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdAt = moment().format(AppLevelDateTimeFormat);
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.updatedAt = moment().format(AppLevelDateTimeFormat);
    }
}
