cracklord.controller('ResourcesController', ['$scope', 'ResourceList', function ResourceController($scope, ResourceList) {
	ResourceList.reload();
	$scope.resources = ResourceList.getAll();
	
	$scope.loadServers = function() { 
		ResourceList.reload(); 
		$scope.resources = ResourceList.getAll();
	}
}]);

cracklord.controller('ConnectResourceController', ['$scope', '$state', 'ResourceService', 'ResourceList', 'growl', '$timeout', function CreateJobController($scope, $state, ResourceService, ResourceList, growl, $timeout) {
	$scope.formData = {};
	$scope.displayWait = false;

	$scope.processResourceConnectForm = function() {
		$scope.displayWait = true;

		var newresource = new ResourceService();

		newresource.name = $scope.formData.name;
		newresource.address = $scope.formData.address;
		newresource.key = $scope.formData.key;
		
		ResourceService.save(newresource).$promise.then(
			function(data) {
				ResourceList.reload();
				$timeout(function() {
					growl.success("Connecting to resource");
					$state.transitionTo('resources');
				}, 3000)
			}, 
			function(error) {
				$scope.displayWait = false;
				switch (error.status) {
					case 400: growl.error("You sent bad data, check your input and if it's correct get in touch with us on github"); break;
					case 403: growl.error("You're not allowed to do that..."); break;
					case 409: growl.error("The request could not be completed because there was a conflict with the existing resource."); break;
					case 500: growl.error("An internal server error occured while trying to add the resource."); break;
				}
			}
		);
	}	
}]);