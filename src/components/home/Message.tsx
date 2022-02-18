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

    const formatDate = (message: Message) => {
        var date = new Date(message.date * 1000);

        let time = date.getHours() + ":" + date.getMinutes();

        return (time);
    }

    const MessageTemplate = (props: { classes: string, message: Message }) => {
        const { classes, message } = props;


        return (
            <div className={"message " + classes}>
                <div>
                    <h3>{message.sender === currentConversation?.id ? currentConversation?.name : contentManager.user?.name}</h3>
                    <h5>{formatDate(message)}</h5>
                    <br />
                    <p>{message.content}</p>
                </div>
            </div>
        )
    };

    const Banner = (props: { date: Date }) => {
        const date = props.date;
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ["January","February","March","April","May","June","July",
        "August","September","October","November","December"];


        return (
            <div id="banner">
                <h3>{days[date.getDay()]} {date.getDate()} {months[date.getMonth()]} {date.getFullYear()}</h3>
            </div>
            )

    }

    const datesAreOnSameDay = (first: Date, second: Date) =>
        first.getFullYear() === second.getFullYear() &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate();

    const MessageList = (props: { messages: Message[] }) => {

        return (
            <>
                {
                    props.messages.map((message, index) => {

                        let date = new Date(message.date * 1000);
                        let previousDate = new Date(((messages[index - 1]) || {}).date * 1000);

                        return (
                            <>
                                {(datesAreOnSameDay(date, previousDate)) || <Banner key={message.id + "-banner"} date={date}/>}
                                <MessageTemplate key={message.id} classes={message.sender === contentManager.user?.id ? "sender" : "receiver"} message={message} />
                            </>
                        )

                    })
                }
            </>
        )

    }


    return (
        <div className="message-container" ref={messageContainerRef}>
            <MessageList messages={messages} />
            <MessageSender />
        </div>
    )
}

const MessageSender = () => {
    let currentConversation = useCurrentConversation();

    const { name, id } = currentConversation || {};
    let message = "";

    const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.currentTarget.reset();

        if (id && message) {

            await contentManager.sendMessage(id, message);

            await contentManager.getConversation(id);
        }

    }

    const placeholder = currentConversation != null ? "Message @" + name : "";

    return (
        <div >
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(e) }}>
                <input id="send-message-container" type="text" onChange={(value) => { message = value.target.value }} placeholder={placeholder} />

            </form>
        </div>
    )
}

export default Messages;