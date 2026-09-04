import Header from "@/components/Header/Header";
import Footer from "../Footer/Footer";

/**
 * Définit la structure principale des pages de l'application.
 *
 * Le layout affiche le composant `Header` en haut de la page et
 * le composant 'Footer' en bas de la page et
 * encapsule le contenu de la page dans l'élément `< main > `.
 *
 * @param {Object} props Les propriétés du composant.
 * @param {React.ReactNode} props.children Le contenu de la page affiché
 * à l'intérieur du layout.
 * @returns {JSX.Element} La structure commune de la page avec le header, 
 * le footer et le contenu principal.
 */
export default function Layout({ children }) {
    return (
        <>
            <Header />
            <main className="page">{children}</main>
            <Footer />
        </>
    );
};