import { Column, Entity, PrimaryColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('InvoicesMl')
export class InvoicesMl {
    @IsNotEmpty()
    @PrimaryColumn({primary: false})
    public invoiceId: number;

    @IsNotEmpty()
    public langId: number;

    @Column({ name: 'content' })
    public content: string;

    @IsNotEmpty()
    @Column({ name: 'is_active' })
    public isActive: number;
}
