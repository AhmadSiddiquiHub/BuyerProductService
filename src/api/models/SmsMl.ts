import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sms_ml')
export class SmsMl {

    @PrimaryColumn({ name: 'sms_id' })
    public smsId: number;

    @PrimaryColumn({ name: 'lang_id' })
    public langId: number;

    @Column({ name: 'body' })
    public body: string;

    @Column({ name: 'is_active' })
    public isActive: number;

}
