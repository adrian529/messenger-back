/* export interface IUser {
    username: string;
    avatar: string;
    contacts: string[];
    email: string;
    contactRequests: string[];
    _id?: string;
} */

export interface IMessage {
    id: string;
    userId: string;
    body: string;
    timestamp: number;
}

export interface IUser {
    avatar: string;
    username: string;
    _id: string;
}

export interface IChat {
        user: IUser,
        chat: {
            users: string[],
            messages: IMessage[]
        }
}

export interface IContact {
    chatId: string,
    id: string,
    lastMessage: IMessage,
    targetUser: IUser
}
