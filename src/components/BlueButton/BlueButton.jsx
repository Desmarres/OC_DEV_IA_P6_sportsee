import styles from "./BlueButton.module.css"

export default function BlueButton({ texte }) {
    return <button className={`${styles.button} body-large`}>{texte}</button>
}