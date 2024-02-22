import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
@Entity('category_path')
export class CategoryPath {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({name: 'id'})
    public id: number;

    @Column({ name: 'cat_id' })
    @IsNotEmpty()
    public catId: number;

    @Column({ name: 'path_id' })
    @IsNotEmpty()
    public pathId: number;

    @IsNotEmpty()
    @Column({ name: 'level' })
    public level: string;
}
