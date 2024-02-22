import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('news_letter')
export class NewsLetter {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'email' })
    public email: string;

    @Column({ name: 'is_active' })
    public isActive: number;
    
    @Column({ name: 'is_subscribed' })
    public isSubscribed: number;
}
