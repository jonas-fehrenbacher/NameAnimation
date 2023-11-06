"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _App_instances, _App_name, _App_htmlApp, _App_playTextAssembler;
class App {
    constructor() {
        _App_instances.add(this);
        _App_name.set(this, void 0);
        _App_htmlApp.set(this, void 0);
        __classPrivateFieldSet(this, _App_name, "JONAS", "f");
        __classPrivateFieldSet(this, _App_htmlApp, document.getElementById("app"), "f");
        __classPrivateFieldGet(this, _App_instances, "m", _App_playTextAssembler).call(this);
    }
}
_App_name = new WeakMap(), _App_htmlApp = new WeakMap(), _App_instances = new WeakSet(), _App_playTextAssembler = function _App_playTextAssembler() {
    // [1] Create text assembler
    let textAssembler = document.createElement("div");
    textAssembler.id = "textAssembler";
    let textAssemblerItems = "";
    for (let i = 0; i < 49; ++i) {
        textAssemblerItems += `<div class="text">${__classPrivateFieldGet(this, _App_name, "f")}</div>`;
    }
    textAssembler.innerHTML = textAssemblerItems;
    // [2] Play
    __classPrivateFieldGet(this, _App_htmlApp, "f").appendChild(textAssembler);
};
let app = new App();
//# sourceMappingURL=main.js.map