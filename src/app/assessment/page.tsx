"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

export default function AssessmentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const degree = searchParams.get("degree");
  const role = searchParams.get("role");

  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.post("/api/generate-questions", {
          degree,
          role,
        });

        let raw = res.data.data;
        raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

        const parsed = JSON.parse(raw);
        setQuestions(parsed.questions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [degree, role]);

  const handleSingleSelect = (i: number, v: string) => {
    setAnswers((p: any) => ({ ...p, [i]: v }));
  };

  const handleMultiSelect = (i: number, v: string) => {
    setAnswers((p: any) => {
      const cur = Array.isArray(p[i]) ? p[i] : [];
      return {
        ...p,
        [i]: cur.includes(v)
          ? cur.filter((x: string) => x !== v)
          : [...cur, v],
      };
    });
  };

  const handleText = (i: number, v: string) => {
    setAnswers((p: any) => ({ ...p, [i]: v }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Skill Assessment
        </h1>
        <p className="text-gray-600 mb-6 text-sm">
          Answer carefully — this impacts your job readiness score
        </p>

        {loading && (
          <p className="text-indigo-600 animate-pulse">
            Generating questions...
          </p>
        )}

        <div className="space-y-6">
          {questions.map((q, index) => (
            <div
              key={index}
              className="border border-gray-200 p-5 rounded-xl hover:shadow-md transition"
            >
              <p className="font-semibold text-gray-900 mb-2">
                {index + 1}. {q.question}
              </p>

              {q.type === "mcq" &&
                q.options.map((opt: string, i: number) => (
                  <label key={i} className="block text-gray-700">
                    <input
                      type="radio"
                      name={`q-${index}`}
                      className="mr-2 accent-indigo-600"
                      checked={answers[index] === opt}
                      onChange={() => handleSingleSelect(index, opt)}
                    />
                    {opt}
                  </label>
                ))}

              {q.type === "multi" &&
                q.options.map((opt: string, i: number) => (
                  <label key={i} className="block text-gray-700">
                    <input
                      type="checkbox"
                      className="mr-2 accent-indigo-600"
                      checked={(answers[index] || []).includes(opt)}
                      onChange={() => handleMultiSelect(index, opt)}
                    />
                    {opt}
                  </label>
                ))}

              {q.type === "text" && (
                <textarea
                  className="w-full border border-gray-300 mt-3 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Write your answer..."
                  value={answers[index] || ""}
                  onChange={(e) =>
                    handleText(index, e.target.value)
                  }
                />
              )}
            </div>
          ))}
        </div>

        {!loading && questions.length > 0 && (
          <button
            onClick={async () => {
              const res = await axios.post("/api/evaluate", {
                questions,
                answers,
                role,
              });

              const data = res.data;

              router.push(
                `/result?score=${data.score}&readiness=${data.readiness}&missing=${encodeURIComponent(
                  data.missing_skills.join(", ")
                )}&strengths=${encodeURIComponent(
                  data.strengths.join(", ")
                )}&feedback=${encodeURIComponent(
                  data.feedback
                )}&courses=${encodeURIComponent(JSON.stringify(data.courses))}`
              );
            }}
            className="mt-8 w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:scale-[1.02] hover:shadow-lg transition"
          >
            Submit Assessment →
          </button>
        )}
      </div>
    </main>
  );
}