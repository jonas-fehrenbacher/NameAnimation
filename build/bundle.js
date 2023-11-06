"use strict";
/**
 * @file      Name.ts
 * @brief     File contains `Name`.
 * @details
 * ~
 * @author    Jonas
 * @date      November 2023
 * @copyright Copyright (c) 2023
 */
var app;
(function (app) {
    /**
     * Display first and last name in a animation.
     */
    class Name {
        #stylesheet; /**< Stylesheet to which the animation and all is added. */
        #htmlName; /**< Div containing the two name animations. */
        #firstName; /**< Animation of the first name. */
        #lastName; /**< Animation of the last name. */
        constructor() {
            this.#stylesheet = new core.Stylesheet_();
            this.#firstName = new core.TextAssembleAnimation();
            this.#lastName = new core.TextMoveAnimation();
            this.#htmlName = core.createDiv(["name"]);
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
        init(config, htmlApp) {
            // Start firstname animation:
            this.#firstName.init({
                text: config.firstName,
                color: config.textAssembleAnimation.color,
                cssFontSize: config.textAssembleAnimation.fontSize,
                minScreenPadding_inPC: config.textAssembleAnimation.minScreenPadding,
                textPartCount: config.textAssembleAnimation.partCount,
                duration_inS: config.textAssembleAnimation.duration_inS,
                startDelay_inS: config.textAssembleAnimation.startDelay_inS
            });
            this.#htmlName?.appendChild(this.#firstName.getHTML()); // play animation
            this.#firstName.play();
            // Start lastname animation:
            this.#lastName.init({
                text: config.lastName,
                color: config.textMoveAnimation.color,
                cssFontSize: config.textMoveAnimation.fontSize,
                minScreenPadding_inPC: config.textMoveAnimation.minScreenPadding,
                duration_inS: config.textMoveAnimation.duration_inS,
                startDelay_inS: config.textMoveAnimation.startDelay_inS,
                direction: config.textMoveAnimation.direction
            });
            this.#htmlName?.appendChild(this.#lastName.getHTML());
            this.#lastName.play();
            htmlApp.appendChild(this.#htmlName);
        }
        /**
         * Get parent HTML element.
         * @returns HTML element containing the names.
         */
        getHTML() {
            return this.#htmlName;
        }
    }
    app.Name = Name;
})(app || (app = {}));
/**
 * Configuration for the application.
 */
var config = {
    "textAssembleAnimation": {
        "color": "red",
        "partCount": 900,
        "duration_inS": 10,
        "startDelay_inS": 1,
        "fontSize": "30rem",
        "minScreenPadding": 20 // 20%: Between text and screen is at minimum a padding of 20%.
    },
    "textMoveAnimation": {
        "color": "rgba(150, 150, 150)",
        "duration_inS": 3,
        "startDelay_inS": 11,
        "fontSize": "10rem",
        "minScreenPadding": 40,
        "direction": "left" // "left" or "right" is allowed
    },
    "firstName": "Jonas",
    "lastName": "Fehrenbacher"
};
/**
 * @file      MessageBus.ts
 * @brief     File contains the `MessageBus`.
 * @details
 * ~
 * @author    Jonas
 * @date      November 2023
 * @copyright Copyright (c) 2023
 */
var core;
(function (core) {
    /**
     * Message which can be send via the `MessageBus`.
     */
    let Message;
    (function (Message) {
    })(Message = core.Message || (core.Message = {}));
    ;
    /**
     * The message bus to connect unrelated code easily.
     *
     * This can reduce system dependencies and help making systems more dynamically usable (e.g. States).
     */
    class MessageBus {
        #receivers; /**< Storage of all registered receivers. */
        constructor() {
            this.#receivers = [];
        }
        /**
         * Add a new receiver, which will receive all sent messages (via `send()`).
         * @param receiver Callback function which will be called if a message is sent.
         */
        add(receiver) {
            this.#receivers.push(receiver);
        }
        /**
         * Add a new message to the bus, ready to be sent to all registered receivers.
         * UserData will be freed, automatically.
         *
         * @param message ID of the message being sent.
         */
        send(message) {
            for (let receiver of this.#receivers) {
                receiver(message);
            }
        }
    }
    core.MessageBus = MessageBus;
})(core || (core = {}));
/**
 * @file      Stylesheet_.ts
 * @brief     File contains the `Stylesheet_`.
 * @details
 * ~
 * @author    Jonas
 * @date      November 2023
 * @copyright Copyright (c) 2023
 */
