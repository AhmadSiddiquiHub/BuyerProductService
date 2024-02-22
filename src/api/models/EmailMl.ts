import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('email_ml')
export class EmailMl {

    @PrimaryColumn({ name: 'email_id' })
    public emailId: number;

    @PrimaryColumn({ name: 'lang_id' })
    public langId: number;

    @Column({ name: 'subject' })
    public subject: string;

    @Column({ name: 'body' })
    public body: string;

    @Column({ name: 'is_active' })
    public isActive: number;

    @Column({ name: 'cc' })
    public CC: string;

    @Column({ name: 'bcc' })
    public BCC: string;
}
