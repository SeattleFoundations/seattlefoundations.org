import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

// Type-check frontmatter using a schema
const blogCollection = defineCollection({
	loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/blog" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// reference the authors collection https://docs.astro.build/en/guides/content-collections/#defining-collection-references
			authors: z.array(reference("authors")),
			// Transform string to Date object
			pubDate: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),
			updatedDate: z
				.string()
				.optional()
				.transform((str) => (str ? new Date(str) : undefined)),
			heroImage: image(),
			categories: z.array(z.string()),
			// blog posts will be excluded from build if draft is "true"
			draft: z.boolean().optional(),
		}),
});

// authors
const authorsCollection = defineCollection({
	loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/authors" }),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			avatar: image(), // author page link. Could be a personal website, github, twitter, whatever you want
		}),
});

// services
const staticCollection = defineCollection({
	loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/static" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			image: image(),
		}),
});

// other pages
const otherPagesCollection = defineCollection({
	loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/otherPages" }),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string(),
			draft: z.boolean().optional(),
		}),
});

// companies
const companiesCollection = defineCollection({
	loader: async () => {
		const response = await fetch("https://ai.seattlefoundations.org/api/companies");
		const data = await response.json();
		// Extract companies array from the response
		return data.success && data.data && data.data.companies ? data.data.companies : [];
	},
	schema: z.object({
		id: z.string().uuid(),
		slug: z.string(),
		name: z.string(),
		url: z.string().url().optional().nullable(),
		description: z.string().optional().nullable(),
		logo: z.string().optional().nullable(),
		memberCount: z.number().optional(),
		members: z
			.array(
				z.object({
					name: z.string(),
					linkedin: z.string().url().optional(),
				}),
			)
			.optional(),
	}),
});

export const collections = {
	blog: blogCollection,
	authors: authorsCollection,
	static: staticCollection,
	otherPages: otherPagesCollection,
	companies: companiesCollection,
};
