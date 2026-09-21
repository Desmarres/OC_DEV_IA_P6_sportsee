import { MAX_LENGTH_ASSISTANT, MAX_LENGTH_PROMPT, MAX_MESSAGES } from "@/config/constants";
import { useEffect, useRef, useState } from "react";

/**
 * Supprime le dernier échange de la conversation lorsqu'il correspond
 * à un message ayant généré une erreur.
 *
 * @param {Array<Object>} chats - Liste des échanges de la conversation.
 *
 * @returns {Array<Object>} La liste des échanges sans le dernier message
 * lorsqu'il est en erreur.
 */
const removeLastError = (chats) =>
    chats.at(-1)?.error
        ? chats.slice(0, -1)
        : chats;

/**
 * Prépare l'historique des échanges afin de l'envoyer à l'API de conversation.
 *
 * Les échanges en erreur sont exclus et seuls les derniers messages autorisés
 * sont conservés. Les prompts et réponses sont également limités à leur longueur
 * maximale avant d'être transformés au format attendu par l'API.
 *
 * @param {Array<Object>} chats - Liste des échanges de la conversation.
 *
 * @returns {Array<Object>} Historique formaté avec les rôles `user` et `assistant`.
 */
const prepareMessage = (chats) => {
    const validChats = removeLastError(chats);

    return validChats.slice(-MAX_MESSAGES).flatMap((chat) => [
        {
            role: "user",
            content: chat.prompt.slice(0, MAX_LENGTH_PROMPT),
        },
        {
            role: "assistant",
            content: chat.answer.slice(0, MAX_LENGTH_ASSISTANT)
        },
    ]);
};

/**
 * Gère les échanges avec l'assistant IA et conserve l'historique
 * des conversations.
 *
 * Le hook envoie chaque nouveau prompt à l'API avec un historique
 * des échanges précédents, limite le nombre de conversations conservées
 * et gère les états de chargement et d'erreur. Les requêtes en cours
 * sont annulées lorsque les paramètres du hook changent ou que le composant
 * est démonté.
 *
 * @param {Object} props - Paramètres du hook.
 * @param {string|number} props.key - Identifiant de l'échange courant.
 * @param {string} props.prompt - Question envoyée à l'assistant IA.
 *
 * @returns {{
 *   loading: boolean,
 *   chats: Array<Object>
 * }} L'état de chargement et l'historique des échanges avec l'assistant.
 */
export default function useAnswerChat({ key, prompt }) {

    const [chats, setChats] = useState([]);
    const chatsRef = useRef([]);

    const NB_MAX_CHAT_MESSAGE = 5;
    const promptValid = Boolean(prompt?.trim());

    useEffect(() => {

        if (!promptValid) return;

        const controller = new AbortController();

        const historicMessages = prepareMessage(chatsRef.current);

        fetch("/api/chat", {
            method: "POST",
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: prompt,
                historicMessages: historicMessages,
            }),
        })
            .then(async response => {
                const body = await response.json();

                if (!response.ok) {
                    const error = new Error(body.error);
                    error.status = response.status;
                    throw error;
                }

                return body;
            })
            .then(({ answer }) => {

                setChats((prevChats) => {

                    const newChats = [
                        ...removeLastError(prevChats),
                        {
                            key,
                            prompt,
                            answer,
                            error: null,
                        },
                    ].slice(-NB_MAX_CHAT_MESSAGE);

                    chatsRef.current = newChats;

                    return newChats;
                });
            })
            .catch(error => {

                if (error.name === "AbortError") return;

                setChats((prevChats) => {

                    const newChats = [
                        ...removeLastError(prevChats),
                        {
                            key,
                            prompt,
                            answer: null,
                            error,
                        },
                    ].slice(-NB_MAX_CHAT_MESSAGE);

                    chatsRef.current = newChats;

                    return newChats;
                });
            });

        return () => controller.abort();

    }, [promptValid, key, prompt]);

    const lastChat = chats.at(-1);

    const loading = promptValid && lastChat?.key !== key;

    return { loading, chats };
}