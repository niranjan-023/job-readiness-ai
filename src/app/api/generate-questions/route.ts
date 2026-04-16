import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
	try {
		const { degree, role } = await req.json();

		const prompt = `
You are an expert hiring manager and industry evaluator.

Generate a comprehensive job readiness assessment.

Candidate Details:
- Degree: ${degree}
- Target Role: ${role}

Your goal:
Evaluate FULL job readiness based on current industry standards.

IMPORTANT:
Do NOT focus only on domain knowledge.
Cover ALL required skill dimensions.

Include questions from these categories:

1. Core Domain Skills (role-specific knowledge)
2. Technical/Tools Skills (e.g., Excel, tools, platforms, software)
3. Practical/Scenario-Based Skills (real-world situations)
4. Communication & Soft Skills
5. Problem Solving & Analytical Thinking
6. Industry Awareness & Trends

Rules:
- Generate 12 to 18 questions based on role complexity and requirement
- Mix of:
  - MCQ
  - Multi-select
  - Descriptive (real-world scenarios)
- Ensure balanced distribution across categories
- Questions should reflect REAL hiring expectations (not textbook theory)
- Include practical and decision-making questions

Return ONLY JSON (no backticks, no explanation):

{
  "questions": [
    {
      "type": "mcq",
      "category": "Core Domain",
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correct": ["A"]
    },
    {
      "type": "multi",
      "category": "Tools",
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correct": ["A","C"]
    },
    {
      "type": "text",
      "category": "Scenario",
      "question": "string"
    }
  ]
}
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

		const content = response.data.choices[0].message.content;

		return NextResponse.json({ data: content });
	} catch (error: any) {
		console.error(error.response?.data || error.message);
		return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 });
	}
}