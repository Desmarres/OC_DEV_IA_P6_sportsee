import useChat from "@/context/ChatContext";
import styles from "./ChatModal.module.css";
import { useForm } from "react-hook-form";
import useAnswerChat from "@/hooks/useAnswerChat";
import { useEffect, useRef, useState } from "react";
import ClosedCross from "@/modal/ClosedCross/ClosedCross";
import UserPrompt from "@/modal/UserPrompt/UserPrompt";
import ChatAnswer from "../ChatAnswer/ChatAnswer";
import InputPrompt from "../InputPrompt/InputPrompt";
import Suggestion from "../Suggestion/Suggestion";

/**
 * Affiche la fenêtre principale de conversation avec l'assistant IA.
 *
 * Le composant permet à l'utilisateur d'envoyer des prompts, d'afficher
 * l'historique des échanges et de visualiser les réponses ou les erreurs
 * retournées par l'assistant. Il gère également le défilement automatique
 * vers le dernier échange et empêche l'envoi d'une nouvelle requête
 * lorsqu'une réponse est en cours de traitement.
 *
 * @returns {JSX.Element} La fenêtre de discussion avec l'historique
 * des échanges, le champ de saisie et les suggestions de questions.
 */
export default function ChatModal() {

    const { toggleChat } = useChat();
    const { register, setValue, handleSubmit, control } = useForm();
    const [prompt, setPrompt] = useState({
        key: null,
        prompt: null,
    });
    const { loading, chats } = useAnswerChat(prompt);
    const requestId = useRef(0);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [chats, loading]);

    const onSubmit = ({ prompt }) => {
        if (loading) return;

        const inputPrompt = {
            key: requestId.current++,
            prompt: prompt,
        }
        setPrompt(inputPrompt);
        setValue("prompt", "");
    }

    const onFormSubmit = (event) => {
        handleSubmit(onSubmit)(event);
    };

    const onSuggestionClick = (suggestion) => {
        if (loading) return;

        onSubmit({ prompt: suggestion });
    };

    return (
        <div className={styles.chatModalContainer}>
            <div className={styles.header}>
                <div className={styles.closedCrossContainer}>
                    <ClosedCross onClick={toggleChat} />
                </div>
                {(!prompt.prompt && chats.length === 0) ?
                    (
                        <h1 className="heading-4">
                            Posez vos questions sur votre programme, vos performances ou vos objectifs
                        </h1>
                    ) : (
                        <div className={styles.chatContainer}>
                            {chats.map((chat) => (
                                <div key={chat.key} className={styles.chat}>
                                    <UserPrompt prompt={chat.prompt} />
                                    <ChatAnswer
                                        loading={false}
                                        answer={chat.answer}
                                        error={chat.error}
                                    />
                                </div>
                            ))
                            }
                            {loading && <div className={styles.chat}>
                                <UserPrompt prompt={prompt.prompt} />
                                <ChatAnswer
                                    loading={loading}
                                    answer={null}
                                    error={null}
                                />
                            </div>}
                            <div ref={chatEndRef} />
                        </div>
                    )
                }
            </div>
            <form className={styles.formContainer} onSubmit={onFormSubmit}>
                <InputPrompt
                    control={control}
                    register={register}
                    loading={loading}
                />
                <Suggestion
                    onClick={onSuggestionClick}
                    loading={loading}
                />
            </form>
        </div>
    )
}