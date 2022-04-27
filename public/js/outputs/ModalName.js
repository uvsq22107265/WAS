System.register([], function (exports_1, context_1) {
    "use strict";
    var ModalName;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            ModalName = class ModalName {
                constructor(game) {
                    this.modal = null;
                    this.closeButton = null;
                    this.inputName = null;
                    this.modalButton = null;
                    this.game = null;
                    this.__create();
                    this.__Listen();
                    this.game = game;
                }
                __create() {
                    this.modal = document.createElement('div');
                    this.modal.classList.add('modal');
                    const modalContent = document.createElement('div');
                    modalContent.classList.add('modal-content');
                    const modalHeader = document.createElement('div');
                    modalHeader.classList.add('modal-header');
                    const title = document.createElement('h2');
                    title.innerHTML = 'Veuillez entrer un surnom';
                    modalHeader.appendChild(title);
                    modalContent.appendChild(modalHeader);
                    const modalBody = document.createElement('div');
                    modalBody.classList.add('modal-body');
                    const label = document.createElement('label');
                    label.innerHTML = 'Name:';
                    modalBody.appendChild(label);
                    this.inputName = document.createElement('input');
                    this.inputName.setAttribute('placeholder', 'Joueur');
                    modalBody.appendChild(this.inputName);
                    modalContent.appendChild(modalBody);
                    const modalFooter = document.createElement('div');
                    modalFooter.classList.add('modal-footer');
                    this.modalButton = document.createElement('button');
                    this.modalButton.classList.add('button-confirmar');
                    this.modalButton.innerHTML = 'Entrer';
                    modalFooter.appendChild(this.modalButton);
                    modalContent.appendChild(modalFooter);
                    this.modal.appendChild(modalContent);
                    document.getElementsByTagName('body')[0].append(this.modal);
                }
                open() {
                    this.modal.style.display = 'flex';
                    this.inputName.focus();
                }
                close() {
                    this.modal.style.display = 'none';
                }
                __saveName(input) {
                    if (input.value !== '') {
                        this.game.newConection(input.value);
                    }
                    else {
                        this.game.newConection('Aucun Nom');
                    }
                    this.close();
                }
                __Listen() {
                    this.modalButton.addEventListener('click', () => {
                        this.__saveName(this.inputName);
                    }, false);
                    this.inputName.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            this.__saveName(this.inputName);
                        }
                    }, false);
                }
            };
            exports_1("ModalName", ModalName);
        }
    };
});
