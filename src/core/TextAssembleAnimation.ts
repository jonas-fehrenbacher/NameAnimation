/**
 * @file      TextAssembleAnimation.ts
 * @brief     File contains the `TextAssembleAnimation`.
 * @details
 * ~
 * @author    Jonas
 * @date      November 2023
 * @copyright Copyright (c) 2023
 */

namespace core
{
    /**
     * Text assemble animation configuration.
     * Use this config to inizialize the `TextAssembleAnimation`.
     */
    export interface TextAssembleAnimationConfig
    {
        text:                  string; /**< The text which will be displayed. */ 
        color:                 string; /**< Color of the animated text. */
        cssFontSize:           string; /**< Font size of the animated text. Is a CSS font-size property value. */
        minScreenPadding_inPC: number; /**< Minimum allowed screen padding. Text will shrink to fit. */
        textPartCount:         number; /**< Of how many parts the text should consist. */
        duration_inS:          number; /**< Duration the animation takes to finish. */
        startDelay_inS:        number; /**< How long the start of the animation is delayed. */
    }

    /**
     * Apply "text assemble" animation to a text.
     * 
     * **How to get started?:**
     * Call the `init` function to inizialize the animation. Afterwards you can get the animations HTML
     * element by calling `getHTML()` and it should be called to add it to the DOM. Afterwards you can
     * play the animation by calling `play()`.
     * 
     * **Animation implementation:**
     * The "text assemble animation" is like that: There are multiple text parts scattert across the screen
     * and they move over time together until the name is constructed. Splitting a text in multiple
     * parts is not possible, but the same can be accomplished by just using multiple texts, lets say
     * 49. We store all those text in an container, the HTML looks similar to this:
     * ```
     * <div class="textAssembleAnimationWrapper">
     *     <div class="text">Jonas</div>
     *     <div class="text">Jonas</div>
     *     <div class="text">Jonas</div>
     *     <div class="text">Jonas</div>
     *     <div class="text">Jonas</div>
     *     <div class="text">Jonas</div>
     *     <div class="text">Jonas</div>
     *     <div class="text">Jonas</div>
     *     <div class="text">Jonas</div>
     *     <div class="text">Jonas</div>
     *     <!-- ... -->
     *  </div>
     * ```
     * Now we define a grid (49 => 7x7) and afterwards loop over each text div element. In each iteration
     * we deside its position and size and then tell CSS to only show this portion of the text. Afterwards
     * we specify a animation for this text part. Every text part has its own animation / keyframe. This is
     * done by using a random value for its radius and Z position. This random value will be the start value
     * used at 0% completion and 100% completion we use an 0deg radius and a 0px Z position. CSS does the 
     * interpolation, automatically.
     */
    export class TextAssembleAnimation
    {
        #text:                  string;                /**< Text which gets displayed. */
        #htmlTextContainer:     HTMLDivElement | null; /**< Container: cointains all text div elements. */
        #stylesheet:            Stylesheet_;           /**< Stylesheet to which the animation and all is added. */
        #htmlTextDiv:           HTMLDivElement | null; /**< Have a text div in the page flow. Everything is positioned absolute, but this gives the container some size. */
        #textCount:             number;                /**< Count of texts stacked on each other (1 text == 1 part). */
        #duration_inS:          Seconds;               /**< How long the animation takes in seconds. */
        #startDelay_inS:        Seconds;               /**< How long till the animation is played in seconds. */
        #color:                 string;                /**< Color of the text. */
        #originalCSSFontSize:   string;                /**< CSS font size. For example: "1rem" */
        #minScreenPadding_inPC: number;                /**< Minimum allowed screen padding. Text will shrink to fit. */

        constructor()
        {
            this.#stylesheet            = new Stylesheet_();
            this.#htmlTextDiv           = null;
            this.#text                  = "";
            this.#textCount             = 1;
            this.#duration_inS          = 5;
            this.#startDelay_inS        = 0;
            this.#color                 = "black";
            this.#originalCSSFontSize   = "1rem";
            this.#minScreenPadding_inPC = 0;
            this.#htmlTextContainer     = null;
        }

