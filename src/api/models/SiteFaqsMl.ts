import { Column, Entity, PrimaryColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('SiteFaqsMl')
export class SiteFaqsMl {
    @IsNotEmpty()
    @PrimaryColumn({ name: 'faq_id ' })
    public faqId: number;

    @IsNotEmpty()
    @PrimaryColumn({ name: 'lang_id ' })
    public langId: number;

    @Column({ name: 'question' })
    public question: string;

    @Column({ name: 'answers' })
    public answers: string;

    @IsNotEmpty()
    @Column({ name: 'is_active' })
    public isActive: number;
}
