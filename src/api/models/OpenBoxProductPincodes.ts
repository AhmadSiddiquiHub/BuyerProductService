import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product";
import { Vendor } from "./Vendor";

@Entity('open_box_product_pincodes')
export class OpenBoxProductPincodes {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number

    @ManyToOne(() => Vendor, (vendor) => vendor.openBoxProductPincodes)
    @JoinColumn({ name: 'vendor_id' })
    public vendorId: number;

    @ManyToOne(() => Product, (product) => product.sameDayProductPincodes)
    @JoinColumn({ name: 'product_id' })
    public productId: number;

    @Column({ name: 'pincode' })
    public pincode: number;

}