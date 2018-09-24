
import _ from 'lodash';
import Roll from '../../lib/dice-roller';
import Effect from '../../definitions/effect';
import GameState from '../../init/gamestate';
import MonsterSpawner from '../../worldgen/monster-spawner';
import { Ring as RandomRing, Potion as RandomPotion } from '../../constants/random';

class SinkDrinkEffect extends Effect {}

export class NoEffect extends SinkDrinkEffect {
  static get probability() { return 25; }
  static use(entity) {
    this.msg(entity, `${entity.name} выпил глоток воды из фонтана.`);
  }
}

export class HardWater extends SinkDrinkEffect {
  static get probability() { return 20; }
  static use(entity) {
    this.msg(entity, `${entity.name} попробовал жесткую, неприятную воду.`);
    entity.gainXp(1);
  }
}

export class HotWater extends SinkDrinkEffect {
  static get probability() { return 5; }
  static use(entity) {
    const hasFireRst = entity.hasTrait('FireResistance');
    let msg = `${entity.name} выпил глоток кипящей воды.`;
    if(hasFireRst) {
      msg += ' It was quite tasty.';
    } else {
      const damage = Roll('1d6');
      entity.takeDamage(damage, { name: 'sink' });
    }

    this.msg(entity, msg);
  }
}

export class SpawnRat extends SinkDrinkEffect {
  static get probability() { return 1; }
  static use(entity, sink) {

    const validTile = _.sample(this.getEmptyTilesInRange(sink));

    if(!validTile) return;
    this.msg(entity, `${entity.name} нашел крысу в воде...`);
    MonsterSpawner.spawnSingle('sewerRat', validTile);
  }
}

export class SpawnElemental extends SinkDrinkEffect {
  static get probability() { return 1; }
  static use(entity, sink) {

    const validTile = _.sample(this.getEmptyTilesInRange(sink));

    if(!validTile) return;
    this.msg(entity, `${entity.name} заставил воду ожить!`);
    MonsterSpawner.spawnSingle('waterElemental', validTile);
  }
}

export class RingGen extends SinkDrinkEffect {
  static get probability() { return 1; }
  static use(entity, sink) {
    if(sink._gotRing) {
      this.msg(entity, `${entity.name} видит что-то странное в воде.`);
      return;
    }
    sink._gotRing = true;
    entity.exercise('wis');
    const ring = RandomRing({ bucName: 'uncursed' });
    GameState.world.moveItem(ring, entity.x, entity.y, entity.z);
    this.msg(entity, `${entity.name} нашел кольцо в воде!`);
  }
}

export class PotionDrink extends SinkDrinkEffect {
  static get probability() { return 1; }
  static use(entity) {
    const potion = RandomPotion({ bucName: 'uncursed' });
    this.msg(entity, `${entity.name} видит ${potion.color} воду в фонтане!`);
    potion.use(entity);
  }
}
