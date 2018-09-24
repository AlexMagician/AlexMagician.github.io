
import _ from 'lodash';
import ROT from 'rot-js';
import Roll from '../../lib/dice-roller';
import Behavior, { Priority } from '../../definitions/behavior';
import GameState from '../../init/gamestate';
import MessageQueue, { MessageTypes } from '../../display/message-handler';
import { Gold, Corpse } from '../items/_special';

/* die after a period of time */
class KillsSelfAfterPeriodOfTimeBehavior extends Behavior {
  constructor(turns = 50) {
    super(Priority.DEFER);
    this.turns = turns;
  }
  act(me) {
    if(this.turns-- > 0) return;
    me.die({ name: 'time' });
  }
}

export const KillsSelfAfterPeriodOfTime = (turns) => new KillsSelfAfterPeriodOfTimeBehavior(turns);

/* drop contents on death */
class DropsItemsBehavior extends Behavior {
  constructor() { super(Priority.DEFER); }
  die(me) {
    const equipped = _(me.equipment).values().flatten().value();
    _.each(equipped, item => me.unequip(item));
    _.each(me.inventory, (item) => {
      me.dropItem(item);
    });
  }
}

export const DropsItems = () => new DropsItemsBehavior();

/* monsters leave a corpse */
class LeavesCorpseBehavior extends Behavior {
  constructor(dropPercent = 100) {
    super(Priority.DEFER);
    this.dropPercent = dropPercent;
  }
  die(me) {
    if(ROT.RNG.getPercentage() > this.dropPercent) return;
    const corpse = new Corpse({ monsterName: me.name, glyph: { fg: me.glyph.fg } });
    GameState.world.moveItem(corpse, me.x, me.y, me.z);
  }
}

export const LeavesCorpse = (percent) => new LeavesCorpseBehavior(percent);

/* some things drop gold */
class DropsGoldBehavior extends Behavior {
  constructor(gold) {
    super(Priority.DEFER);
    this.goldDrop = gold;
  }
  die(me) {
    const droppedGold = Roll(this.goldDrop);
    const goldItem = new Gold(droppedGold + me.gold);
    if(goldItem.goldValue === 0) return;
    GameState.world.moveItem(goldItem, me.x, me.y, me.z);
  }
}

export const DropsGold = (gold) => new DropsGoldBehavior(gold);

/* explodes upon death. can be pretty dangerous */
class ExplodesBehavior extends Behavior {
  constructor(roll = '1d4', range = 1, percent = 100) {
    super(Priority.DEFER);
    this.roll = roll;
    this.percent = percent;
    this.range = range;
  }

  die(me) {
    if(ROT.RNG.getPercentage() > this.percent) {
      MessageQueue.add({ message: `${me.name} explodes a little bit.`, type: MessageTypes.COMBAT });
      return;
    }
    MessageQueue.add({ message: `${me.name} violently explodes!`, type: MessageTypes.COMBAT });
    _.each(GameState.world.getValidEntitiesInRange(me.x, me.y, me.z, this.range), (entity) => {
      if(me === entity || entity.hp.atMin()) return; // infinite loop prevention
      entity.takeDamage(Roll(this.roll), me);
    });
  }
}

export const Explodes = (roll, range, percent) => new ExplodesBehavior(roll, range, percent);

/* drop contents on death */
class LifeSaveBehavior extends Behavior {
  constructor(numUses) { super(Priority.ALWAYS); this.numUses = numUses; }
  takeDamage(me) {
    if(me.hp.atMin()) {
      me.hp.toMax();
      MessageQueue.add({ message: `${me.name}'s life was saved!`, type: MessageTypes.COMBAT });
      me.breakConduct('lifeSave');

      if(this.numUses-- <= 0) me.removeBehavior(this);

      if(this._itemRef) {
        this._itemRef.disintegrate(me);
      }
    }
  }
}

export const LifeSave = (numUses = 1) => new LifeSaveBehavior(numUses);