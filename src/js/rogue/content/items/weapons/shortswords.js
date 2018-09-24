
import _ from 'lodash';
import { Hands } from '../../../definitions/equipment';
import Attacks from '../../attacks/_all';
import Materials from '../../../constants/materials';
import { material, rarity } from '../../../constants/decorators';

@rarity(25)
@material(Materials.Copper)
export class OrcishShortSword extends Hands {
  constructor(opts = {}) {
    _.extend(opts, {
      glyph: { fg: '#ccc' },
      attacks: [Attacks.Slash({ roll: '1d5' })]
    });
    super(opts);
  }
}

@rarity(25)
@material(Materials.Iron)
export class Shortsword extends Hands {
  constructor(opts = {}) {
    _.extend(opts, {
      glyph: { fg: 'teal' },
      attacks: [Attacks.Slash({ roll: '1d6' })]
    });
    super(opts);
  }
}

@rarity(15)
@material(Materials.Iron)
export class DwarvenShortsword extends Hands {
  constructor(opts = {}) {
    _.extend(opts, {
      glyph: { fg: 'teal' },
      attacks: [Attacks.Slash({ roll: '1d7' })]
    });
    super(opts);
  }
}

@rarity(5)
@material(Materials.Wood)
export class ElvishShortsword extends Hands {
  constructor(opts = {}) {
    _.extend(opts, {
      glyph: { fg: 'teal' },
      attacks: [Attacks.Slash({ roll: '1d8' })]
    });
    super(opts);
  }
}