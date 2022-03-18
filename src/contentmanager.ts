import EventEmitter from 'events';
import { User, Message, Conversation } from './interfaces';
import SocketHandeler from "./websocket"; 


class ContentManager extends EventEmitter {
    public token?: string | null;
    public user?: User;
    public conversations: Conversation[] = [];
    public socketHandeler?: SocketHandeler; 

    constructor() {
        super();

        (window as any).contentManager = this;
        this.token = localStorage.getItem("token");

        this.socketHandeler = new SocketHandeler();

        if (this.token !== null) {

            const parsedJwt = this.parseJwt(this.token);
            this.user = { id: parsedJwt.sub, name: parsedJwt.name} as User;

            this.setLocalUserPicture();

            this.socketHandeler.startConnection(this.token); 

            this.emit("message");

        }

    }

    public setLocalUserPicture = async () => { //TODO: do it other way becuase this is bad
        
        if (!this.user || !this.token) {
            return;
        } 

        const response = await this.request("GET", undefined, "/conversation/" + this.user.id, this.token);

        const responseJson = await response.json();
        this.user.picture = responseJson["picture"];

        this.emit("user");
    }

    private request = async (method: "GET" | "POST", body: string | undefined, location: string, token?: string) => {
        const headers: { [name: string]: string } = { 'content-Type': 'application/json' };

        if (token) headers["authorization"] = "Bearer " + token;

        const requestOptions = {
            method,
            headers,
            body,
        };

        /*         const response = await fetch(process.env.APILOCATION || "", requestOptions); */
        const response = await fetch("https://messageapi.essung.dev" + location, requestOptions);

        return response;
    }

    parseJwt(token: string) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    };


    private decodeToken = (token: string) => {

        const parsedJwt = this.parseJwt(token);
        this.user = { id: parsedJwt.sub, name: parsedJwt.name } as User;

    }

    public getToken = async (name: string, password: string) => {

        const response = await this.request("POST", JSON.stringify( { name, password }), "/auth", undefined)
        
        const token = (await response.json())["token"];

        this.setToken(token);

    }

    public setToken = (token: string) => {

        if(!token) {
            return;
        }

        localStorage.setItem("token", token);

        this.decodeToken(token);

        this.token = token;

       if (this.socketHandeler) {
           this.socketHandeler.startConnection(token);
       } 

       this.setLocalUserPicture();

    }

    public getConversations = async () => {
        if (this.token === null) {
            return;
        }

        const response = await this.request("GET", undefined, "/conversations", this.token);

        const conversations = await response.json() as Conversation[];

        this.conversations = conversations;

        this.emit('message');
    }

    public getConversation = async (id: number | null) => {
        if (this.token === null || id == null) {
            return;
        }

        const response = await this.request("GET", undefined, "/conversation/" + id, this.token);


        const responseJson = await response.json();
        const messages = responseJson["messages"] as Message[];
        let conversation = this.conversations.find(conversation => conversation.id === id);

        console.log(responseJson.picture);

        this.conversations = this.conversations.map(conversation => {
            if (conversation.id !== id) {
                return conversation;
            }

            return { id: id, name: responseJson["name"], messages: messages, picture: responseJson["picture"] }

        })

        if (!(this.conversations.find(conversation => conversation.id === id))) {

            conversation = { id: id, messages: messages, name: responseJson["name"], picture: responseJson["picture"]}

            if (conversation.name) {
                this.conversations.push(conversation);
            }

        }

        this.emit('message');

    }

    public sendBlob = async (blob: Blob,) => {
        if(this.token) {
            this.request("POST", JSON.stringify({blob}), "/profilepic", this.token);
        }
    }

    public addMessage = async (message: Message) => {

        const existingConvos = this.conversations.map(conversation => conversation.id);

        if (!existingConvos.includes(message.sender)) {
            await this.getConversation(message.sender);

            console.log("does not include");

            return;

        } else {
            this.conversations = this.conversations.map(convo => {
                if (convo.id === message.sender) {
                   return {id: convo.id, messages: convo.messages?.concat(message), name: convo.name} as Conversation;
                }
                
                return convo;
            });
        }

        this.addFirst(this.conversations.find(conversation => conversation.id === message.sender));

        this.emit("message");
    }

    public addFirst = (conversation: Conversation | undefined) => {

        if(!conversation) {
            return;
        }

        this.conversations = this.conversations.filter(convo => convo.id !== conversation.id);
        
        if (conversation.name) {
            this.conversations.unshift(conversation);
        }
    }

    public createUser = async (name: string, password: string) => {

        const response = await this.request("POST", JSON.stringify({ name: name, password: password }), "/user");

        const token = await response.text();

        console.log(token);

        if (token === "Unauthorized") return "Unauthorized";

        this.setToken(token);

        return "";

    }

    public sendMessage = async (reciver: number, content: string) => {
        if (this.token === null) {
            throw new Error("Token required");
        }

        this.addFirst(this.conversations.find(conversation => conversation.id === reciver));

        await this.request("POST", JSON.stringify({ reciver: reciver, content }), "/send", this.token);
    }


    public addListener(event: 'message', listener: (message: Message[]) => void): this;
    public addListener(event: 'user', listener: (user: User) => void): this;
    public addListener(event: string | symbol, listener: (...args: any[]) => void): this {
        return super.addListener(event, listener);
    }

}

const contentManager = new ContentManager();



export default contentManager;
