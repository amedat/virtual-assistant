import { h, r as registerInstance } from './core-950489bb.js';

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

const wait = (duration=500) => input =>
  new Promise(resolve => setTimeout(() => resolve(input), duration));

function createElementsFromText(text) {
    return text.split('\n').map(line => {
        if (line === '') {
            return document.createElement('br');
        }
        const pElement = document.createElement('p');
        pElement.appendChild(document.createTextNode(line));
        return pElement;
    });
}
class Pane {
    constructor() {
        this.mapInputTextToHtmlElements = createElementsFromText;
        this.triangle = 'bottom';
    }
    addMessage(direction, text) {
        const message = document.createElement('chat-message');
        message.state = direction === 'outgoing' ? 'pending' : 'none';
        message.direction = direction;
        message.triangle = this.triangle;
        message.footer = new Date().toLocaleString('en-US', {
            hour: 'numeric', minute: 'numeric', hour12: true
        });
        this.mapInputTextToHtmlElements(text)
            .map(element => message.appendChild(element));
        this.pane.appendChild(message);
        this.conversation.scrollToBottom();
        return message;
    }
    async addOutgoingMessage(text) {
        return this.addMessage('outgoing', text);
    }
    async addIncomingMessage(text) {
        return this.addMessage('incoming', text);
    }
    async addCard({ text, image }) {
        const card = document.createElement('ion-card');
        card.setAttribute('style', 'background: white;');
        if (image) {
            const imgElement = document.createElement('img');
            imgElement.src = image;
            card.appendChild(imgElement);
        }
        if (text) {
            const contentElement = document.createElement('ion-card-content');
            this.mapInputTextToHtmlElements(text)
                .map(element => contentElement.appendChild(element));
            card.appendChild(contentElement);
        }
        this.pane.appendChild(card);
        this.conversation.scrollToBottom();
        return card;
    }
    render() {
        return [
            h("ion-header", { class: "header" },
                h("slot", { name: "header" })),
            h("chat-conversation", { ref: element => this.conversation = element },
                h("slot", null)),
            h("ion-footer", { class: "footer" },
                h("chat-input", { onSend: event => this.addOutgoingMessage(event.detail.value)
                        .then(message => this.incoming.emit({
                        element: message,
                        text: event.detail.value
                    })) }))
        ];
    }
    static get is() { return "chat-pane"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["pane.css"]
    }; }
    static get styleUrls() { return {
        "$": ["pane.css"]
    }; }
    static get properties() { return {
        "mapInputTextToHtmlElements": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "(text: string) => HTMLElement[]",
                "resolved": "(text: string) => HTMLElement[]",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "defaultValue": "createElementsFromText"
        },
        "triangle": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "MessageTriangle",
                "resolved": "\"bottom\" | \"none\" | \"top\"",
                "references": {
                    "MessageTriangle": {
                        "location": "import",
                        "path": "../../interfaces"
                    }
                }
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": ""
            },
            "attribute": "triangle",
            "reflect": false,
            "defaultValue": "'bottom'"
        }
    }; }
    static get events() { return [{
            "method": "incoming",
            "name": "incoming",
            "bubbles": true,
            "cancelable": true,
            "composed": true,
            "docs": {
                "tags": [],
                "text": ""
            },
            "complexType": {
                "original": "IncomingEventDetail",
                "resolved": "IncomingEventDetail",
                "references": {
                    "IncomingEventDetail": {
                        "location": "import",
                        "path": "../../interfaces"
                    }
                }
            }
        }]; }
    static get methods() { return {
        "addOutgoingMessage": {
            "complexType": {
                "signature": "(text: string) => Promise<HTMLElement>",
                "parameters": [{
                        "tags": [],
                        "text": ""
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "HTMLElement": {
                        "location": "global"
                    }
                },
                "return": "Promise<HTMLElement>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        },
        "addIncomingMessage": {
            "complexType": {
                "signature": "(text: string) => Promise<HTMLElement>",
                "parameters": [{
                        "tags": [],
                        "text": ""
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "HTMLElement": {
                        "location": "global"
                    }
                },
                "return": "Promise<HTMLElement>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        },
        "addCard": {
            "complexType": {
                "signature": "({ text, image }: { text?: string; image?: string; }) => Promise<HTMLElement>",
                "parameters": [{
                        "tags": [],
                        "text": ""
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "HTMLElement": {
                        "location": "global"
                    }
                },
                "return": "Promise<HTMLElement>"
            },
            "docs": {
                "text": "",
                "tags": []
            }
        }
    }; }
    static get elementRef() { return "pane"; }
}

function mapDuration(gap) {
    return {
        'none': 0,
        'short': 500,
        'long': 1000
    }[gap];
}
let previousMessageSent = Promise.resolve();
const RasaBot = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.conversation = uuidv4();
        this.header = 'Virtual Assistant';
        this.gap = 'long';
    }
    handleIncomingMessage(event) {
        const chatMessageElement = event.detail.element;
        fetch(`${this.server}/conversations/${this.conversation}/messages`, {
            method: 'POST',
            body: JSON.stringify({ text: event.detail.text, sender: 'user' }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(() => chatMessageElement.state = 'delivered')
            .then(() => this.predictUntilListen())
            .then(wait(mapDuration(this.gap)))
            .then(() => chatMessageElement.state = 'read');
    }
    predictUntilListen(execution) {
        if (execution && execution.messages && execution.messages.length == 0) {
            return;
        }
        else if (execution) {
            execution.messages.map(message => {
                previousMessageSent = previousMessageSent
                    .then(wait(mapDuration(this.gap)))
                    .then(() => {
                    if (message.text) {
                        this.pane.addIncomingMessage(message.text);
                    }
                    if (message.image) {
                        this.pane.addCard({ image: message.image });
                    }
                });
            });
        }
        fetch(`${this.server}/conversations/${this.conversation}/predict`, { method: 'POST' })
            .then(result => result.json())
            .then(response => response.scores[0].action)
            .then(action => fetch(`${this.server}/conversations/${this.conversation}/execute`, {
            method: 'POST',
            body: JSON.stringify({ name: action }),
            headers: {
                'Content-Type': 'application/json'
            }
        }))
            .then(result => result.json())
            .then(execution => this.predictUntilListen(execution));
    }
    componentDidLoad() {
        this.predictUntilListen();
    }
    render() {
        return (h("fab-app", { ref: element => this.fab = element }, h("chat-pane", { class: "trainer-chat-pane", ref: element => this.pane = element, onIncoming: event => this.handleIncomingMessage(event) }, h("ion-toolbar", { slot: "header", class: "toolbar" }, h("ion-title", null, h("div", { class: "trainer-icon-div" }, h("ion-icon", { class: "trainer-icon", src: "../assets/images/trainer.svg" })), h("div", { class: "trainer-header-div" }, h("span", { class: "trainer-header" }, h("b", null, this.header)))), h("ion-buttons", { slot: "primary" }, h("ion-button", { onClick: () => this.fab.close() }, h("ion-icon", { slot: "icon-only", name: "close" })))))));
    }
    static get style() { return "* {\n  font-family: \'Lato\', sans-serif;\n}\n.toolbar {\n  --ion-toolbar-background: linear-gradient(to right, #19D2CC, #0968B5);\n  --ion-toolbar-color: var(--header-text-color);\n}\n.trainer-icon {\n  width: 35px;\n  height: 30px;\n}\n.trainer-icon-div {\n  float: left;\n}\n.trainer-header-div {\n  margin-top: 1%;\n}\n.inner-scroll {\n  background-color: #e3dfd9;\n}"; }
};

export { RasaBot as rasa_bot };