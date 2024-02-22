import { EntityRepository, Repository } from 'typeorm';
import { ChatLog } from '../models/ChatLog';

@EntityRepository(ChatLog)
export class ChatLogRepository extends Repository<ChatLog>  {
}
