angular.module('plannrs')
  .controller('mainController', ['$scope', 'mainService','JIRA_URL', 'ticketProcessorService', function($scope, mainService, JIRA_URL, ticketProcessorService) {
    $scope.ui = {
      issueSummary: null,
      projectLabel: 'Select project',
      componentLabel: 'Select component',
      affectedVersionLabel: 'Select version',
      fixVersionLabel: 'Select version',
      labelLabel1: 'Select label 1',
      labelLabel2: 'Select label 2',
      epicLabel: 'Select epic',
      priorityLabel: 'Select priority',
      assigneeLabel: 'Select assignee',
      reporterLabel: 'Select reporter',
      issueTypeLabel: 'Select issue type',
      jqlQuery: null,
      jqlQueryProcessingResult: 'Nothing'
    }
    $scope.data = {
      projects: [{key:'Loading...'}],
      components: [{name:'Loading...'}],
      versions: [{name:'Loading...'}],
      labels: ['Loading...'],
      epics: [{fields:{customfield_10901:'Loading...'}}],
      priorities: [{displayName:'Loading...'}],
      issues: [],
      unreviewedIssues: [],
      users: [{key:'Loading...'}],
      issueTypes: [{name: 'Loading...'}]
    }
    $scope.formData = {
      selectedProjectId: null,
      selectedIssueTypeId: null,
      selectedSecurityId: '10802', // “Open to Centralway”,
      selectedPriorityId: null,
      //selectedDueDate: moment().add(1, 'week').day(5).format('YYYY-MM-DD'), // “Due Date”
      selectedDueDate: null,
      selectedComponentId: null,
      selectedAffectedVersionId: null,
      selectedFixVersionId: null,
      selectedReporter: null,
      selectedAssignee: null,
      selectedLabel1: null,
      selectedLabel2: null,
      selectedEpicKey: null,
      storyPoints: null
    }

    $scope.addIssue = function() {
      var issue = angular.copy($scope.formData);
      issue.summary = angular.copy($scope.ui.issueSummary);
      $scope.ui.issueSummary = null;
      $scope.data.issues.push(issue);
    }
    $scope.removeIssue = function(index) {
      $scope.data.issues.splice(index, 1);
    }

    $scope.loadProjects = function() {
      var promise = mainService.getProjects();
      promise.then(function(response) {
        $scope.data.projects = response;
      });
    }
    $scope.loadComponents = function() {
      var promise = mainService.getComponents();
      promise.then(function(response) {
        $scope.data.components = response;
      });
    }
    $scope.loadVersions = function(ignoreCache) {
      var promise = mainService.getVersions(ignoreCache);
      promise.then(function(response) {
        $scope.data.versions = response;
      });
    }
    $scope.loadEpics = function(ignoreCache) {
      var promise = mainService.getEpics(ignoreCache);
      promise.then(function(response) {
        $scope.data.epics = response.issues;
      }); 
    }
    $scope.loadLabels = function(ignoreCache) {
      var promise = mainService.getLabels(ignoreCache);
      promise.then(function(response) {
        $scope.data.labels = response;
      }); 
    }
    $scope.loadPriorities = function() {
      var promise = mainService.getPriorities();
      promise.then(function(response) {
        $scope.data.priorities = response;
      }); 
    }
    $scope.loadUnreviewedIssues = function(ignoreCache) {
      var promise = mainService.getUnreviewedIssues(ignoreCache);
      promise.then(function(response) {
        $scope.data.unreviewedIssues = response.issues;
      }); 
    }
    $scope.loadUsers = function() {
      var promise = mainService.getUsers();
      promise.then(function(response) {
        $scope.data.users = response;
      }); 
    }
    $scope.loadIssueTypes = function() {
      var promise = mainService.getIssueTypes();
      promise.then(function(response) {
        $scope.data.issueTypes = response;
      });
    }

    $scope.selectAssignee = function(assignee) {
      $scope.ui.assigneeLabel = assignee.displayName;
      $scope.formData.selectedAssignee = assignee.key;
    }

    $scope.selectReporter = function(reporter) {
      $scope.ui.reporterLabel = reporter.displayName;
      $scope.formData.selectedReporter = reporter.key;
    }

    $scope.selectIssueType = function(issueType) {
      $scope.ui.issueTypeLabel = issueType.name;
      $scope.formData.selectedIssueTypeId = issueType.id;
    }

    $scope.selectProject = function(project) {
      $scope.ui.projectLabel = project.key;
      $scope.formData.selectedProjectId = project.id;
    }

    $scope.selectPriority = function(priority) {
      $scope.ui.priorityLabel = priority.name;
      $scope.formData.selectedPriorityId = priority.id;
    }


    $scope.selectComponent = function(component) {
      $scope.ui.componentLabel = component.name;
      $scope.formData.selectedComponentId = component.id;
    }
    $scope.clearComponent = function() {
      $scope.ui.componentLabel = 'Select component';
      $scope.formData.selectedComponentId = null;
    }


    $scope.selectAffectedVersion = function(version) {
      $scope.ui.affectedVersionLabel = version.name;
      $scope.formData.selectedAffectedVersionId = version.id; 
    }
    $scope.clearAffectedVersion = function() {
      $scope.ui.affectedVersionLabel = 'Select version';
      $scope.formData.selectedAffectedVersionId = null;
    }


    $scope.selectFixVersion = function(version) {
      $scope.ui.fixVersionLabel = version.name;
      $scope.formData.selectedFixVersionId = version.id; 
    }
    $scope.clearFixVersion = function() {
      $scope.ui.fixVersionLabel = 'Select version';
      $scope.formData.selectedFixVersionId = null;
    }


    $scope.selectLabel1 = function(label) {
      $scope.ui.labelLabel1 = label;
      $scope.formData.selectedLabel1 = label; 
    }

    $scope.selectLabel2 = function(label) {
      $scope.ui.labelLabel2 = label;
      $scope.formData.selectedLabel2 = label; 
    }

    $scope.clearLabel1 = function() {
      $scope.ui.labelLabel1 = 'Select label 1';
      $scope.formData.selectedLabel1 = null;
    }
    $scope.clearLabel2 = function() {
      $scope.ui.labelLabel2 = 'Select label 2';
      $scope.formData.selectedLabel2 = null;
    }


    $scope.selectEpic = function(epic) {
      $scope.ui.epicLabel = epic.fields.customfield_10901;
      $scope.formData.selectedEpicKey = epic.key; 
    }
    $scope.clearEpic = function() {
      $scope.ui.epicLabel = 'Select epic';
      $scope.formData.selectedEpicKey = null;
    }


    /*
    $scope.createIssue = function() {
      var issueData = angular.copy($scope.formData);
      console.log("Response", mainService.createissue(issueData));
    }
    */
    $scope.createBulkIssues = function() {
      mainService.createBulkIssues($scope.data.issues);
      $scope.data.issues = [];
    }
    $scope.getJIRALink = function(key) {
      return JIRA_URL + '/' + key;
    }
    $scope.refreshUnreviewedIssues = function() {
      $scope.loadUnreviewedIssues(true);
    }

    $scope.getTotalStoryPoints = function() {
      ticketProcessorService.getTotalStoryPoints($scope.ui.jqlQuery, $scope.ui);
    }

    $scope.getTotalLabels = function() {
      ticketProcessorService.getTotalLabels($scope.ui.jqlQuery, $scope.ui);
    }

    $scope.loadUnreviewedIssues();
    
}])