# Seattle Foundations

Welcome to the Seattle Foundations website [https://seattlefoundations.org](https://seattlefoundations.org).

This website is built and is maintained by the community. If you have any questions or feedback, please reach out to Art Litvinau over email or Foundations Slack (*art at seattlefoundations.org*).

## Getting Started

1. Install dependencies: `pnpm install`
2. Build the site: `pnpm build`
3. Start the development server: `pnpm dev`

The site will be available at [http://localhost:4321](http://localhost:4321)

## Contributing

Anyone is welcome to contributing by forking this repository and submitting a pull request.

### Contributing to the blog

**Create author profile first:**

1. Create an author folder in the `src/data/authors` directory.
2. Add a `index.md` file to the folder and add your author details to it.

```
---
name: "Patrick Ellis"
avatar: ./avatar.jpg
---
```

**Then create a blog post:**

1. Create a a folder in the `src/data/blog/en` directory.
2. Add a `index.md` file to the folder and add your blog post content to it.
3. Store all the images in the same folder as the `index.md` file.
4. Reference the author's slug created in the previous step.
5. Create a a hero image and store it under `heroImage.jpg`.

Typical `index.md` file structure:

```md
---
title: "AI Engineering + ‘Vibe Coding’ Tips"
description: >-
  Patrick Ellis shares practical insights on how 'vibe coding' and AI engineering tools transformed his team's development process, empowering non-technical staff
draft: false
authors:
  - patrick-ellis
pubDate: 2025-03-13
heroImage: ./heroImage.jpg
categories:
  - Vibe Coding
---

I've spent the past two years diving deep into the world of GenAI and CodeGen…

![Image alt text](./pathToImage.jpg)
```

The blog posts are rendered using [Astro.build](https://docs.astro.build/en/guides/markdown-content/) and will be available at [https://seattlefoundations.org/blog](https://seattlefoundations.org/blog).

## Deployment
Auto-deploys from main

## License

This website is maintained by Seattle Foundations. All rights reserved.
