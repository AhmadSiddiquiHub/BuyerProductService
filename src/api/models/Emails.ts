import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('emails')
export class Emails {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'description' })
    public description: string;
}
