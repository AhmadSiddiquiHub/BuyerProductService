import { Column, Entity, BeforeInsert, PrimaryGeneratedColumn } from 'typeorm';
import moment = require('moment/moment');
import { AppLevelDateTimeFormat } from '../utils';
@Entity('chat_log')
export class ChatLog {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'sender' })
    public sender: number;

    @Column({ name: 'receiver' })
    public receiver: number;

    @Column({ name: 'conversation_id' })
    public conversationId: number;

    @Column({ name: 'message' })
    public message: string;

    @Column({ name: 'created_date' })
    public createdDate: string;

    // @Column({ name: 'm_id' })
    // public mId: number;

    @Column({ name: 'm_type' })
    public mType: string;
    
    @Column({ name: 'type' })
    public type: string;

    @Column({ name: 'status' })
    public status: string;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().format(AppLevelDateTimeFormat);
    }
}
