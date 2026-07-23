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

const Word = models.Comment || mongoose.model("Comment", wordSchema);
export default Word;