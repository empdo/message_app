import React from "react";
import contentManager from "../../contentmanager";
import { Conversation } from "../../interfaces";
import "./home.scss";
import Messages from "./Message";
import { useNavigate, useParams } from "react-router-dom";
import logoutSvg from "./logout-svgrepo-com.svg";

const Conversations = (props: { dispatch: (id: number) => any }) => {
  const { dispatch } = props;
  const conversations = useConversations();

  let inputId = 0;


  const ConversationList = () => {
    return (
      <ul>
        {conversations.map((conversation) => {
          const url = `https://messageapi.essung.dev/static/${conversation.id}.png`;

          return (
            <li
              onClick={() => dispatch(conversation.id)}
              className="convo-item"
              key={conversation.id}
            >
             <img src={url} alt="img" onError={(e)=>{e.currentTarget.onerror = null; e.currentTarget.src = "https://unstats.un.org/unsd/bigdata/conferences/2017/img/no-pic.png"}} />
              <p>{conversation.name}</p>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div id="convo-bar">
      <section>
        <h2>Contacts</h2>
        <ConversationList />
        <div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              dispatch(inputId);
            }}
          >
            <input
              type="number"
              placeholder="id"
              onChange={(value) => {
                inputId = value.target.valueAsNumber;
              }}
            />
          </form>
        </div>
      </section>
      <section>
        <div id="profile-thing">
          <h2>{contentManager.user?.name}</h2>
          <p># {contentManager.user?.id}</p>
          <img
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
              if (contentManager.socketHandeler)
                contentManager.socketHandeler.closeConnection();
            }}
            id="logout"
            src={logoutSvg}
            alt=""
          />
        </div>
      </section>
    </div>
  );
};

export const useConversations = () => {
  const [conversations, setConversations] = React.useState<Conversation[]>(
    contentManager.conversations
  );

  React.useEffect(() => {
    const messageCallback = () => {
      setConversations(contentManager.conversations);
    };

    contentManager.addListener("message", messageCallback);

    return () => {
      contentManager.removeListener("message", messageCallback);
    };
  }, [conversations]);

  return conversations;
};

export const useCurrentConversation = () => {
  const id = parseInt(useParams().id || "");
  const conversations = useConversations();

  return conversations.find((conversation2) => conversation2.id === id);
};

const Home = () => {
  const navigate = useNavigate();

  const updateCurrentConversation = async (currentConvoId: number) => {
    await contentManager.getConversation(currentConvoId);

    navigate("/conversation/" + currentConvoId);
  };

  return (
    <div id="home">
      <Conversations dispatch={updateCurrentConversation} />
      <Messages />
    </div>
  );
};

export default Home;
