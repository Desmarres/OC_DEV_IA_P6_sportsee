import { createContext, useContext, useEffect, useState } from 'react';

export const AuthStatus = {
    Unknown: 0,
    Authenticated: 1,
    Guest: 2,
};

const AuthContext = createContext(null);

/**
 * Fournit le contexte d'authentification à l'ensemble des composants enfants.
 *
 * Le provider vérifie au chargement si l'utilisateur est authentifié,
 * puis met à disposition les fonctions de connexion et de déconnexion
 * ainsi que le statut d'authentification.
 *
 * @param {Object} props Les propriétés du composant.
 * @param {React.ReactNode} props.children Les composants enfants bénéficiant
 * du contexte d'authentification.
 * @returns {JSX.Element} Le contexte d'authentification contenant le statut
 * et les fonctions de connexion et de déconnexion.
 */
export function AuthProvider({ children }) {

    const [status, setStatus] = useState(AuthStatus.Unknown);

    useEffect(() => {
        fetch('/api/me')
            .then(response => response.json())
            .then(({ authenticated }) => {
                setStatus(authenticated ? AuthStatus.Authenticated : AuthStatus.Guest)
            });
    }, []);

    async function login(username, password) {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (!response.ok) { throw new Error(data.message || 'Identifiants invalides'); }
        setStatus(AuthStatus.Authenticated);
    };

    async function logout() {
        await fetch('/api/logout', { method: 'POST' });
        setStatus(AuthStatus.Guest);
    };

    return (
        <AuthContext.Provider value={{ status, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Permet d'accéder au contexte d'authentification depuis un composant.
 *
 * Vérifie que le hook est utilisé à l'intérieur d'un `AuthProvider`.
 * Une erreur est levée dans le cas contraire.
 *
 * @returns {{status: number, login: Function, logout: Function}}
 * Les données et fonctions fournies par le contexte d'authentification.
 * @throws {Error} Si le hook est utilisé en dehors d'un `AuthProvider`.
 */
export default function useAuth() {
    const context = useContext(AuthContext);;
    if (!context) throw new Error('useAuth doit être utilisé dans un AuthProvider');
    return context;
};