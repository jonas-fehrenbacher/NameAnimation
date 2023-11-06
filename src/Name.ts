/**
 * @file      Name.ts
 * @brief     File contains `Name`.
 * @details
 * ~
 * @author    Jonas
 * @date      November 2023
 * @copyright Copyright (c) 2023
 */

namespace app
{
    /**
     * Display first and last name in a animation.
     */
    export class Name
    {
        #stylesheet: core.Stylesheet_;           /**< Stylesheet to which the animation and all is added. */
        #htmlName:   HTMLDivElement | null;      /**< Div containing the two name animations. */
        #firstName:  core.TextAssembleAnimation; /**< Animation of the first name. */
        #lastName:   core.TextMoveAnimation;     /**< Animation of the last name. */ 

        constructor()
        {
            this.#stylesheet = new core.Stylesheet_();
            this.#firstName  = new core.TextAssembleAnimation();
            this.#lastName   = new core.TextMoveAnimation();
            this.#htmlName   = core.createDiv(["name"]);

            this.#stylesheet.add(`.name {
                position:        relative;
                display:         flex;
                flex-direction:  column;
                justify-content: center;
                align-items:     center;
            }`);
        }

        /**
         * Inizialize the name, add it to the DOM and play animation.
         * @param config The apps configuration.
         * @param htmlApp HTML app element. @see main
         */
        init(config: any, htmlApp: HTMLDivElement): void
        {
            // Start firstname animation:
            this.#firstName.init({
                text:                  config.firstName, 
                color:                 config.textAssembleAnimation.color, 
                cssFontSize:           config.textAssembleAnimation.fontSize, 
                minScreenPadding_inPC: config.textAssembleAnimation.minScreenPadding, 
                textPartCount:         config.textAssembleAnimation.partCount, 
                duration_inS:          config.textAssembleAnimation.duration_inS, 
                startDelay_inS:        config.textAssembleAnimation.startDelay_inS
            });
            this.#htmlName?.appendChild(<HTMLDivElement>this.#firstName.getHTML()); // play animation
            this.#firstName.play();

            // Start lastname animation:
            this.#lastName.init({
                text:                  config.lastName, 
                color:                 config.textMoveAnimation.color, 
                cssFontSize:           config.textMoveAnimation.fontSize, 
                minScreenPadding_inPC: config.textMoveAnimation.minScreenPadding, 
                duration_inS:          config.textMoveAnimation.duration_inS, 
                startDelay_inS:        config.textMoveAnimation.startDelay_inS,
                direction:             config.textMoveAnimation.direction
            });
            this.#htmlName?.appendChild(<HTMLDivElement>this.#lastName.getHTML());
            this.#lastName.play();

            htmlApp.appendChild(<HTMLDivElement>this.#htmlName);
        }

        /**
         * Get parent HTML element.
         * @returns HTML element containing the names.
         */
        getHTML(): HTMLDivElement | null
        {
            return this.#htmlName;
        }
    }
}