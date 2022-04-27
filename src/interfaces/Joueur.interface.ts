import { Socket } from 'socket.io';
import { Carte } from './Carte.interface';

export interface Joueur {
    name: string;
    token: boolean;
    socket: Socket;
    cartes: Carte[];
}