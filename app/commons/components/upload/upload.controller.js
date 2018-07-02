import random from '../../utility/random';
import uploadProvider from './uploadProvider';
import _ from 'lodash';
function uploadController($scope, $element, $attrs, $timeout,
  $http, oauthDataFactory) {
  
  var url = oauthDataFactory.urlMain()  + ($scope.url ? $scope.url : 'api/upload');
  var vm = this;
  vm.files = [];

  var _css = ''; 
  if (!$attrs.class && !$attrs.ngClass) {
    _css = '';    
  }
  else {
    _css = $attrs.ngClass ? $attrs.ngClass : $attrs.class;
  }

  var button = $element.find('button').addClass('btn btn-primary');  
  var fileField = $element.find('input');
  var ul = $element.find('ul');

  var _appendFileInfo = function (fileInfo) {
    vm.files.push(fileInfo);
    var name =  fileInfo.file.name;
    var gid = fileInfo.gid ;    
    ul.append('<li id="item-' + gid + '" class="list-group-item">' + 
    '<span class="file-info">' + name + '</span>' +
    '<i id="loading-' + gid + '" class="fa fa-spinner fa-spin text-primary"></i>' + 
    '</li>');
  }

  var _deleteUploadFile = function (gid) {
    $('#item-' + gid).remove();
    _.remove(vm.files, {
      gid: gid
    });
    uploadProvider.removeUploadFile($http, url, gid);
  }

  var _atferUploadFile = function (gid) {
    $('#loading-' + gid).removeClass('fa-spinner');
    $('#loading-' + gid).removeClass('fa-spin');
    $('#loading-' + gid).addClass('fa-check');

    $('#loading-' + gid).parent().append(
      '<i id="delete-' + gid + '" class="fa fa-times text-danger" ' +
      'style="padding-left: 5px;cursor: pointer;"></i>'
    );

    $timeout(function () {
      $('#delete-' + gid).bind('click', function () {
        _deleteUploadFile($(this).attr('id').replace('delete-', ''));
      })
    });
    fileField.val(null);
  }

  
  //If an ACCEPT attribute was provided, add it to the input.
  if ($attrs.accept) {
    fileField.attr('accept', $attrs.accept);
  }
  if ($attrs.multiple) {
    fileField.attr('multiple', $attrs.multiple);
  }

  fileField.bind('change', function (event) {
    vm.files = [];
    var files = event.target.files;
    for (var i = 0; i < files.length; i++) {
      var fileInfo = {file: files[i], gid: random.guid('')};
      _appendFileInfo(fileInfo);
      uploadProvider.uploadFile($http, url, fileInfo, _atferUploadFile);
    }

  });
  fileField.bind('click', function (e) {
    e.stopPropagation();
  });
  button.bind('click', function (e) {
    e.preventDefault();
    fileField[0].click();
  });

  function init() {

  }
  init();
}

/* @ngInject */
export default uploadController;