import { Language } from "../LangSelector/types";
import { FooterLinkType } from "./types";

export const footerLinks: FooterLinkType[] = [
  {
    label: "Developers",
    items: [
      {
        label: "Github",
        href: "https://github.com/helix",
      },
    ],
  },
];

export const socials = [
  {
    label: "Twitter",
    icon: "Twitter",
    href: "https://twitter.com/GeometryFinance",
  },
  {
    label: "Github",
    icon: "Github",
    href: "https://github.com/helix/",
  },
  {
    label: "Discord",
    icon: "Discord",
    href: "https://discord.gg/geometry",
  },
  
];

export const langs: Language[] = [...Array(20)].map((_, i) => ({
  code: `en${i}`,
  language: `English${i}`,
  locale: `Locale${i}`,
}));
