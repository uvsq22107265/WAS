import {ModalName} from './ModalName.js';
import {Alert} from './Alert.js';
import { Console } from 'console';
export class Game {

    private Ultimoleft = 6;// initialise a -1
    private Ultimoright = 6; // initialise a -1
    private firstturn = 0;
    private sens;
    private Jogador;
    private Debug;
    private socket;
    private modal: ModalName;
    private alert: Alert;

    constructor(io) {
        this.socket = io();
        this.sizeScreen();
        this.modal = new ModalName(this);
        this.alert = new Alert();
    }

    /**
     * This function create a new card in game.
     * 
     * @param {array} nums - array nums cards 
     * @param {boolean} horizontal - is horizontal or vertical.
     * @param {boolean} invertido - is inverted
     * @returns array cards 
     */
    private newCard(nums, horizontal= false, invertido= false) {
        const n1 = nums.num1;
        const n2 = nums.num2;
        const dcard = document.createElement('div');
        dcard.classList.add('card');
        dcard.setAttribute('value', nums);
        if (horizontal) { dcard.classList.add('R90'); }
        if (invertido) { dcard.classList.add('R180'); }

        let span = document.createElement('span');
        span.classList.add('dice');
        span.classList.add('dice-' + n1);
        span.setAttribute('value', n1);
        dcard.appendChild(span);

        const hr = document.createElement('hr');
        dcard.appendChild(hr);

        span = document.createElement('span');
        span.classList.add('dice');
        span.classList.add('dice-' + n2);
        span.setAttribute('value', n2);
        dcard.appendChild(span);

        return dcard;
    }

    /**
     * This fucntions test is 
     * 
     * @param {array} nums - this fucntio test if has 2 numbers equals. 
     * @returns {boolean}
     */
    private isDouble(nums) {
        if (nums.num1 == nums.num2) {  return true; } else { return false; }
    }

    /**
     * this funtion test if the numbes should be inverted when played
     * 
     * @param {array} nums - array de number. 
     * @returns {booelan}
     */
    private isInverted(nums) {
        if (((nums.num1 == this.Ultimoleft) || (nums.num2 == this.Ultimoright)) && (nums.num2 != nums.num1)) {  return true; } else { return false; }
    }

    /**
     * This function test if the number is allowed in momment
     * 
     * @param {array} nums -  array number
     * @param {int} num - number will tested
     * @returns {boolean}
     */
    private isAllowed(nums, num) {
        if((nums.num1 == 6) && (nums.num2 == 6)) 
            {
                this.sens = "right";
                return true;
            }
         if((num == this.Ultimoleft) || (num == this.Ultimoright))
            {
                if(num == this.Ultimoleft) this.sens = "left";
                if(num == this.Ultimoright) this.sens = "right"; 
                return true;
            } 
        else{
                return false;
            }
    }


    /**
     * this function chamte the last number from game.
     * 
     * @param {array} nums 
     */
    private changeUltimo(nums) {
        let ultimoleft = this.Ultimoleft;
        let ultimoright = this.Ultimoright;
        if (nums.num1 != ultimoleft && nums.num1 != this.Ultimoleft && nums.num1 != ultimoright && nums.num1 != this.Ultimoright) {
            if(this.sens == "left"){
                ultimoleft = nums.num1;
            }
            else{
                ultimoright = nums.num1;
            }
        }
        if (nums.num2 != ultimoleft && nums.num2 != this.Ultimoleft && nums.num2 != ultimoright && nums.num2 != this.Ultimoright) {
            if(this.sens == "left"){
                ultimoleft = nums.num2;
            }
            else{
                ultimoright = nums.num2;
            }
        }
        this.Ultimoleft = ultimoleft;
        this.Ultimoright = ultimoright;
        console.info("Ultimo Left", this.Ultimoleft);
        console.info("Ultimo Right", this.Ultimoright)
    }

    /**
     *  Open token will allow gamer make actions.
     */
    private OpenToken() {
        document.getElementById('pass').classList.add('active');
        document.getElementById('wait').classList.add('disabled');
        document.getElementById('status').innerHTML = 'C"est votre tour!';
    }

    /**
     * Close token this disallow gamer to make actions
     */
    private CloseToken() {
        document.getElementById('pass').classList.remove('active');
        document.getElementById('wait').classList.remove('disabled');
        document.getElementById('status').innerHTML = 'En attente d"autres joueurs';
    }

    /**
     * This fucntion make the gamer pass the token.
     */
    private PassarVez() {
        this.socket.emit('PASS');
        this.CloseToken();
    }

    /**
     * this functions will put scroll to bottom in game.
     */
    private downTabScroll() {
        const objDiv = document.getElementById('tabuleiro');
        objDiv.scrollTop = objDiv.scrollHeight;
    }
    /**
     * this functions will put scroll to bottom in game.
     */
     private topTabScroll() {
        const objDiv = document.getElementById('tabuleiro');
        objDiv.scrollTop = 0;
    }


