import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    actorName: { 
        type: String, 
        required: true 
    },

    action: { 
        type: String, 
        required: true 
    },

    avatarLetter: { 
        type: String,
        default: function () {
            return this.actorName ? this.actorName.charAt(0).toUpperCase() : "?";
        }
    },

    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

export default mongoose.model("Activity", activitySchema);
