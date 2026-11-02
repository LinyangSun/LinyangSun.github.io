import type { SocialLink } from "../types";

export const SOCIALS: SocialLink[] = [
    {
        name: "ORCID",
        href: "https://orcid.org/0000-0003-1148-0364",
        linkTitle: "Linyang Sun on ORCID",
        isActive: true,
    },
    {
        name: "LinkedIn",
        href: "https://www.linkedin.com/in/linyang-sun-b92a69283/",
        linkTitle: "Linyang Sun on LinkedIn",
        isActive: true,
    },
    {
        name: "ResearchGate",
        href: "https://www.researchgate.net/profile/Linyang-Sun",
        linkTitle: "Linyang Sun on ResearchGate",
        isActive: true,
    },
    {
        name: "Github",
        href: "https://github.com/LinyangSun",
        linkTitle: "Linyang Sun on GitHub",
        isActive: true,
    },
];

export const SOCIAL_ICONS: Record<string, string> = {
    Github: "Github",
    Mail: "Mail",
    Linkedin: "LinkedIn",
    LinkedIn: "LinkedIn",
    ResearchGate: "ResearchGate",
    "Google Scholar": "GoogleScholar",
    ORCID: "ORCID",
    RSS: "RSS",
};
