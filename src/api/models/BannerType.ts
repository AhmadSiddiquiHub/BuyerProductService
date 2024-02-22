import { Column, Entity, PrimaryColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
@Entity('banner_type')
export class BannerType {

    @IsNotEmpty()
    @PrimaryColumn({ primary: false })
    public type: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'width_range' })
    public widthRange: string;

    @Column({ name: 'height_range' })
    public heightRange: string;

    @Column({ name: 'size_range' })
    public sizeRange: string;
}
