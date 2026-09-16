import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import useChat from "@/context/ChatContext";
import ChatModal from "@/modal/ChatModal/ChatModal";

/**
 * Définit la structure principale des pages de l'application.
 *
 * Le layout affiche le composant `Header` en haut de la page et
 * le composant `Footer` en bas de la page. Il encapsule le contenu
 * de la page dans l'élément `<main>`.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {React.ReactNode} props.children - Le contenu de la page affiché
 * à l'intérieur du layout.
 *
 * @returns {JSX.Element} La structure commune de la page avec le header,
 * le contenu principal et le footer.
 */
export default function Layout({ children }) {

    const { isOpen } = useChat();
    return (
        <>
            <Header />
            <main className="page">
                {isOpen ? <ChatModal /> : children}</main>
            <Footer />
        </>
    );
};