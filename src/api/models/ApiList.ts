import { Column, Entity, PrimaryColumn} from 'typeorm';
@Entity('ApiList')
export class ApiList {

    @PrimaryColumn({ name: 'api_name' })
    public apiName: string;

    @Column({ name: 'description' })
    public description: string;
}
