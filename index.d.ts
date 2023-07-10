/* export interface IUser {
    username: string;
    avatar: string;
    contacts: string[];
    email: string;
    contactRequests: string[];
    _id?: string;
} */

export interface Message {
    id: string;
    userId: string;
    body: string;
    timestamp?: number;
}

export interface IUser {
    avatar: string;
    username: string;
    _id: string;
}

export interface IChat {
    data: {
        user: IUser,
        chat: {
            users: string[],
            messages: Message[]
        }
    }
}

/* 
    username: String;
    avatar?: String;
    contacts: String[];
    refreshToken?: String;
    email?: String;
    serviceProvider?: String;
*/