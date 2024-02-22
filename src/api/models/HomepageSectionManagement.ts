import {
  BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn
} from "typeorm";
import { IsNotEmpty } from "class-validator"
import HomeSectionType from "./HomepageSectionType";

var udGroup = ['PATCH', 'DELETE'];

@Entity()
class HomepageSectionManagement extends BaseEntity {

  @IsNotEmpty({ groups: udGroup })
  @PrimaryGeneratedColumn({ type: "integer" })
  id: number;

  @Column({type: "integer", nullable: true })
  parent_id: number;

  @Column({ type: "varchar"})
  name: string;

  @Column({ type: "varchar"})
  slug: string;

  @Column({ type: "varchar"})
  api_path: string;

  @Column({ type: "varchar"})
  component_name: string;

  @Column({ type: "varchar"})
  description: string;

  @Column({ type: "varchar"})
  side_banner_url: string;

  @Column({ type: "boolean", default: false  })
  is_show_side_banner	: boolean;

  @Column({ type: "integer", nullable: false })
  design_type_id: number;

  @Column({ type: "integer", nullable: false })
  section_type_id: number;

  @Column({ type: "integer", nullable: false })
  category_id: number;

  @Column({ name: 'api_payload', type: 'json', nullable: true}) // Use 'json' or 'jsonb' depending on your needs
  api_payload: Record<string, any>; // This will hold your dynamic JSON data



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


  @JoinColumn({ name: "parent_id" })
  @ManyToOne(type => HomepageSectionManagement, homepageSectionManagement => homepageSectionManagement.children)
  parent: HomepageSectionManagement;

  @OneToMany(type => HomepageSectionManagement, homepageSectionManagement => homepageSectionManagement.parent)
  children: HomepageSectionManagement[];

  @OneToOne(type => HomeSectionType, homeSectionType => homeSectionType.id)
  @JoinColumn({ name: 'section_type_id' })
  public homeSectionType: HomeSectionType;
  
}

export default HomepageSectionManagement;
