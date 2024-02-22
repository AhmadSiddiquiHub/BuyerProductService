import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product_warranty')
export class ProductWarranty {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: string;

    @Column({ name: 'vendor_product_id' })
    public vendorProductId: number;

    @Column({ name: 'warranty_type_id' })
    public warrantyTypeId: number;

    @Column({ name: 'period' })
    public period: string;

    @Column({ name: 'active' })
    public active: number;
}
