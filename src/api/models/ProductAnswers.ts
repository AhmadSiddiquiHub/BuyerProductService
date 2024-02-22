import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
export enum userType {
    BUYER = 'Buyer',
    VENDOR = 'Vendor',
    MANUFACTURER = 'Manufacturer',
}

@Entity('product_answers')
export class ProductAnswers {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'product_question_id' })
    public productQuestionId: number;

    @Column({ name: 'answer' })
    public answer: number;

    @IsNotEmpty()
    @Column({ name: 'is_active' })
    public isActive: number;

    @IsNotEmpty()
    @Column({ name: 'user_id' })
    public userId: number;

    @IsNotEmpty()
    @Column({ name: 'user_type', type: 'enum', enum: userType })
    public userType!: userType;

    @IsNotEmpty()
    @Column({ name: 'created_at' })
    public createdAt: string;

    @IsNotEmpty()
    @Column({ name: 'updated_at' })
    public updatedAt: string;
}
