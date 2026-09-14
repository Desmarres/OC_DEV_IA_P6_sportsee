
/**
 * Effectue une division entière et retourne le quotient ainsi que le reste.
 *
 * @param {number} dividend - Nombre à diviser.
 * @param {number} divisor - Nombre par lequel effectuer la division.
 *
 * @returns {{quotient: number, remainder: number}} Le quotient entier
 * et le reste de la division.
 */
export function divideWithRemainder(dividend, divisor) {
    const quotient = Math.floor(dividend / divisor);
    const remainder = dividend % divisor;

    return { quotient, remainder };
}

/**
 * Calcule le nombre total de calories brûlées sur l'ensemble des activités.
 *
 * Les activités ne contenant pas de valeur `caloriesBurned` sont considérées
 * comme ayant une valeur de zéro.
 *
 * @param {Array<Object>} activities - Liste des activités de l'utilisateur.
 *
 * @returns {number} Nombre total de calories brûlées.
 */
export function getTotalCalories(activities) {
    if (!activities || activities.length === 0) {
        return 0;
    }

    return activities.reduce((total, activity) => {
        return total + (activity.caloriesBurned ?? 0);
    }, 0);
}