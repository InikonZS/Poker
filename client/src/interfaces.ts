export interface IPlayer {
  name: string;
  cards: ICard[];
  isFold: boolean;
  isAllIn: boolean;
  chips: number;
  bet: number;
  isAbsent: boolean;
}
  
export interface ICard {
  type: number;
  value: number;
}

export interface IDataState {
  currentPlayerIndex: number;
  currentRound: number;
  dealerIndex: number;
  deck: Array<ICard>;
  initialIndex: number;
  lastInRoundIndex: number;
  minimalBet: number;
  move: string;
  myPlayerIndex: number;
  players: Array<IPlayer>;
  pot: number;
  tableCards: Array<ICard>;
}

export interface IDataAsk {
  actions: IActions;
  playerId: number;
}

export interface IDataAskOther {
  playerId: number;
}

export interface IDataWinner {
  winIndex: number;
  cards: ICard[];
  count: number;
  comboName: string
}

export interface IDataServer {
  actions?: Array<string>;
  playerId: number;
}

export interface IGameMessage<T> { 
  type: string;
  data: T;
}

export enum Round {
  Preflop = 1,
  Flop,
  Turn,
  River,
}  

export interface IActions {
  raise?: () => void;
  check?: () => void;
  fold?: () => void;
  call?: () => void;
  bet?: () => void; 
}

export interface IBank {
  bank: number;
  players: IPlayer[];
}