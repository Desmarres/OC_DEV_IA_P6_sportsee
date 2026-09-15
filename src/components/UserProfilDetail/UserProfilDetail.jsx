import { divideWithRemainder } from "@/utils/operation";
import styles from "./UserProfilDetail.module.css"

/**
 * Affiche les informations détaillées du profil de l'utilisateur.
 *
 * La taille de l'utilisateur, fournie en centimètres, est convertie
 * en mètres et centimètres avant d'être affichée.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {Object} props.profile - Informations détaillées du profil utilisateur.
 * @param {number} props.profile.age - Âge de l'utilisateur.
 * @param {string} props.profile.lastName - Nom de famille de l'utilisateur.
 * @param {number} props.profile.height - Taille de l'utilisateur en centimètres.
 * @param {number} props.profile.weight - Poids de l'utilisateur en kilogrammes.
 *
 * @returns {JSX.Element} Une liste contenant les informations détaillées
 * du profil utilisateur.
 */
export default function UserProfilDetail({ profile }) {

    const { quotient: meters, remainder: centimeters } = divideWithRemainder(profile.height, 100);

    return (
        <div className={styles.userProfilDetailContainer}>
            <h2 className="heading-4">Votre profil</h2>
            <ul className="body-large">
                <li>Âge : {profile.age}</li>
                <li>Genre : {profile.gender === "female" ? "Femme" : "Homme"}</li>
                <li>Taille : {`${meters}m${centimeters}`}</li>
                <li>Poids : {profile.weight}kg</li>
            </ul>
        </div>
    )
}