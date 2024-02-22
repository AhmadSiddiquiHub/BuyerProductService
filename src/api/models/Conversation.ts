import { Column, Entity, BeforeInsert, PrimaryGeneratedColumn } from 'typeorm';
import moment = require('moment/moment');
import { AppLevelDateTimeFormat } from '../utils';
@Entity('conversations')
export class Conversation {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'sender' })
    public sender: number;
    
    @Column({ name: 'receiver' })
    public receiver: number;

    @Column({ name: 'deleted_by_sender' })
    public deletedBySender: number;

    @Column({ name: 'deleted_by_receiver' })
    public deletedByReceiver: number;

    @Column({ name: 'latest_msg' })
    public latestMsg: string;

    @Column({ name: 'created_date' })
    public createdDate: string;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().format(AppLevelDateTimeFormat);
        this.latestMsg = moment().format(AppLevelDateTimeFormat);
    }
}
