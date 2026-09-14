import useUserInfo from "@/hooks/useUserInfo";
import { createContext, useContext } from "react";
import useAuth, { AuthStatus } from "./AuthContext";


const UserInfoContext = createContext(null);

/**
 * Fournit les informations de profil et les statistiques de l'utilisateur
 * à l'ensemble des composants enfants.
 *
 * Les données utilisateur sont récupérées uniquement lorsque l'utilisateur
 * est authentifié.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {React.ReactNode} props.children - Les composants enfants bénéficiant
 * du contexte des informations utilisateur.
 *
 * @returns {JSX.Element} Le contexte contenant le profil, les statistiques,
 * l'état de chargement et les éventuelles erreurs.
 */
export function UserInfoProvider({ children }) {


    const { status } = useAuth();
    const { profile, statistics, loading, error } = useUserInfo(status === AuthStatus.Authenticated);

    return (
        <UserInfoContext.Provider value={{ profile, statistics, loading, error }}>
            {children}
        </UserInfoContext.Provider>
    )
}

/**
 * Permet d'accéder au contexte contenant les informations de l'utilisateur.
 *
 * Vérifie que le hook est utilisé à l'intérieur d'un `UserInfoProvider`.
 * Une erreur est levée dans le cas contraire.
 *
 * @returns {{profile: Object, statistics: Object, loading: boolean, error: Error|null}}
 * Les informations utilisateur fournies par le contexte.
 *
 * @throws {Error} Si le hook est utilisé en dehors d'un `UserInfoProvider`.
 */
export default function useUserInfoContext() {
    const context = useContext(UserInfoContext);
    if (!context) throw new Error('useUserInfoContext doit être utilisé dans un UserInfoProvider');
    return context;
}