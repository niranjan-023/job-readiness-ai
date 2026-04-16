"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
	const [degree, setDegree] = useState("");
	const router = useRouter();
	const [role, setRole] = useState("");

	const handleSubmit = () => {
		if (!degree || !role) {
			alert("Please fill all fields");
			return;
		}

		router.push(
			`/assessment?degree=${encodeURIComponent(degree)}&role=${encodeURIComponent(role)}`
		);
	};

	return (
		<main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
			<div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
				<h1 className="text-2xl font-bold mb-6 text-center">
					Job Readiness AI
				</h1>

				<div className="space-y-4">
					{/* Degree */}
					<div>
						<label className="block mb-1 font-medium">
							Your Degree
						</label>
						<input
							type="text"
							placeholder="e.g. B.Tech CSE"
							className="w-full border rounded-lg p-2"
							value={degree}
							onChange={(e) => setDegree(e.target.value)}
						/>
					</div>

					{/* Role */}
					<div>
						<label className="block mb-1 font-medium">
							Target Role / Internship
						</label>
						<input
							type="text"
							placeholder="e.g. Frontend Developer"
							className="w-full border rounded-lg p-2"
							value={role}
							onChange={(e) => setRole(e.target.value)}
						/>
					</div>

					{/* Submit */}
					<button
						onClick={handleSubmit}
						className="w-full bg-black text-white py-2 rounded-lg hover:opacity-90"
					>
						Continue
					</button>
				</div>
			</div>
		</main>
	);
}