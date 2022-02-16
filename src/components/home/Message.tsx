import React from "react";
import contentManager from "../../contentmanager";
import { Message } from "../../interfaces";
import { useCurrentConversation } from "./home";

const Messages = () => {

    const currentConversation = useCurrentConversation();

    const messages: Message[] = currentConversation?.messages || [];
    const messageContainerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        window.setTimeout(() => {
            if (messageContainerRef.current) {
                messageContainerRef.current.scrollTo({ top: messageContainerRef.current.scrollHeight });
            }
        }, 0);
    }, [currentConversation]);

    React.useEffect(() => {
    

    }, [])

    const messageTemplate = (classes: string, index: number, message: Message) => (
        <div key={index} className={"message " + classes}>
            <div>
                <h3>{message.sender === currentConversation?.id ? currentConversation?.name : contentManager.user?.name}</h3>
                <p>{message.content}</p>
            </div>
        </div>
    )

    const MessageList = () => (
        <div className="message-container" ref={messageContainerRef}>
            {messages.map((message, index) => messageTemplate(message.sender === contentManager.user?.id ? "sender" : "receiver", index, message))}
            <MessageSender />
        </div>
    );


    return (
        <MessageList />
    )
}

const MessageSender = () => {
    let currentConversation = useCurrentConversation();

    const { name, id } = currentConversation || {};
    let message = "";

    const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.currentTarget.reset();

        e.preventDefault();

        if (id && message) {

            await contentManager.sendMessage(id, message);

            await contentManager.getConversation(id);
        }

    }

    const placeholder = currentConversation != null ? "Message @" + name : "";

    return (
        <div >
            <form onSubmit={(e) => sendMessage(e)}>
                <input id="send-message-container" type="text" onChange={(value) => { message = value.target.value }} placeholder={placeholder} />

            </form>
        </div>
    )
}

export default Messages;