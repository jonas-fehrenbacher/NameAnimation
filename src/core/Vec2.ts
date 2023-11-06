/**
 * @file      Vec2.ts
 * @brief     File contains `Vec2`.
 * @details
 * ~
 * @author    Jonas
 * @date      November 2023
 * @copyright Copyright (c) 2023
 */

namespace core
{
    /**
     * 2D Vector which has x and y.
     * 
     * Can be used to describe multiple things, for exmaple position, movement and size.
     */
    export class Vec2
    {
        x: number; /**< X axis value. */
        y: number; /**< Y axis value. */

        /**
         * Initialize the 2D vector.
         * @param x X axis value.
         * @param y Y axis value.
         */
        constructor(x?: number, y?: number)
        {
            this.x = x? x : 0;
            this.y = y? y : 0;
        }
    }
}