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
		link: "https://hill-newsprint-479.notion.site/Founder-in-Residence-Program-184bcd8b70e4804a8836cf1193af7d02",
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
		text: "Merch",
		link: "https://merch.seattlefoundations.org/",
	},
	{
		text: "Almost Live!",
		link: "/almost-live",
	},
];

export default navConfig;
