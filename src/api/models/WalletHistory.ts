import { Column, Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm/index';
import { IsNotEmpty } from 'class-validator';

@Entity('wallet_history')
export class WalletHistory {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public walletHistoryId: number;

    @Column({ name: 'type' })
    public type: string;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'order_id' })
    public orderId: number;

    @Column({ name: 'status' })
    public status: string;

    @Column({ name: 'amount' })
    public amount: number;

    @Column({ name: 'created_date' })
    public createdDate: string;
}
