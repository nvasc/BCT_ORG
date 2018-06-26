import gridCommand from './grid-command.html';
import colActive from './col-active.html';
import saveTemplate from './save.html';

function clientController($q, $scope, clientService, popupFactory) {
  const vm = this;
  // Message ------------------
  var rss = {
    CreateTitle: 'Tạo mới một client',
    CreateButton: 'Tạo mới',
    CreateButtonClass: 'btn-primary',

    UpdateTitle: 'Cập nhật một client',
    UpdateButton: 'Cập nhật',
    UpdateButtonClass: 'btn-primary',

    DeleteConfirm: 'Bạn có chắc chắn muốn xóa client này?',
    DeleteTitle: 'Xóa một client',
    DeleteButton: 'Xóa',
    DeleteButtonClass: 'btn-danger',

    CancelButton: 'Hủy',
    CancelButtonClass: 'btn-default'    
  }
  // Initial in screen ------------------
  clientService.init();
  var _scopeGrid = null;
  // Scope of Grid
  vm.setScopeGrid = function (s) {
    _scopeGrid = s;
  };

  function refreshGrid() {
    if (_scopeGrid) {
      _scopeGrid.refresh();
    }
  }

  // Column Define of Grid Component ------------------
  vm.colDefs = [{
    name: 'Audience',
    displayName: 'Key',
  }, {
    name: 'Secret',
    displayName: 'Secret',
  }, {
    name: 'Issuer',
    displayName: 'Domains',
  }, {
    name: 'RefreshTokenLifeTime',
    displayName: 'Expire In',
    dataType: 1,
    width: 90,
  }, {
    width: 90,
    name: 'IsActive',
    displayName: 'Trạng Thái',
    cellTemplate: colActive,
    cellClass: 'grid-text-align-center',
    enableSorting: false,
    dataType: 3
  }, {
    name: ' ',
    cellTemplate: gridCommand,
    cellClass: 'grid-command',
    width: 60,
    enableSorting: false,
    enableFiltering: false,
  }];
  // manually Filter in Grid Component ------------------
  vm.isFilter = false;
  vm.filter = function () {
    vm.isFilter = !vm.isFilter;
  }
  
  // CRUD for this function ------------------
  vm.saveObj = {};

  vm.create = function () {
    popupFactory.setOptions({
      rss: rss,
      title: rss.CreateTitle,
      columnClass: 'col-md-offset-3 col-md-6',        
      icon: 'fa fa-plus', 
      content: saveTemplate,
      scope: $scope,
    });

    clientService.get(0).then(function (obj) {      
      vm.saveObj = obj;
      popupFactory.create(function () { 
        var deferred = $q.defer();
        clientService.create(vm.saveObj).then(function () {
          deferred.resolve(true); 
          refreshGrid(); 
        }, function () {
          deferred.resolve(false);  
        })    
        return deferred.promise;
      }, function () { vm.saveObj = {}; });
    });
    
  }
  vm.update = function (row) {
    popupFactory.setOptions({
      rss: rss,
      title: rss.UpdateTitle,
      columnClass: 'col-md-offset-3 col-md-6',  
      icon: 'fa fa-edit',
      content: saveTemplate,
      scope: $scope,
    });
    clientService.get(row.entity.Id).then(function (obj) {      
      vm.saveObj = obj;
      popupFactory.update(function () { 
        var deferred = $q.defer();
        clientService.update(row.entity.Id, vm.saveObj).then(function () {
          deferred.resolve(true);  
          refreshGrid();
        }, function () {
          deferred.resolve(false);  
        })              
        return deferred.promise;
      }, function () { vm.saveObj = {}; });
    });
  };

  vm.delete = function (row) {
    popupFactory.setOptions({
      rss: rss,
      title: rss.DeleteTitle,
      columnClass: 'col-md-offset-5 col-md-3',   
      icon: 'fa fa-times',
      content: rss.DeleteConfirm,
      scope: $scope,
    });
    popupFactory.delete(function () { 
      var deferred = $q.defer();
      clientService.delete(row.entity.Id).then(function () {
        deferred.resolve(true);
        refreshGrid();
      }, function () {
        deferred.resolve(false);  
      })    
      return deferred.promise;
    }, function () { vm.saveObj = {} });
  };

}

/* @ngInject */
export default clientController;