export interface ServerToClientEvents {
  connection: (result: boolean) => void;
  roomRequestError: (message: string) => void;
  updateGamePhase: (
    planningPhase: 'lobby' | 'planning' | 'battle' | 'result',
  ) => void;
  connectToRoom: (room: string) => void;
  disconnectFromRoom: (room: string) => void;
}

export interface ClientToServerEvents {
  requestRoom: (room: string, createOrJoin: 'create' | 'join') => void;
  disconnectFromRoom: (room: string) => void;
  test: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
