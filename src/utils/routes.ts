export const companyLogoUrl = (relativeUrl: string) => {
	return new URL(relativeUrl, "https://app.fndtns.org").toString();
};
