import { createContext, useContext, useState } from "react";


const ChatContext = createContext(null);
/**
 * Fournit le contexte de gestion de l'ouverture et de la fermeture
 * de l'interface de discussion avec l'assistant IA.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {React.ReactNode} props.children - Les composants enfants bénéficiant
 * du contexte de discussion.
 *
 * @returns {JSX.Element} Le contexte contenant l'état d'ouverture du chat
 * et la fonction permettant de le basculer.
 */
export function ChatProvider({ children }) {

    const [isOpen, setIsOpen] = useState(false);

    function toggleChat() {
        setIsOpen(prev => !prev);
    }

    return (
        <ChatContext.Provider value={{ isOpen, toggleChat }}>
            {children}
        </ChatContext.Provider>
    );
};

/**
 * Permet d'accéder au contexte de gestion du chat.
 *
 * Vérifie que le hook est utilisé à l'intérieur d'un `ChatProvider`.
 * Une erreur est levée dans le cas contraire.
 *
 * @returns {{isOpen: boolean, toggleChat: Function}}
 * L'état d'ouverture du chat et la fonction permettant de le basculer.
 *
 * @throws {Error} Si le hook est utilisé en dehors d'un `ChatProvider`.
 */
export default function useChat() {
    const context = useContext(ChatContext);
    if (!context) throw new Error("useChat doit être utilisé dans un ChatProvider");
    return context;
};