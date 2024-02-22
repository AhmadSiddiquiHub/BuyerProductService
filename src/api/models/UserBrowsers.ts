import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import moment = require('moment');
import { AppLevelDateTimeFormat } from '../utils';
@Entity('user_browsers')
export class UserBrowsers {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'browser_id' })
    public browserId: string;

    @Column({ name: 'require_otp' })
    public requireOtp: number;

    @Column({ name: 'created_date' })
    public createdDate: string;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().format(AppLevelDateTimeFormat);
    }
}
