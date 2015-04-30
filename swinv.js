(function(){
    var app = angular.module('opsi-swinv', []);
  
    app.controller('swinvController',function($http,$filter){

	this.showallprods=0;
	this.showopsiinstalled=0;
	baseurl='/rpc';
	logonurl='https://opsireader:opsipass@'+window.location.host+'/rpc';

	this.clientId="defaultclient.ub.hsu-hh.de";

	this.auditParams={'id':'jsonrpc','method':'auditSoftwareOnClient_getObjects','params':[]};
	this.auditParams.params.push([]);
	this.auditParams.params.push({"clientId":"defaultclient.ub.hsu-hh.de"});

	opsiURL=baseurl+"?"+$filter('json')(this.auditParams);

	me=this;
	me['installed']=[];
	me['productinfos']=[];

	this.jsonParmDns=function(){
	    this.search=window.location.search;
	    if (this.search.match(/dns/)){ // we believe in barcode like {"dns":"<clientId>"}
		var qsearch=decodeURIComponent(this.search).match(/{.+dns.+:.+}/);
		var jsonsearch=decodeURIComponent(qsearch); // get the json 
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
//		    alert("success: "+$filter('json')(response));
		    // call after logon success
		    me.getproductinfos(); 
		    me.refresh(me.clientId);
		})
		.error(function(response){
		    alert("err: "+(response));
		});
	};

	this.getprods=function(id){
	    this.opsires="calling.. "+id;
	    if(id)this.auditParams.params[1].clientId=id;
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
//	this.getproductinfos(); 

	this.refresh=function(id){
	    if(null != id){
		this.getprods(id);
		this.getinstalled(id);
	    }
	};


	this.nonMS=function(name){
//	    return true;
	    if(name.match(/AddressBook/)) return false;
	    if(name.match(/^Connection Manager/)) return false;
	    if(name.match(/^DirectDrawEx/)) return false;
	    if(name.match(/^DXM_Runtime/)) return false;
	    if(name.match(/^Fontcore/)) return false;
	    if(name.match(/KB[0-9]+/))  return false;
	    if(name.match(/Microsoft/)) return false;
	    if(name.match(/^MPlayer2/)) return false;
	    if(name.match(/^Outlook/)) return false;
	    if(name.match(/^[iI][Ee]/)) return false;
	    if(name.match(/^Windows/)) return false;
	    if(name.match(/^MobileOptionPack/)) return false;
	    if(name.match(/^SchedulingAgent/)) return false;
	    if(name.match(/^WIC/)) return false;
	    return true;
	}


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
	
	// mark rows w/o reason/license
	this.csswarn=function(name){
	    if(this.isOpsi(name) || this.reason(name))
		return "ng-binding";
	    else
		return "warn";
	};


    });


    var swpattern={'^Audacity':'OpenSource',
		   '^Java':'Oracle',
		   '^Mozilla ':'Mozilla Public',
		   '^Foxit':'Agreement',
		   '^Symantec':'SW Agreement',
		   '^LiveUpdate':'SW Agreement',
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
		   '^MagicInfo':'Agreement',
		   '^Sentinel':'FKI RFID',
		   '^KeyboardRF':'FKI RFID'

		  };




})();
