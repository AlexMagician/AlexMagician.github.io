
import _ from 'lodash';
import Professions from '../content/professions/_all';
import Races from '../content/races/_all';
import * as Traits from '../content/traits/_all';

const upgrades = [
  { name: 'Смена имени',
    help: 'Позволяет переименовывать персонажей.',
    cost: 100000,
    currency: 'sp' },
  { name: 'Смена цвета',
    help: 'Позволяет менять цвет значка персонажей.',
    cost: 100000,
    currency: 'sp' }
];

// SP
_.each(_.keys(Professions), profession => {
  upgrades.push(
    { name: `Случайный: ${profession}`,
      help: `Класс (${profession}) теперь будет попадаться среди случайных классов.`,
      cost: 10000,
      currency: 'sp',
      operate: (upgradeData) => upgradeData.unlocked.profession.push(profession)
    });

  upgrades.push(
    { name: `Класс: ${profession}`,
      help: `Класс (${profession}) теперь можно присвоить любому персонажу.`,
      req: `Случайный: ${profession}`,
      unlockedProfession: profession,
      cost: 50000,
      currency: 'sp',
      operate: (upgradeData) => upgradeData.selectable.profession.push(profession)
    });
});

_.each(_.keys(Races), race => {
  upgrades.push(
    { name: `Случайный: ${race}`,
      help: `Эта раса (${race}) теперь будет появляться среди случайных рас.`,
      cost: 20000,
      currency: 'sp',
      operate: (upgradeData) => upgradeData.unlocked.race.push(race)
    });

  upgrades.push(
    { name: `Раса: ${race}`,
      help: `Эту расу (${race}) теперь можно присвоить любому персонажу.`,
      req: `Случайный: ${race}`,
      unlockedRace: race,
      cost: 80000,
      currency: 'sp',
      operate: (upgradeData) => upgradeData.selectable.race.push(race)
    });
});

_.each(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA', 'LUK'], stat => {
  upgrades.push({
    name: `Свойство: Мл. ${stat}`,
    help: `Младшее свойство ${stat} дает +1 к ${stat}, будучи присвоенным персонажу.`,
    cost: 5000,
    currency: 'sp'
  });

  upgrades.push({
    name: `Свойство: Ст. ${stat}`,
    help: `Старшее свойство ${stat} дает +3 к ${stat}, будучи присвоенным персонажу.`,
    cost: 50000,
    currency: 'sp'
  });
});

_.each(_.keys(Traits), trait => {
  upgrades.push({
    name: `Свойство: Сит. ${trait}`,
    help: `Дает ситуационное свойство ${trait} базового уровня при назначении персонажу.`,
    cost: 100000,
    currency: 'sp'
  });
});

upgrades.push({
  name: 'Усиление: Мастерство',
  help: 'Данный персонаж лучше обращается с любым оружием.',
  cost: 100000,
  currency: 'sp'
});

upgrades.push({
  name: 'Усиление: Уровень',
  help: 'Данный персонаж начинает игру с более высокого уровня.',
  cost: 150000,
  currency: 'sp'
});

upgrades.push({
  name: 'Усиление: Зачарованные вещи',
  help: 'Данный персонаж получает зачарования на все свои вещи.',
  cost: 200000,
  currency: 'sp'
});

upgrades.push({
  name: 'Усиление: Заряженные вещи',
  help: 'Данный персонаж получает больше зарядов на всех своих вещах.',
  cost: 250000,
  currency: 'sp'
});

for(let i = 0; i < 3; i++) {
  upgrades.push({
    name: `Большая группа ${i+1}`,
    help: `Добавляет одного дополнительного персонажа в группу. Вступает в силу со следующей игры.`,
    req: i > 0 ? `Большая группа ${i}` : null,
    currency: 'sp',
    cost: (i+2) * 150000,
    operate: (upgradeData) => upgradeData.extra.players++
  });
}
// no more SP

// KP
for(let i = 0; i < 5; i++) {
  upgrades.push({
    name: `Больше монстров ${i+1}`,
    help: `Теперь в подземелье появляется больше монстров.`,
    req: i > 0 ? `Больше монстров ${i}` : null,
    currency: 'kp',
    cost: (i+1) * 20000,
    operate: (upgradeData) => upgradeData.dungeon.monsterLimit += 5
  });
}

for(let i = 0; i < 10; i++) {
  upgrades.push({
    name: `Темные монстры ${i+1}`,
    help: `Более сильные монстры начнут появляться в подземелье.`,
    req: i > 0 ? `Темные монстры ${i}` : null,
    currency: 'kp',
    cost: (i+1) * 10000,
    operate: (upgradeData) => upgradeData.dungeon.maxDifficulty += 5
  });
}
// no more KP

// VP
_.each(['throne', 'fountain', 'sink'], feat => {
  for(let i = 0; i < 5; i++) {
    upgrades.push({
      name: `Объект: ${_.capitalize(feat)} ${i+1}`,
      help: `Эта структура будет появляться в подземелье чаще.`,
      req: i > 0 ? `Объект: ${_.capitalize(feat)} ${i}` : null,
      currency: 'vp',
      cost: (i+1) * 10,
      operate: (upgradeData) => upgradeData.dungeon[`${feat}spawnChance`] += 200 // +2%
    });
  }
});

for(let i = 0; i < 9; i++) {
  upgrades.push({
    name: `Глубокое подземелье ${i+1}`,
    help: `Данж станет глубже на 10 этажей. Вступает в силу со следующей игры.`,
    req: i > 0 ? `Глубокое подземелье ${i}` : null,
    currency: 'vp',
    cost: (i+1) * 20,
    operate: (upgradeData) => upgradeData.dungeon.depth += 10
  });
}

for(let i = 0; i < 9; i++) {
  upgrades.push({
    name: `Широкое подземелье ${i+1}`,
    help: `Данж станет шире и выше.`,
    req: i > 0 ? `Широкое подземелье ${i}` : null,
    currency: 'vp',
    cost: (i+1) * 5,
    operate: (upgradeData) => upgradeData.dungeon.squarity += 10
  });
}

for(let i = 0; i < 5; i++) {
  upgrades.push({
    name: `Потеряны и найдены ${i+1}`,
    help: `Предыдущие персонажи оставят больше вещей, и вы сможете их найти!`,
    req: i > 0 ? `Потеряны и найдены ${i}` : null,
    currency: 'vp',
    cost: (i+1) * 15,
    operate: (upgradeData) => upgradeData.dungeon.itemsInDungeon += 4
  });
}

for(let i = 0; i < 5; i++) {
  upgrades.push({
    name: `Усиление внимания ${i+1}`,
    help: `Вы сможете видеть больше вещей.`,
    req: i > 0 ? `Усиление внимания ${i}` : null,
    currency: 'vp',
    cost: (i+1) * 25,
    operate: (upgradeData) => upgradeData.dungeon.itemDropChance += 15
  });
}

for(let i = 0; i < 10; i++) {
  upgrades.push({
    name: `Быстрое возрождение ${i+1}`,
    help: `Сокращает время возрождения, чтобы данж мог скушоть ваших героев быстрее.`,
    req: i > 0 ? `Быстрое возрождение ${i}` : null,
    currency: 'vp',
    cost: (i+1) * 25,
    operate: (upgradeData) => upgradeData.extra.respawnTime += 1
  });
}
// no more VP

export default upgrades;
