import mongoose from "mongoose";
import { DayScheduleSchema } from "./daySchedule.schema.js";

export const ScreenTimeSchema = new mongoose.Schema(
    {
        isLimitEnabled: { type: Boolean, default: false },
        dailyLimitMinutes: { type: Number, default: 0 },
        weeklyLimitMinutes: { type: Number, default: 0 },
        usedTodayMinutes: { type: Number, default: 0 },
        usedWeekMinutes: { type: Number, default: 0 },
        weeklySchedule: {
            type: [DayScheduleSchema],
            default: []
        }
    },
{ _id: false }
);