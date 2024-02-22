import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './Users';

@Entity('open_box_subscription')
export class OpenBoxSubscription {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number

    @OneToOne(() => Users)
    @JoinColumn({ name: 'user_id' })
    public userId: number

    @Column({ name: 'user_email' })
    public userEmail: string;

    @Column({ name: 'is_active' })
    public isActive: number

    @Column({ name: 'is_subscribed' })
    public isSubscribed: number
}