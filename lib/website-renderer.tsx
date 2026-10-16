import LoveLetter01 from '@/components/templates/love-letter/dear-you';
import Anniversary01 from '@/components/templates/anniversary/anniversary-01';
import OurStory01 from '@/components/templates/story/OurStory01';
import BirthdaySurprise01 from '@/components/templates/birthday/surprise-01';
import Anniversary02 from '@/components/templates/anniversary/anniversary-02';

import type { WebsiteRecord } from '@/types/website';
import Anniversary03 from '@/components/templates/anniversary/anniversary-03';
import Apology01 from '@/components/templates/apology/apology-01';
import Apology02 from '@/components/templates/apology/apology-02';
import Apology03 from '@/components/templates/apology/apology-03';

const rendererMap = {
  'love-letter-01': LoveLetter01,
  'anniversary-01': Anniversary01,
  'our-story-01': OurStory01,
  'birthday-surprise-01': BirthdaySurprise01,
  'anniversary-02': Anniversary02,
  'anniversary-03': Anniversary03,
  'apology-01': Apology01,
  'apology-02': Apology02,
  'apology-03': Apology03,
};

export function WebsiteRenderer({ website }: { website: WebsiteRecord }) {
  const Template = rendererMap[website.templateId as keyof typeof rendererMap];

  if (!Template) {
    return (
      <main className="center-page">
        <div className="empty-state">
          <span>Template unavailable</span>

          <h1>{website.templateId}</h1>

          <p>
            The website record exists, but this template has not been registered
            in the renderer yet.
          </p>
        </div>
      </main>
    );
  }

  return <Template website={website} />;
}
