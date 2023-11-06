/**
 * @file      TextMoveAnimation.ts
 * @brief     File contains the `TextMoveAnimation`.
 * @details
 * ~
 * @author    Jonas
 * @date      November 2023
 * @copyright Copyright (c) 2023
 */

namespace core
{
    /**
     * Text move animation configuration.
     * Use this config to inizialize the `TextMoveAnimation`.
     */
    export interface TextMoveAnimationConfig
    {
        text:                  string; /**< The text which will be displayed. */ 
        color:                 string; /**< Color of the animated text. */
        cssFontSize:           string; /**< Font size of the animated text. Is a CSS font-size property value. */
        minScreenPadding_inPC: number; /**< Minimum allowed screen padding. Text will shrink to fit. */
        duration_inS:          number; /**< Duration the animation takes to finish. */
        startDelay_inS:        number; /**< How long the start of the animation is delayed. */
        direction:             string; /**< Direction from which text should move. "left" or "right" is allowed. */
    }

    /**
     * Apply the "text move" animation to a text. 
     */
    export class TextMoveAnimation
    {
        #text:                  string;                /**< Text which gets displayed. */
        #htmlTextDiv:           HTMLDivElement | null; /**< HTML text div element. */
        #stylesheet:            Stylesheet_;           /**< Stylesheet to which the animation and all is added. */
        #duration_inS:          Seconds;               /**< How long the animation takes in seconds. */
        #startDelay_inS:        Seconds;               /**< How long till the animation is played in seconds. */
        #color:                 string;                /**< Color of the text. */
        #originalCSSFontSize:   string;                /**< CSS font size. For example: "1rem" */
        #minScreenPadding_inPC: number;                /**< Minimum allowed screen padding. Text will shrink to fit. */
        #direction:             string;                /**< Direction from which text should move. "left" or "right" is allowed. */

        constructor()
        {
            this.#text                  = "";       
            this.#htmlTextDiv           = null; 
            this.#stylesheet            = new Stylesheet_();
            this.#duration_inS          = 5;
            this.#startDelay_inS        = 0;
            this.#color                 = "black";
            this.#originalCSSFontSize   = "1rem";
            this.#minScreenPadding_inPC = 0;
            this.#direction             = "left";
        }

        /**
         * Initialize the animated text. 
         * @param config Configuration for the text assemble animation.
         */
        init(config: TextMoveAnimationConfig): void
        {
            // [1] Init
            this.#text                  = config.text;
            this.#color                 = config.color;
            this.#originalCSSFontSize   = config.cssFontSize;
            this.#minScreenPadding_inPC = config.minScreenPadding_inPC;
            this.#duration_inS          = config.duration_inS;
            this.#startDelay_inS        = config.startDelay_inS;
            this.#direction             = config.direction;
            this.#htmlTextDiv           = createTextDiv(this.#text, ["moveAnimationText"]);

            // [2] Add style
            this.#stylesheet.add(`.moveAnimationText { 
                color: ${this.#color};
                font-size: ${this.#originalCSSFontSize};
                
            }`);
            this.#stylesheet.add(`.moveAnimation { 
                opacity: 0;

                animation-name: move;
                animation-duration: ${this.#duration_inS}s;
                animation-delay: ${this.#startDelay_inS}s;
                /*animation-timing-function: cubic-brezier(n, n, n, n); */ 
                animation-iteration-count: 1;   /* play animation only once; infinite */
                animation-direction: alternate; /* alternate - The animation is played forwards first, then backwards */
                animation-fill-mode: forwards; /* forward - The element will retain the style values that is set by the last keyframe */
            }`);
            this.#stylesheet.add(`@keyframes move {
                0% {
                    opacity: 0;
                    transform: translate(${ this.#direction == "left"? -200 : 200 }%, 0%);
                }
        
                100% {
                    opacity: 1;
                    transform: translate(0%, 0%);
                }
            }`);

            this.#resize();
            addEventListener("resize", ((event: any) => { this.#resize(); }).bind(this));
        }

        /**
         * Play the animation.
         */
        play(): void
        {
            // [1] Play animation
            if (this.#htmlTextDiv?.classList.contains("moveAnimation")) {
                // ..animation is currently playing - restart
                this.#htmlTextDiv?.classList.remove("moveAnimation");
            }
            this.#htmlTextDiv?.classList.add("moveAnimation");

            // [2] Remove animation
            // After the animation played the text stays and if you remove it, then its position will changes.
            // So do not use this code.
            //let delay: Milliseconds = (this.#duration_inS) * 1000;
            //setTimeout(() => {
            //    this.#htmlTextDiv?.classList.remove("moveAnimation");
            //}, delay);
        }

        /**
         * Resize text.
         * 
         * This should be called if the screen changes size.
         */
        #resize(): void
        {
            let isDOMElement: boolean = document.body.contains(this.#htmlTextDiv);
            if (this.#htmlTextDiv) 
                // Useful if the screen got smaller / text got smaller and then screen got larger. With this text will enlarge as well.
                this.#htmlTextDiv.style.fontSize = this.#originalCSSFontSize;

            if (!isDOMElement) {
                dom_addHiddenElement(this.#htmlTextDiv); // DOM is required for `getHTMLElementFont`.
            }

            let cssFont: string = getHTMLElementFont(<HTMLElement>this.#htmlTextDiv);
            let optimalCSSFont: string = ""; {
                let optimalCSSFontSize: string = clampFontSizeToScreenPadding(this.#text, cssFont, this.#minScreenPadding_inPC);
                optimalCSSFont = setCSSFontSize(cssFont, optimalCSSFontSize);
            }
            if (this.#htmlTextDiv && cmpCSSFont(cssFont, optimalCSSFont) != 0) {
                this.#htmlTextDiv.style.fontSize = getCSSFontSize(optimalCSSFont);
            }

            if (!isDOMElement) {
                dom_removeHiddenElement(this.#htmlTextDiv, "flex"); // remove element from the DOM.
            }
        }

        resize(cssFontSize: string): void
        {
            if (this.#htmlTextDiv) {
                this.#htmlTextDiv.style.fontSize = cssFontSize;
            }
        }

        /**
         * Get the base HTML element of the "text move" animation. Add this somewhere to the DOM.
         * @returns Base HTML element.
         */
        getHTML(): HTMLDivElement | null
        {
            return this.#htmlTextDiv;
        }
    }
}