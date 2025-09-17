import MaxWidthWrapper from "@/components/commons/MaxWidthWrapper";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("HomePage");
  return (
    <MaxWidthWrapper className="flex flex-col items-center gap-8 mt-16 py-12">
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </MaxWidthWrapper>
  );
}
