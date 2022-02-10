import { reverse } from "dns/promises";
import { sensitiveHeaders } from "http2";
import React, { Component, Dispatch, useEffect } from "react";
import { cursorTo } from "readline";
import { createBuilderStatusReporter, moveSyntheticComments } from "typescript";
import contentManager from "../../contentmanager";
import { Conversation, Message } from "../../interfaces";
import "./home.scss";

export const usePopup = (element: JSX.Element): [JSX.Element, (() => void)] => {

    const [popup, setPopup] = React.useState<boolean>(false);

    const toogle = () => {
        setPopup(!popup);
    }

    const component = popup ? element : <></>;

    return [component, toogle]

}

export const CurrentConversationContext = React.createContext<number | null>(null);

const Conversations = (props: { conversations: Conversation[], dispatch: (id: number) => any }) => {

    const { conversations, dispatch } = props;
    let inputId = 0;
    const [popup, tooglePopup] = usePopup(
        <div id="popup">
        </div>
    );


    const ConversationList = () => {
        return (
            <ul>{
                conversations.map(conversation => {
                    return (
                        <li onClick={() => dispatch(conversation.id)} className="convo-item" key={conversation.id}>
                            <span />
                            <p >{conversation.name}</p>
                        </li >
                    );
                })
            }
            </ul>
        );
    }

    return (
        <div id="convo-bar">
            <section>
                <h2>Contacts</h2>
                <ConversationList />
                <div>
                    <form onSubmit={(e) => { e.preventDefault(); dispatch(inputId); }}>
                        <input type="number" placeholder="id" onChange={(value) => { inputId = value.target.valueAsNumber }} />
                    </form>
                </div>
            </section>
            <section>
                <div id="profile-thing">
                    <h2>{contentManager.user?.name}</h2>
                    <p># {contentManager.user?.id}</p>
                </div>
            </section>
        </div>
    );
}

const Messages = () => {

    const currentConversation = useCurrentConversation();

    const messages: Message[] = currentConversation?.messages || [];

    console.log("messages", messages, currentConversation);

    const messageTemplate = (classes: string, index: number, message: Message) => (
            <div key={index} className={"message " + classes}>
                <div>
                    <h2>{message.sender === currentConversation?.id ? currentConversation?.name : contentManager.user?.name}</h2>
                    <p>{message.content}</p>
                </div>
            </div>
    )

    const MessageList = () => (
        <div className="message-container">
            {messages.map((message, index) => messageTemplate(message.sender === contentManager.user?.id ? "sender" : "receiver", index, message))}
            <MessageSender/>
        </div>
    );


    return (
        <MessageList />
    )
}

const MessageSender = () => {
    const currentConversation = useCurrentConversation();

    const {name, id} = currentConversation || {};
    let message = "";

    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (id) {
            contentManager.sendMessage(id, message);

            e.currentTarget.reset();

        }
    }

    const placeholder = currentConversation != null ? "Message @" + name  : "";

    return (
        <div >
            <form onSubmit={(e) => sendMessage(e)}>
                <input id="send-message-container" type="text" onChange={(value) => { message = value.target.value }} placeholder={placeholder} />

            </form>
        </div>
    )
}

export const useConversations = () => {
    const [conversations, setConversations] = React.useState<Conversation[]>([]);

    React.useEffect(() => {

        const messageCallback = () => {
            if (contentManager.conversations !== conversations) {

                setConversations(contentManager.conversations);
            }
        }

        contentManager.addListener('message', messageCallback);

        return () => { contentManager.removeListener('message', messageCallback) };
    }, [conversations])

    return { conversations };
}

export const useCurrentConversation = () => {
    const conversation = React.useContext(CurrentConversationContext);
    return contentManager.conversations.find(conversation2 => conversation2.id === conversation);
}


const Home = () => {

    const [currentConversation, setCurrentConversation] = React.useState<number | null>(null);
    const { conversations } = useConversations();

    const updateCurrentConversation = async (id: number) => {
        await contentManager.getConversation(id);
        setCurrentConversation(id);
    }

    React.useEffect(() => {
        if (currentConversation) {
            updateCurrentConversation(currentConversation);
        }

    }, []);

    /*     React.useEffect(() => {
    
            if (currentConversation) {
                contentManager.getConversation(currentConversation);
            }
    
        }, [currentConversation]); */


    return (
        <CurrentConversationContext.Provider value={currentConversation}>
            <div id="home">
                <button id="logout" onClick={() => { localStorage.removeItem("token"); window.location.reload() }}>lohg out!</button>
                <Conversations conversations={conversations} dispatch={updateCurrentConversation} />
                <Messages />
            </div>
        </CurrentConversationContext.Provider>
    )
}

export default Home;