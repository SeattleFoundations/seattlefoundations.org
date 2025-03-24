import { type SiteDataProps } from "../types/configDataTypes";

// Update this file with your site specific information
const siteData: SiteDataProps = {
	name: "Foundations",
	// Your website's title and description (meta fields)
	title: "Foundations - In-person, Invite-only startup community in Seattle",
	description:
		"Foundations' mission is to provide the scaffolding needed to support the most capable and ambitious Seattle founders without getting in the way of their most precious resource, time",

	// used on contact page and footer
	contact: {
		address1: "1234 Main Street",
		address2: "New York, NY 10001",
		phone: "(123) 456-7890",
		email: "art@seattlefoundations.org",
	},

	// Your information for blog post purposes
	author: {
		name: "Foundations",
		email: "art@seattlefoundations.org",
		twitter: "",
	},

	// default image for meta tags if the page doesn't have an image already
	defaultImage: {
		src: "/images/og_image.png",
		alt: "Foundations",
	},
};

export default siteData;
