export interface User {
    id: number;
    name: string;
}

export interface Message {
    sender: number;
    receiver: number;
    date: number;
    content: string;
}

export interface Conversation {
   id: number,
   name: string, 
   messages: Message[] | null,
}