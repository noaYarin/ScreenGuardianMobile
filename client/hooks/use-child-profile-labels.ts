import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { Child } from "../src/redux/slices/children-slice";

export type ChildProfileLabels = {
  childName: string;
  birthDateLabel: string;
  genderLabel: string;
};

/**
 * Display labels for a child profile (name, birth date, gender) — reusable across parent screens.
 */
export function useChildProfileLabels(child: Child | null): ChildProfileLabels {
  const { t } = useTranslation();

  return useMemo(() => {
    const childName = child?.name ?? "";
    const birthDateLabel = child?.birthDate
      ? new Date(child.birthDate).toLocaleDateString("he-IL")
      : "";
    const genderKey = String(child?.gender ?? "").toLowerCase();
    const genderLabel =
      genderKey === "boy"
        ? t("addChild.gender_boy")
        : genderKey === "girl"
          ? t("addChild.gender_girl")
          : genderKey === "other"
            ? t("addChild.gender_other")
            : "";

    return { childName, birthDateLabel, genderLabel };
  }, [child, t]);
}
