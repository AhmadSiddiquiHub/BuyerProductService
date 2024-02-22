
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('cron_job_products')
export class CronJobProduct {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'site_id' })
    public siteId: number;

    @Column({ name: 'product_id' })
    public productId: number;

    @IsNotEmpty()
    @Column({ name: 'product_variant_id' })
    public productVariantId: number;

    @Column({ name: 'points' })
    public points: number;

    @Column({ name: 'cron_job_type_id' })
    public cronJobType: string;
}
