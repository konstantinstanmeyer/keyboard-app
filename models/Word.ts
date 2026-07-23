import mongoose, { Schema, models } from "mongoose";

const wordSchema = new Schema({
        word: {
            type: String,
            required: true,
        },
        definition: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
)

const Word = models.Word || mongoose.model("Word", wordSchema);
export default Word;