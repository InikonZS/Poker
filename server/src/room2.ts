import { IRoomServer } from './interfaces/IRoomServer'
// import { Player } from './player'
import { GameLogic } from '../../client/src/game/game-logic'
import { IActions, ICard, IPlayer } from '../../client/src/interfaces'
import { connection } from "websocket"
import { RoomLogic } from '../../client/src/game/room-logic';
import { Player, BotPlayer } from '../../client/src/game/players';
import { IMessage } from '../../client/src/interfaces/IMessage';

export class Room {
    roomLogic: RoomLogic
    players: Map<connection, Player | BotPlayer> = new Map()
    lastActions: IActions = null;
    lastPlayer: Player = null;
    messages: IMessage[]

    constructor(public name: string) {
        this.roomLogic = new RoomLogic();
        this.messages = []
        // setInterval(() => {
        //     if(Math.random() < 0.02) {
        //         const bot = new BotPlayer('bot' + Math.random() * 100000);
        //         if (!this.roomLogic.checkTable()) {
        //           this.roomLogic.join(bot);  
        //         }
        //     }
        //     if(Math.random() < 0.02) {
        //         const bot = [...this.players.values()].filter(it => it instanceof(BotPlayer))[0];
        //         if(bot) {
        //             this.roomLogic.leave(bot);
        //         }
        //     }
        // }, 2000);    
    }

    startGame(): void {
        throw new Error('Method not implemented.')
    }
    handleMessage(connection: connection, msg: any, reqId?: string) {
        switch(msg.type) {
            case "join": {
                const player = new Player(msg.data.name);
                player.onMessage = (msg) => {
                    if(msg.type == 'ask') {
                        this.lastActions = msg.data.actions;
                        this.lastPlayer = player;                        
                        connection.sendUTF( JSON.stringify({
                            type: 'pocker',
                            data: {
                              ...msg,
                              data: {
                                ...msg.data,
                                actions: Object.keys(msg.data.actions)                
                              }
                            }
                          }));
                    } else {
                        connection.sendUTF( JSON.stringify({
                            type: 'pocker',
                            data: {
                              ...msg
                            }
                          }));
                    }
                }
                const playerIndex = this.roomLogic.join(player);
                this.players.set(connection, player);
                console.log("MSG JOIN",msg, "reqID", reqId)
                connection.sendUTF(JSON.stringify({
                    type: 'privateMessage',
                    requestId: reqId,
                    data: {
                        type: "join",
                        playerIndex: playerIndex,
                        roomName: this.name,
                        succes: true
                    }
                }))
                break;
            }
            case "leave": {
                const currentPlayer = this.players.get(connection);
                this.roomLogic.leave(currentPlayer);
                this.players.delete(connection);
                // this.lastActions = null;
                // this.lastPlayer = null;
                break;
            }
            case "move": {
                const currentPlayer = this.players.get(connection);
                if(currentPlayer == this.lastPlayer) {
                    this.lastActions[msg.data.action as keyof IActions]();
                    // this.lastActions = null;
                    // this.lastPlayer = null;
                } else {
                    console.log('Wrong Player', currentPlayer, this.lastPlayer);
                }
                break;
            }
            case "roomState": {
                connection.sendUTF(JSON.stringify({
                    type: 'privateMessage',
                    // requestId: "HelloWorld",
                    data: {
                        data: {
                            type: "roomState",
                            data: this.roomLogic.getCurrentState()
                        },
                        requestId: reqId,
                        type: "roomState",
                        roomName: this.name,
                        succes: true
                    }
                }))
                break;
            }
            case "chatMessage": {
                this.messages.push(msg.message)
                this.players.forEach((player, connection) => {
                    console.log("try send message")
                    connection.send(JSON.stringify({
                        type: "pocker",
                        data: {
                            type: "chatMessage",
                            data: {messages: this.messages},
                        }
                    }))
                })
            }
        }
    }
    handleDisconnect(connection: connection) {        
        const currentPlayer = this.players.get(connection);
        this.roomLogic.leave(currentPlayer);
        this.players.delete(connection);
        // this.lastActions = null;
        // this.lastPlayer = null;
    }
}
