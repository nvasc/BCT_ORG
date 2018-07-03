function apiService($timeout, $rootScope) {

  var service = {};
  var _init = function () {
    $timeout(function () {
      $.AdminLTE.layout.fix();
      $(window, '.content-wrapper').unbind('resize');
    });
  };
  service.init = _init;
  return service

}
/* @ngInject */
export default apiService;
