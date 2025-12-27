import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    type: { type: String, required: true },

    reportedBy: { 
        type: String, 
        required: true 
    },

    content: { 
        type: String, 
        required: true 
    },

    status: { 
        type: String, 
        enum: ["pending", "reviewing", "resolved"], 
        default: "pending" 
    },

    priority: { 
        type: String, 
        enum: ["high", "medium", "low"],
        default: "medium" 
    },

    date: { 
        type: Date, 
        default: Date.now 
    }
});

export default mongoose.model("Report", reportSchema);
