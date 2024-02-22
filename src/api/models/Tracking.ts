import {
    BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn
  } from "typeorm";
  import { IsNotEmpty } from "class-validator"
  
  var udGroup = ['PATCH', 'DELETE'];
  
  @Entity()
  class Tracking extends BaseEntity {
  
    @IsNotEmpty({ groups: udGroup })
    @PrimaryGeneratedColumn({ type: "integer" })
    id: number;
  
    @Column({ type: "varchar"})
    title: string;
  
    @Column({ type: "varchar"})
    description: string;
  
    @Column({ type: "varchar", nullable: true })
    image_url: string;
  
    @Column({ type: "integer", nullable: false })
    site_id: number;
  
    @Column({ type: "integer", nullable: false })
    lang_id: number;
    
    @Column({ type: "integer", nullable: false })
    sort_order: number;
  
    @Column({ type: "boolean", default: true })
    is_active: boolean;
  
    @Column({ type: "boolean", default: false})
    is_mobile_view: boolean;
  
    @Column({ type: "boolean", default: false})
    is_web_view: boolean;
    

    @Column({ type: "integer", nullable: false })
    design_id: number;
  
    @Column({ type: "boolean", default: false })
    is_deleted: boolean;
  
    @CreateDateColumn({ type: "timestamp", default: Timestamp })
    created_at: Date;
  
    @UpdateDateColumn({ type: "timestamp", default: Timestamp })
    updated_at: Date;
  
    @DeleteDateColumn({ type: "timestamp", default: null })
    deleted_at: Date;
  
  }
  
  export default Tracking;
  