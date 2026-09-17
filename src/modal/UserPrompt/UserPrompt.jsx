import Image from "next/image";
import styles from "./UserPrompt.module.css";
import useUserInfo from "@/hooks/useUserInfo";

export default function UserPrompt({ prompt }) {

    const { profile } = useUserInfo();

    return (
        <div className={`${styles.promptContainer} body-default`}>
            <div className={styles.prompt}>{prompt}</div>
            {profile?.profilePicture && <div className={styles.imageContainer}>
                <Image
                    src={profile.profilePicture}
                    alt="Photo de profil"
                    className={styles.profilePicture}
                    fill
                    sizes="36px"
                />
            </div>
            }
        </div>
    );
}