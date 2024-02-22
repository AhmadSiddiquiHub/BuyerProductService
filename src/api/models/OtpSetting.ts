import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('opt_settings')
export class OtpSetting {
    
    @PrimaryColumn({ name: 'id' })
    public id: string;

    @Column({ name: 'api_name' })
    public apiName: number;

    @Column({ name: 'site_id' })
    public siteId: number;

    @Column({ name: 'expiry_in_minutes' })
    public expiryInMinutes: number;

    @Column({ name: 'sms_opt_len' })
    public smsOptLen: string;

    @Column({ name: 'email_otp_len' })
    public emailOtpLen: string;

    @Column({ name: 'same_opt' })
    public sameOpt: number;

    @Column({ name: 'is_active' })
    public isActive: number;
}
