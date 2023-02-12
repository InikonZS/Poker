import React, { useEffect, useState } from "react";
import Player from '../player/player';
import MainPlayer from '../main-player/main-player';
import BankCoin from '../bank-coin/bank-coin';
import { ICard, IPlayer } from "../../interfaces";
import '../../style.css';
import './players-list.css';

type PlayersListProps = {
  players: Array<IPlayer>;
  player: IPlayer;
  currentPlayer: IPlayer;
  isOpened: boolean;
  winner: IPlayer | null;
  winCards: Array<ICard> | null;
}

export default function PlayersList({ players, player, currentPlayer, isOpened, winner, winCards }: PlayersListProps) {  
  return (
      <div className="players-list">
        <MainPlayer player={player} isCurrent={player == currentPlayer} isWinner={player == winner} winCards={winCards} />
        {players.filter(it => it != player).map((_player, index) => {
          if(_player == player) return;

          return (        
            <Player key={index} player={_player} place={index+1} isCurrent={_player == currentPlayer} isOpened={isOpened} isWinner={_player == winner}
            winCards={winCards} />      
          )           
        }          
        )}
      </div>
  )
}