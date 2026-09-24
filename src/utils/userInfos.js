import { NB_HISTORIC_ACTIVITIES } from "@/config/constants";
import { getProfilStatistic } from "./auth";
import { getLastActivities } from "./dataActivity";
import { formatInfosProfilLastActivities } from "./promptIA";


export async function getUserInfos(token, nbActivities = NB_HISTORIC_ACTIVITIES, weeklyGoal = true) {

    const profilStatistic = await getProfilStatistic(token);

    const profile = profilStatistic?.profile;
    const statistics = profilStatistic?.statistics;

    const lastActivities = profile?.weeklyGoal
        ? await getLastActivities(token, nbActivities, profile.weeklyGoal)
        : null;

    return formatInfosProfilLastActivities(profile, statistics, lastActivities, weeklyGoal);

}