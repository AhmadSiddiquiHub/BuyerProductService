import {
    BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn
  } from "typeorm";
  import { IsNotEmpty } from "class-validator"
  
  var udGroup = ['PATCH', 'DELETE'];
  
  @Entity()
  class FooterBlog extends BaseEntity {
  
    @IsNotEmpty({ groups: udGroup })
    @PrimaryGeneratedColumn({ type: "integer" })
    id: number;
  
    @Column({ type: "varchar"})
    body: string;
  
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
  
  }
  
  export default FooterBlog;
  