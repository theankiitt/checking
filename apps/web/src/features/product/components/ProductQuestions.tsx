"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api/client";

interface ProductQuestionsProps {
  productId: string;
}

interface Question {
  id: string;
  question: string;
  answer?: string;
  createdAt: string;
}

export default function ProductQuestions({ productId }: ProductQuestionsProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionText, setQuestionText] = useState("");
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await apiClient.get<any>(
          `/api/v1/products/${productId}/questions`,
        );
        if (response.success && response.data?.questions) {
          setQuestions(response.data.questions);
        }
      } catch (error) {
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [productId]);

  const handleSubmitQuestion = async () => {
    if (!questionText.trim()) return;

    setIsSubmittingQuestion(true);
    try {
      const response = await apiClient.post<any>(
        `/api/v1/products/${productId}/questions`,
        { question: questionText },
      );

      if (response.success) {
        setQuestions((prev) => [
          {
            id: Date.now().toString(),
            question: questionText,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
        setQuestionText("");
        alert("Question submitted successfully!");
      }
    } catch (error) {
      alert("Failed to submit question. Please try again.");
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
        Questions about this product
      </h2>

      <div className="mb-6">
        <textarea
          value={questionText}
          onChange={(e) => {
            if (e.target.value.length <= 300) {
              setQuestionText(e.target.value);
            }
          }}
          placeholder="Enter your question(s) here"
          className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent resize-none text-gray-900"
          maxLength={300}
        />
        <div className="text-xs text-gray-400 text-right mt-2">
          {questionText.length}/300
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmitQuestion}
            disabled={!questionText.trim() || isSubmittingQuestion}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
          >
            {isSubmittingQuestion ? "Submitting..." : "ASK QUESTIONS"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading questions...</div>
      ) : questions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❓</div>
          <p className="text-gray-400 text-lg mb-1">
            There are no questions yet.
          </p>
          <p className="text-gray-400 text-sm">
            Ask the seller now and their answer will show here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((question) => (
            <div
              key={question.id}
              className="border-b border-gray-100 pb-6 last:border-b-0"
            >
              <div className="flex items-start space-x-2 mb-2">
                <span className="text-sm font-medium text-gray-900">Q:</span>
                <p className="text-gray-900">{question.question}</p>
              </div>
              {question.answer && (
                <div className="ml-6 pl-4 border-l-2 border-gray-200">
                  <div className="flex items-start space-x-2">
                    <span className="text-sm font-medium text-[#EB6426]">
                      A:
                    </span>
                    <p className="text-gray-700">{question.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
