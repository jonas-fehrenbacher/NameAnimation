/**
 * @file      MessageBus.ts
 * @brief     File contains the `MessageBus`.
 * @details
 * ~
 * @author    Jonas
 * @date      November 2023
 * @copyright Copyright (c) 2023
 */

namespace core
{
    /**
     * Message which can be send via the `MessageBus`.
     */
    export enum Message
    {
        
    }

    /**
     * Message receiver which can register on the `MessageBus` to receive messages.
     */
    export interface MessageReceiver { (message: Message): void; };

    /**
     * The message bus to connect unrelated code easily. 
     * 
     * This can reduce system dependencies and help making systems more dynamically usable (e.g. States).
     */
    export class MessageBus
    {
        #receivers: MessageReceiver[]; /**< Storage of all registered receivers. */

        constructor()
        {
            this.#receivers = [];
        }

        /**
		 * Add a new receiver, which will receive all sent messages (via `send()`).
		 * @param receiver Callback function which will be called if a message is sent.
		 */
        add(receiver: MessageReceiver): void
        {
            this.#receivers.push(receiver);
        }

        /**
		 * Add a new message to the bus, ready to be sent to all registered receivers.
		 * UserData will be freed, automatically.
		 * 
		 * @param message ID of the message being sent.
		 */
        send(message: Message): void
        {
            for (let receiver of this.#receivers) {
                receiver(message);
            }
        }
    }
}