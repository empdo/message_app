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

const Conversations = (props: { conversations: Conversation[], dispatch: React.Dispatch<React.SetStateAction<number | null>> }) => {

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

const Messages = (props: { currentConversation: number | null, conversations: Conversation[] }) => {
    const { conversations, currentConversation } = props;

    const messages: Message[] = conversations.find(conversation =>
        conversation.id === currentConversation && conversation.messages
        )?.messages || [];

    console.log(conversations.find(conversation =>
        true
        ));

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

        return (
            messages.map((message, index) => {
                return messageTemplate(message.sender === contentManager.user?.id ? "sender" : "receiver", index, message);
            })

        )
    }

    return (
        <div className="message-container">
            {messageList()}
            {/*             <MessageSender currentConversation={props.conversation.id}/>  */}
        </div>
    )
}

const MessageSender = (props: { currentConversation: number | null }) => {
    const currentConversation = props.currentConversation;
    let message = "";

    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (currentConversation) {
            contentManager.sendMessage(currentConversation, message);

            e.currentTarget.reset();

        }
    }

    const placeholder = currentConversation != null ? "message: #" + currentConversation.toString() : "";
    return (
        <div >
            <form onSubmit={(e) => sendMessage(e)}>
                <input id="send-message-container" type="text" onChange={(value) => { message = value.target.value }} placeholder={placeholder} />

            </form>
        </div>
    )
}

export const useMessages = () => {
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

const Home = () => {

    const [currentConversation, setCurrentConversation] = React.useState<number | null>(null);
    const { conversations } = useMessages();

    React.useEffect(() => {

        if (currentConversation) {
            contentManager.getConversation(currentConversation);
        }

    }, [currentConversation])

    return (
        <div id="home">
            <button id="logout" onClick={() => { localStorage.removeItem("token"); window.location.reload() }}>lohg out!</button>
            <Conversations conversations={conversations} dispatch={setCurrentConversation} />
            <Messages currentConversation={currentConversation} conversations={conversations} />
        </div>
    )
}

export default Home;