import mongoose from "mongoose";

export const ScreenTimeSchema = new mongoose.Schema(
    {
        haveLimit: { type: Boolean, default: false },
        timeUsed: { type: Number, default: 0 },
        endDate: { type: Date, default: null },
        startDate: { type: Date, default: null },
        maxAllowedTime: { type: Number, default: 0 },
        remainingTime: { type: Number, default: 0 },
        
    }, 
);
