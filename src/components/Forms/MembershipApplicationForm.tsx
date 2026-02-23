import React, { useState } from "react";

// Types
interface FormData {
	name: string;
	email: string;
	linkedin_url: string;
	location: string;
	application_type: string;
	stage: string[];
	working_status: string;
	areas_of_interest: string;
	about_me: string;
	project_link: string;
	looking_for: string[];
	referral_source: string;
}

interface FormErrors {
	name?: string;
	email?: string;
	about_me?: string;
	linkedin_url?: string;
	location?: string;
	stage?: string;
	working_status?: string;
	areas_of_interest?: string;
	looking_for?: string;
	referral_source?: string;
	project_link?: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

// Constants
const STAGE_OPTIONS = [
	"Interested in founding in the future",
	"Actively exploring ideas",
	"Built a basic MVP/prototype",
	"Working product with early customers",
	"Fundraising",
];

const WORKING_STATUS_OPTIONS = [
	{ label: "Full-time", value: "full-time" },
	{ label: "Part-time (still have a day job)", value: "part-time" },
	{ label: "Not yet started", value: "not-started" },
];

const APPLICATION_TYPE_OPTIONS = [
	{ label: "Founder in Residence", value: "fir" },
	{ label: "Member", value: "member" },
];

const LOOKING_FOR_OPTIONS = [
	"Find a co-founder",
	"Help with idea discovery & validation",
	"Keep myself accountable",
	"Find first employees",
	"Secure funding",
];

const API_ENDPOINT = "https://ai.seattlefoundations.org/api/membership/requests";

export const MembershipApplicationForm = () => {
	const [formData, setFormData] = useState<FormData>({
		name: "",
		email: "",
		linkedin_url: "",
		location: "",
		application_type: "fir",
		stage: [],
		working_status: "",
		areas_of_interest: "",
		about_me: "",
		project_link: "",
		looking_for: [],
		referral_source: "",
	});

	const [errors, setErrors] = useState<FormErrors>({});
	const [status, setStatus] = useState<SubmitStatus>("idle");
	const [errorMessage, setErrorMessage] = useState("");

	// Validation helpers
	const isValidEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const isValidUrl = (url: string): boolean => {
		if (!url) return true; // Empty is valid for optional fields
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
			newErrors.name = "Full name is required";
		}

		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!isValidEmail(formData.email)) {
			newErrors.email = "Please enter a valid email address";
		}

		if (!formData.linkedin_url.trim()) {
			newErrors.linkedin_url = "LinkedIn URL is required";
		} else if (!isValidUrl(formData.linkedin_url)) {
			newErrors.linkedin_url = "Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/yourprofile)";
		}

		if (!formData.location.trim()) {
			newErrors.location = "Location is required";
		}

		if (formData.stage.length === 0) {
			newErrors.stage = "Please select at least one stage";
		}

		if (!formData.working_status) {
			newErrors.working_status = "Please select your working status";
		}

		if (!formData.areas_of_interest.trim()) {
			newErrors.areas_of_interest = "Please enter your areas of interest";
		}

		if (!formData.about_me.trim()) {
			newErrors.about_me = "Please tell us about yourself and what you're building";
		}

		if (formData.looking_for.length === 0) {
			newErrors.looking_for = "Please select at least one option";
		}

		if (!formData.referral_source.trim()) {
			newErrors.referral_source = "Please tell us how you heard about Foundations";
		}

		// Project link is optional, but validate URL format if provided
		if (formData.project_link && !isValidUrl(formData.project_link)) {
			newErrors.project_link = "Please enter a valid project URL (e.g., https://your-startup.com)";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Input handlers
	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		
		// For URL fields, validate in real-time and only clear error if valid
		if (name === "linkedin_url" || name === "project_link") {
			if (value.trim() === "") {
				// Clear error if field is empty (project_link is optional)
				if (name === "project_link") {
					setErrors((prev) => ({ ...prev, [name]: undefined }));
				}
				// Keep error for linkedin_url if empty (it's required)
			} else if (isValidUrl(value)) {
				// Clear error only if URL is valid
				setErrors((prev) => ({ ...prev, [name]: undefined }));
			}
			// If URL is invalid, keep the error
		} else {
			// For non-URL fields, clear error when user starts typing
			if (errors[name as keyof FormErrors]) {
				setErrors((prev) => ({ ...prev, [name]: undefined }));
			}
		}
	};

