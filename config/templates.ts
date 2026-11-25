import dearYou from '@/components/templates/love-letter/dear-you/config';
import loveLetter02 from '@/components/templates/love-letter/loveletter-02/config';
import loveLetter03 from '@/components/templates/love-letter/loveletter-03/config';
import loveLetter04 from '@/components/templates/love-letter/loveletter-04/config';
import loveLetter05 from '@/components/templates/love-letter/loveletter-05/config';
import loveLetter06 from '@/components/templates/love-letter/loveletter-06/config';
import loveLetter07 from '@/components/templates/love-letter/loveletter-07/config';

import birthdaySurprise from '@/components/templates/birthday/surprise-01/config';
import { birthdayBoxConfig } from '@/components/templates/birthday/surprise-02/config';
import { todayIsYoursConfig } from '@/components/templates/birthday/surprise-03/config';
import { reasonsSpecialConfig } from '@/components/templates/birthday/surprise-04/config';
import { memoryVaultConfig } from '@/components/templates/birthday/surprise-05/config';
import birthdaySurprise06Config from '@/components/templates/birthday/surprise-06/config';
import birthdaySurprise07Config from '@/components/templates/birthday/surprise-07/config';

import { anniversary01Config } from '@/components/templates/anniversary/anniversary-01/config';
import { anniversary02Config } from '@/components/templates/anniversary/anniversary-02/config';
import { anniversary03Config } from '@/components/templates/anniversary/anniversary-03/config';
import { config as anniversary04Config } from '@/components/templates/anniversary/anniversary-04/config';
import { config as anniversary05Config } from '@/components/templates/anniversary/anniversary-05/config';
import { config as anniversary06Config } from '@/components/templates/anniversary/anniversary-06/config';
import { config as anniversary07Config } from '@/components/templates/anniversary/anniversary-07/config';

import { apology01Config } from '@/components/templates/apology/apology-01/config';
import { apology02Config } from '@/components/templates/apology/apology-02/config';
import { apology03Config } from '@/components/templates/apology/apology-03/config';
import apology04Config from '@/components/templates/apology/apology-04/config';
import apology05Config from '@/components/templates/apology/apology-05/config';
import apology06Config from '@/components/templates/apology/apology-06/config';
import apology07Config from '@/components/templates/apology/apology-07/config';

import ourStory01Config from '@/components/templates/our-story/ourstory-01/config';
import ourStory02Config from '@/components/templates/our-story/ourstory-02/config';
import ourStory03Config from '@/components/templates/our-story/ourstory-03/config';
import ourStory04Config from '@/components/templates/our-story/ourstory-04/config';
import ourStory05Config from '@/components/templates/our-story/ourstory-05/config';
import { config as ourStory06Config } from '@/components/templates/our-story/ourstory-06/config';
import { config as ourStory07Config } from '@/components/templates/our-story/ourstory-07/config';

import dateInvitation01Config from '@/components/templates/date-invitation/date-01/config';
import dateInvitation02Config from '@/components/templates/date-invitation/date-02/config';
import dateInvitation03Config from '@/components/templates/date-invitation/date-03/config';
import dateInvitation04Config from '@/components/templates/date-invitation/date-04/config';
import dateInvitation05Config from '@/components/templates/date-invitation/date-05/config';
import dateInvitation06Config from '@/components/templates/date-invitation/date-06/config';
import dateInvitation07Config from '@/components/templates/date-invitation/date-07/config';

import proposal01Config from '@/components/templates/proposal/proposal-01/config';
import proposal02Config from '@/components/templates/proposal/proposal-02/config';
import proposal03Config from '@/components/templates/proposal/proposal-03/config';
import proposal04Config from '@/components/templates/proposal/proposal-04/config';
import proposal05Config from '@/components/templates/proposal/proposal-05/config';

import type { TemplateDefinition } from '@/types/template';

export const templates: TemplateDefinition[] = [
  dearYou,
  loveLetter02,
  loveLetter03,
  loveLetter04,
  loveLetter05,
  loveLetter06,
  loveLetter07,
  birthdaySurprise,
  birthdayBoxConfig,
  todayIsYoursConfig,
  reasonsSpecialConfig,
  memoryVaultConfig,
  birthdaySurprise06Config,
  birthdaySurprise07Config,
  anniversary01Config,
  anniversary02Config,
  anniversary03Config,
  anniversary06Config,
  anniversary07Config,
  anniversary04Config,
  anniversary05Config,
  apology01Config,
  apology02Config,
  apology03Config,
  apology04Config,
  apology05Config,
  apology06Config,
  apology07Config,
  ourStory01Config,
  ourStory02Config,
  ourStory03Config,
  ourStory04Config,
  ourStory05Config,
  ourStory06Config,
  ourStory07Config,
  dateInvitation01Config,
  dateInvitation02Config,
  dateInvitation03Config,
  dateInvitation04Config,
  dateInvitation05Config,
  dateInvitation06Config,
  dateInvitation07Config,
  proposal01Config,
  proposal02Config,
  proposal03Config,
  proposal04Config,
  proposal05Config,
];

export function getTemplateById(id: string): TemplateDefinition | undefined {
  return templates.find((template) => template.id === id);
}
