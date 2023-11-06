/**
 * @file      Tools.ts
 * @brief     File contains tools / little helper functions.
 * @details
 * ~
 * @author    Jonas
 * @date      November 2023
 * @copyright Copyright (c) 2023
 */

namespace core
{
    var CANVAS: HTMLCanvasElement = document.createElement("canvas"); /**< save performance */
    var NEXT_UUID = 0; /**< Stores the next free UUID. */

    /**
     * Assert the handed condition and throw an error if it is false.
     * @param condition Boolean condition which should be checked.
     * @param message Output message if an error occures.
     */
    export function assert(condition: boolean, message?: string): void
    {
        if (!condition) {
            throw new Error(message || "Assertion failed!");
        }
    }

    /**
     * Get the next free universal unique identifier.
     * @returns Next free UUID.
     */
    export function getUUID(): number
    {
        return NEXT_UUID++;
    }

    /**
     * Check if all source flags do exist inside `flags`.
     * @param sourceFlags Container with all flags that should be checked.
     * @param flags Contains multiple bit flags.
     * @retval true All source flags from the container do exist inside `flags`.
     */
    export function containsFlags(sourceFlags: number[], flags: number): boolean
    {
        let foundFlags: number = 0;
        for (const flag of sourceFlags)
            if ((flag & flags) == flag) {
                foundFlags |= flag;
            }
        if (foundFlags == flags) {
            return true;
        }
        return false;
    }

    /**
     * Get a random number between a minimum and maximum, where min and max are inclusive.
     * 
     * `Math.random()` generates a number between 0 and 1.
     * 
     * @param min Minimum random number (inclusive).
     * @param max Maximum random number (inclusive).
     * @returns Random number in the range of min to max.
     */
    export function random(min: number, max: number): number 
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    export function isGradientColor(cssColorValue: string): boolean
    {
        if (cssColorValue.includes("linear-gradient") || cssColorValue.includes("radial-gradient") || 
            cssColorValue.includes("conic-gradient")) {
            return true;
        }
        return false;
    }

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
    export function getTextWidth(text: string, font: string) : number
    {
        let context: CanvasRenderingContext2D = <CanvasRenderingContext2D>CANVAS.getContext("2d");
        context.font = font; // font is set with string like this: "bold 48px serif".
        const metrics = context.measureText(text);
        return metrics.width;
    }

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
    export function getTextHeight(text: string, font: string) : number
    {
        let context: CanvasRenderingContext2D = <CanvasRenderingContext2D>CANVAS.getContext("2d");
        context.font = font; // font is set with string like this: "bold 48px serif".
        const metrics = context.measureText(text);
        return metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    }

    /**
     * Get the "font height" of the handed font.
     * 
     * "Font height" is a constant value and is the general height of the font. "Actual height" is specific to the
     * text.
     * 
     * @param font Font for which the height should be measured.
     * @returns Height of the font.
     */
    export function getFontHeight(font: string) : number
    {
        let context: CanvasRenderingContext2D = <CanvasRenderingContext2D>CANVAS.getContext("2d");
        context.font = font; // font is set with string like this: "bold 48px serif".
        const metrics = context.measureText("A");
        return metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
    }
  
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
    export function getHTMLElementFont(htmlElement: HTMLElement = document.body): string
    {
        const fontWeight = getComputedStyle(htmlElement).fontWeight || 'normal';
        const fontSize   = getComputedStyle(htmlElement).fontSize   || '16px';
        const fontFamily = getComputedStyle(htmlElement).fontFamily || 'Times New Roman';

        return `${fontWeight} ${fontSize} ${fontFamily}`;
    }

    /**
     * Clamp font size, so that it fits into the screen, which takes the handed padding into consideration.
     * @param text Text which must be clamped to the screens bound.
     * @param font The font string of the text. For example: "bold 48px serif". Can be received by `getHTMLElementFont`.
     * @param size_inScreenPC Text size in screen pixel percentage. 
     * @returns The css font size. For example: "1rem", "16px"
     */
    export function clampFontSizeToScreenPadding(text: string, font: string, minScreenPadding_inPC: number): string
    {
        // [1] Set fixed values
        let windowSize: Vec2 = new Vec2(document.documentElement.clientWidth, document.documentElement.clientHeight); // in pixel; see: https://dmitripavlutin.com/screen-window-page-sizes/
        let windowSize_pvalue = (100 - minScreenPadding_inPC) / 100; // percent value
        let availableWindowSize: Vec2 = new Vec2(
            windowSize.x * windowSize_pvalue,
            windowSize.y * windowSize_pvalue
        );

        // [2] Check if text fits into the available space
        {
            let textSize: Vec2 = new Vec2(getTextWidth(text, font), getFontHeight(font));
            //console.log("Old font size: " + textSize.x + " x " + textSize.y);
            if (textSize.x <= availableWindowSize.x && textSize.y <= availableWindowSize.y) {
                return getCSSFontSize(font); // We are good - do nothing.
            }
        }

        // [3] Calculate new font size
        // ..font size is to big - we need to find the largest possible font size.
        let currentFontSize_inRem: number = 0;
        let textSize:              Vec2   = new Vec2(0, 0);
        let nextTextSize:          Vec2   = new Vec2(0, 0);
        while (nextTextSize.x < availableWindowSize.x && nextTextSize.y < availableWindowSize.y) {
            ++currentFontSize_inRem;
            textSize.x = nextTextSize.x; // You may not do `textSize = nextTextSize`, because this creates an alias and the size gets too large.
            textSize.y = nextTextSize.y;

            let newFont: string = setCSSFontSize(font, currentFontSize_inRem + "rem");
            nextTextSize.x = getTextWidth(text, newFont);
            nextTextSize.y = getFontHeight(newFont);
        }

        // Debug:
        //console.log("New font size: " + textSize.x + " x " + textSize.y);
        //console.log(windowSize);
        //console.log(availableWindowSize);

        return currentFontSize_inRem + "rem"; // Between number and unit may not be a space!
    }

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
    export function cmpCSSFont(a: string, b: string): number
    {
        let text = "A";
        let aPixelCount = Math.floor(getTextWidth(text, a)) * Math.floor(getTextHeight(text, a)); // remove float values
        let bPixelCount = Math.floor(getTextWidth(text, b)) * Math.floor(getTextHeight(text, b));
        if (aPixelCount > bPixelCount) return -1;
        if (bPixelCount > aPixelCount) return 1;
        return 0;
    }

