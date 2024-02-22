import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@Entity('activity_log')
export class ActivityLog {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'module_id' })
    public moduleId: number;

    @Column({ name: 'api_name' })
    public apiName: string;

    @IsNotEmpty()
    @Column({ name: 'site_it' })
    public siteIt: number;

    @IsNotEmpty()
    @Exclude()
    @Column({ name: 'response_code' })
    public responseCode: string;

    @IsNotEmpty()
    @Column({ name: 'response_desc' })
    public responseDesc: string;

    @Column({ name: 'reason' })
    public reason: number;

    @Column({ name: 'started_at' })
    public startedAt: Date;

    @Column({ name: 'ended_at' })
    public endedAt: Date;
}
