import { Column, Entity, OneToOne, JoinColumn} from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm/index';
import { Sites } from './Sites';
@Entity('plugins')
export class Plugins  {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'plugin_name' })
    public pluginName: string;

    @Column({ name: 'plugin_avatar' })
    public pluginAvatar: string;

    @Column({ name: 'plugin_avatar_path' })
    public pluginAvatarPath: string;

    @Column({ name: 'plugin_type' })
    public pluginType: string;

    @Column({ name: 'plugin_additional_info' })
    public pluginAdditionalInfo: string;

    @Column({ name: 'plugin_status' })
    public pluginStatus: number;

    @Column({ name: 'site_id' })
    public siteId: number;

    @Column({ name: 'wallet_topup' })
    public walletTopup: number;
    
    @Column({ name: 'sort_order' })
    public sortOrder: number;

    @OneToOne(type => Sites, site => site.id)
    @JoinColumn({ name: 'site_id' })
    public site: Sites;
}
