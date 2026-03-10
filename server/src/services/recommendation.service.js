import { AppError } from "../utils/appError.js";
import { Common as CommonErrors } from "../constants/errors.js";
import { getChildByParentId } from "../dal/parent.dal.js";
import { findDevicesByChildId } from "../dal/device.dal.js";
import { findRequestsByChild } from "../dal/request.dal.js";
import { RequestStatus } from "../constants/status.js";
import {
    RecommendationCode,
    RecommendationPriority
} from "../constants/recommendation.js";

function ensureChildBelongsToParent(childList, childId) {
    const child = childList.find((c) => String(c._id) === String(childId));

    if (!child) {
        throw new AppError(CommonErrors.CHILD_NOT_FOUND);
    }

    return child;
}

function buildRecommendations({ child, devices, requests }) {
    const recommendations = [];

    const activeDevice = devices[0];
    const screenTime = activeDevice?.screenTime || {};

    const pendingRequests = requests.filter(
        (r) => r.status === RequestStatus.PENDING
    );

    const approvedRequests = requests.filter(
        (r) => r.status === RequestStatus.APPROVED
    );


    const isHighDailyUsage =
        screenTime.isLimitEnabled === true &&
        Number(screenTime.dailyLimitMinutes) > 0 &&
        Number(screenTime.usedTodayMinutes) / Number(screenTime.dailyLimitMinutes) >= 0.8;

    if (approvedRequests.length >= 3) {
        recommendations.push({
            code: RecommendationCode.REVIEW_DAILY_LIMIT,
            title: "מומלץ לבדוק את המגבלה היומית",
            description: "הילד ביקש ואושר לו זמן נוסף מספר פעמים. ייתכן שהמגבלה היומית לא מותאמת לשגרה.",
            priority: RecommendationPriority.HIGH
        });
    }

    if (pendingRequests.length > 0) {
        recommendations.push({
            code: RecommendationCode.PENDING_REQUESTS,
            title: "יש בקשות הארכה שממתינות לטיפול",
            description: `כרגע יש ${pendingRequests.length} בקשות שממתינות לאישור או דחייה.`,
            priority: RecommendationPriority.MEDIUM
        });
    }

    if (screenTime.isLimitEnabled !== true) {
        recommendations.push({
            code: RecommendationCode.ENABLE_LIMIT,
            title: "מומלץ להפעיל מגבלת זמן מסך",
            description: "כרגע מגבלת זמן המסך אינה פעילה. הגדרה כזאת תעזור ביצירת שגרה קבועה.",
            priority: RecommendationPriority.HIGH
        });
    }

    if (isHighDailyUsage) {
        recommendations.push({
            code: RecommendationCode.HIGH_DAILY_USAGE,
            title: "השימוש היום קרוב למגבלה היומית",
            description: "הילד כבר ניצל חלק גדול מזמן המסך היומי. ייתכן שכדאי לבדוק אם המגבלה מתאימה לשגרה.",
            priority: RecommendationPriority.MEDIUM
        });
    }

    if (isHighDailyUsage || approvedRequests.length >= 3) {
        recommendations.push({
            code: RecommendationCode.SUGGEST_ACTIVITY,
            title: "מומלץ להציע פעילות חלופית",
            description: "זוהה שימוש גבוה במסך או צורך חוזר בזמן נוסף. אפשר להציע פעילות ספורטיבית, יצירתית או משפחתית במקום זמן מסך נוסף.",
            priority: RecommendationPriority.MEDIUM
        });
    }

    if (!screenTime.dailyLimitMinutes || Number(screenTime.dailyLimitMinutes) <= 0) {
        recommendations.push({
            code: RecommendationCode.SET_DAILY_LIMIT,
            title: "מומלץ להגדיר מגבלה יומית",
            description: "כרגע לא מוגדרת מגבלה יומית ברורה. הגדרה כזאת תעזור ביצירת שגרה קבועה.",
            priority: RecommendationPriority.HIGH
        });
    }

    if (!screenTime.weeklySchedule || screenTime.weeklySchedule.length === 0) {
        recommendations.push({
            code: RecommendationCode.SET_WEEKLY_SCHEDULE,
            title: "מומלץ להגדיר שגרה שבועית",
            description: "שגרה שבועית קבועה יכולה לעזור ביצירת גבולות ברורים לאורך השבוע.",
            priority: RecommendationPriority.LOW
        });
    }

    if (activeDevice?.isLocked === true) {
        recommendations.push({
            code: RecommendationCode.CHECK_LOCK_REASON,
            title: "בדקו אם הנעילה עדיין נחוצה",
            description: "המכשיר נעול כרגע. מומלץ לבדוק אם הנעילה זמנית או אם צריך לעדכן את ההגדרות.",
            priority: RecommendationPriority.LOW
        });
    }

    if (child?.birthDate) {
        const age = new Date().getFullYear() - new Date(child.birthDate).getFullYear();

        if (age >= 6 && age <= 10) {
            recommendations.push({
                code: RecommendationCode.YOUNG_CHILD_GUIDANCE,
                title: "לילדים צעירים מומלץ לנסח גבולות פשוטים וברורים",
                description: "בגילאים צעירים כדאי להגדיר מגבלות קבועות ופשוטות שקל להבין ולעקוב אחריהן.",
                priority: RecommendationPriority.LOW
            });
        }
    }

    return recommendations;
}

export async function getParentRecommendations(parentId, childId) {
    const childList = await getChildByParentId(parentId);
    const child = ensureChildBelongsToParent(childList, childId);

    const devices = await findDevicesByChildId(childId);

    const requests = await findRequestsByChild({
        parentId,
        childId
    });

    const recommendations = buildRecommendations({
        child,
        devices,
        requests
    });

    return {
        childId,
        recommendations
    };
}