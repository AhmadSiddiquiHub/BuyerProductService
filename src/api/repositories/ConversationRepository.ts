import { EntityRepository, Repository } from 'typeorm';
import { Conversation } from '../models/Conversation';

@EntityRepository(Conversation)
export class ConversationRepository extends Repository<Conversation>  {
}
