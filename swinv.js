(function(){
    var app = angular.module('opsi-swinv', []);
  
    app.controller('swinvController',function($http,$filter){

//	this.products=opsiswp.result;
	this.baseurl="/interface?{%20%22id%22:%201,%20%22method%22:%20%22auditSoftware_getObjects%22,%20%22params%22:%20[]%20}";
	baseurl='/rpc';
	logonurl='https://opsireader:opsipass@'+window.location.host+'/rpc';
	this.testurl='/interface?{"id":1,"method":"auditSoftware_getObjects","params":[]}';

	this.auditParams={'id':'jsonrpc','method':'auditSoftwareOnClient_getObjects','params':[]};
	this.logonParams={'id':'1','method':'authenticated','params':[]};

	this.auditParams.params.push([]);
//	this.auditParams.params.push({"clientId":"0024e81bc792.ub.hsu-hh.de"});
	this.auditParams.params.push({"clientId":"782bcbb49fd9.ub.hsu-hh.de"}); // goihl

	this.getObj={'method':'jsonp','url':baseurl,'params':this.auditParams}; // gets mangled


	opsiURL=baseurl+"?"+$filter('json')(this.auditParams);

	me=this;

	this.logon=function(){
	    $http.post(logonurl,this.logonParams)
		.success(function(response){
//		    alert($filter('json')(response));
		})
		.error(function(response){
		    alert("err: "+(response));
		});
	};

	this.getprods=function(id){
	    this.opsires="calling.. "+id;
	    if(id)this.auditParams.params[1].clientId=id;
//	    this.opsistat=$filter('json')(this.getObj);
	    $http.post(baseurl,this.auditParams)
		.success(function(response,stat,head,conf){
		   // alert("success: "+response);
		    me.opsires="success";
		    if(response.error)alert(response.error.message);
		    me.products=response.result;
		    me.opsistat=stat;
		    me.opsihead=head;
		    me.opsiconf=conf;
		})
		.error(function(err,stat,head,conf){
		    me.opsires="error";
		    alert("err: "+(err)+stat+head+$filter('json')(conf));
		    me.opsistat=stat;
		    me.opsihead=head;
		    me.opsiconf=conf;
		});
//	    this.opsihead="call done";
	    
	};

	this.logon();
//	this.getprods();

	this.nonMS=function(name){
//	    return true;
	    if(name.match(/KB[0-9]+/))  return false;
	    if(name.match(/Microsoft/)) return false;
	    if(name.match(/^IE/)) return false;
	    return true;
	}

	this.getfirst=function(){
	    this.opsires="init";
//	    alert(this.opsires);
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
