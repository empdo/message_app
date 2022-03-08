export interface User {
    id: number;
    name: string;
    picture: string | null;
}

export interface Message {
    id: number;
    sender: number;
    receiver: number;
    date: number;
    content: string;
}

export interface Conversation {
   id: number,
   name: string, 
   messages: Message[] | null,
    picture: string | null;
}