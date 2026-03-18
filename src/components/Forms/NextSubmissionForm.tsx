import React, { useState } from "react";

interface FormData {
	name: string;
	email: string;
	linkedin: string;
	problem: string;
	expertise: string;
	anythingElseWeShouldKnow: string;
}

interface FormErrors {
	name?: string;
	email?: string;
	linkedin?: string;
	problem?: string;
	expertise?: string;
	ipAgreement?: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

const API_ENDPOINT = "https://app.fndtns.org/api/foundations-next/submissions";
const ERROR_FIELD_SELECTORS: Record<keyof FormErrors, string> = {
	name: "#name",
	email: "#email",
	linkedin: "#linkedin",
	problem: "#problem",
	expertise: "#expertise",
	ipAgreement: "#ipAgreement",
};

export const NextSubmissionForm = () => {
	const [formData, setFormData] = useState<FormData>({
		name: "",
		email: "",
		linkedin: "",
		problem: "",
		expertise: "",
		anythingElseWeShouldKnow: "",
	});
	const [ipAgreement, setIpAgreement] = useState(false);
	const [errors, setErrors] = useState<FormErrors>({});
	const [status, setStatus] = useState<SubmitStatus>("idle");
	const [errorMessage, setErrorMessage] = useState("");

	const scrollToFirstError = (newErrors: FormErrors) => {
		const firstErrorField = Object.keys(newErrors)[0] as keyof FormErrors | undefined;
		if (!firstErrorField) return;

		requestAnimationFrame(() => {
			const selector = ERROR_FIELD_SELECTORS[firstErrorField];
			const element = selector ? document.querySelector(selector) : null;
			if (element instanceof HTMLElement) {
				element.scrollIntoView({ behavior: "smooth", block: "center" });
				if ("focus" in element) {
					element.focus({ preventScroll: true });
				}
			}
		});
	};

	const isValidEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const isValidUrl = (url: string): boolean => {
		if (!url.trim()) return true;
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	};

	const validateForm = (): boolean => {
		const newErrors: FormErrors = {};

		if (!formData.name.trim()) {
			newErrors.name = "Name is required";
		}

		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!isValidEmail(formData.email)) {
			newErrors.email = "Please enter a valid email address";
		}

		if (formData.linkedin.trim() && !isValidUrl(formData.linkedin)) {
			newErrors.linkedin = "Please enter a valid LinkedIn URL";
		}

		if (!formData.problem.trim()) {
			newErrors.problem = "Please describe the business problem";
		}

		if (!formData.expertise.trim()) {
			newErrors.expertise = "Please tell us why you understand this problem";
		}

		if (!ipAgreement) {
			newErrors.ipAgreement = "You must agree before submitting";
		}

		setErrors(newErrors);
		if (Object.keys(newErrors).length > 0) {
			scrollToFirstError(newErrors);
			return false;
		}

		return true;
	};

