export interface User {
    id: number;
    name: string;
}

export interface Message {
    sender: number;
    reciver: number;
    date: number;
    content: string;
}