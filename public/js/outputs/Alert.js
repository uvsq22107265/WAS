System.register([], function (exports_1, context_1) {
    "use strict";
    var Alert;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Alert = class Alert {
                constructor() {
                    this.modal = null;
                    this.closeButton = null;
                    this.modalBody = null;
                    this.modalButton = null;
                    this.__create();
                    this.__Listen();
                }
                __create() {
                    this.modal = document.createElement('div');
                    this.modal.classList.add('modal');
                    const modalContent = document.createElement('div');
                    modalContent.classList.add('modal-content');
                    const modalHeader = document.createElement('div');
                    modalHeader.classList.add('modal-header');
                    const modalclose = document.createElement('span');
                    modalclose.classList.add('close');
                    modalclose.innerHTML = '&times;';
                    this.closeButton = modalclose;
                    modalHeader.appendChild(modalclose);
                    const title = document.createElement('h2');
                    title.innerHTML = 'INFO!!!';
                    modalHeader.appendChild(title);
                    modalContent.appendChild(modalHeader);
                    this.modalBody = document.createElement('div');
                    this.modalBody.classList.add('modal-body');
                    modalContent.appendChild(this.modalBody);
                    const modalFooter = document.createElement('div');
                    modalFooter.classList.add('modal-footer');
                    this.modalButton = document.createElement('button');
                    this.modalButton.classList.add('button-confirmar');
                    this.modalButton.innerHTML = 'Reinciar';
                    modalFooter.appendChild(this.modalButton);
                    modalContent.appendChild(modalFooter);
                    this.modal.appendChild(modalContent);
                    document.getElementsByTagName('body')[0].append(this.modal);
                }
                open(msg) {
                    this.modal.style.display = 'flex';
                    this.modalBody.innerHTML = msg;
                }
                close() {
                    this.modal.style.display = 'none';
                }
                __Listen() {
                    this.modalButton.addEventListener('click', () => {
                        this.close();
                    }, false);
                    this.closeButton.addEventListener('click', () => {
                        this.close();
                    }, false);
                }
            };
            exports_1("Alert", Alert);
        }
    };
});
