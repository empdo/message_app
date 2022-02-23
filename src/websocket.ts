import contentManager from "./contentmanager";
import { Message } from "./interfaces";

class SocketHandeler {
    public socket = new WebSocket('ws://localhost:4678');

    closeConnection = () => {
        this.socket.close();
    }

    startConnection = () => {
        this.socket.addEventListener('open', (event) => {
            this.socket.send(JSON.stringify({
                action: "listen",
                token: contentManager.token,
            }));

        });

        this.socket.addEventListener('message', (event) => {
            const data = event.data;
        
            const parsedData = JSON.parse(data.toString());

            const message = parsedData.message as Message;

            contentManager.addMessage(message);

        });
        
    }


}

export default SocketHandeler;