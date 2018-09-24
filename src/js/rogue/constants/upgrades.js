
import _ from 'lodash';
import Professions from '../content/professions/_all';
import Races from '../content/races/_all';
import * as Traits from '../content/traits/_all';

const upgrades = [
  { name: 'Rename Tag',
    help: 'Allow for renaming of player characters.',
    cost: 100000,
    currency: 'sp' },
  { name: 'Color Tag',
    help: 'Allow for changing of player characters color.',
    cost: 100000,
    currency: 'sp' }
];

// SP
_.each(_.keys(Professions), profession => {
  upgrades.push(
    { name: `Random: ${profession}`,
      help: `This class (${profession}) will show up randomly.`,
      cost: 10000,
      currency: 'sp',
      operate: (upgradeData) => upgradeData.unlocked.profession.push(profession)
    });

  upgrades.push(
    { name: `Class: ${profession}`,
      help: `This class (${profession}) can be selected for all party members.`,
      req: `Random: ${profession}`,
      unlockedProfession: profession,
      cost: 50000,
      currency: 'sp',
      operate: (upgradeData) => upgradeData.selectable.profession.push(profession)
    });
});

_.each(_.keys(Races), race => {
  upgrades.push(
    { name: `Random: ${race}`,
      help: `This race (${race}) will show up randomly.`,
      cost: 20000,
      currency: 'sp',
      operate: (upgradeData) => upgradeData.unlocked.race.push(race)
    });

  upgrades.push(
    { name: `Race: ${race}`,
      help: `This race (${race}) can be selected for all party members.`,
      req: `Random: ${race}`,
      unlockedRace: race,
      cost: 80000,
      currency: 'sp',
      operate: (upgradeData) => upgradeData.selectable.race.push(race)
    });
});

_.each(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA', 'LUK'], stat => {
  upgrades.push({
    name: `Trait: L. ${stat}`,
    help: `Lesser ${stat} grants +1 ${stat} when assigned to a character.`,
    cost: 5000,
    currency: 'sp'
  });

  upgrades.push({
    name: `Trait: G. ${stat}`,
    help: `Greater ${stat} grants +3 ${stat} when assigned to a character.`,
    cost: 50000,
    currency: 'sp'
  });
});

_.each(_.keys(Traits), trait => {
  upgrades.push({
    name: `Trait: U. ${trait}`,
    help: `Grants utility for a basic level of ${trait} when assigned to a character`,
    cost: 100000,
    currency: 'sp'
  });
});

upgrades.push({
  name: 'Buff: Proficient',
  help: 'The assigned character is more proficient with every weapon.',
  cost: 100000,
  currency: 'sp'
});

upgrades.push({
  name: 'Buff: Higher Level',
  help: 'The assigned character starts at a higher level.',
  cost: 150000,
  currency: 'sp'
});

upgrades.push({
  name: 'Buff: Enchanted Gear',
  help: 'The assigned character gets an enchantment on all of their gear.',
  cost: 200000,
  currency: 'sp'
});

upgrades.push({
  name: 'Buff: Charged Gear',
  help: 'The assigned character gets more charges on all of their gear.',
  cost: 250000,
  currency: 'sp'
});

for(let i = 0; i < 3; i++) {
  upgrades.push({
    name: `Bigger Party ${i+1}`,
    help: `Add one member to your adventuring party.`,
    req: i > 0 ? `Bigger Party ${i}` : null,
    currency: 'sp',
    cost: (i+2) * 150000,
    operate: (upgradeData) => upgradeData.extra.players++
  });
}
// no more SP

// KP
for(let i = 0; i < 5; i++) {
  upgrades.push({
    name: `More Monsters ${i+1}`,
    help: `More monsters will be able to spawn in the dungeon.`,
    req: i > 0 ? `More Monsters ${i}` : null,
    currency: 'kp',
    cost: (i+1) * 20000,
    operate: (upgradeData) => upgradeData.dungeon.monsterLimit += 5
  });
}

for(let i = 0; i < 10; i++) {
  upgrades.push({
    name: `Darker Monsters ${i+1}`,
    help: `More difficult monsters will be able to spawn in the dungeon.`,
    req: i > 0 ? `Darker Monsters ${i}` : null,
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
      name: `Feature: ${_.capitalize(feat)} ${i+1}`,
      help: `The dungeon will spawn ${feat}s more frequently.`,
      req: i > 0 ? `Feature: ${_.capitalize(feat)} ${i}` : null,
      currency: 'vp',
      cost: (i+1) * 10,
      operate: (upgradeData) => upgradeData.dungeon[`${feat}spawnChance`] += 200 // +2%
    });
  }
});

for(let i = 0; i < 9; i++) {
  upgrades.push({
    name: `Deeper Dungeon ${i+1}`,
    help: `The dungeon will get 10 floors deeper.`,
    req: i > 0 ? `Deeper Dungeon ${i}` : null,
    currency: 'vp',
    cost: (i+1) * 20,
    operate: (upgradeData) => upgradeData.dungeon.depth += 10
  });
}

for(let i = 0; i < 9; i++) {
  upgrades.push({
    name: `Squarer Dungeon ${i+1}`,
    help: `The dungeon will get wider and taller.`,
    req: i > 0 ? `Squarer Dungeon ${i}` : null,
    currency: 'vp',
    cost: (i+1) * 5,
    operate: (upgradeData) => upgradeData.dungeon.squarity += 10
  });
}

for(let i = 0; i < 5; i++) {
  upgrades.push({
    name: `Lost and Found ${i+1}`,
    help: `More items got lost by previous adventurers, so you can find them!`,
    req: i > 0 ? `Lost and Found ${i}` : null,
    currency: 'vp',
    cost: (i+1) * 15,
    operate: (upgradeData) => upgradeData.dungeon.itemsInDungeon += 4
  });
}

for(let i = 0; i < 5; i++) {
  upgrades.push({
    name: `Perception Boost ${i+1}`,
    help: `Lost items are more likely to be out in the open.`,
    req: i > 0 ? `Perception Boost ${i}` : null,
    currency: 'vp',
    cost: (i+1) * 25,
    operate: (upgradeData) => upgradeData.dungeon.itemDropChance += 15
  });
}

for(let i = 0; i < 10; i++) {
  upgrades.push({
    name: `Faster Respawn ${i+1}`,
    help: `Respawn faster so the dungeon can eat you again faster.`,
    req: i > 0 ? `Faster Respawn ${i}` : null,
    currency: 'vp',
    cost: (i+1) * 25,
    operate: (upgradeData) => upgradeData.extra.respawnTime += 1
  });
}
// no more VP

export default upgrades;
