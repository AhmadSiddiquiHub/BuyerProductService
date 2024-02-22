import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import { VendorProduct } from './VendorProduct';
@Entity('products_meta_info')
export class ProductMetaInfo {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'product_id' })
    public productId: number;

    @Column({ name: 'site_id' })
    public siteId: number;

    @Column({ name: 'title' })
    public title: string;

    @Column({ name: 'keyword' })
    public keyword: string;

    @Column({ name: 'description' })
    public description: string;

    @OneToOne(type => VendorProduct, VP => VP.productMetaInfo)
    @JoinColumn({ name: 'product_id' })
    public productMetaInfo: VendorProduct;

}
