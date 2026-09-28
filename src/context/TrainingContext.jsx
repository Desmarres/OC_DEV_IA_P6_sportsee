import {
    createContext,
    useCallback,
    useContext,
    useState,
} from "react";
import useGenerateTrainingPlan from "../hooks/useGenerateTrainingPlan";

const TrainingContext = createContext(null);

/**
 * Fournit le contexte permettant de gérer la création et l'affichage
 * du planning d'entraînement personnalisé.
 *
 * Le provider gère l'ouverture de l'interface, le planning généré,
 * son état de chargement et les éventuelles erreurs. Il conserve également
 * la dernière demande afin de permettre la régénération du planning.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {React.ReactNode} props.children - Les composants enfants bénéficiant
 * du contexte de gestion du planning.
 *
 * @returns {JSX.Element} Le contexte contenant l'état du planning,
 * les fonctions de génération et de régénération ainsi que les données
 * associées à la dernière demande.
 */
export function TrainingProvider({ children }) {
    const [isOpenTraining, setIsOpenTraining] = useState(false);
    const [lastRequest, setLastRequest] = useState(null);

    const {
        plan,
        loading,
        error,
        generatePlan: requestPlan,
    } = useGenerateTrainingPlan();

    const toggleTraining = useCallback(() => {
        setIsOpenTraining(prev => !prev);
    }, []);

    const generatePlan = useCallback(async (request) => {
        setLastRequest(request);
        setIsOpenTraining(true);

        try {
            return await requestPlan(request);
        } catch (error) {
            return null;
        }
    }, [requestPlan]);

    const regenerate = useCallback(async () => {
        if (!lastRequest) {
            return;
        }

        try {
            return await requestPlan(lastRequest);
        } catch (error) {
            return null;
        }
    }, [lastRequest, requestPlan]);

    const downloadPlan = async () => {
        if (!plan || !lastRequest) return

        const body = {
            target: lastRequest.target,
            startDate: lastRequest.startDate,
            timeSlot: lastRequest.timeSlot,
            weeks: plan.weeks
        }

        const response = await fetch("/api/training-plan/download-ics", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
        }

        const blob = await response.blob();

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `plan-entrainement-${new Date().toISOString().slice(0, 10)}.ics`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

    }

    const value = {
        isOpenTraining,
        toggleTraining,
        plan,
        loading,
        error,
        lastRequest,
        generatePlan,
        regenerate,
        downloadPlan,
    };

    return (
        <TrainingContext.Provider value={value}>
            {children}
        </TrainingContext.Provider>
    );
}

/**
 * Permet d'accéder au contexte de gestion du planning d'entraînement.
 *
 * Vérifie que le hook est utilisé à l'intérieur d'un `TrainingProvider`.
 * Une erreur est levée dans le cas contraire.
 *
 * @returns {{isOpenTraining: boolean, toggleTraining: Function}}
 * L'état d'ouverture du planning et la fonction permettant de le basculer.
 *
 * @throws {Error} Si le hook est utilisé en dehors d'un `TrainingProvider`.
 */
export default function useTraining() {
    const context = useContext(TrainingContext);
    if (!context) throw new Error("useTraining doit être utilisé dans un TrainingProvider");
    return context;
}