	const handleCheckboxChange = (field: "stage" | "looking_for", value: string) => {
		setFormData((prev) => {
			const currentValues = prev[field];
			if (currentValues.includes(value)) {
				return { ...prev, [field]: currentValues.filter((v) => v !== value) };
			} else {
				return { ...prev, [field]: [...currentValues, value] };
			}
		});
		// Clear error when user makes a selection
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const handleRadioChange = (value: string) => {
		setFormData((prev) => ({ ...prev, working_status: value }));
		if (errors.working_status) {
			setErrors((prev) => ({ ...prev, working_status: undefined }));
		}
	};

	const handleApplicationTypeChange = (value: string) => {
		setFormData((prev) => ({ ...prev, application_type: value }));
	};

	// URL field blur handler for immediate validation feedback
	const handleUrlBlur = (fieldName: "linkedin_url" | "project_link") => {
		const value = formData[fieldName];
		const newErrors = { ...errors };

		if (fieldName === "linkedin_url") {
			if (!value.trim()) {
				newErrors.linkedin_url = "LinkedIn URL is required";
			} else if (!isValidUrl(value)) {
				newErrors.linkedin_url = "Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/yourprofile)";
			} else {
				delete newErrors.linkedin_url;
			}
		} else if (fieldName === "project_link") {
			// Project link is optional
			if (value.trim() && !isValidUrl(value)) {
				newErrors.project_link = "Please enter a valid project URL (e.g., https://your-startup.com)";
			} else {
				delete newErrors.project_link;
			}
		}

		setErrors(newErrors);
	};

	// Form submission
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setStatus("loading");
		setErrorMessage("");

		// Convert form data to API format
		const partTime =
			formData.working_status === "part-time" || formData.working_status === "not-started";

		// Parse areas of interest from comma-separated string to array
		const areasOfInterest = formData.areas_of_interest
			.split(",")
			.map((s) => s.trim())
			.filter((s) => s.length > 0);

		const payload: Record<string, unknown> = {
			name: formData.name.trim(),
			email: formData.email.trim(),
			about_me: formData.about_me.trim(),
			linkedin_url: formData.linkedin_url.trim(),
			location: formData.location.trim(),
			application_type: formData.application_type,
			stage: formData.stage,
			part_time: partTime,
			areas_of_interest: areasOfInterest,
			looking_for: formData.looking_for,
			referral_source: formData.referral_source.trim(),
		};

		// Only include project_link if provided (optional field)
		if (formData.project_link.trim()) {
			payload.project_link = formData.project_link.trim();
		}

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
				throw new Error(data.error || "Something went wrong. Please try again.");
			}
		} catch (error) {
			setStatus("error");
			setErrorMessage(
				error instanceof Error ? error.message : "An unexpected error occurred"
			);
		}
	};

	// Success state
	if (status === "success") {
		return (
			<div className="rounded-xl bg-success/10 border border-success/20 p-8 text-center">
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
					Application Submitted!
				</h3>
				<p className="text-muted-foreground">
					Thank you for your interest in Foundations. We'll review your
					application and get back to you soon.
				</p>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-8">
			{/* Error Banner */}
			{status === "error" && (
				<div className="rounded-lg bg-error/10 border border-error/20 p-4">
					<p className="text-sm text-error-foreground">{errorMessage}</p>
				</div>
			)}

			{/* Name */}
			<div className="space-y-2">
				<label htmlFor="name" className="block text-sm font-medium text-foreground">
					Full Name <span className="text-error">*</span>
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

			{/* Email */}
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

			{/* LinkedIn URL */}
			<div className="space-y-2">
				<label
					htmlFor="linkedin_url"
					className="block text-sm font-medium text-foreground"
				>
					LinkedIn URL <span className="text-error">*</span>
				</label>
				<input
					type="url"
					id="linkedin_url"
					name="linkedin_url"
					value={formData.linkedin_url}
					onChange={handleInputChange}
					onBlur={() => handleUrlBlur("linkedin_url")}
					className={`form__input ${errors.linkedin_url ? "!border-error" : ""}`}
					placeholder="https://linkedin.com/in/yourprofile"
				/>
				{errors.linkedin_url && (
					<p className="text-sm text-error">{errors.linkedin_url}</p>
				)}
			</div>

			{/* Location */}
			<div className="space-y-2">
				<label htmlFor="location" className="block text-sm font-medium text-foreground">
					What city/neighborhood are you located in? <span className="text-error">*</span>
				</label>
				<input
					type="text"
					id="location"
					name="location"
					value={formData.location}
					onChange={handleInputChange}
					className={`form__input ${errors.location ? "!border-error" : ""}`}
					placeholder="e.g., Capitol Hill, Seattle"
				/>
				{errors.location && <p className="text-sm text-error">{errors.location}</p>}
			</div>

			{/* Application Type */}
			<fieldset className="space-y-3">
				<legend className="text-sm font-medium text-foreground">
					Application Type
				</legend>
				<div className="space-y-2">
					{APPLICATION_TYPE_OPTIONS.map((option) => (
						<label
							key={option.value}
							className="flex items-center gap-3 cursor-pointer group"
						>
							<input
								type="radio"
								name="application_type"
								value={option.value}
								checked={formData.application_type === option.value}
								onChange={() => handleApplicationTypeChange(option.value)}
								className="h-5 w-5 border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 dark:border-gray-600 dark:bg-gray-800"
							/>
							<span className="text-sm text-foreground group-hover:text-primary transition-colors">
								{option.label}
							</span>
						</label>
					))}
				</div>
				<p className="text-xs text-muted-foreground">
					Acceptance directly into membership requires a strong track record of building and scaling current or prior startups.
				</p>
			</fieldset>

			{/* Stage */}
			<fieldset className="space-y-3">
				<legend className="text-sm font-medium text-foreground">
					What stage are you at in your founding journey? (select all that apply) <span className="text-error">*</span>
				</legend>
				<div className="space-y-2">
					{STAGE_OPTIONS.map((option) => (
						<label
							key={option}
							className="flex items-center gap-3 cursor-pointer group"
						>
							<input
								type="checkbox"
								checked={formData.stage.includes(option)}
								onChange={() => handleCheckboxChange("stage", option)}
								className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 dark:border-gray-600 dark:bg-gray-800"
							/>
							<span className="text-sm text-foreground group-hover:text-primary transition-colors">
								{option}
							</span>
						</label>
					))}
				</div>
				{errors.stage && <p className="text-sm text-error">{errors.stage}</p>}
			</fieldset>

			{/* Working Status */}
			<fieldset className="space-y-3">
				<legend className="text-sm font-medium text-foreground">
					Are you currently working on your startup? <span className="text-error">*</span>
				</legend>
				<div className="space-y-2">
					{WORKING_STATUS_OPTIONS.map((option) => (
						<label
							key={option.value}
							className="flex items-center gap-3 cursor-pointer group"
						>
							<input
								type="radio"
								name="working_status"
								value={option.value}
								checked={formData.working_status === option.value}
								onChange={() => handleRadioChange(option.value)}
								className="h-5 w-5 border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 dark:border-gray-600 dark:bg-gray-800"
							/>
							<span className="text-sm text-foreground group-hover:text-primary transition-colors">
								{option.label}
							</span>
						</label>
					))}
				</div>
				{errors.working_status && <p className="text-sm text-error">{errors.working_status}</p>}
			</fieldset>

			{/* Areas of Interest */}
			<div className="space-y-2">
				<label
					htmlFor="areas_of_interest"
					className="block text-sm font-medium text-foreground"
				>
					Tell us about your areas of interest <span className="text-error">*</span>
				</label>
				<input
					type="text"
					id="areas_of_interest"
					name="areas_of_interest"
					value={formData.areas_of_interest}
					onChange={handleInputChange}
					className={`form__input ${errors.areas_of_interest ? "!border-error" : ""}`}
					placeholder="e.g., AI, Healthcare, Fintech"
				/>
				<p className="text-xs text-muted-foreground">
					Separate multiple interests with commas
				</p>
				{errors.areas_of_interest && <p className="text-sm text-error">{errors.areas_of_interest}</p>}
			</div>

			{/* About Me */}
			<div className="space-y-2">
				<label htmlFor="about_me" className="block text-sm font-medium text-foreground">
					Write a paragraph about yourself and what you are currently building{" "}
					<span className="text-error">*</span>
				</label>
				<textarea
					id="about_me"
					name="about_me"
					value={formData.about_me}
					onChange={handleInputChange}
					rows={6}
					className={`form__input resize-y ${errors.about_me ? "!border-error" : ""}`}
					placeholder="Tell us about your background, what you're working on, and what excites you about building..."
				/>
				{errors.about_me && <p className="text-sm text-error">{errors.about_me}</p>}
			</div>

			{/* Project Link */}
			<div className="space-y-2">
				<label
					htmlFor="project_link"
					className="block text-sm font-medium text-foreground"
				>
					Link your project (if applicable)
				</label>
				<input
					type="url"
					id="project_link"
					name="project_link"
					value={formData.project_link}
					onChange={handleInputChange}
					onBlur={() => handleUrlBlur("project_link")}
					className={`form__input ${errors.project_link ? "!border-error" : ""}`}
					placeholder="https://your-startup.com"
				/>
				{errors.project_link && (
					<p className="text-sm text-error">{errors.project_link}</p>
				)}
			</div>

			{/* Looking For */}
			<fieldset className="space-y-3">
				<legend className="text-sm font-medium text-foreground">
					What are you looking for in this community? (select all that apply) <span className="text-error">*</span>
				</legend>
				<div className="space-y-2">
					{LOOKING_FOR_OPTIONS.map((option) => (
						<label
							key={option}
							className="flex items-center gap-3 cursor-pointer group"
						>
							<input
								type="checkbox"
								checked={formData.looking_for.includes(option)}
								onChange={() => handleCheckboxChange("looking_for", option)}
								className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 dark:border-gray-600 dark:bg-gray-800"
							/>
							<span className="text-sm text-foreground group-hover:text-primary transition-colors">
								{option}
							</span>
						</label>
					))}
				</div>
				{errors.looking_for && <p className="text-sm text-error">{errors.looking_for}</p>}
			</fieldset>

			{/* Referral Source */}
			<div className="space-y-2">
				<label
					htmlFor="referral_source"
					className="block text-sm font-medium text-foreground"
				>
					How did you hear about Foundations? <span className="text-error">*</span>
				</label>
				<input
					type="text"
					id="referral_source"
					name="referral_source"
					value={formData.referral_source}
					onChange={handleInputChange}
					className={`form__input ${errors.referral_source ? "!border-error" : ""}`}
					placeholder="e.g., Friend, LinkedIn, X, Event"
				/>
				{errors.referral_source && <p className="text-sm text-error">{errors.referral_source}</p>}
			</div>

			{/* Submit Button */}
			<button
				type="submit"
				disabled={status === "loading"}
				className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50"
			>
				{status === "loading" ? (
					<>
						<svg
							className="h-5 w-5 animate-spin"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
						Submitting...
					</>
				) : (
					"Submit Application"
				)}
			</button>
		</form>
	);
};
