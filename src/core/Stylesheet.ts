/**
 * @file      Stylesheet_.ts
 * @brief     File contains the `Stylesheet_`.
 * @details
 * ~
 * @author    Jonas
 * @date      November 2023
 * @copyright Copyright (c) 2023
 */

namespace core
{
    export class Stylesheet_
    {
        #style: HTMLStyleElement | null; /**< DOM element, a flavor of HTMLElement. */
        #sheet: CSSStyleSheet;           /**< Wrapper for CSS style sheets (contains CSS rules). Is not related to the DOM. */
        #root: HTMLElement;              /**< Root node of the HTML document. */

        /**
         * Initialize stylesheet.
         * @param index -1 to create a new stylesheet or the index of an existing stylesheet.
         */
        constructor(index = -1)
        {
            this.#root = document.documentElement;

            if (index == -1) {
                this.#style = document.createElement("style");
                document.head.appendChild(this.#style);
                this.#sheet = <CSSStyleSheet>this.#style.sheet; // Order matters: Append first style to the head!
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
        add(value: string)
        {
            this.#sheet?.insertRule(value, this.#sheet.cssRules.length); // position rule to the end
        }

        /**
         * Import another CSS file.
         * @param filepath Relative filepath to a CSS file.
         */
        import(filepath: string)
        {
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
        setProperty(name: string, value: string)
        {
            this.#root.style.setProperty(name, value);
        }
    }
}