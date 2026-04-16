"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

export default function AssessmentPage() {
	const searchParams = useSearchParams();

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

				// Clean AI response
				raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

				const parsed = JSON.parse(raw);
				setQuestions(parsed.questions);
			} catch (err) {
				console.error("Error parsing questions", err);
			} finally {
				setLoading(false);
			}
		};

		fetchQuestions();
	}, [degree, role]);

	// Handlers
	const handleSingleSelect = (qIndex: number, value: string) => {
		setAnswers((prev: any) => ({
			...prev,
			[qIndex]: value,
		}));
	};

	const handleMultiSelect = (qIndex: number, value: string) => {
		setAnswers((prev: any) => {
			const current = Array.isArray(prev[qIndex]) ? prev[qIndex] : [];

			if (current.includes(value)) {
				return {
					...prev,
					[qIndex]: current.filter((v: string) => v !== value),
				};
			} else {
				return {
					...prev,
					[qIndex]: [...current, value],
				};
			}
		});
	};

	const handleText = (qIndex: number, value: string) => {
		setAnswers((prev: any) => ({
			...prev,
			[qIndex]: value,
		}));
	};

	return (
		<main className="min-h-screen bg-gray-100 p-4">
			<div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow">
				<h1 className="text-2xl font-bold mb-4">
					Assessment Questions
				</h1>

				{loading && <p>Generating questions...</p>}

				{!loading && questions.length === 0 && (
					<p>No questions generated.</p>
				)}

				<div className="space-y-6">
					{questions.map((q, index) => (
						<div key={index} className="border p-4 rounded-lg">
							<p className="font-medium">
								{index + 1}. {q.question}
							</p>

							{/* MCQ */}
							{q.type === "mcq" && (
								<div className="mt-2 space-y-1">
									{q.options?.map((opt: string, i: number) => (
										<label key={i} className="block">
											<input
												type="radio"
												name={`q-${index}`}
												className="mr-2"
												checked={answers[index] === opt}
												onChange={() =>
													handleSingleSelect(index, opt)
												}
											/>
											{opt}
										</label>
									))}
								</div>
							)}

							{/* Multi */}
							{q.type === "multi" && (
								<div className="mt-2 space-y-1">
									{q.options?.map((opt: string, i: number) => (
										<label key={i} className="block">
											<input
												type="checkbox"
												className="mr-2"
												checked={(answers[index] || []).includes(opt)}
												onChange={() =>
													handleMultiSelect(index, opt)
												}
											/>
											{opt}
										</label>
									))}
								</div>
							)}

							{/* Text */}
							{q.type === "text" && (
								<textarea
									className="w-full border mt-2 p-2 rounded"
									placeholder="Your answer..."
									value={answers[index] || ""}
									onChange={(e) =>
										handleText(index, e.target.value)
									}
								/>
							)}
						</div>
					))}
				</div>

				{/* Submit Button INSIDE card */}
				{!loading && questions.length > 0 && (
					<button
						onClick={async () => {
							try {
								const res = await axios.post("/api/evaluate", {
									questions,
									answers,
									role,
								});

								console.log("Final Score:", res.data.score);
								alert(
									`Score: ${res.data.score} \n Readiness: ${res.data.readiness} \n Missing Skills: ${res.data.	missing_skills.join(", ")}`
								);
							} catch (err) {
								console.error("Evaluation error", err);
							}
						}}
						className="mt-6 w-full bg-black text-white py-2 rounded-lg"
					>
						Submit Answers
					</button>
				)}
			</div>
		</main>
	);
}