    /**
     * This function will create hand.
     * 
     * @param {array} Hand - this is array with all cards from gamer  
     */
    /*private createHand(Hand) {
        for (const nums of Hand) {
            const card = this.newCard(nums, false);
            const dices = card.querySelectorAll('.dice');
            dices.forEach((dice, index) => {
                    dice.classList.add('hand');
                    dice.addEventListener('click', (e) => {
                        console.log("Click");
                        // Ici vous entrez la fonction pour sélectionner une pièce sur l'échiquier

                        if (!this.isAllowed(nums, dice.getAttribute('value'))) {console.log("testing false"
                        ); return false; }
                        const clone = ( e.srcElement as Element).parentElement.cloneNode(true);

                        if (this.isDouble(nums)) { ( clone as Element).classList.add('R90'); }
                        if (this.isInverted(nums)) { ( clone as Element).classList.add('R180'); }

                        document.getElementById('tabuleiro').appendChild(clone);
                        if(this.firstturn == 0){
                            this.firstturn = 1;
                        }
                        this.downTabScroll();
                        ( e.srcElement as Element).parentElement.remove();
                        this.changeUltimo(nums);
                        this.CloseToken();
                        this.socket.emit('gaming', {value: nums , lastleft: this.Ultimoleft, lastright: this.Ultimoright});
                    });

                    dice.addEventListener('mouseover', (e) => {
                        if (this.isAllowed(nums, dice.getAttribute('value'))) {
                            ( e.srcElement as Element).classList.add('hoverPossible');
                        } else {
                            ( e.srcElement as Element).classList.add('hoverImPossible');
                        }
                    });

                    dice.addEventListener('mouseout', (e) => {
                        ( e.srcElement as Element).classList.remove('hoverPossible');
                        ( e.srcElement as Element).classList.remove('hoverImPossible');
                });
            });
            document.getElementById('hand').appendChild(card);
        }
    }*/
    private createHand(Hand) {
        for (const nums of Hand) {
            const card = this.newCard(nums, false);
            const dices = card.querySelectorAll('.dice');
            dices.forEach((dice, index) => {
                    dice.classList.add('hand');
                    dice.addEventListener('click', (e) => {
                        // le traitement du jeu

                        if (!this.isAllowed(nums, dice.getAttribute('value'))) { return false; }
                        const clone = ( e.srcElement as Element).parentElement.cloneNode(true);

                        if (this.isDouble(nums)) { ( clone as Element).classList.add('R90'); }
                        if (this.isInverted(nums)) { ( clone as Element).classList.add('R180'); }
                        if(this.sens == "left"){
                            document.getElementById('tabuleiro').prepend(clone);
                            this.topTabScroll();
                            ( e.srcElement as Element).parentElement.remove();
                        }else{
                            document.getElementById('tabuleiro').appendChild(clone)
                            this.downTabScroll();
                            ( e.srcElement as Element).parentElement.remove();
                        }
                        this.changeUltimo(nums);// changer les fins de liste du jeu

                        this.CloseToken();
                        this.socket.emit('gaming', {value: nums , lastleft: this.Ultimoleft, lastright: this.Ultimoright, sens: this.sens});
                    });

                    dice.addEventListener('mouseover', (e) => {
                        if (this.isAllowed(nums,dice.getAttribute('value'))) {
                            ( e.srcElement as Element).classList.add('hoverPossible');
                        } else {
                            ( e.srcElement as Element).classList.add('hoverImPossible');
                        }
                    });

                    dice.addEventListener('mouseout', (e) => {
                        ( e.srcElement as Element).classList.remove('hoverPossible');
                        ( e.srcElement as Element).classList.remove('hoverImPossible');
                    });
            });
            document.getElementById('hand').appendChild(card);
        }
    }
    
    /**
     * Reboot the game
     */
    public Reiniciar() {
        document.getElementById('tabuleiro').innerHTML = '';
        const cards = document.querySelectorAll('#hand > div:not(#wait) ');
        cards.forEach( (card) => {
            card.parentNode.removeChild( card );
        });
        document.getElementById('status').innerHTML = 'En attente de joueurs...';
    }

    /**
     * This function send comand new connection to server.
     * @param {string} name - Send user name. 
     */
    public newConection(name: string) {
        this.socket.emit('NEW CONNECTION', name);
    }

    /**
     * THis function  listem the server to make actions on client application
     */
    private listen() {
        this.socket.on('connect', () =>  {
                if (this.Debug) { console.info('conectado!!'); }
                this.modal.open();
        });
        this.socket.on('HAND', (msg) => {
            this.Reiniciar();
            this.createHand(msg);
        });
        this.socket.on('GAMER NAME', (msg) => {
            document.getElementById('gamerName_' + msg.gamer).innerHTML = msg.name ;
            document.getElementById('gamer_num').innerHTML = (msg.gamer + 1);
            this.Jogador = msg.gamer;
        });
        this.socket.on('MOVIMENT', (msg) => {
            if(msg.sens == "left"){
                const card  = this.newCard(msg.value, this.isDouble(msg.value), this.isInverted(msg.value));
                document.getElementById('tabuleiro').prepend(card);
                this.topTabScroll();
            }else{
                const card  = this.newCard(msg.value, this.isDouble(msg.value), this.isInverted(msg.value));
                document.getElementById('tabuleiro').appendChild(card);
                this.downTabScroll();
            }
            this.Ultimoleft = msg.lastleft;
            this.Ultimoright = msg.lastright;
        });
        this.socket.on('TOKEN', (token) => {
            this.CloseToken();
            if (token == this.Jogador) {
                this.OpenToken();
            }
            ( document.getElementById('Tokenjogador_' + token) as HTMLInputElement).checked = true;
        });
        this.socket.on('REBOOT', (msg) => {
            this.alert.open(msg)
            this.Reiniciar();
        });
        this.socket.on('INFO', (msg) => {
            document.getElementById('gamers').innerHTML = msg.gamers;
            document.getElementById('tab').innerHTML = msg.tab;
            document.getElementById('cards_in_hand').innerHTML = msg.cardsInHand;
        });
    }

    /**
     * Send message to Incompatible screen resolution.
     */
    private  sizeScreen() {
        if (window.screen.width >= 1024 && window.screen.height >= 768) {
             this.listen();
        }else{
            document.getElementById("game").classList.add("hide");
            document.getElementById('mobile_message').classList.remove("hide");
        }
    } 
}
