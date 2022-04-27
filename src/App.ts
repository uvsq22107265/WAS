import * as express from 'express';
import { createServer, Server } from 'http';
import { Socket } from 'socket.io';
import socketIo = require('socket.io');
import domino from './Domino';
import { Joueur } from './interfaces/Joueur.interface';
import {Jeu} from './interfaces/Jeu.interface';

class App {
    public app: express.Application;
    public server: Server;
    public debug= false;
    private io: socketIo.Server

    constructor() {
        this.routes();
        this.sockets();
        this.listen();
        this.runtime();
    }
    /**
     * Http ROutes
     */
    private routes() {
        this.app = express();
        this.app.use(express.static('./public'));
    }
    /**
     * Socket http
     *
     * @return {void}
     */
    private sockets(): void {
        this.server = createServer(this.app);
        this.io = new socketIo.Server(this.server);
    }

    /**
     * Listen the connection
     */
    private listen(): void {

        this.io.on('connection', (socket: Socket) => {// a la reception d'un message (connection d'une autre machine)
            console.info('A user connected!');

            socket.on('NEW CONNECTION', (msg: string) => {//dans le cas d'une nouvelle connexion d'un utilisateur
                const cartes = domino.distribution();//on va creer 7 cartes aleatoires armis les cartes restantes
                const joueur: Joueur = {// creer un objet joueur
                    name: msg,
                    socket,
                    cartes,
                    token: domino.premierjeu(cartes),
                }

                socket.emit('HAND', cartes);//envoyer la main du joueur aux restants des joeuurs.
                domino.joueurs.push(joueur);// sauvegarder le joueur.

                domino.joueurs.map((s, index) => {
                    socket.emit('GAMER NAME', {gamer: index, name: s.name});
                });
            });
            socket.on('gaming', (msg) => {// un joueur a jouee un coup
                const gamerIndex:number = domino.index_joueurs(socket);

                domino.joueurs[gamerIndex].cartes.splice(domino.cartes.indexOf(msg.value), 1);
                domino.cartes_utilisees.push(msg.value);
                domino.ultimoleft = msg.lastleft;
                domino.ultimoright = msg.lastright;
                console.info('User play!', msg.value);
                domino.joueurs[gamerIndex].token = false;

                if ((domino.index_joueurs(socket) + 1) < 4) {
                    domino.joueurs[gamerIndex + 1].token = true;
                } else {
                    domino.joueurs[0].token = true;
                }
                socket.broadcast.emit('MOVIMENT', msg);
                domino.supprimer_carte_joueur(domino.joueurs[gamerIndex], msg.value);
                if (domino.isJoueur_gagnant(domino.joueurs[gamerIndex])) {
                    this.reboot('Le Joueur ' + (gamerIndex +1) +  ' -  "' + domino.joueurs[gamerIndex].name + '" a Gagne!');
                    if (this.debug) {
                        console.info('Joueur Gagnant!');
                    }
                }
                domino.retirer_carte_en_main( msg.value);
            });
            socket.on('PASS', () => {// quand on passe le tour.
                const gamerIndex:number = domino.index_joueurs(socket);

                if (domino.joueurs[gamerIndex].token) {
                    domino.joueurs[gamerIndex].token = false;
                    if ((gamerIndex + 1) < 4) {
                        domino.joueurs[gamerIndex + 1].token = true;
                    } else {
                         domino.joueurs[0].token = true;
                    }
                    if (this.debug) {
                        console.info('User Pass!');
                    }
                }
            });
            socket.on('disconnect', () => { // quand un utilisatuer se deconnecte
                const gamerIndex:number = domino.index_joueurs(socket);
                domino.joueurs.splice(gamerIndex, 1);
                if (this.debug) {
                    console.info('User disconnected!');
                }
                this.reboot(`Le Joueur :  ${(gamerIndex) + 1} s est deconnecte !! ` );
            });
        });
    }

    /**
     * Runtime
     */
    private runtime() {
        setInterval(() => {
            this.io.emit('INFO', {
                'tab': domino.cartes_utilisees.length,
                'gamers': domino.joueurs.length,
                'cardsInHand': domino.cartes_en_main.length,
            });
            if (domino.joueurs.length == 4) {
                domino.joueurs.map((gamer, index) => {
                    if (gamer.token) {
                        this.io.emit('TOKEN', index);
                    }
                });
            }
        }, 1000);
    }
    /**
     * Reboot the Game
     *
     * @param msg
     */
    private reboot(msg) {
        domino.cartes_utilisees = [];
        domino.cartes_en_main =  [];

        domino.joueurs.map((gamer, index) => {
            gamer.socket.emit('REBOOT', msg);
            const cards = domino.distribution();
            gamer.cartes = cards;
            gamer.token = domino.premierjeu(cards);
            gamer.socket.emit('HAND', cards);
            gamer.socket.emit('GAMER NAME', {gamer: index, name: gamer.name});
        });
        if (this.debug) {
            console.info('Relancement du jeu !');
        }
    }
}

export default new App();
