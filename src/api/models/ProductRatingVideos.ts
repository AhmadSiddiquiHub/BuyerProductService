import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('product_rating_videos')
export class ProductRatingVideos {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'product_rating_id' })
    public productRatingId: number;

    @IsNotEmpty()
    @Column({ name: 'is_active' })
    public isActive: number;

    @IsNotEmpty()
    @Column({ name: 'video_path' })
    public videoPath: string;
}
