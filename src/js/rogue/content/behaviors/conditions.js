
import _ from 'lodash';
import Roll from '../../lib/dice-roller';
import Behavior, { Priority } from '../../definitions/behavior';
import MessageQueue, { MessageTypes } from '../../display/message-handler';

/* being stunned sucks */
class StunnedBehavior extends Behavior {
  constructor(numTurns = 1) {
    super(Priority.STUN);
    this.stunTurns = numTurns;
  }
  act(me) {
    if(this.stunTurns <= 0) {
      me.removeBehavior(this);
      MessageQueue.add({ message: `${me.name} пришел в себя.`, type: MessageTypes.COMBAT });
      return true;
    }

    MessageQueue.add({ message: `${me.name} оглушен!`, type: MessageTypes.COMBAT });
    this.stunTurns--;
    return false;
  }
}

export const Stunned = (numTurns) => new StunnedBehavior(numTurns);

/* being poisoned also sucks */
class PoisonedBehavior extends Behavior {
  constructor(numTurns = 3) {
    super(Priority.ALWAYS);
    this.poisonTurns = numTurns;
  }
  act(me) {
    if(this.poisonTurns <= 0) {
      me.removeBehavior(this);
      MessageQueue.add({ message: `${me.name} больше не отравлен.`, type: MessageTypes.COMBAT });
      return;
    }

    const damage = Roll('1d4');
    MessageQueue.add({ message: `${me.name} получает ${damage} единиц урона ядом!`, type: MessageTypes.COMBAT });
    this.poisonTurns--;
  }
}

export const Poisoned = (numTurns) => new PoisonedBehavior(numTurns);

/* being seduced really sucks */
class SeducedBehavior extends Behavior {
  constructor(numTurns = 2) {
    super(Priority.STUN);
    this.stunTurns = numTurns;
  }
  act(me) {
    me.breakConduct('celibate');
    if(this.stunTurns <= 0) {
      me.removeBehavior(this);
      MessageQueue.add({ message: `${me.name} больше не поддается соблазну.`, type: MessageTypes.COMBAT });
      return true;
    }

    this.stunTurns--;
    MessageQueue.add({ message: `${me.name} соблазнился печеньками!`, type: MessageTypes.COMBAT });

    const item = _(me.equipment).values().flatten().sample();
    if(!item) return false;

    me.unequip(item);
    me.dropItem(item);

    MessageQueue.add({ message: `$С {me.name} выпало ${item.name}!`, type: MessageTypes.COMBAT });
    return false;
  }
}

export const Seduced = (numTurns) => new SeducedBehavior(numTurns);