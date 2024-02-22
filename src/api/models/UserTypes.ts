import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryColumn} from 'typeorm';
@Entity('UserTypes')
export class UserTypes {
    @IsNotEmpty()
    @PrimaryColumn({ name: 'id' })
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'name' })
    public name: string;
}
