import { Button } from "@/components/ui/button";
import { RocketIcon } from "lucide-react";
import Link from "next/link";
import en from "@/locales/en.json"; // 使用路径别名

const CTAButton = ({ locale }: { locale: any }) => {
    locale=en;
  return (
    <Link
      href="https://github.com/weijunext/landing-page-boilerplate"
      target="_blank"
      rel="noopener noreferrer nofollow"
    >
      <Button
        variant="default"
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
        aria-label="Get Boilerplate"
      >
        <RocketIcon />
        {locale.CTA.title}
      </Button>
    </Link>
  );
};

export default CTAButton;