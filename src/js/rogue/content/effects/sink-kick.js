
import _ from 'lodash';
import Roll from '../../lib/dice-roller';
import Effect from '../../definitions/effect';
import { Ring as RandomRing } from '../../constants/random';
import GameState from '../../init/gamestate';
import MonsterSpawner from '../../worldgen/monster-spawner';

class SinkKickEffect extends Effect {}

export class BasicEffect extends SinkKickEffect {
  static get probability() { return 7; }
  static use(entity) {
    this.msg(entity, `${entity.name} ударяет чашу фонтана, и та легонько вибрирует.`);
    entity.alertAllInRange(50);
  }
}

export class RingGen extends SinkKickEffect {
  static get probability() { return 3; }
  static use(entity, sink) {
    if(sink._gotRing) {
      this.msg(entity, `${entity.name} выплеснул странную воду из чаши.`);
      return;
    }
    sink._gotRing = true;
    entity.exercise('wis');
    entity.exercise('dex');
    const ring = RandomRing({ bucName: 'uncursed' });
    GameState.world.moveItem(ring, entity.x, entity.y, entity.z);
    this.msg(entity, `${entity.name} нашел в ней кольцо!`);
  }
}

export class BadKick extends SinkKickEffect {
  static get probability() { return 1; }
  static use(entity) {
    this.msg(entity, `${entity.name} поранился, когда ударял чашу фонтана. Как неуклюже.`);
    entity.alertAllInRange(50);
    entity.abuse('dex');
    entity.abuse('wis');
    const damage = Roll('1d5');
    entity.takeDamage(damage, { name: 'sink' });
  }
}

export class SpawnsPudding extends SinkKickEffect {
  static get probability() { return 1; }
  static use(entity, sink) {
    const validTile = _.sample(this.getEmptyTilesInRange(sink));

    if(!validTile) return;
    this.msg(entity, `${entity.name} вызвал какое-то черное существо из фонтана!`);
    MonsterSpawner.spawnSingle('blackPudding', validTile);
  }
}