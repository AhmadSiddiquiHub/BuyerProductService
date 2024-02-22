import { IsNotEmpty } from 'class-validator';
import moment from 'moment';
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './Users';
import { AppLevelDateTimeFormat } from '../utils';
@Entity('access_token')
export class AccessToken {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;
    @IsNotEmpty()
    @Column({ name: 'user_id' })
    public userId: number;
    @IsNotEmpty()
    @Column({ name: 'token' })
    public token: string;

    @ManyToOne(type => Users, user => user.accessToken)
    @JoinColumn({ name: 'user_id' })
    public user: Users;

    @Column({ name: 'created_at' })
    public createdAt: string;

    @Column({ name: 'updated_at' })
    public updatedAt: string;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdAt = moment().format(AppLevelDateTimeFormat);
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.updatedAt = moment().format(AppLevelDateTimeFormat);
    }

}
