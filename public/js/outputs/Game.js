System.register(["./ModalName.js", "./Alert.js"], function (exports_1, context_1) {
    "use strict";
    var ModalName_js_1, Alert_js_1, Game;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (ModalName_js_1_1) {
                ModalName_js_1 = ModalName_js_1_1;
            },
            function (Alert_js_1_1) {
                Alert_js_1 = Alert_js_1_1;
            }
        ],
        execute: function () {
            Game = class Game {
                constructor(io) {
                    this.Ultimoleft = 6;
                    this.Ultimoright = 6;
                    this.firstturn = 0;
                    this.socket = io();
                    this.sizeScreen();
                    this.modal = new ModalName_js_1.ModalName(this);
                    this.alert = new Alert_js_1.Alert();
                }
                newCard(nums, horizontal = false, invertido = false) {
                    const n1 = nums.num1;
                    const n2 = nums.num2;
                    const dcard = document.createElement('div');
                    dcard.classList.add('card');
                    dcard.setAttribute('value', nums);
                    if (horizontal) {
                        dcard.classList.add('R90');
                    }
                    if (invertido) {
                        dcard.classList.add('R180');
                    }
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
                isDouble(nums) {
                    if (nums.num1 == nums.num2) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                isInverted(nums) {
                    if (((nums.num1 == this.Ultimoleft) || (nums.num2 == this.Ultimoright)) && (nums.num2 != nums.num1)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                isAllowed(nums, num) {
                    if ((nums.num1 == 6) && (nums.num2 == 6)) {
                        this.sens = "right";
                        return true;
                    }
                    if ((num == this.Ultimoleft) || (num == this.Ultimoright)) {
                        if (num == this.Ultimoleft)
                            this.sens = "left";
                        if (num == this.Ultimoright)
                            this.sens = "right";
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                changeUltimo(nums) {
                    let ultimoleft = this.Ultimoleft;
                    let ultimoright = this.Ultimoright;
                    if (nums.num1 != ultimoleft && nums.num1 != this.Ultimoleft && nums.num1 != ultimoright && nums.num1 != this.Ultimoright) {
                        if (this.sens == "left") {
                            ultimoleft = nums.num1;
                        }
                        else {
                            ultimoright = nums.num1;
                        }
                    }
                    if (nums.num2 != ultimoleft && nums.num2 != this.Ultimoleft && nums.num2 != ultimoright && nums.num2 != this.Ultimoright) {
                        if (this.sens == "left") {
                            ultimoleft = nums.num2;
                        }
                        else {
                            ultimoright = nums.num2;
                        }
                    }
                    this.Ultimoleft = ultimoleft;
                    this.Ultimoright = ultimoright;
                    console.info("Ultimo Left", this.Ultimoleft);
                    console.info("Ultimo Right", this.Ultimoright);
                }
                OpenToken() {
                    document.getElementById('pass').classList.add('active');
                    document.getElementById('wait').classList.add('disabled');
                    document.getElementById('status').innerHTML = 'C"est votre tour!';
                }
                CloseToken() {
                    document.getElementById('pass').classList.remove('active');
                    document.getElementById('wait').classList.remove('disabled');
                    document.getElementById('status').innerHTML = 'En attente d"autres joueurs';
                }
                PassarVez() {
                    this.socket.emit('PASS');
                    this.CloseToken();
                }
                downTabScroll() {
                    const objDiv = document.getElementById('tabuleiro');
                    objDiv.scrollTop = objDiv.scrollHeight;
                }
                topTabScroll() {
                    const objDiv = document.getElementById('tabuleiro');
                    objDiv.scrollTop = 0;
                }
                createHand(Hand) {
                    for (const nums of Hand) {
                        const card = this.newCard(nums, false);
                        const dices = card.querySelectorAll('.dice');
                        dices.forEach((dice, index) => {
                            dice.classList.add('hand');
                            dice.addEventListener('click', (e) => {
                                if (!this.isAllowed(nums, dice.getAttribute('value'))) {
                                    return false;
                                }
                                const clone = e.srcElement.parentElement.cloneNode(true);
                                if (this.isDouble(nums)) {
                                    clone.classList.add('R90');
                                }
                                if (this.isInverted(nums)) {
                                    clone.classList.add('R180');
                                }
                                if (this.sens == "left") {
                                    document.getElementById('tabuleiro').prepend(clone);
                                    this.topTabScroll();
                                    e.srcElement.parentElement.remove();
                                }
                                else {
                                    document.getElementById('tabuleiro').appendChild(clone);
                                    this.downTabScroll();
                                    e.srcElement.parentElement.remove();
                                }
                                this.changeUltimo(nums);
                                this.CloseToken();
                                this.socket.emit('gaming', { value: nums, lastleft: this.Ultimoleft, lastright: this.Ultimoright, sens: this.sens });
                            });
                            dice.addEventListener('mouseover', (e) => {
                                if (this.isAllowed(nums, dice.getAttribute('value'))) {
                                    e.srcElement.classList.add('hoverPossible');
                                }
                                else {
                                    e.srcElement.classList.add('hoverImPossible');
                                }
                            });
                            dice.addEventListener('mouseout', (e) => {
                                e.srcElement.classList.remove('hoverPossible');
                                e.srcElement.classList.remove('hoverImPossible');
                            });
                        });
                        document.getElementById('hand').appendChild(card);
                    }
                }
                Reiniciar() {
                    document.getElementById('tabuleiro').innerHTML = '';
                    const cards = document.querySelectorAll('#hand > div:not(#wait) ');
                    cards.forEach((card) => {
                        card.parentNode.removeChild(card);
                    });
                    document.getElementById('status').innerHTML = 'En attente de joueurs...';
                }
                newConection(name) {
                    this.socket.emit('NEW CONNECTION', name);
                }
                listen() {
                    this.socket.on('connect', () => {
                        if (this.Debug) {
                            console.info('conectado!!');
                        }
                        this.modal.open();
                    });
                    this.socket.on('HAND', (msg) => {
                        this.Reiniciar();
                        this.createHand(msg);
                    });
                    this.socket.on('GAMER NAME', (msg) => {
                        document.getElementById('gamerName_' + msg.gamer).innerHTML = msg.name;
                        document.getElementById('gamer_num').innerHTML = (msg.gamer + 1);
                        this.Jogador = msg.gamer;
                    });
                    this.socket.on('MOVIMENT', (msg) => {
                        if (msg.sens == "left") {
                            const card = this.newCard(msg.value, this.isDouble(msg.value), this.isInverted(msg.value));
                            document.getElementById('tabuleiro').prepend(card);
                            this.topTabScroll();
                        }
                        else {
                            const card = this.newCard(msg.value, this.isDouble(msg.value), this.isInverted(msg.value));
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
                        document.getElementById('Tokenjogador_' + token).checked = true;
                    });
                    this.socket.on('REBOOT', (msg) => {
                        this.alert.open(msg);
                        this.Reiniciar();
                    });
                    this.socket.on('INFO', (msg) => {
                        document.getElementById('gamers').innerHTML = msg.gamers;
                        document.getElementById('tab').innerHTML = msg.tab;
                        document.getElementById('cards_in_hand').innerHTML = msg.cardsInHand;
                    });
                }
                sizeScreen() {
                    if (window.screen.width >= 1024 && window.screen.height >= 768) {
                        this.listen();
                    }
                    else {
                        document.getElementById("game").classList.add("hide");
                        document.getElementById('mobile_message').classList.remove("hide");
                    }
                }
            };
            exports_1("Game", Game);
        }
    };
});
