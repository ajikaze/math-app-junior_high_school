import { useState } from "react";
import { apiService } from "../services/api";
import { validatePromptInput } from "../utils/validatePromptInput";
import { sanitizeAIOutput } from "../utils/sanitizeAIOutput";

export const useAIQuestion = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [answer, setAnswer] = useState<string | null>(null);

    const askQuestion = async (question: string) => {
        // ここでバリデーション
        const validationError = validatePromptInput(question);
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError(null);
        setAnswer(null);

        try {
            const response = await apiService.askAIQuestion(question);

            if (response.success && response.data) {
                setAnswer(sanitizeAIOutput(response.data));
            } else {
                setError(response.error || "質問の処理に失敗しました");
            }
        } catch (err) {
            setError("予期しないエラーが発生しました");
            console.error("AI question error:", err);
        } finally {
            setLoading(false);
        }
    };

    const clearAnswer = () => {
        setAnswer(null);
        setError(null);
    };

    return {
        loading,
        error,
        answer,
        askQuestion,
        clearAnswer,
    };
};
