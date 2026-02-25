import React from "react";

export const NewsletterForm = ({ formId, userGroup = "Newsletter" }: { formId: string; userGroup?: string }) => {
	const [email, setEmail] = React.useState("");
	const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
	const [errorMessage, setErrorMessage] = React.useState("");
	const formRef = React.useRef<HTMLFormElement>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setStatus("loading");
		setErrorMessage("");

		try {
			// Use the URLSearchParams API to format data as application/x-www-form-urlencoded
			const formData = new URLSearchParams();
			formData.append("email", email);
			formData.append("userGroup", userGroup);

			const response = await fetch(`https://app.loops.so/api/newsletter-form/${formId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: formData,
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Something went wrong");
			}

			if (data.success) {
				setStatus("success");
				setEmail("");
			} else {
				throw new Error(data.message || "Something went wrong");
			}
		} catch (error) {
			setStatus("error");
			setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
		}
	};

	// As a fallback, if the JavaScript approach fails, let the form submit normally
	const handleManualSubmit = () => {
		if (formRef.current && status === "error") {
			formRef.current.method = "post";
			formRef.current.action = `https://app.loops.so/api/newsletter-form/${formId}`;
			formRef.current.submit();
		}
	};

	if (status === "success") {
		return (
			<div className="rounded-lg bg-white p-6 shadow-lg">
				<h3 className="mb-2 text-lg font-medium text-gray-900">Thank you!</h3>
				<p className="text-gray-600">You've been successfully signed up.</p>
			</div>
		);
	}

	return (
		<form ref={formRef} onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-lg">
			<div className="mb-4">
				<label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
					Email
				</label>
				<input
					type="email"
					name="email"
					id="newsletter-email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					className="focus:ring-primary-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:outline-none"
					placeholder="Enter your email address"
					disabled={status === "loading"}
				/>
			</div>
			<input type="hidden" name="userGroup" value={userGroup} />
			{status === "error" && (
				<div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
					{errorMessage || "Failed to subscribe. Please try again."}
					<button
						type="button"
						onClick={handleManualSubmit}
						className="ml-2 text-red-800 underline"
					>
						Try standard submission
					</button>
				</div>
			)}
			<button
				type="submit"
				disabled={status === "loading"}
				className="bg-primary-500 hover:bg-primary-600 w-full rounded-md px-4 py-2 font-medium text-white transition duration-300 disabled:bg-gray-400"
			>
				{status === "loading" ? "Signing up..." : "Sign up"}
			</button>
		</form>
	);
};
