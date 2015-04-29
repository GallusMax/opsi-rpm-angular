(function(){
    var app = angular.module('opsi-swinv', []);
  
    app.controller('swinvController',function($http,$filter){

	this.showallprods=0;
	this.showopsiinstalled=0;
//	this.products=opsiswp.result;
	this.baseurl="/interface?{%20%22id%22:%201,%20%22method%22:%20%22auditSoftware_getObjects%22,%20%22params%22:%20[]%20}";
	baseurl='/rpc';
	logonurl='https://opsireader:opsipass@'+window.location.host+'/rpc';
	this.testurl='/interface?{"id":1,"method":"auditSoftware_getObjects","params":[]}';

	this.auditParams={'id':'jsonrpc','method':'auditSoftwareOnClient_getObjects','params':[]};
	this.logonParams={'id':'1','method':'authenticated','params':[]};
	this.localinstalledParams={'id':'1','method':'getInstalledLocalBootProductIds_list','params':[]};
	this.productinfosParams={'id':'1','method':'getProductInfos_hash','params':[]};

	this.auditParams.params.push([]);
//	this.auditParams.params.push({"clientId":"0024e81bc792.ub.hsu-hh.de"});
	this.auditParams.params.push({"clientId":"782bcbb49fd9.ub.hsu-hh.de"}); // goihl

	this.clientId="782bcbb49fd9.ub.hsu-hh.de";

	this.getObj={'method':'jsonp','url':baseurl,'params':this.auditParams}; // gets mangled

	opsiURL=baseurl+"?"+$filter('json')(this.auditParams);

	me=this;
	me['installed']=[];
	me['productinfos']=[];

	this.allProdClicked=function(check){
	    alert($filter('json')(check));
	};

	this.jsonParmDns=function(){
	    this.search=window.location.search;
	    if (this.search.match(/dns/)){ // we believe in barcode like {"dns":"<clientId>"}
		var qsearch=decodeURIComponent(this.search).match(/{.+dns.+:.+}/);
		var jsonsearch=decodeURIComponent(qsearch); // get the json 
//		alert(qsearch+" : "+jsonsearch);
//		return jsonsearch;
		return angular.fromJson(jsonsearch).dns;
//		return JSON.parse(jsonsearch).dns;
	    }
	    return null;
	};

	this.opsicall=function(field,method,arg){
    	    Params={'id':'1','method':method,'params':[]};
	    if(arg)Params.params[0]=arg;
	    $http.post(baseurl,Params)
		.success(function(response,stat,head,conf){
//		    alert("success: "+$filter('json')(response));
		    me.opsires="success: "+method;
		    me.opsiconf=conf;
		    if(response.error)
			alert(response.error.message);
		    else
			me[field]=response.result;
		  
		})
		.error(function(err,stat,head,conf){
		    me.opsires="error";
		    alert("err: "+(err)+stat+head+$filter('json')(conf));
		    me.opsistat=stat;
		    me.opsihead=head;
		    me.opsiconf=conf;
		});

	};

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

	// get products on Client with id
	this.getinstalled=function(id){
	    this.opsicall('installed','getInstalledLocalBootProductIds_list',id);
	};

	// get all available OPSi products
	this.getproductinfos=function(){
	    this.opsicall('productinfos','getProducts_listOfHashes');
	};

	this.logon();
	this.clientId=this.jsonParmDns();
	this.getproductinfos(); 

	this.refresh=function(id){
	    if(null != id){
		this.getprods(id);
		this.getinstalled(id);
	    }
	};


	this.refresh(this.clientId);

	this.nonMS=function(name){
//	    return true;
	    if(name.match(/KB[0-9]+/))  return false;
	    if(name.match(/Microsoft/)) return false;
	    if(name.match(/^[iI][Ee]/)) return false;
	    if(name.match(/^Windows/)) return false;
	    if(name.match(/AddressBook/)) return false;
	    if(name.match(/MobileOptionPack/)) return false;
	    return true;
	}

	this.getfirst=function(){
	    this.opsires="init";
//	    alert(this.opsires);
	    return this.products[0];
	};

	this.pattern=swpattern;

	this.reason=function(name){
	    for(p in this.pattern){
		if(name.match(p))
		    return this.pattern[p];
	    }
	    
	};
	
	// guess the corresponding OPSI productId from the Windows Product name
	this.opsiProdId=function(name){
	    for(i=0; i<this.productinfos.length;i++){
		p=this.productinfos[i];
		if(p.name && name.match(p.name)||name.match(p.productId))
		    return p.productId;
	    }
	    return null;
	};
	// convenience: is this an OPSI product?
	this.isOpsi=function(name){
	    return (null != this.opsiProdId(name));
	};



    });


    var swpattern={'^Java':'Oracle',
		   '^Mozilla ':'Mozilla Public',
		   '^Foxit':'erworben',
		   '^Symantec':'BW',
		   '^sprh':'GVK',
		   '^shiph':'GVK',
		   '^OpenOff':'OpenSource',
		   '^Google':'Google Public',
		   '^Adobe Flash':'Adobe Public',
		   '^OpenSSL':'OpenSource',
		   'HASP':'FKI RFID',
		   'LibraryConversion':'FKI RFID',
		   '^Camtasia':'',
		   '^Python':'OpenSource',
		   '^MagicInfo':'erworben',
		   '^Sentinel':'FKI RFID',
		   '^KeyboardRF':'FKI RFID'

		  };




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
