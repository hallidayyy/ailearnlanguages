import { LucideIcon, MagnetIcon } from "lucide-react";
import { IconType } from "react-icons";
import { BsGithub } from "react-icons/bs";
import { FaToolbox } from "react-icons/fa";
import { FaEarthAsia, FaMobileScreenButton } from "react-icons/fa6";
import { MdCloudUpload } from "react-icons/md";

export const FEATURES_EN = [
  {
    title: "Podcast Transcription",
    content: "Support transcribing podcasts in English, French, German, Italian, and Spanish into text.",
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
    title: "AI-assisted dictation practice",
    content:
      "With the assistance of AI, check your dictation results, receive an evaluation of your listening level along with constructive suggestions for improving your listening skills.",
    icon: MagnetIcon,
  },
  {
    title: "Explain in Your Native Language",
    content:
      "All explanations are in your native language, which enhances your language learning experience.",
    icon: MdCloudUpload,
  },
  {
    title: "Treat each podcast as a reading comprehension exercise",
    content:
      "Use AI assistance to organize each article into a reading comprehension test, helping you better understand the words and grammar that appear in the podcast.",
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