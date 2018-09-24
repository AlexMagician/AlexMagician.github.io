
import _ from 'lodash';

import module from '../module';
import GameState from '../../rogue/init/gamestate';

module.controller('Party', ($scope, $uibModal, $timeout) => {

  $scope.inventoryOffset = () => 60 + document.getElementsByClassName('player-block')[0].offsetHeight;

  $scope.countSlotsTaken = (equipment) => _.reduce(equipment, (prev, item) => prev + item.slotsTaken, 0);

  $scope.openEditWindow = (player, index) => {
    $uibModal.open({
      templateUrl: 'player-edit',
      controller: 'PartyMemberEdit',
      keyboard: false,
      backdrop: 'static',
      resolve: { player, index }
    });
  };

  $scope.isBelow = (player, stat, threshold) => (player[stat].cur/player[stat].max*100<threshold);
  $scope.isAbove = (player, stat, threshold) => (player[stat].cur/player[stat].max*100>threshold);

  GameState.on('redraw', () => {

    $timeout(function() {
      $scope.players = GameState.players;
    });

  });
});

module.controller('PartyMemberEdit', ($scope, $uibModalInstance, TemplateDataManager, UpgradeDataManager, player, index) => {
  $scope.close = $uibModalInstance.close;

  const upgradesBySplit = (split, defaultVal = 'Random') => {
    return [{ key: defaultVal, val: undefined }].concat(_(UpgradeDataManager.upgrades)
      .filter(u => _.contains(u, split))
      .map(u => u.split(split)[1].trim())
      .map(u => ({ key: u, val: u }))
      .value());
  };

  $scope.templateDataManager = TemplateDataManager;
  $scope.upgradeDataManager = UpgradeDataManager;
  $scope.index = index;
  $scope.player = player;

  $scope.genders = [
    { key: 'Случайно', val: undefined },
    { key: 'Мужской', val: 'Male' },
    { key: 'Женский', val: 'Female' }
  ];

  $scope.aligns = [
    { key: 'Случайно', val: undefined },
    { key: 'Агрессивный', val: -200 },
    { key: 'Злой', val: -100 },
    { key: 'Нейтральный', val: 0 },
    { key: 'Добрый', val: 100 },
    { key: 'Миролюбивый', val: 200 }
  ];

  $scope.professions = upgradesBySplit('Класс:');

  $scope.races = upgradesBySplit('Раса:');

  $scope.colors = [
    { key: 'По умолчанию', val: undefined },
    { key: 'Красный', val: '#f00' },
    { key: 'Синий', val: '#00f' },
    { key: 'Зеленый', val: '#0f0' },
    { key: 'Желтый', val: '#ff0' },
    { key: 'Бирюзовый', val: '#0ff' },
    { key: 'Пурпурный', val: '#f0f' }
  ];

  $scope.greater = upgradesBySplit('Ст. свойство', 'Нет');
  $scope.lesser = upgradesBySplit('Мл. свойство', 'Нет');
  $scope.utility = upgradesBySplit('Сит. свойство', 'Нет');
  $scope.buff = upgradesBySplit('Усиление:', 'Нет');

  $scope.ais = [
    { key: 'Изучать подземелье', val: undefined },
    { key: 'Бродить', val: 'Wander' }
  ];
});
