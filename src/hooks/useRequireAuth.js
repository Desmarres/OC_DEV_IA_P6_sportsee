import useAuth, { AuthStatus } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

/**
 * Vérifie que l'utilisateur est authentifié avant d'autoriser l'accès
 * à une page protégée.
 *
 * Lorsque le statut de l'utilisateur correspond à `Guest`, il est
 * automatiquement redirigé vers la page d'accueil.
 *
 * @returns {AuthStatus} Le statut actuel d'authentification de l'utilisateur.
 */
export default function useRequireAuth() {
    const { status } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (status === AuthStatus.Guest) {
            router.push("/")
        }
    }, [status, router]);

    return status;
};