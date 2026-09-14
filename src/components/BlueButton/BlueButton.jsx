import styles from "./BlueButton.module.css"

/**
 * Affiche un bouton bleu avec un texte personnalisable.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {string} props.texte - Texte affiché à l'intérieur du bouton.
 *
 * @returns {JSX.Element} Un bouton stylisé avec le texte fourni.
 */
export default function BlueButton({ texte }) {
    return <button className={`${styles.button} body-large`}>{texte}</button>
}