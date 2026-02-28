export const companyLogoUrl = (relativeUrl: string) => {
	return new URL(relativeUrl, "https://ai.fndtns.org").toString();
};
