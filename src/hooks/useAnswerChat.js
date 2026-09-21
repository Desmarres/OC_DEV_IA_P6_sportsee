import { MAX_MESSAGES } from "@/config/constants";
import { useEffect, useRef, useState } from "react";


const removeLastError = (chats) =>
    chats.at(-1)?.error
        ? chats.slice(0, -1)
        : chats;

const prepareMessage = (chats) => {
    const validChats = removeLastError(chats);

    return validChats.slice(-MAX_MESSAGES).flatMap((chat) => [
        {
            role: "user",
            content: chat.prompt,
        },
        {
            role: "assistant",
            content: chat.answer,
        },
    ]);
};


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