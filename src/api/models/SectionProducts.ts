import {
  BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn
} from "typeorm";
import { IsNotEmpty } from "class-validator"
import { Product } from "./Product";
import { Categories } from "./Categories";

var udGroup = ['PATCH', 'DELETE'];

@Entity()
class SectionProducts extends BaseEntity {

  @IsNotEmpty({ groups: udGroup })
  @PrimaryGeneratedColumn({ type: "integer" })
  id: number;

  @Column({ type: "integer", nullable: true })
  product_id: number;

  @Column({ type: "integer", nullable: true })
  category_id: number;

  @Column({ type: "integer", nullable: false })
  section_id: number;


  @Column({ type: "integer", nullable: false })
  site_id: number;

  @Column({ type: "integer", nullable: false })
  lang_id: number;
  
  @Column({ type: "integer", nullable: false })
  sort_order: number;

  @Column({ type: "boolean", default: true })
  is_active: boolean;


  @Column({ type: "boolean", default: false })
  is_deleted: boolean;

  @CreateDateColumn({ type: "timestamp", default: Timestamp })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: Timestamp })
  updated_at: Date;

  @DeleteDateColumn({ type: "timestamp", default: null })
  deleted_at: Date;
  
  @OneToOne(type => Product, p => p.suborder)
  @JoinColumn({ name: 'product_id' })
  public product: Product;

  @OneToOne(type => Categories, c => c.sectionProducts)
  @JoinColumn({ name: 'category_id' })
  public categories: Categories;

}

export default SectionProducts;
