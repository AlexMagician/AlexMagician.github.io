
import Profession from '../../definitions/profession';

import Roll from '../../lib/dice-roller';
import { Gold } from '../items/_special';
import * as Foods from '../items/foods';
import * as Potions from '../items/potions';
import * as Projectiles from '../items/projectiles';
import * as Thresholds from '../../constants/skill-thresholds';

const touristCfg = {
  hp  : '1d5',
  mp  : '1d2 + 1',
  str : '1d3',
  con : '1d2',
  int : '1d3',
  dex : '1d2',
  wis : '1d2',
  cha : '1d3 + 1',
  luk : '1d3',
  levelUp: {
    hp  : '1d5',
    mp  : '1d2',
    str : '1d2 - 1',
    con : '1d2',
    int : '1d2 - 1',
    dex : '1d1',
    wis : '1d2 - 1',
    cha : '1d2',
    luk : '1d2 - 1'
  },
  titles: ['Rambler',, 'Sightseer',,, 'Excursionist',,, 'Perigrinator',,, 'Traveler',,, 'Journeyer',,, 'Voyager',,, 'Explorer',,, 'Adventurer'],
  skillCaps: { bash: Thresholds.Competent, slash: Thresholds.Competent, smash: Thresholds.Competent, stab: Thresholds.Competent, thrust: Thresholds.Competent, unarmed: Thresholds.Competent },
  startingItems: [
    { init: () => new Gold(Roll('1d1000')) },
    { choices: { less: 5, more: 1 },
      choicesInit: {
        less: () => new Projectiles.Dart({ charges: '1d5 + 5', bucName: 'uncursed' }),
        more: () => new Projectiles.Dart({ charges: '5d10 + 10', bucName: 'uncursed' })
      }
    },
    { init: () => new Foods.Ration({ charges: '1d5 + 5', bucName: 'uncursed' }) },
    { init: () => new Potions.Healing({ charges: '1d3 + 1', bucName: 'blessed', startIdentified: true }) }
  ]
};

export default class Tourist extends Profession {
  constructor() {
    super(touristCfg);
  }
}