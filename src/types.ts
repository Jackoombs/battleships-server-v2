export interface ServerToClientEvents {
  connection: (result: boolean) => void;
  roomRequestError: (message: string) => void;
  updateGamePhase: (
    planningPhase: 'lobby' | 'planning' | 'battle' | 'result',
    playerTurn?: boolean | null,
  ) => void;
  connectToRoom: (room: string) => void;
  disconnectFromRoom: (room: string) => void;
  checkPlayerReady: () => void;
  opponentReceiveFire: (coord: [number, number]) => void;
  endRound: (
    coord: [number, number],
    isHit: boolean,
    isSunk: null | string,
  ) => void;
  gameResult: (isWinner: boolean) => void;
}

export interface ClientToServerEvents {
  requestRoom: (room: string, createOrJoin: 'create' | 'join') => void;
  disconnectFromRoom: (room: string) => void;
  checkOpponentReady: (room: string) => void;
  beginGame: (room: string) => void;
  playerFire: (room: string, coord: [number, number]) => void;
  endRound: (
    room: string,
    coord: [number, number],
    isHit: boolean,
    isSunk: null | string,
  ) => void;
  isWin: (room: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
