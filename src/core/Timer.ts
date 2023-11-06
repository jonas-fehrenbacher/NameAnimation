/**
 * @file      Timer.ts
 * @brief     File contains the `Timer`.
 * @details
 * ~
 * @author    Jonas
 * @date      November 2023
 * @copyright Copyright (c) 2023
 */

namespace core
{
    export type Milliseconds = number;
    export type Seconds = number;

    /**
	 * Timer which starts automatically on creation.
	 * 
	 * Note: A clock just shows the current time (`clock::now()`). A timer does not show the current time,
	 * but measures how much time elapsed.
	 */
    export class Timer
    {
        #startTP:     Milliseconds; /**< Start timepoint. Determines elapsed time. */
        #stoppedTime: Milliseconds; /**< Used when timer is paused, to store its elapsed time till then. @see `pause()` */
        #STOP_DURATION: number;     /**< Flag indicating that the timer is stopped. @see `stop()` */

        constructor()
        {
            this.#startTP = this.#now();
            this.#stoppedTime = 0;
            this.#STOP_DURATION = -1;
        }

        /**
		 * Restart the timer. This is the default behaviour when a `Timer` is created.
		 * @return Elapsed time
		 */
		restart(): Milliseconds
        {
            let time: Milliseconds = this.getElapsedTime();
            this.#startTP = this.#now();
            this.#stoppedTime = 0;
            return time;
        }

		/**
		 * Resume paused timer.
		 */
		resume(): void
        {
            if (this.isPaused()) {
                this.#startTP = this.#now() - this.#stoppedTime;
                this.#stoppedTime = 0;
            }
        }

		/**
		 * Pause timer, so that its elapsed time stored and it can be resumed.
		 */
		pause(): void
        {
            if (!this.isPaused() && !this.isStopped()) {
                this.#stoppedTime = this.#now() - this.#startTP;
            }
        }

		/**
		 * Stop timer: Time is 0ns - use `restart()` to start timer.
		 */
		stop(): void
        {
            this.#stoppedTime = this.#STOP_DURATION;
        }

		/**
		 * Add time to the timer. 
		 * Has no effect on stopped timer.
		 * @param time Time to add to the timer.
		 */
		add(time: Milliseconds): void
        {
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
		getElapsedTime(): Milliseconds
        {
            if (this.isStopped()) return 0;
            if (this.isPaused()) return this.#stoppedTime;
            return this.#now() - this.#startTP;
        }

		/**
		 * Check if timer is paused.
		 * @retval true Timer is paused.
		 * @retval false Timer is not paused.
		 */
		isPaused(): boolean
        {
            return this.#stoppedTime > 0;
        }

		/**
		 * Check if timer is stopped.
		 * @retval true Timer is stopped.
		 * @retval false Timer is not stopped.
		 */
		isStopped(): boolean
        {
            return this.#stoppedTime == this.#STOP_DURATION;
        }

        /**
         * Get the current timepoint.
         * `Date.now()`: returns the number of milliseconds elapsed since 1970.
         * `performance.now()`: returns a high resolution timestamp in milliseconds.
         * @returns Current timepoint in milliseconds.
         */
        #now(): Milliseconds
        {
            return performance.now(); // or Date.now()
        }
    }
}