import { EntityRepository, Repository } from 'typeorm';
import { SiteSettings } from '../models/SiteSettings';

@EntityRepository(SiteSettings)
export class SiteSettingsRepository extends Repository<SiteSettings>  {
}
