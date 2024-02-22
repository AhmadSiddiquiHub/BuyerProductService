import { EntityRepository, Repository } from 'typeorm';
import { Documents } from '../models/document';

@EntityRepository(Documents)
export class DocumentsRepository extends Repository<Documents>  {
}
