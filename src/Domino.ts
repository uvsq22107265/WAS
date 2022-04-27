import { Socket } from 'socket.io';
import {Carte} from './interfaces/Carte.interface';
import { Joueur } from './interfaces/Joueur.interface';


class Domino {

    public joueurs:Joueur[] = [];
    public cartes_en_main:Carte[] = [];
    public cartes_utilisees:Carte[] = [];
    public cartes:Carte[] = [];
    public ultimoleft: any;
    public ultimoright: any;

    constructor() {
        this.creations_cartes();// creer les cartes.
    }

    //distribuer 7 cartes aleatoirement sur un joueur.
    public distribution():Carte[] {
        const maMain: Carte[] = [];
        let rand: Carte;
        let index: number;

        for (index = 0; index < 7; index++) {
            do {
                rand = this.cartes[Math.floor((Math.random() * 28))];
            } while (this.cartes_en_main.indexOf(rand) !== -1);

            this.cartes_en_main.push(rand);
            maMain.push(rand);
        }
        return maMain;
    }
    /**
     * Tester si c possible de jouer le premier jeu.
     * @param carte 
     * @returns 
     */
    public  premierjeu(carte: Carte[]):boolean {
        if (carte.indexOf(this.cartes[27]) > -1) {// si il a dans sa main la carte (6,6)
            return true;
        } else {
            return false;
        }
    }
    // retourn l'index d'un joueur
    public index_joueurs(socket: Socket):number {
        return this.joueurs.findIndex((joueur)=> {
            return (socket === joueur.socket)
        });
    }
    // supprimer une carte de la main d'un joueur
    public supprimer_carte_joueur(joueur: Joueur, carte: Carte) {
        const index = this.index_carte_joueur(joueur, carte);
        if ( index > -1) {// si il existe
            joueur.cartes.splice(index, 1);
        }
    }
    // verifier si un joueur a gagner
    public isJoueur_gagnant(joueur: Joueur):boolean {
        return (joueur.cartes.length == 0); // on teste si le joueur n'a plus de cartes en main
    }
    // retirer une carte d'une main
    public retirer_carte_en_main(carte: Carte) {
        const index = this.index_carte_main(carte);
        if (index > -1) {
            this.cartes_en_main.splice(index, 1);
        }
    }
    /**
     * Creation des cartes du jeu de (0;0) a (6;6)
     */
    private  creations_cartes() {
        let index = 0;
        for (let i = 0; i < 7; i++) {
            for (let p = 0; p < 7; p++) {
                if ( p >= i) {
                    this.cartes[index++] = {num1:i, num2:p};
                }
            }
        }
    }
    // retourn l'index d'une carte en main
    private index_carte_main(carte: Carte) {
        return this.cartes_en_main.findIndex((element: Carte)=> {
            return  carte === element;
        });
    }
    //retourn l'index d'une carte dans la main d'un joueur donnee
    private index_carte_joueur(joueur: Joueur, carte: Carte) {
        return joueur.cartes.findIndex((element: Carte)=> {
            return (carte === element);
        });
    }
}

export default new Domino();
