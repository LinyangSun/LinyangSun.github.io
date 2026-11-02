import type { PagesConfig } from "../types";

export const PAGES: PagesConfig = {
    home: {
        title: "About Me",
        subtitle: "",
        isActive: true,
    },
    blog: {
        title: "Blog",
        subtitle: "Thoughts on physics, philosophy, and music.",
        isActive: true,
    },
    publications: {
        title: "Selected Publications",
        subtitle: "",
        isActive: true,
    },
    talks: {
        title: "Talks & Presentations",
        subtitle: "Selected oral presentations at scientific conferences.",
        isActive: true,
    },
    projects: {
        title: "Code & Projects",
        subtitle: "Open source contributions and technological experiments.",
        isActive: true,
    },
    teaching: {
        title: "Teaching",
        subtitle: "Teaching assistantships at the University of Helsinki.",
        isActive: true,
    },
    tags: {
        title: "Tags",
        subtitle: "Explore content by topic.",
        isActive: true,
    },
    cv: {
        title: "Curriculum Vitae",
        subtitle: "Academic and professional history.",
        isActive: true,
    },
};
