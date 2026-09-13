import Image from 'next/image'
import styles from './UserProfil.module.css'
import { formatDate } from '@/utils/date'

export default function UserProfil({ profile }) {

    console.log(profile)
    return (
        <div className={styles.profil}>
            <div className={styles.imageContainer}>
                <Image
                    src={profile.profilePicture}
                    alt="Photo de profil"
                    className={styles.profilePicture}
                    fill
                    sizes="104px"
                    priority
                />
            </div>
            <div className={styles.detail}>
                <h1 className="heading-4">{profile.firstName}</h1>
                <p className="body-default">Membre depuis le {(profile.createdAt) && formatDate(profile.createdAt)}</p>
            </div>
        </div>
    )
}