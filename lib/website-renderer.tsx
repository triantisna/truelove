import LoveLetter01 from "@/components/templates/love-letter/LoveLetter01";
import Anniversary01 from "@/components/templates/anniversary/Anniversary01";
import OurStory01 from "@/components/templates/story/OurStory01";
import type { WebsiteRecord } from "@/types/website";

const rendererMap = {
  "love-letter-01": LoveLetter01,
  "anniversary-01": Anniversary01,
  "our-story-01": OurStory01
};

export function WebsiteRenderer({ website }: { website: WebsiteRecord }) {
  const Template = rendererMap[website.templateId as keyof typeof rendererMap];

  if (!Template) {
    return (
      <main className="center-page">
        <div className="empty-state">
          <span>Template unavailable</span>
          <h1>{website.templateId}</h1>
          <p>The website record exists, but this template has not been registered in the renderer yet.</p>
        </div>
      </main>
    );
  }

  return <Template website={website} />;
}
