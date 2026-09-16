import useChat from "@/context/ChatContext";
import styles from "./ChatModal.module.css";
import Image from "next/image";
import BlueButton from "@/components/BlueButton/BlueButton";
import { useForm, useWatch } from "react-hook-form";
import Icon from '@/assets/IconeAI.svg'

export default function ChatModal() {

    const { toggleChat } = useChat();
    const { register, setValue, handleSubmit, control } = useForm();

    const prompt = useWatch({
        control,
        name: "prompt",
        defaultValue: "",
    });

    const onSubmit = (data) => {
        console.log(data);
        setValue("prompt", "");
    }

    const onSuggestionClick = (suggestion) => {
        setValue("prompt", suggestion);
        handleSubmit(onSubmit)();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.altKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    const suggestions = [
        "Comment améliorer mon endurance ?",
        "Que signifie mon score de récupération ?",
        "Peux-tu m’expliquer mon dernier graphique ?"
    ]

    return (
        <div className={styles.chatModalContainer}>
            <div className={styles.header}>
                <div className={styles.closedContainer}>
                    <div className="body-default" onClick={toggleChat}>
                        <p>Fermer</p>
                        <Image
                            src="/crossClose.svg"
                            alt="Croix de fermeture de la modale"
                            className={styles.logo}
                            width={12}
                            height={12}
                            loading='eager'
                        />
                    </div>
                </div>
                <h1 className="heading-4">Posez vos questions sur votre programme, vos performances ou vos objectifs</h1>
            </div>
            <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
                <div className={`${styles.textareaContainer} body-default`}>
                    {!prompt && (
                        <div className={styles.placeholder}>
                            <Icon
                                color="var(--secondary-color-30)"
                                width={19}
                                height={21}
                            />
                            <span>Comment puis-je vous aider ?</span>
                        </div>
                    )}
                    <textarea
                        className={`${styles.textarea} body-default`}
                        id="prompt"
                        name="prompt"
                        {...register("prompt")}
                        onKeyDown={handleKeyDown} />
                    <BlueButton
                        texte={
                            <svg
                                width="12"
                                height="16"
                                viewBox="0 0 12 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M10.862 5.80239C10.6649 5.99742 10.3449 5.99792 10.1479 5.80239L6.00993 1.70546V15.5C6.00993 15.776 5.7839 16 5.50486 16C5.22583 16 4.99979 15.776 4.99979 15.5V1.70546L0.861834 5.8019C0.66481 5.99742 0.344792 5.99742 0.147768 5.8019C-0.049256 5.60637 -0.049256 5.28984 0.147768 5.09481L5.14781 0.144774C5.34284 -0.0482597 5.66735 -0.0482597 5.86237 0.144774L10.8624 5.09481C11.0595 5.29034 11.0595 5.60687 10.862 5.80239C11.0595 5.60687 10.6649 5.99742 10.862 5.80239Z"
                                    fill="white"
                                />
                            </svg>
                        }
                        type="submit"
                    />
                </div>
                <div className={`${styles.suggestionContainer} body-small`}>
                    {suggestions.map((suggestion, index) => (
                        <div
                            className={styles.suggestion}
                            key={`${suggestion}-${index}`}
                            onClick={() => onSuggestionClick(suggestion)}
                        >
                            {suggestion}
                        </div>
                    ))}
                </div>
            </form>
        </div>
    )
}