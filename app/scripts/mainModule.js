angular.module('plannrs', ['LocalStorageModule'])
  .constant('API_URL', 'http://localhost:8080/api/proxy')
  .constant('JIRA_URL', 'https://jira.cwc.io/browse')
  .directive('ngEnter', function() {
    return function(scope, element, attrs) {
      element.bind("keydown keypress", function(event) {
        if(event.which === 13) {
          scope.$apply(function(){
            scope.$eval(attrs.ngEnter, {'event': event});
          });
          event.preventDefault();
        }
      });
    };
  });