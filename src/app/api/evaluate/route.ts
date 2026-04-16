import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { questions, answers, role } = await req.json();

    let score = 0;
    let total = 0;

    const textQuestions: any[] = [];

    questions.forEach((q: any, index: number) => {
      const userAnswer = answers[index];

      if (q.type === "mcq") {
        total += 1;
        if (userAnswer && q.correct?.includes(userAnswer)) {
          score += 1;
        }
      }

      else if (q.type === "multi") {
        total += 1;

        const correct = q.correct || [];
        const user = userAnswer || [];

        const matchCount = user.filter((u: string) =>
          correct.includes(u)
        ).length;

        score += matchCount / correct.length;
      }

      else if (q.type === "text") {
        textQuestions.push({
          question: q.question,
          answer: userAnswer || "",
        });
      }
    });

    // Text evaluation
    let textScore = 0;

    if (textQuestions.length > 0) {
      const prompt = `
Evaluate the following answers for a ${role} candidate.

Give score (0–10) for each answer based on:
- clarity
- relevance
- practical understanding

Return ONLY JSON:
{
  "scores": [number]
}

Data:
${JSON.stringify(textQuestions)}
`;

      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      let raw = response.data.choices[0].message.content;
      raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

      const parsed = JSON.parse(raw);

      textScore =
        parsed.scores.reduce((a: number, b: number) => a + b, 0) /
        (parsed.scores.length * 10);

      total += 1;
      score += textScore;
    }

    const finalScore = Math.round((score / total) * 100);

    // 🧠 Skill gap analysis
    const analysisPrompt = `
You are an expert recruiter.

Analyze this candidate for role: ${role}

Score: ${finalScore}/100

User Answers:
${JSON.stringify(answers)}

Questions:
${JSON.stringify(questions)}

Return ONLY JSON:

{
  "readiness": number (0-100),
  "missing_skills": ["skill1", "skill2"],
  "strengths": ["skill1"],
  "feedback": "detailed feedback"
}
`;

    const analysisRes = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: analysisPrompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let rawAnalysis = analysisRes.data.choices[0].message.content;
    rawAnalysis = rawAnalysis.replace(/```json/g, "").replace(/```/g, "").trim();

    const analysis = JSON.parse(rawAnalysis);

    return NextResponse.json({
      score: finalScore,
      ...analysis,
    });

  } catch (err: any) {
    console.error(err.response?.data || err.message);
    return NextResponse.json(
      { error: "Evaluation failed" },
      { status: 500 }
    );
  }
}