    /**
     * Get the size of the handed font string.
     * @param cssFont CSS font string - looks like this: "bold 48px serif". 
     * @returns Size of the handed font string.
     * @see getHTMLElementFont
     * @see getTextWidth
     * @see getTextHeight
     * @see getFontHeight
     */
    export function getCSSFontSize(cssFont: string): string
    {
        return cssFont.split(" ")[1];
    }

    /**
     * Set the CSS font size on a temporare value and return it.
     * @param cssFont CSS font string in which the size should be changed.
     * @param cssFontSize CSS font size which should be inserted.
     * @returns New css font string with the handed size.
     */
    export function setCSSFontSize(cssFont: string, cssFontSize: string): string
    {
        let cssFontArr = cssFont.split(" ");
        cssFontArr[1] = cssFontSize; // `.`: Match any char; `*`: Match previous token unlimited times; `g`: All matches (don't return after first match)
        let newCSSFont = cssFontArr.join(" ");
        return newCSSFont;
    }

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
    export function dom_addHiddenElement(htmlElement: HTMLElement | null)
    {
        if (htmlElement) {
            htmlElement.style.display = "none";
            document.body.appendChild(htmlElement);
        }
    }

    /**
     * Remove a HTML element from the DOM which was added with `dom_addHiddenElement`.
     * @param htmlElement HTML element which should be removed from the DOM.
     */
    export function dom_removeHiddenElement(htmlElement: HTMLElement | null, cssDisplayValue: string)
    {
        assert(htmlElement?.style.display == "none");

        if (htmlElement) {
            htmlElement.style.display = cssDisplayValue;
            document.body.removeChild(htmlElement);
        }
    }

    /**
     * Get a json object from the handed file.
     * @param file Json file
     * @returns Object or Array containing all json values from the file.
     */
    export function getJson(file: Blob): Promise<unknown>
    {
        // Note: If you return a Promise, then this function is automatically 'async' - no need for this keyword.

        return new Promise((resolve, reject) => {
            try {
                let reader: FileReader = new FileReader();
                reader.readAsText(file);
                reader.onload = function(e: ProgressEvent<FileReader>) {
                    let data: string = <string>e.target?.result;
                    let jsonData: any = JSON.parse(data);

                    // The parameter of 'resolve' is this functions return value if used like this: 'let jsonData = await getJsonFromExcelFile(files[0]);'.
                    resolve(jsonData);
                }
            }
            catch(e) {
                reject(e); // return 'e' on error..
            }
        });
    }

    /**
     * '.outerHTML' is not cross browser compatible, instead use this function.
     * Be aware that this makes a deep copy and is expensive on large DOM trees.
     * See: https://stackoverflow.com/questions/1763479/how-to-get-the-html-for-a-dom-element-in-javascript
     */
    export function outerHTML(element: any): any
    {
        let container = document.createElement("div");
        container.appendChild(element.cloneNode(true));
        return container.innerHTML;
    }

    /**
     * Create a div with classes.
     * @param classList Classes that should be added to the created div.
     * @returns The create div.
     */
    export function createDiv(classList: string[]): HTMLDivElement
    {
        // [1] Create text div
        let htmlDiv = document.createElement("div");

        // [2] Add classes
        for (const class_ of classList) {
            htmlDiv.classList.add(class_);
        }
        
        return htmlDiv;
    }

    /**
     * Create a HTML div element which has the handed classes and contains the handed text. 
     * @param text Text which should be added to the created div.
     * @param classList Classes that should be added to the created div.
     * @returns The create div.
     */
    export function createTextDiv(text: string, classList: string[]): HTMLDivElement
    {
        // [1] Create text div
        let htmlTextDiv = createDiv(classList);

        // [3] Append text
        let htmlText = document.createTextNode(text);
        htmlTextDiv.appendChild(htmlText);

        return htmlTextDiv;
    }
}