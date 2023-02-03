import React, { useEffect, useState } from "react";
import PlayerList from '../components/players-list/players-list';
import Table from '../components/table/table';
import ButtonsPanel from '../components/buttons-panel/buttons-panel';
import '../style.css';
import './game.css';
import { IActions, ICard, IPlayer } from "../interfaces";

type GameProps = {
    players: Array<IPlayer>;
    actions: IActions;
    cards: Array<ICard>;
}

export default function Game({players, actions, cards}: GameProps) {
    return (
        <div className="game">
            <div className="game__wrapper">
                <PlayerList players={players} />         
                <Table cards={cards}/>  
                {/* {(!players[myPlayerIndex].isFold && currentPlayerIndex === myPlayerIndex) &&  */}
                <ButtonsPanel actions={actions} />
                {/* } */}
            </div> 
        </div>
    )
}