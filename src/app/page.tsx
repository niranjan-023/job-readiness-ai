"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
	const [degree, setDegree] = useState("");
	const [role, setRole] = useState("");
	const router = useRouter();

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
		<main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4">
			<div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100 transition hover:shadow-2xl">

				<h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
					Job Readiness AI
				</h1>
				<p className="text-center text-gray-600 mb-6 text-sm">
					Evaluate your skills & get job-ready insights
				</p>

				<div className="space-y-5">

					<div>
						<label className="block text-sm font-semibold text-gray-800 mb-1">
							Your Degree
						</label>
						<input
							type="text"
							placeholder="e.g. MBA"
							className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 caret-black"
							value={degree}
							onChange={(e) => setDegree(e.target.value)}
						/>
					</div>

					<div>
						<label className="block text-sm font-semibold text-gray-800 mb-1">
							Target Role / Internship
						</label>
						<input
							type="text"
							placeholder="e.g. Marketing"
							className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 caret-black"
							value={role}
							onChange={(e) => setRole(e.target.value)}
						/>
					</div>

					<button
						onClick={handleSubmit}
						className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:scale-[1.02] hover:shadow-lg transition"
					>
						Continue →
					</button>
				</div>
			</div>
		</main>
	);
}