import { Column, Entity, PrimaryColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
@Entity('BannerDestType')
export class BannerDestType {

    @PrimaryColumn({ primary: false })
    @IsNotEmpty()
    public type: number;

    @Column({ name: 'name' })
    public name: string;
}
