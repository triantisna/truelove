import LoveLetter01 from '@/components/templates/love-letter/dear-you';
import LoveLetter02 from '@/components/templates/love-letter/loveletter-02';
import LoveLetter03 from '@/components/templates/love-letter/loveletter-03';
import LoveLetter04 from '@/components/templates/love-letter/loveletter-04';
import LoveLetter05 from '@/components/templates/love-letter/loveletter-05';
import LoveLetter06 from '@/components/templates/love-letter/loveletter-06';
import LoveLetter07 from '@/components/templates/love-letter/loveletter-07';

import OurStory01 from '@/components/templates/our-story/ourstory-01';
import OurStory02 from '@/components/templates/our-story/ourstory-02';
import OurStory03 from '@/components/templates/our-story/ourstory-03';
import OurStory04 from '@/components/templates/our-story/ourstory-04';
import OurStory05 from '@/components/templates/our-story/ourstory-05';
import OurStory06 from '@/components/templates/our-story/ourstory-06';
import OurStory07 from '@/components/templates/our-story/ourstory-07';

import BirthdaySurprise01 from '@/components/templates/birthday/surprise-01';
import BirthdayBox from '@/components/templates/birthday/surprise-02';
import TodayIsYours from '@/components/templates/birthday/surprise-03';
import ReasonsYoureSpecial from '@/components/templates/birthday/surprise-04';
import MemoryVault from '@/components/templates/birthday/surprise-05';
import BirthdaySurprise06 from '@/components/templates/birthday/surprise-06';
import BirthdaySurprise07 from '@/components/templates/birthday/surprise-07';

import Anniversary01 from '@/components/templates/anniversary/anniversary-01';
import Anniversary02 from '@/components/templates/anniversary/anniversary-02';
import Anniversary03 from '@/components/templates/anniversary/anniversary-03';
import Anniversary04 from '@/components/templates/anniversary/anniversary-04';
import Anniversary05 from '@/components/templates/anniversary/anniversary-05';
import Anniversary06 from '@/components/templates/anniversary/anniversary-06';
import Anniversary07 from '@/components/templates/anniversary/anniversary-07';

import Apology01 from '@/components/templates/apology/apology-01';
import Apology02 from '@/components/templates/apology/apology-02';
import Apology03 from '@/components/templates/apology/apology-03';
import Apology04 from '@/components/templates/apology/apology-04';
import Apology05 from '@/components/templates/apology/apology-05';
import Apology06 from '@/components/templates/apology/apology-06';
import Apology07 from '@/components/templates/apology/apology-07';

import dateInvitation01 from '@/components/templates/date-invitation/date-01';
import dateInvitation02 from '@/components/templates/date-invitation/date-02';
import dateInvitation03 from '@/components/templates/date-invitation/date-03';
import dateInvitation04 from '@/components/templates/date-invitation/date-04';
import dateInvitation05 from '@/components/templates/date-invitation/date-05';
import dateInvitation06 from '@/components/templates/date-invitation/date-06';
import dateInvitation07 from '@/components/templates/date-invitation/date-07';

import Proposal01 from '@/components/templates/proposal/proposal-01';
import Proposal02 from '@/components/templates/proposal/proposal-02';
import Proposal03 from '@/components/templates/proposal/proposal-03';
import Proposal04 from '@/components/templates/proposal/proposal-04';
import Proposal05 from '@/components/templates/proposal/proposal-05';

import type { WebsiteRecord } from '@/types/website';

const rendererMap = {
  'love-letter-01': LoveLetter01,
  'love-letter-02': LoveLetter02,
  'love-letter-03': LoveLetter03,
  'love-letter-04': LoveLetter04,
  'love-letter-05': LoveLetter05,
  'love-letter-06': LoveLetter06,
  'love-letter-07': LoveLetter07,
  'ourstory-01': OurStory01,
  'ourstory-02': OurStory02,
  'ourstory-03': OurStory03,
  'ourstory-04': OurStory04,
  'ourstory-05': OurStory05,
  'ourstory-06': OurStory06,
  'ourstory-07': OurStory07,
  'birthday-surprise-01': BirthdaySurprise01,
  'birthday-surprise-02': BirthdayBox,
  'birthday-surprise-03': TodayIsYours,
  'birthday-surprise-04': ReasonsYoureSpecial,
  'birthday-surprise-05': MemoryVault,
  'birthday-surprise-06': BirthdaySurprise06,
  'birthday-surprise-07': BirthdaySurprise07,
  'anniversary-01': Anniversary01,
  'anniversary-02': Anniversary02,
  'anniversary-03': Anniversary03,
  'anniversary-06': Anniversary06,
  'anniversary-07': Anniversary07,
  'anniversary-04': Anniversary04,
  'anniversary-05': Anniversary05,
  'apology-01': Apology01,
  'apology-02': Apology02,
  'apology-03': Apology03,
  'apology-04': Apology04,
  'apology-05': Apology05,
  'apology-06': Apology06,
  'apology-07': Apology07,
  'date-01': dateInvitation01,
  'date-02': dateInvitation02,
  'date-03': dateInvitation03,
  'date-04': dateInvitation04,
  'date-05': dateInvitation05,
  'date-06': dateInvitation06,
  'date-07': dateInvitation07,
  'proposal-01': Proposal01,
  'proposal-02': Proposal02,
  'proposal-03': Proposal03,
  'proposal-04': Proposal04,
  'proposal-05': Proposal05,
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
