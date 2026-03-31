import { type navItem } from "../types/configDataTypes";

const navConfig: navItem[] = [
	{
		text: "Manifesto",
		link: "/static/manifesto",
	},
	// {
	// 	text: "Companies",
	// 	link: "/companies",
	// },
	{
		text: "Founders in Residence",
		link: "https://app.fndtns.org/kb/founder-in-residence",
		newTab: true,
	},
	{
		text: "NEXT",
		link: "/next",
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
		text: "Events",
		link: "/events",
	},
];

export default navConfig;
