angular.module('AlphaOmega.services',['ngResource'])
   .service("online",["$resource","$http","$timeout",online])
   .service("helper",["$ionicPopup","$ionicActionSheet","$state",helper])
   .service("crud",["online","helper","$stateParams","$log","$timeout",crud]);

//############################################################################//
//ONLINE                                                                      //
//############################################################################//
/*
 * online, is used to access the online db
 * @param {function} callback, the call back function for the results
 * @param {string} caller, when using the API to call a report
 * @returns {undefined}
 */
function online($resource,$http,$timeout) {
   var isViewLoading={"width": "100%", "display": "block"};

   this.notitia=function(params){

      var view = ":call,:view,:jesua,:mensa,:display";
      params   = params||{};
      checkConnection();//@todo: check connection mobile & desktop
      if (dynamis.get("SITE_CONFIG").isOnline && dynamis.get("SITE_CONFIG").Online) {
         var service = $resource(dynamis.get("SITE_API")+view, params, {"militia": {"method": "PUT", isArray: false, "cache": true, "responseType": "json", "withCredentials": true}});
         iyona.deb("SERVICE",service);
         return service;
      }else{
         iyona.msg("You are currently offline", true, "danger bold");
         isViewLoading = {"display": "none"};
         return false;
      }
   }//endufntion notitia

   this.verify=function(server){

      isViewLoading = {"display": "none"};
      if (server.notitia && (typeof server.notitia.sql !== "undefined" || typeof server.notitia.quaerre !== "undefined")) iyona.info("QUAERRE", server.notitia.sql || server.notitia.quaerre);
      if (server.notitia && server.notitia.idem !== 0) {//cookie
         var u = dynamis.get("USER_NAME", true) || {};
         u.cons = server.notitia.idem;
         dynamis.set("USER_NAME", u, true)
      }//pour maitre un autre biscuit
      if(typeof server.notitia !=="undefined" && typeof server.notitia.err !=="undefined") { iyona.err(server.notitia.err,server.notitia.msg); this.msg(server.notitia.msg); return false;}
      else if(typeof server.notitia !=="undefined" && typeof server.notitia.iota !=="undefined") return server;
      else {iyona.err('Online error',server);return false;}
   }//end verify

   this.responseType=this.responseType||"json";
   this.post=function(url,params,callback){

      if(dynamis.get("SITE_CONFIG").isOnline===false || dynamis.get("SITE_CONFIG").Online===false){iyona.msg("Your device is currently Offline.",true,"danger bold"); return false;}//@todo
      $http.post(url,params,{"responseType":this.responseType,"cache":true,"headers":{"Content-Type":"application/x-www-form-urlencoded"},"withCredentials":true})
      .success(function(server){isViewLoading = {"display":"none"};callback(server);})
      .error(function(data,status,headers,config){isViewLoading = {"display":"none"};
         iyona.msg("Please check your internet connection::"+navigator.connection.type,true,'danger bold');
         iyona.info("There was an error in handling the transaction.");
         if(data&&"err" in data)iyona.msg(data.err,true,"danger",true);
         iyona.deb(data,status,headers,config,config.url);
      });
   }


   this.msg=function(msg,permanent,err){//duplication of function from crud
      if(!msg) return;
      iyona.info(msg);
      clss=clss!==false?"balanced":"assertive";
      var clss=permanent!==true?clss+" blink_me":clss;iyona.deb("Jesus is Love",_$("#parent"),_$("#parent").scope());
      _$("#parent").scope().msg = {"text":msg,"err":err,"clss":clss};
      if(permanent!==true)$timeout(function(){_$("#parent").scope().msg=false; },5000);
   }
}
//############################################################################//
//HELPER                                                                      //
//############################################################################//
function helper($ionicPopup,$ionicActionSheet,$state){
   var curNode,$scope;

   this.set=function(scope,node,display){

      $scope   = scope;
      curNode  = eternalCall(node,display);
      //enable module that have been set in the Node setting
      if(curNode.display.module instanceof Array){
         var x,module,l=curNode.display.module.length;
         for(x=0;x<l;x++){
            module = curNode.display.module[x];
            $scope.module[module] = this[module];
         }//end for array module
      }//end if module array
   };//end func set
   this.action=function(){

      var title,submitTxt,buttons,custModule;
      title = curNode.display.title;

      if(!$scope.service.jesua) submitTxt = "<i class='icon ion-ios7-paper-outline' i> Create "+title;
      else submitTxt = "<i class='icon ion-ios7-compose-outline' i> Update "+title;
      //create default submit and add custom action modules, this includes text & module to be called.
      buttons = [{"text":submitTxt}];
      if(curNode.display.action instanceof Array){buttons = buttons.concat(curNode.display.action);}

      var actionSheet = $ionicActionSheet.show({
         "titleText":"Take Action",
         "buttons":buttons,
         "cancelText":"<i class='icon ion-ios7-close-outline' i> Cancel Action",
         "destructiveText":"<i class='icon ion-ios7-trash-outline' i> Delete Article",
         "buttonClicked":function(index){
            iyona.info("button clicked is",index);
            switch(index){
               case 0: $scope.module.submit(); break;//note submit is setup to update or create in the crud service.
               default://buttons has all the custome module & text, select the custome module via the index
                  custModule = buttons[index].module;
                  iyona.deb(custModule,buttons,$scope.module);
                  if(typeof $scope.module[custModule]!=="undefined") $scope.module[custModule]();
                  else if(typeof buttons[index].goto ==="string") $state.go(buttons[index].goto);
                  else if(typeof buttons[index].goto ==="object") $state.go(buttons[index].goto.call,buttons[index].goto.params,{"reload":false});
                  break;
            }actionSheet();
         },
         "cancel":function(){iyona.info("cancel button clicked ");},
         "destructiveButtonClicked":function(){$scope.module.delete(); actionSheet();}
      });
   };
   this.logoff=function(){

      $ionicPopup.confirm({"title":"Exit Applicaiton","template":"Are you sure you want to exit?"})
      .then(function(res){
         if(res){
            dynamis.clear();dynamis.clear(true);
            ionic.Platform.exitApp();
         }
         else {console.info("Not closing");}
      });

   };
   this.getPicture=function(e){

      if(typeof navigator.camera === "undefined") {iyona.err("Camera option not available.",navigator); return false;}
      navigator.camera.getPicture(
         function(img){iyona.info("Capturing image",Camera); e.target.src = "data:image/jpeg;base64,"+img; },
         function(err){$ionicPopup.alert({"title":"Image Capture","template":"Could not capture the image::"+err}).then(function(){iyona.info("The image was no image captured::"+err);}); },
         {"quality":100,"destinationType":Camera.DestinationType.DATA_URL,"correctOrientation":true});
   };
   this.barscan=function(){if(typeof cordova === "undefined"){iyona.info("cordova not setup");return;}

      cordova.plugins.barcodeScanner.scan(
         function(result){iyona.deb("Result",result);
            $ionicPopup.alert({"title":"Captured Content","template":"Result: "+result.text+"\n"+"Format: "+result.format+"\n"+"Candelled: "+result.cancelled});
            $state.go('call.article/search/'+result.text+'/barcode');
         },
         function(err){$ionicPopup.alert("Scanning failed: "+err);}
      );
   };
   this.addChild=function(set,newObj){

      $scope.display[set]=false;
      $scope.child.gerund[set].push(newObj);
   };

   this.showMe=function(opt){
      $scope.display[opt]=true;
   };
   this.reorderItem=function(item,from,to){

      iyona.deb("Ordering",item,from,to);
   };
   this.enumWalk=function(opt){

      var selected = $scope.father[opt].alpha? $scope.father[opt].alpha:0;
      selected++;

      if(typeof $scope.father[opt].enum[selected]!=="undefined")$scope.father[opt].alpha=selected;
      else $scope.father[opt].alpha = 0;
   };
}
//############################################################################//
//CRUD                                                                        //
//############################################################################//
function crud(online,helper,$stateParams,$log,$timeout){
   var that=this,$db,$scope,curNode,curMensa,curDisplay,curTitle,nodeName,nodeDisplay,RECORD,consuetudinem={};

   this.set=function(scope,node,display){

      $scope      = scope;//set the variable to the private var
      nodeName    = node;
      nodeDisplay = display;
      curNode     = eternalCall(node,display);//retrieve the eternal scope
      if(curNode===false) {iyona.err("The defaultScope was not found"); return false;}
      curMensa    = curNode.mensa;
      curDisplay  = curNode.display;
      curTitle    = curNode.title;
      $scope.module = typeof $scope.module!=="undefined"?$scope.module:{};
      //setup on $scope the module, service, father, child
      angular.extend($scope,{"father":curDisplay.fields,"child":curDisplay.child,"service":{"title":curTitle},"display":{} });
      angular.extend(consuetudinem,{"child":curDisplay.child,"uProfile":nodeName,"uDisplay":nodeDisplay});

      helper.set(scope,node,display);//set the module on the $scope.module property
      $db = online.notitia({"view":"form","call":"benedictio","mensa":nodeName,"display":nodeDisplay});

      $scope.module.delete = function(rem,ndx){ rem = rem||$stateParams.jesua; if(typeof $scope.module.omega==="function")$scope.module.omega(function(){omega(rem,ndx)}); else omega(rem,ndx);}
      if($stateParams.jesua==="new" || $stateParams.jesua==="") {
         $stateParams.jesua = null;$scope.service.Tau = "Alpha";$scope.service.title = "New "+curTitle;
         $scope.module.submit = function(){ if(typeof $scope.module.alpha==="function")$scope.module.alpha(function(){alpha()}); else alpha();}
      }
      if($stateParams.jesua==="list"){
         $stateParams.jesua = null;$scope.service.Tau = "sigma";
         sigmaList();
      }
      if($stateParams.jesua!==null && $stateParams.jesua!==""){
         $scope.service.jesua = $stateParams.jesua;$scope.service.Tau = "deLta";
         $scope.module.submit = function(){ if(typeof $scope.module.delta==="function")$scope.module.delta(function(){delta()}); else delta();}
         sigma($stateParams.jesua);
      }//end if updating

   };//end function set

   function sigma(jesua){ if($db===false) return;

      RECORD = new $db.get({"jesua":jesua},function(server){
         if(online.verify(server)===false)return;
         var iota = server.notitia.iota[0];

         for(var key in iota){//merge the result with defaultScope setting
            if (iota[key]!==null&&typeof $scope.father[key]!=="undefined"&&$scope.father[key].hasOwnProperty("alpha")){
               //for enumerators get index
               if(typeof $scope.father[key].enum!=="undefined") {$scope.father[key].alpha = $scope.father[key].enum.indexOf(iota[key]);}
               else $scope.father[key].alpha = iota[key];
            }
            else $scope.father[key]=iota[key];
         }
         $scope.$broadcast("readyForm",server.notitia);iyona.deb("Selected record server and father");that.msg(server.notitia.msg,false,'balanced');
      });
   }//end function sigma
   function sigmaList(){ if($db===false) return;
      
      var search = $stateParams.search?{"jesua":$stateParams.search}:{}
      RECORD = new $db.get(search,function(server){
         if(online.verify(server)===false)return;
         var iota = server.notitia.iota;
         $scope.generations=server.notitia.iota;

         $scope.$broadcast("readyList",server.notitia);iyona.deb("Selected record server and father");that.msg(server.notitia.msg,false,'balanced');
      });
   }//end function sigma
   function alpha(){iyona.info("Creating a new record");

      if(typeof $scope.father.created==="undefined") $scope.father.created = new Date().toISOString(); else if ($scope.father.created==="none") delete $scope.father.created;
      var basilia = setQuaerere(nodeName,$scope.father,$scope.service.Tau,consuetudinem);
      RECORD  = new $db();
      angular.extend(RECORD,basilia);
      RECORD.$save(function(server){
         if(online.verify(server)===false)return;
         var notitia = server.notitia;
         $scope.father.jesua.alpha = notitia.iota;
         that.msg(server.notitia.msg,false,'balanced');
      });
   }//end function alpha
   function delta(){iyona.info("Updating a record");

      var basilia = setQuaerere(nodeName,$scope.father,$scope.service.Tau,consuetudinem);
      delete RECORD.notitia;
      angular.extend(RECORD,basilia);

      RECORD.$militia({"jesua":$stateParams.jesua},function(server){
         if(online.verify(server)===false)return;
         var notitia = server.notitia;
         that.msg(notitia.msg,false,'balanced');
      });
   }//end function delta
   function omega(jesua,index){iyona.info("Deleting the record",jesua);

      if(!jesua){iyona.msg("You need to add a new record first.",false,"assertive bold"); return false;}
      RECORD.$delete({"jesua":jesua},function(server){iyona.deb("server server server",server);
         if(online.verify(server)===false)return;
         if(index)$scope.generations.splice(index,1);
         that.msg(server.notitia.msg,false,'balanced');
      });
   }//end function omega
   this.msg=function(msg,permanent,err){
      if(!msg) return;
      iyona.info(msg);
      clss=clss!==false?"balanced":"assertive";
      var clss=permanent!==true?clss+" blink_me":clss;
      $scope.$parent.msg = {"text":msg,"err":err,"clss":clss};
      if(permanent!==true)$timeout(function(){$scope.$parent.msg=false; },5000);
   }
}