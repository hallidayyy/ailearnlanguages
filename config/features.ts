import { LucideIcon, MagnetIcon } from "lucide-react";
import { IconType } from "react-icons";
import { BsGithub } from "react-icons/bs";
import { FaToolbox } from "react-icons/fa";
import { FaEarthAsia, FaMobileScreenButton } from "react-icons/fa6";
import { MdCloudUpload } from "react-icons/md";

export const FEATURES_EN = [
  {
    title: "Podcast Transcription",
    content: "Transcribe podcasts into text in over 125 languages.",
    icon: BsGithub,
  },
  {
    title: "Explain Key Vocabulary",
    content:
      "Extract key vocabulary from the podcast and provide detailed explanations for you.",
    icon: FaMobileScreenButton,
  },
  {
    title: "Explain Key Grammar Points",
    content:
      "Extract key grammar points from the podcast and provide detailed explanations for you.",
    icon: FaToolbox,
  },
  {
    title: "Supports Learning 9 Languages",
    content:
      "Currently supports learning 9 languages, including English, French, Spanish, German, Russian, and Japanese, with plans to support 125 languages in the future.",
    icon: MagnetIcon,
  },
  {
    title: "Explain in Your Native Language",
    content:
      "All explanations are in your native language, which enhances your language learning experience.",
    icon: MdCloudUpload,
  },
  {
    title: "AI assistance",
    content:
      "Use the latest AI to help you learn a new language.",
    icon: FaEarthAsia,
  },
];


interface FeaturesCollection {
  [key: `FEATURES_${string}`]: {
    title: string;
    content: string;
    icon: IconType | LucideIcon | string;
  }[];
}

export const ALL_FEATURES: FeaturesCollection = {
  FEATURES_EN,

}