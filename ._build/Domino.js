"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Domino {
    constructor() {
        this.joueurs = [];
        this.cartes_en_main = [];
        this.cartes_utilisees = [];
        this.cartes = [];
        this.creations_cartes();
    }
    distribution() {
        const maMain = [];
        let rand;
        let index;
        for (index = 0; index < 7; index++) {
            do {
                rand = this.cartes[Math.floor((Math.random() * 28))];
            } while (this.cartes_en_main.indexOf(rand) !== -1);
            this.cartes_en_main.push(rand);
            maMain.push(rand);
        }
        return maMain;
    }
    premierjeu(carte) {
        if (carte.indexOf(this.cartes[27]) > -1) {
            return true;
        }
        else {
            return false;
        }
    }
    index_joueurs(socket) {
        return this.joueurs.findIndex((joueur) => {
            return (socket === joueur.socket);
        });
    }
    supprimer_carte_joueur(joueur, carte) {
        const index = this.index_carte_joueur(joueur, carte);
        if (index > -1) {
            joueur.cartes.splice(index, 1);
        }
    }
    isJoueur_gagnant(joueur) {
        return (joueur.cartes.length == 0);
    }
    retirer_carte_en_main(carte) {
        const index = this.index_carte_main(carte);
        if (index > -1) {
            this.cartes_en_main.splice(index, 1);
        }
    }
    creations_cartes() {
        let index = 0;
        for (let i = 0; i < 7; i++) {
            for (let p = 0; p < 7; p++) {
                if (p >= i) {
                    this.cartes[index++] = { num1: i, num2: p };
                }
            }
        }
    }
    index_carte_main(carte) {
        return this.cartes_en_main.findIndex((element) => {
            return carte === element;
        });
    }
    index_carte_joueur(joueur, carte) {
        return joueur.cartes.findIndex((element) => {
            return (carte === element);
        });
    }
}
exports.default = new Domino();
