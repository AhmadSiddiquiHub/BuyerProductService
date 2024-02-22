import { Column, Entity, PrimaryColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('otp_codes')
export class OtpCodes {
    @IsNotEmpty()
    @PrimaryColumn({ name: 'id' })
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'user_id' })
    public userId: number;

    @PrimaryColumn({ name: 'api_name' })
    public apiName: string;

    @IsNotEmpty()
    @Column({ name: 'mobile_otp' })
    public mobileOtp: number;

    @IsNotEmpty()
    @Column({ name: 'email_otp' })
    public emailOtp: number;

    @IsNotEmpty()
    @Column({ name: 'expired_at' })
    public expiredAt: string;

    @Column({ name: 'is_verified' })
    public isVerified: number;

    @Column({ name: 'fail_otp_attempts' })
    public failOtpAttempts: number;

    @Column({ name: 'blocked_at' })
    public blockedAt: string;

    @Column({ name: 'edit_able_field' })
    public editAbleField: string;
}
