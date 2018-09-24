
import _ from 'lodash';
import ROT from 'rot-js';
import Roll from '../../lib/dice-roller';
import { Gold } from '../items/_special';
import * as Traits from '../traits/_all';
import GameState from '../../init/gamestate';
import Effect from '../../definitions/effect';
import MonsterSpawner from '../../worldgen/monster-spawner';

class FountainEffect extends Effect {}

export class NoEffect extends FountainEffect {
  static get probability() { return 19; }
  static use(entity) {
    this.msg(entity, `${entity.name} выпивает воду из фонтана, но ничего не происходит.`);
  }
}

export class DropGold extends FountainEffect {
  static get probability() { return 8; }
  static use(entity) {
    const gold = new Gold(Roll('1d1000'));
    GameState.world.moveItem(gold, entity.x, entity.y, entity.z);
    this.msg(entity, `${entity.name} слышит звон золота.`);
  }
}

export class Contaminated extends FountainEffect {
  static get probability() { return 1; }
  static use(entity) {
    const hasPsnRst = entity.hasTrait('PoisonResistance');
    const damageRoll = hasPsnRst ? '1d4' : '1d10';
    const abusesStats = !hasPsnRst;
    const msg = hasPsnRst ? `${entity.name} выпил подозрительную зеленую жижу.` : `Тьфу! ${entity.name} выпил испорченную воду.`;
    if(abusesStats) {
      entity.abuse('str', '1d2+1');
      entity.abuse('con', '1d2');
    }

    entity.takeDamage(Roll(damageRoll), { name: 'fountain' });
    this.msg(entity, msg);
  }
}

export class BlurredVision extends FountainEffect {
  static get probability() { return 2; }
  static use(entity) {
    entity.addTrait(Traits.SeeInvisible({ level: 5 }));
    entity.exercise('wis');
    this.msg(entity, `Зрение ${entity.name} сначала распывается, но затем становится сильнее, чем раньше.`);
  }
}

export class SpawnSnakes extends FountainEffect {
  static get probability() { return 1; }
  static use(entity) {
    this.msg(entity, `${entity.name} пьет воду из фонтана.`);
    this.msg(entity, `Толпа змей появляется на полу!`);
    const spawned = Roll('1d5 + 1');

    const validTiles = _.sample(this.getEmptyTilesInRange(entity), spawned);

    for(let i = 0; i < spawned; i++) {
      if(!validTiles[i]) continue;
      MonsterSpawner.spawnSingle('waterMoccasin', validTiles[i]);
    }
  }
}

export class StrangeFeeling extends FountainEffect {
  static get probability() { return 3; }
  static use(entity) {
    this.msg(entity, `${entity.name} чувствует прилив испуга, но затем все проходит.`);
    entity.exercise('wis');
  }
}

export class CurseItems extends FountainEffect {
  static get probability() { return 2; }
  static use(entity) {
    this.msg(entity, `${entity.name} выпил искаженную воду!`);
    _.each(entity.inventory, item => {
      if(ROT.RNG.getPercentage() > 20) return;
      item.curse();
    });
  }
}

export class SpawnDemon extends FountainEffect {
  static get probability() { return 1; }
  static use(entity) {

    const validTile = _.sample(this.getEmptyTilesInRange(entity));

    if(!validTile) return;
    this.msg(entity, `Кривой латинской молитвой ${entity.name} призвал демона из воды!`);
    MonsterSpawner.spawnSingle('waterDemon', validTile);
  }
}

export class SpawnNymph extends FountainEffect {
  static get probability() { return 1; }
  static use(entity) {

    const validTile = _.sample(this.getEmptyTilesInRange(entity));
    if(!validTile) return;

    this.msg(entity, `${entity.name} привлекает нимфу!`);
    MonsterSpawner.spawnSingle('waterNymph', validTile);
  }
}