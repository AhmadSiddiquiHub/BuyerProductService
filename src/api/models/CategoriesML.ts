import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Categories } from './Categories';
@Entity('categories_ml')
export class CategoriesML {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'cat_id' })
    public catId: number;

    @Column({ name: 'lang_id' })
    public langId: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'meta_title' })
    public metaTitle: string;

    @Column({ name: 'meta_keyword' })
    public metaKeyword: string;

    @Column({ name: 'meta_description' })
    public metaDescription: string;

    @Column({ name: 'is_active' })
    public isActive: number;

    @OneToOne(type => Categories, categories => categories.id)
    @JoinColumn({ name: 'cat_id' })
    public category: Categories;
}
