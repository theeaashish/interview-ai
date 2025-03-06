import mongoose, {Schema, Document} from "mongoose";

interface ITest extends Document {
    userId: string;
    title: string;
    questions: { question: string; answer: string; score?: number }[];
    createdAt: Date;
}

const TestSchema = new Schema<ITest>({
    userId: { 
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    questions: [{
        question: String,
        answer: String,
        score: Number,
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Test = mongoose.model<ITest>("Test", TestSchema);
export default Test;