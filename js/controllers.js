angular.module('AlphaOmega.controllers', [])
.controller('AppCtrl',['$scope','helper','$state',AppCtrl])
.controller('DashCtrl',['$scope','$ionicModal','online',DashCtrl])
.controller('ProfileCtrl',['$scope','crud',ProfileCtrl])
.controller('ProfileListCtrl',['$scope','crud',ProfileListCtrl])
.controller('ArticleCtrl',['$scope','crud',ArticlesCtrl])
.controller('CheckoutCtrl',['$scope','online',CheckoutCtrl])
.controller('ArticleDetailsCtrl',['$scope','crud',ArticleDetailsCtrl])
.controller('articleListLogsCtrl',['$scope','$ionicSlideBoxDelegate','crud',articleListLogsCtrl])
.controller('logViewsCtrl',['$scope','$ionicSideMenuDelegate','$ionicLoading','$ionicPopup',logViewsCtrl]);

//============================================================================//
/**
 * the controller for the main application.
 * This is located as the top parent controller of the side menus
 */
function AppCtrl($scope,helper,$state) {
   
   $scope.barscan=helper.barscan;
   $scope.logoff=helper.logoff;
   $scope.checkout=function(){
      $state.go('call.checkout');
   }
}
//============================================================================//
/**
 * the controller for the Dashboard
 */
function DashCtrl($scope,$ionicModal,online) {
	$scope.father = {};
   $ionicModal
   .fromTemplateUrl('cera/login.html',{"scope":$scope,"animation":"slide-in-up","focusFirstInput":true,"backdropClickToClose":false,"hardwareBackButtonClose":false})
   .then(function(modal){
      $scope.modal = modal;
      if(!impetroUser().operarius) $scope.modal.show();
   });

   $scope.loginDisplay = function(){ $scope.modal.show();};
   $scope.loginHide = function(){ $scope.modal.hide();};
   $scope.loginValidation = function () {$scope.loginHide(); };
   $scope.$on('$destroy',function(){$scope.modal.remove();});
   $scope.$on('modal.hidden',function(){/*...*/});
   $scope.$on('modal.removed',function(){/*...*/});

   angular.extend($scope,{"module":{},"service":{}});
   $scope.service.attempt=0;
   $scope.module.login  =function(){
      var u,p,url,setting= new configuration(),
      USER_NAME = {"operarius":"fredtma","licencia":{"Alpha":true,"deLta":true,"omegA":true,"lego":true},"nominis":"Frederick Tshimanga","jesua":"d27974ca95fd620ac92cf95bf8c1d1f2","procurator":1,"cons":"rpa741cbbu8c53ekcnmi1m6p13"};
      dynamis.set("USER_NAME",USER_NAME);dynamis.set("USER_NAME",USER_NAME,true);
      setting.config();//when login in run setup of default setting
      $scope.modal.remove();
      return;
      u=$scope.data.username;p=md5($scope.father.password);//aliquis
      if(!u || !p) {$scope.service.msg = "Please enter the username."; return false;}
      online.post(sessionStorage.SITE_SERVICE,{"u":u,"p":p},function(server){
         var row;
         if(server.length){
            row=server.rows[0];
            var procurator=(row['level']==='super')?1:0,
            USER_NAME={"operarius":row['username'],"licencia":row['aditum'],"nominis":row['name'],"jesua":row['jesua'],"procurator":procurator,"cons":row["sess"],"mail":row['email']};
            dynamis.set("USER_NAME",USER_NAME);dynamis.set("USER_NAME",USER_NAME,true);
            configuration.config();//when login in run setup of default setting
            $scope.modal.remove();
            //@todo:change login details.
         }else{$scope.service.attempt++;msg='Failed login.Fill in your email address & click on forgot password';
            iyona.msg(msg,false," danger bold");
         }
      });//fetch callback
   };
   $scope.module.forgot =function(){};

}
//============================================================================//
function ProfileCtrl($scope,crud){
   crud.set($scope,'profile-list','details');

   $scope.module.alpha=function(callback){
      var name = $scope.service.name.split(" ");
      $scope.father.firstname = name[0];$scope.father.lastname  = name[1];$scope.father.dob = $scope.service.year+'-'+$scope.service.month+'-'+$scope.service.day
      callback.call();//call the service function
   }
   $scope.module.delta=function(callback){
      var name = $scope.service.name.split(" ");
      $scope.father.firstname = name[0];$scope.father.lastname  = name[1];$scope.father.dob = $scope.service.year+'-'+$scope.service.month+'-'+$scope.service.day
      callback.call();//call the service function
   }
   $scope.$on("readyForm",function(data,notitia){
      if(typeof notitia.iota!=="undefined") {
         var dob = notitia.iota[0].dob;
         dob = dob.split("-")||[];
         if(dob.length>2){ $scope.service.year=dob[0];$scope.service.month=dob[1];$scope.service.day=dob[2];}
         $scope.service.name = notitia.iota[0].firstname+' '+notitia.iota[0].lastname;
      }
      else iyona.info("Could not set name",data,notitia);
   });

}
//============================================================================//
function ProfileListCtrl($scope,crud){crud.set($scope,'profile-list','list');}
//============================================================================//
/**
 * the controller for the article
 */
