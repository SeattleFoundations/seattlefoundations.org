export const companyLogoUrl = (relativeUrl: string) => {
	return new URL(relativeUrl, "https://ai.seattlefoundations.org").toString();
};
