import { EntityRepository, Repository } from 'typeorm';
import { SiteAddresses } from '../models/siteAddresses';

@EntityRepository(SiteAddresses)
export class SiteAddressesRepository extends Repository<SiteAddresses>  {
}
