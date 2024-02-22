import { Service } from 'typedi';
import { getConnection } from 'typeorm';
import { Conversation } from '../models/Conversation';
import { Users } from '../models/Users';

@Service()
export class ConversationService {

    constructor() {}

    public async conversationList(userId: number): Promise<any> {
        const conversationColumns = [
            'Conversation.id as id',
            'Conversation.latest_msg as latestMsgDate',
            'Conversation.sender as sender',
            'Conversation.receiver as receiver',
            'Conversation.created_date as createdDate',
            // sender
            'Sender.first_name as senderName',
            'Sender.type_id as senderTypeId',
            // receiver
            'Receiver.first_name as receiverName',
            'Receiver.type_id as receiverTypeId',
            // message
            '(SELECT cl.message FROM chat_log cl WHERE cl.conversation_id = Conversation.id ORDER BY created_date DESC LIMIT 1) as message',
            '(SELECT cl.type FROM chat_log cl WHERE cl.conversation_id = Conversation.id ORDER BY created_date DESC LIMIT 1) as messageType',
        ];
        const conversations: any = await getConnection().getRepository(Conversation).createQueryBuilder('Conversation')
        .leftJoin(Users, 'Sender', 'Sender.id = Conversation.sender')
        .leftJoin(Users, 'Receiver', 'Receiver.id = Conversation.receiver')
        .select(conversationColumns)
        .where('Conversation.sender = :sender OR Conversation.receiver = :receiver', { sender: userId, receiver: userId })
        .getRawMany();
        return conversations.map((x, y) => {
            const obj: any = {
                id: x.id,
                latestMessageDate: x.latestMsgDate,
                latestMessage: x.message,
                latestMessageType: x.messageType
            };
            if (userId === x.sender) {
                obj.receiverId = x.receiver;
                obj.receiverName = x.receiverName;
                obj.receiverImage = 'seller_store_logo_placeholder.png';
            }
            if (userId !== x.sender) {
                obj.receiverId = x.sender;
                obj.receiverName = x.senderName;
                obj.receiverImage = 'seller_store_logo_placeholder.png';
            }
            return obj;
        });
    }
}
