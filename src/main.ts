/**
 * @file      main.ts
 * @brief     Entry point of this application.
 * @details
 * ~
 * @author    Jonas
 * @date      November 2023
 * @copyright Copyright (c) 2023
 */

/// <reference path="config.js" />
/// <reference path="core/MessageBus.ts" />
/// <reference path="core/Stylesheet.ts" />
/// <reference path="core/TextAssembleAnimation.ts" />
/// <reference path="core/TextMoveAnimation.ts" />
/// <reference path="core/Tools.ts" />
/// <reference path="core/Vec2.ts" />

/**
 * Entry point of this application. Everything javascript related is called from here.
 */
class App
{
    #htmlApp:    HTMLDivElement;  /**< HTML element to which everything is added. */
    #messageBus: core.MessageBus; /**< Message bus to connect app systems. */
    #name: app.Name;              /**< Name which should get displayed. */

    /**
     * Inizialize and start the app.
     */
    constructor()
    {
        this.#htmlApp    = <HTMLDivElement>document.getElementById("app");
        this.#messageBus = new core.MessageBus();
        this.#name       = new app.Name();

        this.#name.init(config, this.#htmlApp);
    }
}

let app_: App = new App(); 