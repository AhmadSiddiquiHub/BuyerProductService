import { EntityRepository, Repository } from 'typeorm';
import { VendorOrderNote } from '../models/VendorOrderNote';

@EntityRepository(VendorOrderNote)
export class VendorOrderNoteRepository extends Repository<VendorOrderNote>  {
}
