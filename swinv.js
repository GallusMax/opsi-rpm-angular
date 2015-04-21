(function(){
    var app = angular.module('opsi-swinv', []);
  
    app.controller('swinvController',function($http){
	this.products=opsiswp.result;
	this.baseurl="https://opsi.ub.hsu-hh.de:4447/interface/extend/configed?{%20%22id%22:%201,%20%22method%22:%20%22auditSoftware_getObjects%22,%20%22params%22:%20[]%20}";

	this.getprods=function(id){
	    $http.get(this.baseurl).
		then(function(response){
		this.products=response.result;
		});
	};

	this.getprods();

	
	this.getfirst=function(){

	    return this.products[0];
	};

    });






var opsiswp =  
{
"id": 1,
"result": [
{
"windowsDisplayVersion": "",
"ident": "AddressBook;;;;x86",
"name": "AddressBook",
"windowsSoftwareId": "addressbook",
"windowsDisplayName": "",
"installSize": -1,
"subVersion": "",
"language": "",
"version": "",
"architecture": "x86",
"type": "AuditSoftware"
},
{
"windowsDisplayVersion": "12.0.0.77",
"ident": "Adobe Flash Player 12 Plugin;12.0.0.77;;;x86",
"name": "Adobe Flash Player 12 Plugin",
"windowsSoftwareId": "{9d32cd07-ea5c-4a79-b976-c0c7f975ede4}",
"windowsDisplayName": "Adobe Flash Player 12 Plugin",
"installSize": -1,
"subVersion": "",
"language": "",
"version": "12.0.0.77",
"architecture": "x86",
"type": "AuditSoftware"
},
{
"windowsDisplayVersion": "",
"ident": "Branding;;;;x86",
"name": "Branding",
"windowsSoftwareId": "branding",
"windowsDisplayName": "",
"installSize": -1,
"subVersion": "",
"language": "",
"version": "",
"architecture": "x86",
"type": "AuditSoftware"
},
{
"windowsDisplayVersion": "",
"ident": "Connection Manager;;;;x86",
"name": "Connection Manager",
"windowsSoftwareId": "connection manager",
"windowsDisplayName": "",
"installSize": -1,
"subVersion": "",
"language": "",
"version": "",
"architecture": "x86",
"type": "AuditSoftware"
}
]};


})();
