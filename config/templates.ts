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
import { anniversary01Config } from '@/components/templates/anniversary/anniversary-01/config';
import { anniversary02Config } from '@/components/templates/anniversary/anniversary-02/config';
import { anniversary03Config } from '@/components/templates/anniversary/anniversary-03/config';
import { config as anniversary04Config } from '@/components/templates/anniversary/anniversary-04/config';
import { config as anniversary05Config } from '@/components/templates/anniversary/anniversary-05/config';
import { apology01Config } from '@/components/templates/apology/apology-01/config';
import { apology02Config } from '@/components/templates/apology/apology-02/config';
import { apology03Config } from '@/components/templates/apology/apology-03/config';

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
  anniversary01Config,
  anniversary02Config,
  anniversary03Config,
  anniversary04Config,
  anniversary05Config,
  apology01Config,
  apology02Config,
  apology03Config,
];

export function getTemplateById(id: string): TemplateDefinition | undefined {
  return templates.find((template) => template.id === id);
}
