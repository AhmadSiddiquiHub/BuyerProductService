import {
  BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn
} from "typeorm";
import { IsNotEmpty } from "class-validator"
import HomepageSectionManagement from "./HomepageSectionManagement";

var udGroup = ['PATCH', 'DELETE'];

@Entity()
class HomeSectionType extends BaseEntity {

  @IsNotEmpty({ groups: udGroup })
  @PrimaryGeneratedColumn({ type: "integer" })
  id: number;

  @Column({ type: "varchar"})
  name: string;

  // @Column({ type: "varchar"})
  // slug: string;

  @Column({ type: "varchar"})
  api_path: string;


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


  @OneToOne(type => HomepageSectionManagement, homepageSectionManagement => homepageSectionManagement.homeSectionType)
  public homepageSectionManagement: HomepageSectionManagement;

}

export default HomeSectionType;
