import { SiteConfig } from "@/types/siteConfig";
import { BsGithub, BsTwitterX, BsWechat } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { SiBuymeacoffee, SiJuejin } from "react-icons/si";

const OPEN_SOURCE_URL = 'https://github.com/weijunext/landing-page-boilerplate'

const baseSiteConfig = {
  name: "Landing page boilerplate",
  description:
    "A free, open-source, and powerful landing page boilerplate, ideal for various projects, enabling you to create a landing page in under an hour.",
  url: "https://landingpage.weijunext.com",
  ogImage: "https://landingpage.weijunext.com/og.png",
  metadataBase: '/',
  keywords: ["landing page boilerplate", "landing page template", "awesome landing page", "next.js landing page"],
  authors: [
    {
      name: "halliday",
      url: "https://twitter.com/languepod",
      twitter: 'https://twitter.com/languepod',
    }
  ],
  creator: '@weijunext',
  openSourceURL: 'https://github.com/weijunext/landing-page-boilerplate',
  themeColors: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  nextThemeColor: 'dark', // next-theme option: system | dark | light
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/logo.png",
  },
  headerLinks: [
    { name: 'repo', href: OPEN_SOURCE_URL, icon: BsGithub },
    { name: 'twitter', href: "https://twitter.com/languepod", icon: BsTwitterX },
    { name: 'buyMeCoffee', href: "https://www.buymeacoffee.com/hallidayyy", icon: SiBuymeacoffee }
  ],
  footerLinks: [
    { name: 'email', href: "mailto:luchao62@gmail.com", icon: MdEmail },
    { name: 'twitter', href: "https://twitter.com/languepod", icon: BsTwitterX },
    { name: 'github', href: "https://github.com/hallidayyy/", icon: BsGithub },
    { name: 'buyMeCoffee', href: "https://www.buymeacoffee.com/hallidayyy", icon: SiBuymeacoffee },
   
  ],
  footerProducts: [
    { url: 'https://www.aiapp.icu/', name: 'AI app: I SEE YOU' },

  ]
}

export const siteConfig: SiteConfig = {
  ...baseSiteConfig,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseSiteConfig.url,
    title: baseSiteConfig.name,
    images: [`${baseSiteConfig.url}/og.png`],
    description: baseSiteConfig.description,
    siteName: baseSiteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    site: baseSiteConfig.url,
    title: baseSiteConfig.name,
    description: baseSiteConfig.description,
    images: [`${baseSiteConfig.url}/og.png`],
    creator: baseSiteConfig.creator,
  },
}