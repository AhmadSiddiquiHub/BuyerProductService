import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { CategoryBrand } from './CategoryBrand';

@Entity('brands')
export class Brands {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'image' })
    public image: string;

    @Column({ name: 'slug' })
    public slug: string;

    // @Column({ name: 'image_path' })
    // public imagepath: string;

    @IsNotEmpty()
    @Column({ name: 'is_active' })
    public isActive: number;

    @OneToOne(type => CategoryBrand, categorybrand => categorybrand.brandId)
    @JoinColumn({ name: 'id' })
    public categorybrand: CategoryBrand;
}
