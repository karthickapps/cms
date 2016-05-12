var app = angular.module("contact", ['ui.bootstrap']);

app.controller("ContactCtrl", ["$scope", "$http", "$modal", function($scope, $http, $modal){

	//Form validation
	var validate = function (form) {
        for (var field in form) {
           if(field[0] != '$' && form[field].$pristine) {
                form[field].$setViewValue(
                    form[field].$modelValue
                );
                form[field].$dirty = true;
            }
        }
    };

	var failureHanlder = function(err){
		alert(err.data.message);
	};
	
	var refresh = function(){
		var successHandler = function(response){
			$scope.list = response.data.data;
		};
		$http.get("/getContacts").then(successHandler, failureHanlder);
    }

    refresh();

    $scope.saveContact = function(form){
		if(!form.$valid){
    		validate(form);
    		return;
    	}
    	$http.post("/saveContact", $scope.contact).then(refresh, failureHanlder);	
		$scope.close();
		angular.element('#addContact').modal('hide');
	};

	$scope.updateContact = function(form){
		if(!form.$valid){
    		validate(form);
    		return;
    	}
		$http.post("/updateContact", $scope.contact).then(refresh, failureHanlder);
		$scope.close();
		angular.element('#addContact').modal('hide');
	};

	$scope.editContact = function(contact){
		$scope.popup = {
			title : "Edit Contact",
			save : false
		};
		contact.dob = new Date(contact.dob);
		$scope.contact = contact;
	};

	$scope.addContact = function(){
		$scope.popup = {
			title : "Add Contact",
			save : true
		};
	};

	$scope.close = function(){
		$scope.contact = {};
        $scope.contactForm.$dirty = false;
        $scope.contactForm.$setPristine(true);
    };

	$scope.viewContact = function(contact){
		$scope.contactDetail = contact;
	};

	$scope.deleteContact = function(id){
		$http.delete("/deleteContact/"+id).then(refresh, failureHanlder);
	};

	$scope.reverseOrderBy = false;
	$scope.orderByColumn = "name";
	
	$scope.getOrderByClass = function(columnName){
		if($scope.orderByColumn == columnName){
			return $scope.reverseOrderBy ? 'sortAsc' : "sortDsc";
		}else{
			return '';
		}
	};

	$scope.orderBy = function(columnName){
		$scope.reverseOrderBy = ($scope.orderByColumn == columnName) ? !$scope.reverseOrderBy : false;
		$scope.orderByColumn = columnName;
	}
}]);
