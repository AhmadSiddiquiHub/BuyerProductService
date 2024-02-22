import {
  BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn
} from "typeorm";
import { IsNotEmpty } from "class-validator"
import {Categories} from "./Categories";
import {Campaign} from "./Campaign";

var udGroup = ['PATCH', 'DELETE'];

@Entity()
class Menus extends BaseEntity {

  @IsNotEmpty({ groups: udGroup })
  @PrimaryGeneratedColumn({ type: "integer" })
  id: number;

  @Column({ type: "varchar"})
  name: string;

  @Column({ type: "integer", nullable: false })
  source_id: number;

  @Column({ type: "integer", nullable: false })
  source_ref_id: number;

  @Column({ type: "integer", nullable: false })
  site_id: number;

  @Column({ type: "integer", nullable: false })
  lang_id: number;

  
  @Column({ type: "integer", nullable: false })
  sort_order: number;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @Column({ type: "varchar", nullable: false })
  url: string;

  @Column({ type: "varchar", nullable: true })
  image_url: string;

  @Column({type: "integer", nullable: true })
  parent_id: number;

  @Column({ type: "varchar", nullable: true })
  label_image_url: string;

  @Column({ type: "varchar", nullable: true })
  label_text: string;

  @Column({ type: "boolean", default: false })
  is_show_on_mobile: boolean;

  @Column({ type: "boolean", default: false })
  is_show_on_web: boolean;
  
  @Column({ type: "boolean", default: false, comment:  'Mega_Menu_Media'})
  is_MMM: boolean;

  @Column({ type: "varchar", nullable: true })
  box_dimension: string;

  @Column({ type: "varchar", nullable: true })
  MMM_url: string;

  @Column({ type: "varchar", nullable: true })
  MMM_link: string;

  @Column({ type: "boolean" })
  menu_type: boolean;

  @Column({ type: "boolean", default: false })
  is_deleted: boolean;

  @CreateDateColumn({ type: "timestamp", default: Timestamp })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: Timestamp })
  updated_at: Date;

  @DeleteDateColumn({ type: "timestamp", default: null })
  deleted_at: Date;

  @JoinColumn({ name: 'source_ref_id' })
  @OneToOne(() => Categories, categories => categories.menus)
  category: Categories;

  @JoinColumn({ name: 'source_ref_id' })
  @OneToOne(() => Campaign, campaign => campaign.menus)
  campaign: Campaign;

  @JoinColumn({ name: "parent_id" })
  @ManyToOne(type => Menus, menus => menus.children)
  parent: Menus;

  @OneToMany(type => Menus, menus => menus.parent)
  children: Menus[];

}

export default Menus;
