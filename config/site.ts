import { SiteConfig } from "@/types/siteConfig";
import { BsGithub, BsTwitterX, BsWechat } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { SiBuymeacoffee, SiJuejin } from "react-icons/si";

const OPEN_SOURCE_URL = ''

// title: "languepod",
//   description:
//     "flexible, immersive audio lessons for language skills and cultural insights on-the-go.",
//   keywords: "language learning podcasts, podcast for language learners, learn languages online, audio language lessons, podcast immersion, language podcast subscription, cultural language podcast, podcast language practice, multilingual podcasts, podcast language acquisition",
// };


const baseSiteConfig = {
  name: "languepod",
  description:
    "With AI assistance, help users learn languages through podcasts, including podcast audio transcription, translation, key vocabulary and grammar explanations, dictation, and other features.",
  url: "https://languepod.fun",
  ogImage: "https://languepod.fun/og.jpg",
  metadataBase: '/',
  keywords: ["language learning podcasts", "podcast for language learners", "learn languages online", "podcast language practice"],
  authors: [
    {
      name: "halliday",
      url: "https://blog.languepod.fun",
      twitter: 'https://twitter.com/languepod',
    }
  ],
  creator: '@halliday',
  openSourceURL: '',
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