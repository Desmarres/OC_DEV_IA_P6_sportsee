/**
 * Regroupe les constantes globales utilisées dans l'application.
 *
 * Ces constantes centralisent notamment la configuration de l'API,
 * les objectifs d'activité, les périodes utilisées pour les graphiques,
 * les libellés de jours et de mois, ainsi que les paramètres liés
 * à l'assistant IA et à l'historique des activités.
 */

export const API_URL = "http://localhost:8000";

export const GOAL_TARGET = 3;

export const NUMBER_OF_WEEKS = 4;

export const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

export const SMALL_MONTHS = ["janv", "fev", "mars", "avr", "mai", "juin", "juil", "aout", "sept", "oct", "nov", "dec"]

/* Configuration constante IA */

export const MAX_MESSAGES = 3;

export const MAX_LENGTH_PROMPT = 1000;

export const MAX_LENGTH_ASSISTANT = 1000;

export const NB_HISTORIC_ACTIVITIES = 10;