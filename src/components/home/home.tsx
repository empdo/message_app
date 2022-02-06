import { reverse } from "dns/promises";
import { sensitiveHeaders } from "http2";
import React, { Component, Dispatch, useEffect } from "react";
import { createBuilderStatusReporter, moveSyntheticComments } from "typescript";
import contentManager from "../../contentmanager";
import { Message } from "../../interfaces";
import "./home.scss";


const getConversations = (id: number | null, conversations: number[], dispatch: React.Dispatch<React.SetStateAction<number | null>>) => {

    const conversationList = () => {
        return conversations.map(conversation => {
            return (
                <li onClick={() => dispatch(conversation)} className="convo-item" key={conversation}>
                    <span />
                    <p >{conversation}</p>
                </li >
            );
        });
    }

    return (
        <div id="convo-bar">
            <h2>Contacts</h2>
            <ul>
                {conversationList()}
            </ul>
        </div>
    )
}

const getMessages = (convoId: number | null, messages: Message[]) => {

    const messageTemplate = (classes: string, index: number, message: Message) => {
            return (
                <div key={index} className={"message " + classes}>
                        <div>
                            <h2>{message.sender}</h2>
                            <p>{message.content}</p>
                        </div>
                </div>
            )
    }

    const messageList = () => {

        const orderedMessages = messages.slice(0);
        orderedMessages.sort((a,b) => {
            return a.date - b.date;
        });

        
        
        return orderedMessages.map((message, index) => {
            if (convoId === message.sender || (message.sender === contentManager.user?.id && message.receiver === convoId)){
                return messageTemplate(message.sender === contentManager.user?.id ? "sender": "receiver",index, message);
            } 

        });
    }

    return (
        <div className="message-container">
            {messageList()}
        </div>
    )
} 

export const useMessages = () => {
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [conversations, setConversations] = React.useState<number[]>([]);

    React.useEffect(() => {

        const messageCallback = () => {
           if (contentManager.messages !== messages){
               setMessages(contentManager.messages || []);

               const convos = contentManager.messages?.map((message) => {
                   return message.sender;
               });
    
               setConversations(([ ...new Set(convos)]));
           } 
        }

        contentManager.addListener('message', messageCallback);

        return () => {contentManager.removeListener('message', messageCallback)};
    }, [messages])

    return {messages, conversations};

}

const Home = () => {

    const {messages, conversations} = useMessages();
    const [currentConversation, setCurrentConversation] = React.useState<number | null>(null);


    console.log(currentConversation);
    return (
        <div id="home">
            {getConversations(currentConversation, conversations, setCurrentConversation)}
            {getMessages(currentConversation, messages)}
            <button id="logout" onClick={() => {localStorage.removeItem("token"); window.location.reload()}}>lohg out!</button>
        </div>
    )
}

export default Home;