	const normalizeUrl = (url: string): string => {
		const trimmed = url.trim();
		if (!trimmed) return trimmed;
		if (/^https?:\/\//i.test(trimmed)) return trimmed;
		return `https://${trimmed}`;
	};

	const handleLinkedinBlur = () => {
		const normalized = normalizeUrl(formData.linkedin);
		if (normalized !== formData.linkedin) {
			setFormData((prev) => ({ ...prev, linkedin: normalized }));
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		if (errors[name as keyof FormErrors]) {
			setErrors((prev) => ({ ...prev, [name]: undefined }));
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!validateForm()) return;

		setStatus("loading");
		setErrorMessage("");

		const payload = {
			name: formData.name.trim(),
			email: formData.email.trim(),
			linkedin: normalizeUrl(formData.linkedin),
			problem: formData.problem.trim(),
			expertise: formData.expertise.trim(),
			anythingElseWeShouldKnow: formData.anythingElseWeShouldKnow.trim(),
		};

		try {
			const response = await fetch(API_ENDPOINT, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			const data = await response.json();

			if (response.ok && data.success) {
				setStatus("success");
			} else {
				throw new Error(data.message || "Something went wrong. Please try again.");
			}
		} catch (error) {
			setStatus("error");
			setErrorMessage(
				error instanceof Error ? error.message : "An unexpected error occurred"
			);
		}
	};

	if (status === "success") {
		return (
			<div className="rounded-xl border border-success/20 bg-success/10 p-8 text-center">
				<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
					<svg
						className="h-8 w-8 text-success-foreground"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
					</svg>
				</div>
				<h3 className="mb-2 text-xl font-semibold text-foreground">
					Submission Received
				</h3>
			<p className="text-muted-foreground">
				Thanks for sending this in. We&apos;ll review the problem and follow up soon,
				usually no more than a week.
			</p>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="space-y-3 pb-2">
				<h2 className="text-xl font-semibold leading-tight tracking-tight text-purple-700 dark:text-purple-300 md:text-2xl">
					What to include
				</h2>
				<p className="leading-7 text-muted-foreground">
					Tell us what is broken, why it matters, and why you are close enough to the problem
					to understand it clearly. If the problem is compelling, we&apos;ll start with a meeting
					to get aligned before deciding whether it&apos;s something we should help solve.
				</p>
			</div>

			{status === "error" && (
				<div className="rounded-lg border border-error/20 bg-error/10 p-4">
					<p className="text-sm text-error-foreground">{errorMessage}</p>
				</div>
			)}

			<div className="space-y-2">
				<label htmlFor="name" className="block text-sm font-medium text-foreground">
					Name <span className="text-error">*</span>
				</label>
				<input
					type="text"
					id="name"
					name="name"
					value={formData.name}
					onChange={handleInputChange}
					className={`form__input ${errors.name ? "!border-error" : ""}`}
					placeholder="Your full name"
				/>
				{errors.name && <p className="text-sm text-error">{errors.name}</p>}
			</div>

			<div className="space-y-2">
				<label htmlFor="email" className="block text-sm font-medium text-foreground">
					Email <span className="text-error">*</span>
				</label>
				<input
					type="email"
					id="email"
					name="email"
					value={formData.email}
					onChange={handleInputChange}
					className={`form__input ${errors.email ? "!border-error" : ""}`}
					placeholder="you@example.com"
				/>
				{errors.email && <p className="text-sm text-error">{errors.email}</p>}
			</div>

			<div className="space-y-2">
				<label htmlFor="linkedin" className="block text-sm font-medium text-foreground">
					LinkedIn URL
				</label>
			<input
				type="url"
				id="linkedin"
				name="linkedin"
				value={formData.linkedin}
				onChange={handleInputChange}
				onBlur={handleLinkedinBlur}
				className={`form__input ${errors.linkedin ? "!border-error" : ""}`}
				placeholder="https://linkedin.com/in/yourprofile"
			/>
				{errors.linkedin && <p className="text-sm text-error">{errors.linkedin}</p>}
			</div>

			<div className="space-y-2">
				<label htmlFor="problem" className="block text-sm font-medium text-foreground">
					What is the business problem? <span className="text-error">*</span>
				</label>
				<textarea
					id="problem"
					name="problem"
					value={formData.problem}
					onChange={handleInputChange}
					rows={5}
					className={`form__input resize-y ${errors.problem ? "!border-error" : ""}`}
					placeholder="Describe the painful operational problem as clearly as you can."
				/>
				{errors.problem && <p className="text-sm text-error">{errors.problem}</p>}
			</div>

			<div className="space-y-2">
				<label htmlFor="expertise" className="block text-sm font-medium text-foreground">
					Why do you understand this problem? <span className="text-error">*</span>
				</label>
				<textarea
					id="expertise"
					name="expertise"
					value={formData.expertise}
					onChange={handleInputChange}
					rows={4}
					className={`form__input resize-y ${errors.expertise ? "!border-error" : ""}`}
					placeholder="Tell us about your role, experience, or domain knowledge."
				/>
				{errors.expertise && <p className="text-sm text-error">{errors.expertise}</p>}
			</div>

			<div className="space-y-2">
				<label
					htmlFor="anythingElseWeShouldKnow"
					className="block text-sm font-medium text-foreground"
				>
					Anything else we should know?
				</label>
				<textarea
					id="anythingElseWeShouldKnow"
					name="anythingElseWeShouldKnow"
					value={formData.anythingElseWeShouldKnow}
					onChange={handleInputChange}
					rows={4}
					className="form__input resize-y"
					placeholder="Optional context, intros, or anything else that would help us evaluate the problem."
				/>
			</div>

		<div className="space-y-2">
			<label className="flex items-start gap-3 cursor-pointer group">
				<input
					type="checkbox"
					id="ipAgreement"
					checked={ipAgreement}
					onChange={(e) => {
						setIpAgreement(e.target.checked);
						if (errors.ipAgreement) {
							setErrors((prev) => ({ ...prev, ipAgreement: undefined }));
						}
					}}
					className={`mt-1 h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 dark:border-gray-600 dark:bg-gray-800 ${errors.ipAgreement ? "!border-error" : ""}`}
				/>
				<span className="text-sm text-foreground leading-snug">
					I agree that what I am submitting is a problem that I have identified and not
					protected or protectable intellectual property. <span className="text-error">*</span>
				</span>
			</label>
			{errors.ipAgreement && <p className="text-sm text-error">{errors.ipAgreement}</p>}
		</div>

		<button
			type="submit"
			disabled={status === "loading"}
			className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-purple-700 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-purple-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:pointer-events-none disabled:opacity-50 dark:bg-purple-600 dark:hover:bg-purple-500 sm:w-auto"
		>
				{status === "loading" ? "Submitting..." : "Submit Your Problem"}
			</button>
		</form>
	);
};
