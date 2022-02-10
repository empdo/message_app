import EventEmitter from 'events';
import {User, Message, Conversation} from './interfaces';
import jwt from 'jsonwebtoken';


class ContentManager extends EventEmitter {
    public token?: string | null;
    public user?: User;
    public conversations: Conversation[] = [];

    constructor() {
        super();

        
        (window as any).contentManager = this;
        this.token = localStorage.getItem("token");

        if(this.token != null){
            const parsedJwt = this.parseJwt(this.token);
            this.user = {id: parsedJwt.sub, name: parsedJwt.name} as User;

           this.emit("message");
        }
    }    

    private request = async (method: "GET" | "POST", body: string | undefined, location: string, token?: string) => {
        const headers: {[name: string]: string} = {'content-Type': 'application/json'}

        if (token) headers["authorization"] = "Bearer " + token;

        const requestOptions = {
            method,
            headers,
            body,
        };

        const response = await fetch(location, requestOptions);

        return response;
    }

    parseJwt (token: string) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    };


    private decodeToken = (token: string) => {

       this.user = this.parseJwt(token) as User;
    }

    public setToken = async (name: string, password: string) => {

        const response = await this.request("POST", JSON.stringify( { "name": name, "password": password }), "/auth")
        
        const token = (await response.json())["token"];


        localStorage.setItem("token", token);

        this.decodeToken(token);

        this.token = token;
    }

    public getConversations = async () => {
        if(this.token === null){
            return;
        }

        const response = await this.request("GET", undefined, "/conversations", this.token);

        this.conversations = await response.json() as Conversation[];

        this.emit('message');
    }

    public getConversation = async (id: number) => {
        if(this.token === null){
            return;
        }

        const response = await this.request("GET", undefined, "/conversation/" + id, this.token);
        
        await Promise.all(this.conversations?.map(async conversation => {

            if(conversation.id == id) {
                conversation.messages = await response.json() as Message[];
            }

            this.emit("message");
        }));

    }

    public sendMessage = async (reciver: number, content: string) => {
        if(this.token === null) {
            return;
        }

        const response = await this.request("POST", JSON.stringify({reciver: reciver, content}), "/send", this.token);
    }


    public addListener(event: 'message', listener: (article: Message[]) => void): this;
    public addListener(event: string | symbol, listener: (...args: any[]) => void): this {
        return super.addListener(event, listener);
    }

}

const contentManager = new ContentManager();

export default contentManager;