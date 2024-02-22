import { Column, Entity, PrimaryColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('Sessions')
export class Sessions {
    @IsNotEmpty()
    @PrimaryColumn({ name: 'session_id' })
    public sessionId: number;

    @IsNotEmpty()
    @Column({ name: 'expires' })
    public expires: number;

    @Column({ name: 'data' })
    public data: string;
}
