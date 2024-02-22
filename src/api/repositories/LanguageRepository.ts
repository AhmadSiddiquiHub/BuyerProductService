import { EntityRepository, Repository } from 'typeorm';

import { Language } from '../models/Languages';

@EntityRepository(Language)
export class LanguageRepository extends Repository<Language>  {

}
