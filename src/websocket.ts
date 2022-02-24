import contentManager from "./contentmanager";
import { Message } from "./interfaces";

class SocketHandeler {
    public socket?: WebSocket;

    closeConnection = () => {
        if(this.socket) {
            this.socket.close();
        }
    }

    startConnection = (token: string) => {
        this.socket = new WebSocket('wss://messageapi.essung.dev');

        if (!token && this.socket) {
            return;
        }

        
        this.socket.addEventListener('open', (event) => {
            if (!this.socket) {
                return;
            }

            this.socket.send(JSON.stringify({
                action: "listen",
                token: token
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