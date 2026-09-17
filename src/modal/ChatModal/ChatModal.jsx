import useChat from "@/context/ChatContext";
import styles from "./ChatModal.module.css";
import { useForm } from "react-hook-form";
import useAnswerChat from "@/hooks/useAnswerChat";
import { useState } from "react";
import ClosedCross from "@/modal/ClosedCross/ClosedCross";
import UserPrompt from "@/modal/UserPrompt/UserPrompt";
import ChatAnswer from "../ChatAnswer/ChatAnswer";
import InputPrompt from "../InputPrompt/InputPrompt";
import Suggestion from "../Suggestion/Suggestion";

export default function ChatModal() {

    const { toggleChat } = useChat();
    const { register, setValue, handleSubmit, control } = useForm();
    const [prompt, setPrompt] = useState(null);
    const { loading, result } = useAnswerChat(prompt);

    const onSubmit = (data) => {
        setPrompt(data.prompt);
        setValue("prompt", "");
    }

    const onSuggestionClick = (suggestion) => {
        setValue("prompt", suggestion);
        handleSubmit(onSubmit)();
    };

    return (
        <div className={styles.chatModalContainer}>
            <div className={styles.header}>
                <ClosedCross onClick={toggleChat} />
                {!prompt ?
                    <h1 className="heading-4">Posez vos questions sur votre programme, vos performances ou vos objectifs</h1>
                    :
                    <div className={styles.chatContainer}>
                        <UserPrompt prompt={prompt} />
                        <ChatAnswer
                            loading={loading}
                            answer={result.data}
                        />
                    </div>
                }
            </div>
            <form className={styles.formContainer} onSubmit={!loading ? handleSubmit(onSubmit) : undefined}>
                <InputPrompt
                    control={control}
                    register={register}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
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