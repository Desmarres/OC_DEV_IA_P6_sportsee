import Image from 'next/image'
import styles from './UserProfil.module.css'
import { formatDate } from '@/utils/date'

/**
 * Affiche les informations principales du profil de l'utilisateur.
 *
 * Le composant présente sa photo de profil, son prénom ainsi que
 * la date à laquelle il a rejoint l'application.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {Object} props.profile - Informations du profil utilisateur.
 * @param {string} props.profile.profilePicture - URL de la photo de profil.
 * @param {string} props.profile.firstName - Prénom de l'utilisateur.
 * @param {string|Date} props.profile.createdAt - Date d'inscription
 * de l'utilisateur.
 *
 * @returns {JSX.Element} Un bloc contenant la photo et les informations
 * principales du profil utilisateur.
 */
export default function UserProfil({ profile }) {

    return (
        <div className={styles.profile}>
            <div className={styles.imageContainer}>
                {profile?.profilePicture && <Image
                    src={profile.profilePicture}
                    alt="Photo de profil"
                    className={styles.profilePicture}
                    fill
                    sizes="104px"
                />}
            </div>
            <div className={styles.detail}>
                <h1 className="heading-4">{profile?.firstName}</h1>
                <p className="body-default">Membre depuis le {profile?.createdAt && formatDate(profile.createdAt)}</p>
            </div>
        </div>
    )
}