
import * as Behaviors from '../behaviors/_all';
import { Attack } from '../../definitions/attack';

export class Bite extends Attack {}
export class Claw extends Attack {}
export class Touch extends Attack {}
export class Bearhug extends Attack {}

export class Poison extends Attack {
  hitString(owner, target, damage, extra) {
    let psn = ``;
    if(extra && !target.hasTrait('PoisonResistance')) {
      psn = ` ${target.name} отравлен!`;
      target.addUniqueBehavior(Behaviors.Poisoned());
    }
    return `${owner.name} ударил ${target.name} на ${damage} единиц урона!${psn}`;
  }
  hitCallback() {
    return true;
  }
}

export class ElectricTouch extends Attack {
  hitString(owner, target, damage, extra) {
    let zap = ``;
    if(extra) {
      zap = ` ${target.name} ударен молнией!`;
      target.addUniqueBehavior(Behaviors.Stunned());
    }
    return `${owner.name} ударил ${target.name} молнией на ${damage} единиц урона!${zap}`;
  }
  hitCallback() {
    return true;
  }
}

export class Explode extends Attack {
  hitString(owner, target, damage) {
    return `${owner.name} взрывается! ${target.name} получает ${damage} единиц урона.`;
  }

  canHit() { return true; }

  afterHitCallback(owner) {
    owner.die(owner);
  }
}

export class SeductiveTouch extends Attack {
  hitString(owner, target, damage, extra) {
    let sed = ``;
    if(extra) {
      sed = ` ${target.name} соблазнен!`;
      target.addUniqueBehavior(Behaviors.Seduced());
    }
    return `${owner.name} соблазняет печеньками ${target.name} на ${damage} единиц урона!${sed}`;
  }
  hitCallback() {
    return true;
  }
}

export class TelepathicBlast extends Attack {
  hitString(owner, target, damage) {
    return `${owner.name} снесен кинетической волной ${target.name} на ${damage} единиц урона!`;
  }
  hitCallback(owner) {
    return owner.hasTrait('Telepathy');
  }
}