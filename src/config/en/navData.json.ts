import { type navItem } from "../types/configDataTypes";

const navConfig: navItem[] = [
	{
		text: "Manifesto",
		link: "/static/manifesto",
	},
	{
		text: "Public Events",
		link: "/events",
	},
	// {
	// 	text: "Companies",
	// 	link: "/companies",
	// },
	{
		text: "Founders in Residence",
		link: "https://ai.seattlefoundations.org/kb/founder-in-residence",
		newTab: true,
	},
	{
		text: "Companies",
		link: "/companies",
	},
	{
		text: "Startup Jobs",
		link: "/jobs",
	},
	{
		text: "Advocate",
		link: "/advocate",
	},
];

export default navConfig;
