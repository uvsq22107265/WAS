"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http_1 = require("http");
const socketIo = require("socket.io");
const Domino_1 = require("./Domino");
class App {
    constructor() {
        this.debug = false;
        this.routes();
        this.sockets();
        this.listen();
        this.runtime();
    }
    routes() {
        this.app = express();
        this.app.use(express.static('./public'));
    }
    sockets() {
        this.server = (0, http_1.createServer)(this.app);
        this.io = new socketIo.Server(this.server);
    }
    listen() {
        this.io.on('connection', (socket) => {
            console.info('A user connected!');
            socket.on('NEW CONNECTION', (msg) => {
                const cartes = Domino_1.default.distribution();
                const joueur = {
                    name: msg,
                    socket,
                    cartes,
                    token: Domino_1.default.premierjeu(cartes),
                };
                socket.emit('HAND', cartes);
                Domino_1.default.joueurs.push(joueur);
                Domino_1.default.joueurs.map((s, index) => {
                    socket.emit('GAMER NAME', { gamer: index, name: s.name });
                });
            });
            socket.on('gaming', (msg) => {
                const gamerIndex = Domino_1.default.index_joueurs(socket);
                Domino_1.default.joueurs[gamerIndex].cartes.splice(Domino_1.default.cartes.indexOf(msg.value), 1);
                Domino_1.default.cartes_utilisees.push(msg.value);
                Domino_1.default.ultimoleft = msg.lastleft;
                Domino_1.default.ultimoright = msg.lastright;
                console.info('User play!', msg.value);
                Domino_1.default.joueurs[gamerIndex].token = false;
                if ((Domino_1.default.index_joueurs(socket) + 1) < 4) {
                    Domino_1.default.joueurs[gamerIndex + 1].token = true;
                }
                else {
                    Domino_1.default.joueurs[0].token = true;
                }
                socket.broadcast.emit('MOVIMENT', msg);
                Domino_1.default.supprimer_carte_joueur(Domino_1.default.joueurs[gamerIndex], msg.value);
                if (Domino_1.default.isJoueur_gagnant(Domino_1.default.joueurs[gamerIndex])) {
                    this.reboot('Le Joueur ' + (gamerIndex + 1) + ' -  "' + Domino_1.default.joueurs[gamerIndex].name + '" a Gagne!');
                    if (this.debug) {
                        console.info('Joueur Gagnant!');
                    }
                }
                Domino_1.default.retirer_carte_en_main(msg.value);
            });
            socket.on('PASS', () => {
                const gamerIndex = Domino_1.default.index_joueurs(socket);
                if (Domino_1.default.joueurs[gamerIndex].token) {
                    Domino_1.default.joueurs[gamerIndex].token = false;
                    if ((gamerIndex + 1) < 4) {
                        Domino_1.default.joueurs[gamerIndex + 1].token = true;
                    }
                    else {
                        Domino_1.default.joueurs[0].token = true;
                    }
                    if (this.debug) {
                        console.info('User Pass!');
                    }
                }
            });
            socket.on('disconnect', () => {
                const gamerIndex = Domino_1.default.index_joueurs(socket);
                Domino_1.default.joueurs.splice(gamerIndex, 1);
                if (this.debug) {
                    console.info('User disconnected!');
                }
                this.reboot(`Le Joueur :  ${(gamerIndex) + 1} s est deconnecte !! `);
            });
        });
    }
    runtime() {
        setInterval(() => {
            this.io.emit('INFO', {
                'tab': Domino_1.default.cartes_utilisees.length,
                'gamers': Domino_1.default.joueurs.length,
                'cardsInHand': Domino_1.default.cartes_en_main.length,
            });
            if (Domino_1.default.joueurs.length == 4) {
                Domino_1.default.joueurs.map((gamer, index) => {
                    if (gamer.token) {
                        this.io.emit('TOKEN', index);
                    }
                });
            }
        }, 1000);
    }
    reboot(msg) {
        Domino_1.default.cartes_utilisees = [];
        Domino_1.default.cartes_en_main = [];
        Domino_1.default.joueurs.map((gamer, index) => {
            gamer.socket.emit('REBOOT', msg);
            const cards = Domino_1.default.distribution();
            gamer.cartes = cards;
            gamer.token = Domino_1.default.premierjeu(cards);
            gamer.socket.emit('HAND', cards);
            gamer.socket.emit('GAMER NAME', { gamer: index, name: gamer.name });
        });
        if (this.debug) {
            console.info('Relancement du jeu !');
        }
    }
}
exports.default = new App();
