import React from "react";
import contentManager from "../../contentmanager";
import { Conversation} from "../../interfaces";
import "./home.scss";
import Messages from "./Message";

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
                    <form onSubmit={async (e) => { e.preventDefault();  dispatch(inputId); }}>
                        <input type="number" placeholder="id" onChange={(value) => { inputId = value.target.valueAsNumber }} />
                    </form>
                </div>
            </section>
            <section>
                <button id="logout" onClick={() => { localStorage.removeItem("token"); window.location.reload() }}>lohg out!</button>
                <div id="profile-thing">
                    <h2>{contentManager.user?.name}</h2>
                    <p># {contentManager.user?.id}</p>
                </div>
            </section>
        </div>
    );
}

export const useConversations = () => {
    const [conversations, setConversations] = React.useState<Conversation[]>(contentManager.conversations);

    React.useEffect(() => {

        const messageCallback = () => {
            setConversations(contentManager.conversations);
        }

        contentManager.addListener('message', messageCallback);

        return () => { contentManager.removeListener('message', messageCallback) };
    }, [conversations])

    return conversations;
}

export const useCurrentConversation = () => {
    const conversation = React.useContext(CurrentConversationContext);
    const conversations = useConversations();

    return conversations.find(conversation2 => conversation2.id === conversation);
}


const Home = () => {

    const [currentConversationId, setCurrentConversation] = React.useState<number | null>(null);
    const conversations = useConversations();


    const updateCurrentConversation = async (id: number) => {
        await contentManager.getConversation(id);
        setCurrentConversation(id);
    }

    React.useEffect(() => {
        let isMounted = true;
        if (currentConversationId) {
            contentManager.getConversation(currentConversationId).then(() => {
                if (isMounted) setCurrentConversation(currentConversationId);
            });
        }

        return () => { isMounted = false };
    }, [currentConversationId]);

    React.useEffect(() => {

        const interval = window.setInterval(() => contentManager.getConversation(currentConversationId), 1000);

        return () => window.clearInterval(interval);

    }, [currentConversationId])


    return (
        <CurrentConversationContext.Provider value={currentConversationId}>
            <div id="home">
                <Conversations conversations={conversations} dispatch={updateCurrentConversation} />
                <Messages />
            </div>
        </CurrentConversationContext.Provider>
    )
}

export default Home;