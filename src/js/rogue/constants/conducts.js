
import _ from 'lodash';
import Settings from './settings';

const conducts = [
  // breakable conducts
  { check: (player) => !player.brokenConduct.stubborn, affirmMessage: 'Вы ни разу не меняли снаряжение.' },
  { check: (player) => !player.brokenConduct.wieldedWeapon, affirmMessage: 'Вас ни разу не атаковали физичексим оружием.' },
  { check: (player) => !player.brokenConduct.pacifist, affirmMessage: 'Вы были пацифистом.' },
  { check: (player) => !player.brokenConduct.nudist, affirmMessage: 'Вы ни разу не экипировали броню.' },
  { check: (player) => !player.brokenConduct.celibate, affirmMessage: 'Вы были одиноки.' },
  { check: (player) => player.brokenConduct.lifeSave, affirmMessage: 'Ваша жизнь была спасена.' },

  // traits
  { check: (player) => player.hasTrait('Infravision'), affirmMessage: 'Вы обладали инфразрением.' },
  { check: (player) => player.hasTrait('Protection'), affirmMessage: 'Вы обладали стойкостью.' },
  { check: (player) => player.hasTrait('Clairvoyance'), affirmMessage: 'Вы обладали ясновидением.' },
  { check: (player) => player.hasTrait('Warning'), affirmMessage: 'Вы были осторожны.' },
  { check: (player) => player.hasTrait('Telepathy'), affirmMessage: 'Вы владели телепатией.' },
  { check: (player) => player.hasTrait('Stealth'), affirmMessage: 'Вы были незаметным.' },
  { check: (player) => player.hasTrait('Invisible'), affirmMessage: 'Вы были невидимы.' },
  { check: (player) => player.hasTrait('SeeInvisible'), affirmMessage: 'Вы могли видеть невидимое.' },
  { check: (player) => player.getSpeed() > Settings.game.baseSpeed, affirmMessage: 'Вы были быстры.' },
  { check: (player) => player.getSpeed() < Settings.game.baseSpeed, affirmMessage: 'Вы были медленным.' },

  { check: (player) => player.hasTrait('PoisonResistance'), affirmMessage: 'Вы были невосприимчивым к яду.' },
  { check: (player) => player.hasTrait('ShockResistance'), affirmMessage: 'Вы были невосприимчивы к шоку.' },
  { check: (player) => player.hasTrait('FireResistance'), affirmMessage: 'Вы были невосприимчивы к огню.' },
  { check: (player) => player.hasTrait('AcidResistance'), affirmMessage: 'Вы были невосприимчивы к кислоте.' },
  { check: (player) => player.hasTrait('IceResistance'), affirmMessage: 'Вы были невосприимчивы ко льду.' },

  // statuses
  { check: (player) => player.hasBehavior('Stunned'), affirmMessage: 'Вас оглушили.' },
  { check: (player) => player.hasBehavior('Poisoned'), affirmMessage: 'Вас отравили.' },
  { check: (player) => player.hasBehavior('Seduced'), affirmMessage: 'Вас соблазнили.' },

  // alignment
  { check: (player) => player.getAlign() === 0, affirmMessage: 'Вы были нейтральны.' },
  { check: (player) => player.getAlign() < 0, affirmMessage: 'Вы были злым.' },
  { check: (player) => player.getAlign() > 0, affirmMessage: 'Вы были добрым.' },

  // you probably always see this
  { check: (player) => player.hp.atMin(), affirmMessage: 'Вы погибли.' }
];

export default (player) => {
  const finalConduct = [];

  const tenses = [
    { split: '%could', past: 'могли', now: 'можете' },
    { split: '%were',  past: 'были',  now: '' },
    { split: '%was',   past: 'был',   now: 'будете' },
    { split: '%had',   past: 'имели',   now: 'имеете' }
  ];

  const adjustMessage = (msg) => _.reduce(tenses, ((prev, obj) => prev.split(obj.split).join(player.hp.atMin() ? obj.past : obj.now)), msg);
  const addMessage = (msg) => finalConduct.push(adjustMessage(msg));

  _.each(conducts, (conduct) => {
    if(conduct.check(player)) {
      addMessage(conduct.affirmMessage);
    } else if(conduct.rejectMessage) {
      addMessage(conduct.rejectMessage);
    }
  });

  return _.sortBy(finalConduct);
};