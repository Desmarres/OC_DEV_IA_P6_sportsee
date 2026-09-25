import { createContext, useContext, useState } from "react";


const TrainingContext = createContext(null);

/**
 * Fournit le contexte permettant de gérer l'ouverture et la fermeture
 * de l'interface de création du planning d'entraînement.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {React.ReactNode} props.children - Les composants enfants bénéficiant
 * du contexte de gestion du planning.
 *
 * @returns {JSX.Element} Le contexte contenant l'état d'ouverture du planning
 * et la fonction permettant de le basculer.
 */
export function TrainingProvider({ children }) {

    const [isOpenTraining, setIsOpenTraining] = useState(false);

    function toggleTraining() {
        setIsOpenTraining(prev => !prev);
    }

    return (
        <TrainingContext.Provider value={{ isOpenTraining, toggleTraining }}>
            {children}
        </TrainingContext.Provider>
    );
};

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