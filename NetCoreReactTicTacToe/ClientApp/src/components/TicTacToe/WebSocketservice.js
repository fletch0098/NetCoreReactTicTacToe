import { HubConnection, TransportType, ConsoleLogger, LogLevel } from '@aspnet/signalr-client';
import { ChatMessage } from './Models/ChatMessage';

class WebSocketService {

    private _connection: HubConnection;

    constructor() {
        var transport = TransportType.WebSockets;
        let logger = new ConsoleLogger(LogLevel.Information);

        // create Connection
        this._connection = new HubConnection(`http://${document.location.host}/chat`,
            { transport: transport, logging: logger });

        // start connection
        this._connection.start().catch(err => console.error(err, 'red'));
    }

    // more methods here ...

}

const WebsocketService = new WebSocketService();

export default WebsocketService;