import LoveLetter01 from '@/components/templates/love-letter/dear-you';
import LoveLetter02 from '@/components/templates/love-letter/loveletter-02';
import LoveLetter03 from '@/components/templates/love-letter/loveletter-03';
import LoveLetter04 from '@/components/templates/love-letter/loveletter-04';
import LoveLetter05 from '@/components/templates/love-letter/loveletter-05';
import LoveLetter06 from '@/components/templates/love-letter/loveletter-06';
import LoveLetter07 from '@/components/templates/love-letter/loveletter-07';
import Anniversary01 from '@/components/templates/anniversary/anniversary-01';
import OurStory01 from '@/components/templates/story/OurStory01';
import BirthdaySurprise01 from '@/components/templates/birthday/surprise-01';
import BirthdayBox from '@/components/templates/birthday/surprise-02';
import TodayIsYours from '@/components/templates/birthday/surprise-03';
import ReasonsYoureSpecial from '@/components/templates/birthday/surprise-04';
import MemoryVault from '@/components/templates/birthday/surprise-05';
import Anniversary02 from '@/components/templates/anniversary/anniversary-02';
import Anniversary04 from '@/components/templates/anniversary/anniversary-04';
import Anniversary05 from '@/components/templates/anniversary/anniversary-05';

import type { WebsiteRecord } from '@/types/website';
import Anniversary03 from '@/components/templates/anniversary/anniversary-03';
import Apology01 from '@/components/templates/apology/apology-01';
import Apology02 from '@/components/templates/apology/apology-02';
import Apology03 from '@/components/templates/apology/apology-03';

const rendererMap = {
  'love-letter-01': LoveLetter01,
  'love-letter-02': LoveLetter02,
  'love-letter-03': LoveLetter03,
  'love-letter-04': LoveLetter04,
  'love-letter-05': LoveLetter05,
  'love-letter-06': LoveLetter06,
  'love-letter-07': LoveLetter07,
  'anniversary-01': Anniversary01,
  'our-story-01': OurStory01,
  'birthday-surprise-01': BirthdaySurprise01,
  'birthday-surprise-02': BirthdayBox,
  'birthday-surprise-03': TodayIsYours,
  'birthday-surprise-04': ReasonsYoureSpecial,
  'birthday-surprise-05': MemoryVault,
  'anniversary-02': Anniversary02,
  'anniversary-03': Anniversary03,
  'anniversary-04': Anniversary04,
  'anniversary-05': Anniversary05,
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