var core;
(function (core) {
    class Stylesheet_ {
        #style; /**< DOM element, a flavor of HTMLElement. */
        #sheet; /**< Wrapper for CSS style sheets (contains CSS rules). Is not related to the DOM. */
        #root; /**< Root node of the HTML document. */
        /**
         * Initialize stylesheet.
         * @param index -1 to create a new stylesheet or the index of an existing stylesheet.
         */
        constructor(index = -1) {
            this.#root = document.documentElement;
            if (index == -1) {
                this.#style = document.createElement("style");
                document.head.appendChild(this.#style);
                this.#sheet = this.#style.sheet; // Order matters: Append first style to the head!
            }
            else {
                this.#style = null;
                this.#sheet = document.styleSheets[index];
            }
        }
        /**
         * Add a rule to the CSS style sheet.
         *
         * A rule is one block: `h1 { color: red; }`.
         *
         * @param value The rule which should be added to the back.
         */
        add(value) {
            this.#sheet?.insertRule(value, this.#sheet.cssRules.length); // position rule to the end
        }
        /**
         * Import another CSS file.
         * @param filepath Relative filepath to a CSS file.
         */
        import(filepath) {
            this.#sheet?.insertRule("@import url(" + filepath + ");", 0); // position rule to the front
        }
        /**
         * Change a property from the `root` element.
         *
         * A property is a css variable: `:root { --primary-color: red; }`.
         *
         * @param name Name of the property in `root`.
         * @param value Value of the property in `root`.
         */
        setProperty(name, value) {
            this.#root.style.setProperty(name, value);
        }
    }
    core.Stylesheet_ = Stylesheet_;
})(core || (core = {}));
/**
 * @file      TextAssembleAnimation.ts
 * @brief     File contains the `TextAssembleAnimation`.
 * @details
 * ~
 * @author    Jonas
 * @date      November 2023
 * @copyright Copyright (c) 2023
 */
var core;
(function (core) {
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
    class TextAssembleAnimation {
        #text; /**< Text which gets displayed. */
        #htmlTextContainer; /**< Container: cointains all text div elements. */
        #stylesheet; /**< Stylesheet to which the animation and all is added. */
        #htmlTextDiv; /**< Have a text div in the page flow. Everything is positioned absolute, but this gives the container some size. */
        #textCount; /**< Count of texts stacked on each other (1 text == 1 part). */
        #duration_inS; /**< How long the animation takes in seconds. */
        #startDelay_inS; /**< How long till the animation is played in seconds. */
        #color; /**< Color of the text. */
        #originalCSSFontSize; /**< CSS font size. For example: "1rem" */
        #minScreenPadding_inPC; /**< Minimum allowed screen padding. Text will shrink to fit. */
        constructor() {
            this.#stylesheet = new core.Stylesheet_();
            this.#htmlTextDiv = null;
            this.#text = "";
            this.#textCount = 1;
            this.#duration_inS = 5;
            this.#startDelay_inS = 0;
            this.#color = "black";
            this.#originalCSSFontSize = "1rem";
            this.#minScreenPadding_inPC = 0;
            this.#htmlTextContainer = null;
        }
        /**
         * Initialize the animated text.
         *
         * @param config Configuration for the text assemble animation.
         */
        init(config) {
            // [1] Create HTML
            this.#text = config.text;
            this.#color = config.color;
            this.#originalCSSFontSize = config.cssFontSize;
            this.#minScreenPadding_inPC = config.minScreenPadding_inPC;
            this.#textCount = config.textPartCount;
            this.#duration_inS = config.duration_inS;
            this.#startDelay_inS = config.startDelay_inS;
            this.#createHTML();
            let isGradientColor = core.isGradientColor(this.#color);
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
            addEventListener("resize", ((event) => { this.#resize(); }).bind(this));
        }
        /**
         * Play the animation.
         */
        play() {
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
            let delay = (this.#startDelay_inS + this.#duration_inS) * 1000;
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
        #createHTML() {
            // [1] Create text assembler
            this.#htmlTextContainer = core.createDiv(["textAssembleAnimationWrapper"]);
            for (let i = 0; i < this.#textCount; ++i) {
                this.#htmlTextContainer.appendChild(core.createTextDiv(this.#text, ["text", "hide"]));
            }
            //this.#htmlTextContainer.children[0].classList.remove("hide");
            // [2] Create real (invisible) text
            /*
                Why? All childs have position absolute, so the real size of `textAssembleAnimationWrapper` is actually 0.
                This causes problems when positioning stuff, so we define a fixed size, by having an invisible text as a
                element in the page flow.
            */
            this.#htmlTextDiv = core.createTextDiv(this.#text, []);
            this.#htmlTextDiv.style.opacity = "1";
            this.#htmlTextContainer.appendChild(this.#htmlTextDiv);
        }
        /**
         * Resize text.
         *
         * This should be called if the screen changes size.
         */
        #resize() {
            let isDOMElement = document.body.contains(this.#htmlTextContainer);
            if (this.#htmlTextContainer)
                // Useful if the screen got smaller / text got smaller and then screen got larger. With this text will enlarge as well.
                this.#htmlTextContainer.style.fontSize = this.#originalCSSFontSize;
            if (!isDOMElement) {
                core.dom_addHiddenElement(this.#htmlTextContainer); // DOM is required for `getHTMLElementFont`.
            }
            let cssFont = core.getHTMLElementFont(this.#htmlTextContainer?.children[0]);
            let optimalCSSFont = "";
            {
                let optimalCSSFontSize = core.clampFontSizeToScreenPadding(this.#text, cssFont, this.#minScreenPadding_inPC);
                optimalCSSFont = core.setCSSFontSize(cssFont, optimalCSSFontSize);
            }
            if (this.#htmlTextContainer && core.cmpCSSFont(cssFont, optimalCSSFont) != 0) {
                this.#htmlTextContainer.style.fontSize = core.getCSSFontSize(optimalCSSFont);
            }
            if (!isDOMElement) {
                core.dom_removeHiddenElement(this.#htmlTextContainer, "flex"); // remove element from the DOM.
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
        #createCSSTextParts() {
            let partCount = new core.Vec2(Math.sqrt(this.#textCount), Math.sqrt(this.#textCount)); // e.g. 49 parts => 7x7 grid
            // [1] Calculate text dimension
            core.dom_addHiddenElement(this.#htmlTextContainer); // DOM is required for `getHTMLElementFont`.
            let fontStr = core.getHTMLElementFont(this.#htmlTextContainer?.children[0]); // calculate new font
            core.dom_removeHiddenElement(this.#htmlTextContainer, "flex"); // remove element from the DOM.
            let textWidth = core.getTextWidth(this.#text, fontStr); // Get style of the children.
            // TODO: Font width is too small with the "Economica" font: A bit is cut off...
            let textHeight = (() => {
                /*
                    `getHTMLElementFont`: Uses `getComputedStyle` to get font bounds.
                    `getFontHeight`:      Uses a canvas to calculate the font height.
                    Why considering `getHTMLElementFont` to get the text height?
                    Using `getFontHeight` can result in a larger value than using `getHTMLElementFont`, but `getFontHeight` returns the
                    bounds of what is possible. Strange, right? I use what is bigger, because otherwise text is cut off for some fonts
                    (Economica).
                */
                let fontHeight = Number(core.getCSSFontSize(fontStr).replace(/\D/g, "")); // (1) get font size, (2) remove all non-number chars, (3) convert to number
                let textHeight = core.getFontHeight(fontStr); // Get style of the children.
                return fontHeight > textHeight ? fontHeight : textHeight; // return bigger size
            })();
            // Debug info:
            // font size can be 160px, but this can result in a text height of 195px. There is unnecessary much free space.
            //console.log("Text width:  " + textWidth);
            //console.log("Text height: " + textHeight);
            //console.log("Font:        " + fontStr);
            // [2] Iterate over each text: cut it and add animation
            for (let i = 0; i < this.#textCount; ++i) /* `i` has to start from 0 for modulo to work. */ {
                let current = new core.Vec2(// current row and column index
                i % partCount.x, // Index to an element in the row.
                Math.floor(i / partCount.x) // Index to an element in the column.
                );
                let partSize = new core.Vec2(// width and height of a each text part
                textWidth / partCount.x, textHeight / partCount.y);
                let partPos = new core.Vec2(// Position of each text part. Is relative to the text position => (0,0) == left-top.
                current.x * partSize.x, current.y * partSize.y);
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
        #createCSSKeyframes() {
            for (let i = 0; i < this.#textCount; ++i) {
                /* The higher the numbers, the more random things are. */
                let rotateX = core.random(-500, 1000); /* Larger range: Does increase speed */
                let rotateY = core.random(-500, 1000); /* Larger range: Does increase speed */
                let rotateZ = core.random(-500, 1000); /* Larger range: Does increase speed */
                let deph = core.random(-5000, 10000); /* Larger range: Does not increase speed, but range */
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
        getHTML() {
            return this.#htmlTextContainer;
        }
    }
    core.TextAssembleAnimation = TextAssembleAnimation;
})(core || (core = {}));
/**
 * @file      TextMoveAnimation.ts
 * @brief     File contains the `TextMoveAnimation`.
 * @details
 * ~
 * @author    Jonas
 * @date      November 2023
 * @copyright Copyright (c) 2023
 */
var core;
(function (core) {
    /**
     * Apply the "text move" animation to a text.
     */
    class TextMoveAnimation {
        #text; /**< Text which gets displayed. */
        #htmlTextDiv; /**< HTML text div element. */
        #stylesheet; /**< Stylesheet to which the animation and all is added. */
        #duration_inS; /**< How long the animation takes in seconds. */
        #startDelay_inS; /**< How long till the animation is played in seconds. */
        #color; /**< Color of the text. */
        #originalCSSFontSize; /**< CSS font size. For example: "1rem" */
        #minScreenPadding_inPC; /**< Minimum allowed screen padding. Text will shrink to fit. */
        #direction; /**< Direction from which text should move. "left" or "right" is allowed. */
        constructor() {
            this.#text = "";
            this.#htmlTextDiv = null;
            this.#stylesheet = new core.Stylesheet_();
            this.#duration_inS = 5;
            this.#startDelay_inS = 0;
            this.#color = "black";
            this.#originalCSSFontSize = "1rem";
            this.#minScreenPadding_inPC = 0;
            this.#direction = "left";
        }
        /**
         * Initialize the animated text.
         * @param config Configuration for the text assemble animation.
         */
        init(config) {
            // [1] Init
            this.#text = config.text;
            this.#color = config.color;
            this.#originalCSSFontSize = config.cssFontSize;
            this.#minScreenPadding_inPC = config.minScreenPadding_inPC;
            this.#duration_inS = config.duration_inS;
            this.#startDelay_inS = config.startDelay_inS;
            this.#direction = config.direction;
            this.#htmlTextDiv = core.createTextDiv(this.#text, ["moveAnimationText"]);
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
                    transform: translate(${this.#direction == "left" ? -200 : 200}%, 0%);
                }
        
                100% {
                    opacity: 1;
                    transform: translate(0%, 0%);
                }
            }`);
            this.#resize();
            addEventListener("resize", ((event) => { this.#resize(); }).bind(this));
        }
        /**
         * Play the animation.
         */
        play() {
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
        #resize() {
            let isDOMElement = document.body.contains(this.#htmlTextDiv);
            if (this.#htmlTextDiv)
                // Useful if the screen got smaller / text got smaller and then screen got larger. With this text will enlarge as well.
                this.#htmlTextDiv.style.fontSize = this.#originalCSSFontSize;
            if (!isDOMElement) {
                core.dom_addHiddenElement(this.#htmlTextDiv); // DOM is required for `getHTMLElementFont`.
            }
            let cssFont = core.getHTMLElementFont(this.#htmlTextDiv);
            let optimalCSSFont = "";
            {
                let optimalCSSFontSize = core.clampFontSizeToScreenPadding(this.#text, cssFont, this.#minScreenPadding_inPC);
                optimalCSSFont = core.setCSSFontSize(cssFont, optimalCSSFontSize);
            }
            if (this.#htmlTextDiv && core.cmpCSSFont(cssFont, optimalCSSFont) != 0) {
                this.#htmlTextDiv.style.fontSize = core.getCSSFontSize(optimalCSSFont);
            }
            if (!isDOMElement) {
                core.dom_removeHiddenElement(this.#htmlTextDiv, "flex"); // remove element from the DOM.
            }
        }
        resize(cssFontSize) {
            if (this.#htmlTextDiv) {
                this.#htmlTextDiv.style.fontSize = cssFontSize;
            }
        }
        /**
         * Get the base HTML element of the "text move" animation. Add this somewhere to the DOM.
         * @returns Base HTML element.
         */
        getHTML() {
            return this.#htmlTextDiv;
        }
    }
    core.TextMoveAnimation = TextMoveAnimation;
})(core || (core = {}));
/**
 * @file      Tools.ts
 * @brief     File contains tools / little helper functions.
 * @details
 * ~
 * @author    Jonas
 * @date      November 2023
 * @copyright Copyright (c) 2023
 */
var core;
(function (core) {
    var CANVAS = document.createElement("canvas"); /**< save performance */
    var NEXT_UUID = 0; /**< Stores the next free UUID. */
    /**
     * Assert the handed condition and throw an error if it is false.
     * @param condition Boolean condition which should be checked.
     * @param message Output message if an error occures.
     */
    function assert(condition, message) {
        if (!condition) {
            throw new Error(message || "Assertion failed!");
        }
    }
    core.assert = assert;
    /**
     * Get the next free universal unique identifier.
     * @returns Next free UUID.
     */
    function getUUID() {
        return NEXT_UUID++;
    }
    core.getUUID = getUUID;
    /**
     * Check if all source flags do exist inside `flags`.
     * @param sourceFlags Container with all flags that should be checked.
     * @param flags Contains multiple bit flags.
     * @retval true All source flags from the container do exist inside `flags`.
     */
    function containsFlags(sourceFlags, flags) {
        let foundFlags = 0;
        for (const flag of sourceFlags)
            if ((flag & flags) == flag) {
                foundFlags |= flag;
            }
        if (foundFlags == flags) {
            return true;
        }
        return false;
    }
    core.containsFlags = containsFlags;
    /**
     * Get a random number between a minimum and maximum, where min and max are inclusive.
     *
     * `Math.random()` generates a number between 0 and 1.
     *
     * @param min Minimum random number (inclusive).
     * @param max Maximum random number (inclusive).
     * @returns Random number in the range of min to max.
     */
    function random(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    core.random = random;
    function isGradientColor(cssColorValue) {
        if (cssColorValue.includes("linear-gradient") || cssColorValue.includes("radial-gradient") ||
            cssColorValue.includes("conic-gradient")) {
            return true;
        }
        return false;
    }
    core.isGradientColor = isGradientColor;
    /**
     * Get the width of the handed text in the handed font.
     *
     * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
     *
     * @param text The text to be rendered.
     * @param font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
     * @returns Width of the text in the handed font.
     *
     * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
     * @see https://stackoverflow.com/a/21015393
     */
    function getTextWidth(text, font) {
        let context = CANVAS.getContext("2d");
        context.font = font; // font is set with string like this: "bold 48px serif".
        const metrics = context.measureText(text);
        return metrics.width;
    }
    core.getTextWidth = getTextWidth;
    /**
     * Get the actual height of the handed text in the handed font.
     *
     * "Font height" is a constant value and is the general height of the font. "Actual height" is specific to the
     * text.
     *
     * @param text Text which height should be measured.
     * @param font Font in which the text should be.
     * @returns Actual height of the text in the handed font.
     */
    function getTextHeight(text, font) {
        let context = CANVAS.getContext("2d");
        context.font = font; // font is set with string like this: "bold 48px serif".
        const metrics = context.measureText(text);
        return metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    }
    core.getTextHeight = getTextHeight;
    /**
     * Get the "font height" of the handed font.
     *
     * "Font height" is a constant value and is the general height of the font. "Actual height" is specific to the
     * text.
     *
     * @param font Font for which the height should be measured.
     * @returns Height of the font.
     */
    function getFontHeight(font) {
        let context = CANVAS.getContext("2d");
        context.font = font; // font is set with string like this: "bold 48px serif".
        const metrics = context.measureText("A");
        return metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
    }
    core.getFontHeight = getFontHeight;
    /**
     * Get the font of the handed html element as a string which can be used in `getTextWidth()`.
     *
     * A style can only be computed from html elements that are added to the DOM.
     *
     * **Computed Style**
     * Using `getComputedStyle` is neccessary, because `htmlElement.style` returns the styles directly
     * placed on it. It's not the style from the stylesheet.
     * The computed style is the style used on the element after all styling sources have been applied.
     * Style sources: external and internal style sheets, inherited styles, and browser default styles.
     *
     * @param htmlElement HTML element of which the font should be returned.
     * @returns HTML elements font as string (contains: weight, size, font name)
     */
    function getHTMLElementFont(htmlElement = document.body) {
        const fontWeight = getComputedStyle(htmlElement).fontWeight || 'normal';
        const fontSize = getComputedStyle(htmlElement).fontSize || '16px';
        const fontFamily = getComputedStyle(htmlElement).fontFamily || 'Times New Roman';
        return `${fontWeight} ${fontSize} ${fontFamily}`;
    }
    core.getHTMLElementFont = getHTMLElementFont;
    /**
     * Clamp font size, so that it fits into the screen, which takes the handed padding into consideration.
     * @param text Text which must be clamped to the screens bound.
     * @param font The font string of the text. For example: "bold 48px serif". Can be received by `getHTMLElementFont`.
     * @param size_inScreenPC Text size in screen pixel percentage.
     * @returns The css font size. For example: "1rem", "16px"
     */
    function clampFontSizeToScreenPadding(text, font, minScreenPadding_inPC) {
        // [1] Set fixed values
        let windowSize = new core.Vec2(document.documentElement.clientWidth, document.documentElement.clientHeight); // in pixel; see: https://dmitripavlutin.com/screen-window-page-sizes/
        let windowSize_pvalue = (100 - minScreenPadding_inPC) / 100; // percent value
        let availableWindowSize = new core.Vec2(windowSize.x * windowSize_pvalue, windowSize.y * windowSize_pvalue);
        // [2] Check if text fits into the available space
        {
            let textSize = new core.Vec2(getTextWidth(text, font), getFontHeight(font));
            //console.log("Old font size: " + textSize.x + " x " + textSize.y);
            if (textSize.x <= availableWindowSize.x && textSize.y <= availableWindowSize.y) {
                return getCSSFontSize(font); // We are good - do nothing.
            }
        }
        // [3] Calculate new font size
        // ..font size is to big - we need to find the largest possible font size.
        let currentFontSize_inRem = 0;
        let textSize = new core.Vec2(0, 0);
        let nextTextSize = new core.Vec2(0, 0);
        while (nextTextSize.x < availableWindowSize.x && nextTextSize.y < availableWindowSize.y) {
            ++currentFontSize_inRem;
            textSize.x = nextTextSize.x; // You may not do `textSize = nextTextSize`, because this creates an alias and the size gets too large.
            textSize.y = nextTextSize.y;
            let newFont = setCSSFontSize(font, currentFontSize_inRem + "rem");
            nextTextSize.x = getTextWidth(text, newFont);
            nextTextSize.y = getFontHeight(newFont);
        }
        // Debug:
        //console.log("New font size: " + textSize.x + " x " + textSize.y);
        //console.log(windowSize);
        //console.log(availableWindowSize);
        return currentFontSize_inRem + "rem"; // Between number and unit may not be a space!
    }
    core.clampFontSizeToScreenPadding = clampFontSizeToScreenPadding;
    /**
     * Compare font size of two css font strings.
     *
     * CSS font strings look like this: "bold 48px serif".
     *
     * @param a CSS font string.
     * @param b CSS font string.
     * @retval -1 a > b
     * @retval 0  a == b
     * @retval 1  b > a
     */
    function cmpCSSFont(a, b) {
        let text = "A";
        let aPixelCount = Math.floor(getTextWidth(text, a)) * Math.floor(getTextHeight(text, a)); // remove float values
        let bPixelCount = Math.floor(getTextWidth(text, b)) * Math.floor(getTextHeight(text, b));
        if (aPixelCount > bPixelCount)
            return -1;
        if (bPixelCount > aPixelCount)
            return 1;
        return 0;
    }
    core.cmpCSSFont = cmpCSSFont;
    /**
     * Get the size of the handed font string.
     * @param cssFont CSS font string - looks like this: "bold 48px serif".
     * @returns Size of the handed font string.
     * @see getHTMLElementFont
     * @see getTextWidth
     * @see getTextHeight
     * @see getFontHeight
     */
    function getCSSFontSize(cssFont) {
        return cssFont.split(" ")[1];
    }
    core.getCSSFontSize = getCSSFontSize;
    /**
     * Set the CSS font size on a temporare value and return it.
     * @param cssFont CSS font string in which the size should be changed.
     * @param cssFontSize CSS font size which should be inserted.
     * @returns New css font string with the handed size.
     */
    function setCSSFontSize(cssFont, cssFontSize) {
        let cssFontArr = cssFont.split(" ");
        cssFontArr[1] = cssFontSize; // `.`: Match any char; `*`: Match previous token unlimited times; `g`: All matches (don't return after first match)
        let newCSSFont = cssFontArr.join(" ");
        return newCSSFont;
    }
    core.setCSSFontSize = setCSSFontSize;
    /**
     * Adds the handed HTML element to the DOM and hides it by setting its css display to "none".
     *
     * Between `dom_addHiddenElement` and `dom_removeHiddenElement` the `style.display` property
     * may not be modified. All changes would be removed by calling `dom_removeHiddenElement`.
     *
     * This is useful if you have to add yout HTML element to the DOM, because some functions /
     * calculations require this, but you not want it there visibly. After you have done your
     * stuff you should call `dom_removeHiddenElement` to remove your element.
     *
     * A automatically set member like `__dom_removeHiddenElement_display` to cache the display
     * value can not be set, because `htmlElement.style.display` returns only the inline style
     * value - not the stylesheet value. To get the final value `getComputedStyle` is
     * required, but this requires the HTML element to be on the DOM. Before adding the
     * element to the DOM, we have to set the display to none, so this not a option.
     *
     * @param htmlElement The html element which should be added to teh DOM.
     */
    function dom_addHiddenElement(htmlElement) {
        if (htmlElement) {
            htmlElement.style.display = "none";
            document.body.appendChild(htmlElement);
        }
    }
    core.dom_addHiddenElement = dom_addHiddenElement;
    /**
     * Remove a HTML element from the DOM which was added with `dom_addHiddenElement`.
     * @param htmlElement HTML element which should be removed from the DOM.
     */
    function dom_removeHiddenElement(htmlElement, cssDisplayValue) {
        assert(htmlElement?.style.display == "none");
        if (htmlElement) {
            htmlElement.style.display = cssDisplayValue;
            document.body.removeChild(htmlElement);
        }
    }
    core.dom_removeHiddenElement = dom_removeHiddenElement;
    /**
     * Get a json object from the handed file.
     * @param file Json file
     * @returns Object or Array containing all json values from the file.
     */
    function getJson(file) {
        // Note: If you return a Promise, then this function is automatically 'async' - no need for this keyword.
        return new Promise((resolve, reject) => {
            try {
                let reader = new FileReader();
                reader.readAsText(file);
                reader.onload = function (e) {
                    let data = e.target?.result;
                    let jsonData = JSON.parse(data);
                    // The parameter of 'resolve' is this functions return value if used like this: 'let jsonData = await getJsonFromExcelFile(files[0]);'.
                    resolve(jsonData);
                };
            }
            catch (e) {
                reject(e); // return 'e' on error..
            }
        });
    }
    core.getJson = getJson;
    /**
     * '.outerHTML' is not cross browser compatible, instead use this function.
     * Be aware that this makes a deep copy and is expensive on large DOM trees.
     * See: https://stackoverflow.com/questions/1763479/how-to-get-the-html-for-a-dom-element-in-javascript
     */
    function outerHTML(element) {
        let container = document.createElement("div");
        container.appendChild(element.cloneNode(true));
        return container.innerHTML;
    }
    core.outerHTML = outerHTML;
    /**
     * Create a div with classes.
     * @param classList Classes that should be added to the created div.
     * @returns The create div.
     */
    function createDiv(classList) {
        // [1] Create text div
        let htmlDiv = document.createElement("div");
        // [2] Add classes
        for (const class_ of classList) {
            htmlDiv.classList.add(class_);
        }
        return htmlDiv;
    }
    core.createDiv = createDiv;
    /**
     * Create a HTML div element which has the handed classes and contains the handed text.
     * @param text Text which should be added to the created div.
     * @param classList Classes that should be added to the created div.
     * @returns The create div.
     */
    function createTextDiv(text, classList) {
        // [1] Create text div
        let htmlTextDiv = createDiv(classList);
        // [3] Append text
        let htmlText = document.createTextNode(text);
        htmlTextDiv.appendChild(htmlText);
        return htmlTextDiv;
    }
    core.createTextDiv = createTextDiv;
})(core || (core = {}));
/**
 * @file      Vec2.ts
 * @brief     File contains `Vec2`.
 * @details
 * ~
 * @author    Jonas
 * @date      November 2023
 * @copyright Copyright (c) 2023
 */
var core;
(function (core) {
    /**
     * 2D Vector which has x and y.
     *
     * Can be used to describe multiple things, for exmaple position, movement and size.
     */
    class Vec2 {
        x; /**< X axis value. */
        y; /**< Y axis value. */
        /**
         * Initialize the 2D vector.
         * @param x X axis value.
         * @param y Y axis value.
         */
        constructor(x, y) {
            this.x = x ? x : 0;
            this.y = y ? y : 0;
        }
    }
    core.Vec2 = Vec2;
})(core || (core = {}));
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
class App {
    #htmlApp; /**< HTML element to which everything is added. */
    #messageBus; /**< Message bus to connect app systems. */
    #name; /**< Name which should get displayed. */
    /**
     * Inizialize and start the app.
     */
    constructor() {
        this.#htmlApp = document.getElementById("app");
        this.#messageBus = new core.MessageBus();
        this.#name = new app.Name();
        this.#name.init(config, this.#htmlApp);
    }
}
let app_ = new App();
/**
 * @file      Timer.ts
 * @brief     File contains the `Timer`.
 * @details
 * ~
 * @author    Jonas
 * @date      November 2023
 * @copyright Copyright (c) 2023
 */
var core;
(function (core) {
    /**
     * Timer which starts automatically on creation.
     *
     * Note: A clock just shows the current time (`clock::now()`). A timer does not show the current time,
     * but measures how much time elapsed.
     */
    class Timer {
        #startTP; /**< Start timepoint. Determines elapsed time. */
        #stoppedTime; /**< Used when timer is paused, to store its elapsed time till then. @see `pause()` */
        #STOP_DURATION; /**< Flag indicating that the timer is stopped. @see `stop()` */
        constructor() {
            this.#startTP = this.#now();
            this.#stoppedTime = 0;
            this.#STOP_DURATION = -1;
        }
        /**
         * Restart the timer. This is the default behaviour when a `Timer` is created.
         * @return Elapsed time
         */
        restart() {
            let time = this.getElapsedTime();
            this.#startTP = this.#now();
            this.#stoppedTime = 0;
            return time;
        }
        /**
         * Resume paused timer.
         */
        resume() {
            if (this.isPaused()) {
                this.#startTP = this.#now() - this.#stoppedTime;
                this.#stoppedTime = 0;
            }
        }
        /**
         * Pause timer, so that its elapsed time stored and it can be resumed.
         */
        pause() {
            if (!this.isPaused() && !this.isStopped()) {
                this.#stoppedTime = this.#now() - this.#startTP;
            }
        }
        /**
         * Stop timer: Time is 0ns - use `restart()` to start timer.
         */
        stop() {
            this.#stoppedTime = this.#STOP_DURATION;
        }
        /**
         * Add time to the timer.
         * Has no effect on stopped timer.
         * @param time Time to add to the timer.
         */
        add(time) {
            if (this.isStopped()) {
                return;
            }
            if (this.isPaused()) {
                if (time < 0 && this.#stoppedTime < Math.abs(time)) {
                    this.#stoppedTime = 0;
                }
                else {
                    this.#stoppedTime -= time;
                }
            }
            else {
                this.#startTP -= time;
            }
        }
        /**
         * Get elapsed time.
         * @return Elapsed time.
         */
        getElapsedTime() {
            if (this.isStopped())
                return 0;
            if (this.isPaused())
                return this.#stoppedTime;
            return this.#now() - this.#startTP;
        }
        /**
         * Check if timer is paused.
         * @retval true Timer is paused.
         * @retval false Timer is not paused.
         */
        isPaused() {
            return this.#stoppedTime > 0;
        }
        /**
         * Check if timer is stopped.
         * @retval true Timer is stopped.
         * @retval false Timer is not stopped.
         */
        isStopped() {
            return this.#stoppedTime == this.#STOP_DURATION;
        }
        /**
         * Get the current timepoint.
         * `Date.now()`: returns the number of milliseconds elapsed since 1970.
         * `performance.now()`: returns a high resolution timestamp in milliseconds.
         * @returns Current timepoint in milliseconds.
         */
        #now() {
            return performance.now(); // or Date.now()
        }
    }
    core.Timer = Timer;
})(core || (core = {}));
//# sourceMappingURL=bundle.js.map