        /**
         * Initialize the animated text. 
         * 
         * @param config Configuration for the text assemble animation.
         */
        init(config: TextAssembleAnimationConfig): void
        {
            // [1] Create HTML
            this.#text                  = config.text;
            this.#color                 = config.color;
            this.#originalCSSFontSize   = config.cssFontSize;
            this.#minScreenPadding_inPC = config.minScreenPadding_inPC;
            this.#textCount             = config.textPartCount;
            this.#duration_inS          = config.duration_inS;
            this.#startDelay_inS        = config.startDelay_inS;
            this.#createHTML();

            let isGradientColor: boolean = core.isGradientColor(this.#color);

            // [2] Add style
            this.#stylesheet.add(`.textAssembleAnimationWrapper { 
                position: relative; /* Orient absolute child to this and set flex container to center. Flex container is only required if animated texts are shown after animation. */

                color: ${this.#color};

                font-size: ${this.#originalCSSFontSize};
            }`);
            this.#stylesheet.add(`.textAssembleAnimationWrapper .text { 
                position: absolute;
            }`);
            this.#stylesheet.add(`.textAssembleAnimationWrapper .textAssembleAnimation { 
                opacity: 0;
            }`);
            this.#stylesheet.add(`.textAssembleAnimationWrapper .hide { 
                display: none;
            }`);

            this.#resize();
            this.#createCSSTextParts();
            this.#createCSSKeyframes();

            addEventListener("resize", ((event: any) => { this.#resize(); }).bind(this));
        }

        /**
         * Play the animation.
         */
        play(): void
        {
            // [1] Play animation
            let parts = this.#htmlTextContainer?.getElementsByClassName("text");
            if (parts) {
                for (const part of parts) {
                    if (part.classList.contains("textAssembleAnimation")) {
                        // ..animation is currently playing - restart
                        part.classList.remove("textAssembleAnimation");
                    }
                    part.classList.add("textAssembleAnimation");

                    if (part.classList.contains("hide")) {
                        part.classList.remove("hide");
                    }
                }
            }
            if (this.#htmlTextDiv)
                this.#htmlTextDiv.style.opacity = "0";

            // [2] Remove animation
            // After the animation played the text stays, so this is optional, but you can see the grid and
            // select each specific tile. By removing the animation class, this gets fixed.
            let delay: Milliseconds = (this.#startDelay_inS + this.#duration_inS) * 1000;
            setTimeout(() => {
                let parts = this.#htmlTextContainer?.getElementsByClassName("text");
                if (parts) {
                    // [2.1] Display none for all text elements
                    for (const part of parts) {
                        part.classList.remove("textAssembleAnimation");
                        if (!part.classList.contains("hide")) {
                            part.classList.add("hide");
                        }
                    }

                    // [2.2] Show text
                    //this.#htmlTextContainer?.children[0].classList.remove("hide");
                    if (this.#htmlTextDiv)
                        this.#htmlTextDiv.style.opacity = "1";
                }
            }, delay);
        }

        /**
         * Create HTML needed to play the animation.
         * 
         * Hides every text element except for the first one. This is useful, because if you stack that many texts
         * over each other, then the browser will show an ugly text. Probably also browser specific what is shown.
         */
        #createHTML(): void
        {
            // [1] Create text assembler
            this.#htmlTextContainer = createDiv(["textAssembleAnimationWrapper"]);
            for (let i: number = 0; i < this.#textCount; ++i) {
                this.#htmlTextContainer.appendChild(createTextDiv(this.#text, ["text", "hide"]));
            }
            //this.#htmlTextContainer.children[0].classList.remove("hide");

            // [2] Create real (invisible) text
            /*
                Why? All childs have position absolute, so the real size of `textAssembleAnimationWrapper` is actually 0.
                This causes problems when positioning stuff, so we define a fixed size, by having an invisible text as a
                element in the page flow.
            */
            this.#htmlTextDiv = createTextDiv(this.#text, []);
            this.#htmlTextDiv.style.opacity = "1";
            this.#htmlTextContainer.appendChild(this.#htmlTextDiv);
        }

        /**
         * Resize text.
         * 
         * This should be called if the screen changes size.
         */
        #resize(): void
        {
            let isDOMElement: boolean = document.body.contains(this.#htmlTextContainer);
            if (this.#htmlTextContainer) 
                // Useful if the screen got smaller / text got smaller and then screen got larger. With this text will enlarge as well.
                this.#htmlTextContainer.style.fontSize = this.#originalCSSFontSize;

            if (!isDOMElement) {
                dom_addHiddenElement(this.#htmlTextContainer); // DOM is required for `getHTMLElementFont`.
            }

            let cssFont: string = getHTMLElementFont(<HTMLElement>this.#htmlTextContainer?.children[0]);
            let optimalCSSFont: string = ""; {
                let optimalCSSFontSize: string = clampFontSizeToScreenPadding(this.#text, cssFont, this.#minScreenPadding_inPC);
                optimalCSSFont = setCSSFontSize(cssFont, optimalCSSFontSize);
            }
            if (this.#htmlTextContainer && cmpCSSFont(cssFont, optimalCSSFont) != 0) {
                this.#htmlTextContainer.style.fontSize = getCSSFontSize(optimalCSSFont);
            }

            if (!isDOMElement) {
                dom_removeHiddenElement(this.#htmlTextContainer, "flex"); // remove element from the DOM.
            }
        }

        /**
         * Split the text in multiple parts by defining for each text a different area to show.
         * 
         * Each part is a rectangle. This is easily accomplishable by using a predefined grid and
         * iterting over each text div element. Telling each part what should be shown of the text
         * and which keyframe animation should be used. The animations are created in `createCSSKeyframes`.
         * 
         * **Grid:**
         *   49 parts => 7x7 grid
         *   _________
         *   | 0 | 1 |
         *   |--------
         *   | 2 | 3 |
         *   ---------
         *   Part x size: 100% / $gridX
         *   Part x pos: $row * xsize (left top corner is origin pos)
         *   Part y size: 100% / $gridY
         *   Part y pos: $column * ysize (left top corner is origin pos)
         **/
        #createCSSTextParts(): void
        {
            let partCount: Vec2 = new Vec2(Math.sqrt(this.#textCount), Math.sqrt(this.#textCount)); // e.g. 49 parts => 7x7 grid

            // [1] Calculate text dimension
            dom_addHiddenElement(this.#htmlTextContainer); // DOM is required for `getHTMLElementFont`.
            let fontStr: string = getHTMLElementFont(<HTMLElement>this.#htmlTextContainer?.children[0]); // calculate new font
            dom_removeHiddenElement(this.#htmlTextContainer, "flex"); // remove element from the DOM.

            let textWidth: number = getTextWidth(this.#text, fontStr); // Get style of the children.
            // TODO: Font width is too small with the "Economica" font: A bit is cut off...
            let textHeight: number = ((): number => {
                /*
                    `getHTMLElementFont`: Uses `getComputedStyle` to get font bounds.
                    `getFontHeight`:      Uses a canvas to calculate the font height.
                    Why considering `getHTMLElementFont` to get the text height?
                    Using `getFontHeight` can result in a larger value than using `getHTMLElementFont`, but `getFontHeight` returns the
                    bounds of what is possible. Strange, right? I use what is bigger, because otherwise text is cut off for some fonts 
                    (Economica).
                */
                let fontHeight: number = Number(getCSSFontSize(fontStr).replace(/\D/g, "")); // (1) get font size, (2) remove all non-number chars, (3) convert to number
                let textHeight: number =  getFontHeight(fontStr); // Get style of the children.
                return fontHeight > textHeight ? fontHeight : textHeight; // return bigger size
            })();

            // Debug info:
            // font size can be 160px, but this can result in a text height of 195px. There is unnecessary much free space.
            //console.log("Text width:  " + textWidth);
            //console.log("Text height: " + textHeight);
            //console.log("Font:        " + fontStr);

            // [2] Iterate over each text: cut it and add animation
            for (let i = 0; i < this.#textCount; ++i) /* `i` has to start from 0 for modulo to work. */
            {
                let current: Vec2 = new Vec2( // current row and column index
                    i % partCount.x,            // Index to an element in the row.
                    Math.floor(i / partCount.x) // Index to an element in the column.
                );

                let partSize: Vec2 = new Vec2( // width and height of a each text part
                    textWidth / partCount.x,
                    textHeight / partCount.y
                );

                let partPos: Vec2 = new Vec2( // Position of each text part. Is relative to the text position => (0,0) == left-top.
                    current.x * partSize.x,
                    current.y * partSize.y
                );

                // Debug info:
                //console.log("current:  ");
                //console.log(current);
                //console.log("partSize: ");
                //console.log(partSize);
                //console.log("partPos:  ");
                //console.log(partPos);
                //console.log("------------------------------------------");

                /*
                    Here we create a rectangle with the calculated dimensions:
                    `polygon(leftTopPoint, rightTopPoint, rightBottomPoint, leftBottomPoint);`.
                    Note that nth-child elements my not start with 0, they start with 1.

                    clip-path:
                    - clip-path: clip-source|basic-shape|margin-box|border-box|padding-box|content-box|fill-box|stroke-box|view-box|none|initial|inherit;
                    - x-axis: 0% is left; y-axis: 0% is top
                    - polygon: is a basic shape; polygon( left right, .. ): Define multiple points, which result together in a shape.
                */
                this.#stylesheet.add(`.textAssembleAnimationWrapper .textAssembleAnimation:nth-child(${i + 1}) {
                    clip-path: polygon(
                    /*              X                          Y               */
                        ${partPos.x}px              ${partPos.y}px,              /* left-top */
                        ${partPos.x + partSize.x}px ${partPos.y}px,              /* right-top */
                        ${partPos.x + partSize.x}px ${partPos.y + partSize.y}px, /* right-bottom */
                        ${partPos.x}px              ${partPos.y + partSize.y}px  /* left-bottom */
                    );

                    animation-name: move${i + 1};
                    animation-duration: ${this.#duration_inS}s;
                    animation-delay: ${this.#startDelay_inS}s;
                    /*animation-timing-function: cubic-brezier(n, n, n, n); */ 
                    animation-iteration-count: 1;   /* play animation only once; infinite */
                    animation-direction: alternate; /* alternate - The animation is played forwards first, then backwards */
                    animation-fill-mode: forwards; /* forward - The element will retain the style values that is set by the last keyframe */
                }`);
            }

        }

        /**
         * Add CSS keyframes to the stylesheet for animating all texts.
         * 
         * Every text has its own keyframe. They get a random rotation and Z transition and this start value is interpolated till
         * the end value, the texts original position, is reached.
         */
        #createCSSKeyframes(): void
        {
            for (let i: number = 0; i < this.#textCount; ++i) {
                /* The higher the numbers, the more random things are. */
                let rotateX: number = random(-500, 1000);   /* Larger range: Does increase speed */
                let rotateY: number = random(-500, 1000);   /* Larger range: Does increase speed */
                let rotateZ: number = random(-500, 1000);   /* Larger range: Does increase speed */
                let deph:    number = random(-5000, 10000); /* Larger range: Does not increase speed, but range */

                this.#stylesheet.add(`@keyframes move${i + 1} {
                    0% {
                        opacity: 0;
                        transform: rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) translateZ(${deph}px);
                    }

                    100% {
                        opacity: 1;
                        transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(0px);
                    }
                }`);
            }
        }

        /**
         * Get the base HTML element of the "text assemble animation". Add this somewhere to the DOM.
         * @returns Base HTML element.
         */
        getHTML(): HTMLDivElement | null
        {
            return this.#htmlTextContainer;
        }
    }
}