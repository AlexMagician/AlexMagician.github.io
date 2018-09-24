
import _ from 'lodash';
import GameState from '../init/gamestate';
import * as Tiles from '../worldgen/tiles/_all';
import { StoneOfSelyk, SelykCellarKey } from '../content/items/_special';
import { Selyk } from '../content/monsters/_special';
import Altar from '../worldgen/maptypes/altar';
import Monster from '../definitions/monster';

class Victory {
  static vp() { return 5; }
  static check() { return true; }
  static get message() { return 'Вы выжили!'; }
  static get description() { return 'Выживите!'; }
  static shouldTrigger() { return false; }
  static trigger() {}
  static mapAdditions() {}
  static mapStairs(i) { return [Tiles.StairsUp, i !== GameState.world.depth-1 ? Tiles.StairsDown : null]; }
}

export class Survival extends Victory {
  static vp() { return GameState.world.depth; }
  static requiredTurns() { return GameState.world.depth*1000; }
  static check() { return _.max(GameState.players, 'currentTurn').currentTurn >= this.requiredTurns(); }
  static get message() { return `Вы продержались необходимое время.`; }
  static get description() { return `Выживите в течение ${this.requiredTurns()} ходов.`; }
}

export class StoneOfSelykFind extends Victory {
  static vp() { return 3 * GameState.world.depth; }
  static check() {
    let found = false;
    _.each(GameState.players, (player) => {
      if(player.hasInInventory(StoneOfSelyk)) found = true;
    });
    return found;
  }
  static shouldTrigger() { return GameState.world.depth === GameState.currentFloor+1; }
  static trigger() {
    GameState.world.placeItemAtRandomLocation(new StoneOfSelyk(), GameState.currentFloor);
  }
  static get message() { return `Вы нашли Кристалл Хоука.`; }
  static get description() { return `Найдите Кристалл Хоука.`; }
}

export class SelykAltar extends Victory {
  static vp() { return 10 * GameState.world.depth; }
  static check() {
    let found = false;
    _.each(GameState.players, (player) => {
      if(player._ascended) found = true;
    });
    return found;
  }
  static mapAdditions() {
    const floor = GameState.world.depth;
    GameState.world.setMapAt(Altar.generate({ z: floor }), floor);
    return true;
  }
  static shouldTrigger() { return GameState.world.depth-1 === GameState.currentFloor+1; }
  static trigger() {
    GameState.world.placeItemAtRandomLocation(new SelykCellarKey(), GameState.currentFloor);
  }
  static get message() { return `Вы добрались до Алтаря Хоука и принесли себя в жертву на нем.`; }
  static get description() { return `Достигните Алтаря Хоука.`; }
  static mapStairs(i) { return [Tiles.StairsUp, i !== GameState.world.depth-1 ? Tiles.StairsDown : Tiles.SelykStairsDown]; }
}

export class KillSelyk extends Victory {
  static vp() { return 20 * GameState.world.depth; }
  static check() {
    let found = false;
    _.each(GameState.players, (player) => {
      if(player.conquest.Selyk) found = true;
    });
    return found;
  }
  static shouldTrigger() { return GameState.world.depth === GameState.currentFloor+1; }
  static trigger() {
    GameState.world.placeEntityAtRandomLocation(new Monster(0, 0, 0, Selyk.init()), GameState.currentFloor);
  }
  static get message() { return `Вы убили Алекса Хоука.`; }
  static get description() { return `Убейте Алекса Хоука.`; }
}