function ArticlesCtrl($scope,crud) {
   
   crud.set($scope,'judges','list');
}
//============================================================================//
/**
 * the controller for the article
 */
function CheckoutCtrl($scope,online) {
   iyona.deb("Check",navigator.onLine,dynamis.get("SITE_CONFIG").isOnline, dynamis.get("SITE_CONFIG").Online,{"militia":"checkout","impetroUser":impetroUser().jesua,"cart":dynamis.get("cart"),"location":"benedictio"});
   online.post(sessionStorage.SITE_SERVICE,{"militia":"checkout","impetroUser":impetroUser().jesua,"cart":dynamis.get("cart"),"location":"benedictio"},function(server){
      iyona.deb("Checkout",server);
      $scope.address = (typeof server.address!=="undefined" && typeof server.address.rows!=="undefined")?server.address.rows:{};
      $scope.articles= (typeof server.articles!=="undefined" && typeof server.articles.rows!=="undefined")?server.articles.rows:{};
   });
}
//============================================================================//
/**
 * the controller for the article logs
 */
function ArticleDetailsCtrl($scope,crud) {
   crud.set($scope,'judges','details');

   $scope.module.alpha=function(callback){
      $scope.father.code = $scope.father.code||uRand(5,true,true,true);iyona.deb("ALPHA",$scope.father);
      callback.call();//call the service function
   }
   $scope.module.add2Cart = function(){
      var cart = dynamis.get("cart")||[];
      var result = objSearch(cart,$scope.father.jesua);
      if(result===false)cart.push({"article":$scope.father.jesua,"total":1});
      else cart[result[1]].total += 1;
      $scope.$parent.items = cart.length;
      iyona.deb(cart,result);
      dynamis.set("cart",cart);
   }
}
//============================================================================//
/**
 * the controller for the article logs
 */
function articleListLogsCtrl($scope,$ionicSlideBoxDelegate,crud) {
   crud.set($scope,'article-logs','details');
   var num,article,articles = $scope.articles.data;

   $scope.module.alpha=function(callback){
      $scope.father.code = $scope.father.code||uRand(5,true,true,true);iyona.deb("ALPHA",$scope.father);
      callback.call();//call the service function
   }
   $scope.$on("readyList",function(server){
      $ionicSlideBoxDelegate.update();
   });
}
//============================================================================//
/**
 * the controller for the article
 */
function logViewsCtrl($scope,$ionicSideMenuDelegate,$ionicLoading,$ionicPopup) {
   //disable and enable the slide menu
   $ionicSideMenuDelegate.canDragContent(false);
   $scope.$on("$stateChangeStart",function(ev,newLoc,oldLoc){ console.warn("Change side menu"); $ionicSideMenuDelegate.canDragContent(true);});

   //$ionicLoading.show({"template":"<strong>Laoding</strong>...","delay":"0","duration":2000})
   //function to count the changes of the slides
   $scope.slideHasChanged=function(index){console.log("the chosen one is ",index);};

   //capture an image
   $scope.getPicture=function(e){
      if(typeof navigator.camera === "undefined") {console.error("object not there ",navigator); return false;}
      navigator.camera.getPicture(
         function(img){console.info("Capturing image",Camera); e.target.src = "data:image/jpeg;base64,"+img; },
         function(err){$ionicPopup.alert({"title":"Image Capture","template":"Could not capture the image::"+err}).then(function(){console.info("The image was not capture::"+err);}); },
         {"quality":100,"destinationType":Camera.DestinationType.DATA_URL,"correctOrientation":true});
   };
}//