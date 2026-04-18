"use client";

import { useSearchParams } from "next/navigation";

export default function ResultPage() {
  const params = useSearchParams();

  const score = params.get("score");
  const readiness = params.get("readiness");
  const missing = params.get("missing");
  const strengths = params.get("strengths");
  const feedback = params.get("feedback");

  const coursesParam = params.get("courses");

  const courses = coursesParam
    ? JSON.parse(decodeURIComponent(coursesParam))
    : [];

  const totalHours = courses.reduce((sum: number, skill: any) => {
    return (
      sum +
      skill.resources.reduce((s: number, r: any) => s + r.hours, 0)
    );
  }, 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">

        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Your Result
        </h1>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Score</p>
            <p className="text-2xl font-bold text-indigo-600">{score}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Readiness</p>
            <p className="text-2xl font-bold text-blue-600">{readiness}%</p>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 mb-1">
            Missing Skills
          </h2>
          <p className="text-gray-700">{missing}</p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 mb-1">
            Strengths
          </h2>
          <p className="text-gray-700">{strengths}</p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 mb-1">
            Feedback
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {feedback}
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 mb-2">
            Recommended Courses
          </h2>

          {courses.map((item: any, index: number) => (
            <div key={index} className="mb-4">
              <p className="font-semibold text-indigo-600">
                {item.skill}
              </p>

              {item.resources.map((res: any, i: number) => {
                let link = "#";

                if (res.platform === "YouTube") {
                  link = `https://www.youtube.com/results?search_query=${encodeURIComponent(res.search_query)}`;
                } else if (res.platform === "Coursera") {
                  link = `https://www.coursera.org/search?query=${encodeURIComponent(res.search_query)}`;
                } else if (res.platform === "Udemy") {
                  link = `https://www.udemy.com/courses/search/?q=${encodeURIComponent(res.search_query)}`;
                }

                return (
                  <a
                    key={i}
                    href={link}
                    target="_blank"
                    className="block text-blue-600 hover:underline text-sm"
                  >
                    {res.title} ({res.platform})
                  </a>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}