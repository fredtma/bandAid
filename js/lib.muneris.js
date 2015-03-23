/*
 * library helper functions
 * hasFormValidation
 * load_script
 * objectSize
 * timeFrame
 * ucwords
 * ucfirst
 * alphaNumertic
 * readWorker
 * callWorker
 * setQuaerere
 * checkConnection
 * objSearch
 * timeDifference
 * downloadURL
 * uRand

 * GPLUS_USER
 * GET_IAMGE
 */

//============================================================================//CONFIG

/*
 * The config needs to be a function in order for the user to login again after a logout clear session.
 */

function configuration(){}
configuration.prototype.config=function(){
   var isChrome=(typeof chrome !== "undefined" && typeof chrome.app.window!=="undefined");
   var i = (isChrome)?'':(true)?'i/':'';
   var conf;

   sessionStorage.startTime   = new Date().getTime();
   sessionStorage.runTime     = new Date().getTime();
   sessionStorage.SITE_NAME   = "Aurora benedictio";
   sessionStorage.SITE_DATE   = 'fullDate';
   sessionStorage.SITE_TIME   = 'mediumTime';
   sessionStorage.SITE_LOCA   = 'benedictio';
   sessionStorage.SITE_URL    = 'http://demo.xpandit.co.za/aura/';
   sessionStorage.SITE_API    = sessionStorage.SITE_URL+i;
   sessionStorage.SITE_SERVICE= sessionStorage.SITE_URL+i+'services';
   sessionStorage.SITE_MILITIA= sessionStorage.SITE_URL+i+'notitia';
   sessionStorage.SITE_ALPHA  = sessionStorage.SITE_URL+i+'alpha';
   sessionStorage.SITE_CONNECT= sessionStorage.SITE_URL+i+'is-connect';
   sessionStorage.SITE_ALIQUIS= sessionStorage.SITE_URL+i+'aliquis';
   sessionStorage.SITE_UPLOADS= sessionStorage.SITE_URL+'uploads/';
   sessionStorage.MAIL_SUPPORT= 'support@xpandit.co.za';
   sessionStorage.DB_NAME     = 'app_xpandit';
   sessionStorage.DB_VERSION  = 1;//always use integer bcos of iDB
   sessionStorage.DB_DESC     = 'The local application Database';
   sessionStorage.DB_SIZE     = 15;
   sessionStorage.DB_LIMIT    = 20;
   conf = {
      "Worker":         window.hasOwnProperty('Worker'),
      "openDatabase":   "openDatabase" in window,
      "indexedDB":      "indexedDB" in window||"webkitIndexedDB" in window||"mozIndexedDB" in window||"msIndexedDB" in window,
      "WebSocket":      window.hasOwnProperty('WebSocket'),
      "history":        window.hasOwnProperty('history'),
      "formValidation": hasFormValidation(),
      "useWorker":      true,
      "useIDB":         true,
      "useWebSql":      false,
      "useJSvalidation":true,
      "isOnline":       navigator.onLine,
      "Online":         true,//used in online service
      "projectID":      "17238315752",
      "chromeApp":      (typeof chrome !== "undefined" && typeof chrome.app.window!=="undefined")
   };
   sessionStorage.SITE_CONFIG   = JSON.stringify(conf);
   iyona.sync({"url":sessionStorage.SITE_URL+'json/caecus-benedictio.json',"method":"get","format":"json","callback":function(data){
      iyona.off("eternalScope-",data);
      dynamis.set("eternal",data,true);
   }});
   dynamis.set("EXEMPLAR",{
      "username":["^[A-Za-z0-9_]{6,15}$","requires at least six alpha-numerique character"],
      "pass1":["((?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,20})","requires complex phrase with upperCase, lowerCase, number and a minimum of 6 chars"],
      "pass2":["^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$","requires complex phrase with upperCase, lowerCase, number and a minimum of 6 chars"],
      "password":["(?=^.{6,}$)((?=.*[0-9])|(?=.*[^A-Za-z0-9]+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$","requires upperCase, lowerCase, number and a minimum of 6 chars"],
      "pass3":["^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$","requires upperCase, lowerCase, number and a minimum of 6 chars"],
      "fullDate":["(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))","follow the following date format (YYYY-MM-DD)"],
      "phone":["[\(]?[0-9]{3}[\)]?[\-|\ ]?[0-9]{3}[\-|\ ]?[0-9]{4}","follow the format of 011-222-3333"],
      "minMax":["[a-zA-Z0-9]{4,8}","requires at least four to eight character"],
      "number":["[-+]?[0-9]*[.,]?[0-9]+","requires a numberic value"],
      "url":["^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$","requires a valid URL"],
      "colour":["^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$","requires a valid colour in the form of (#ccc or #cccccc)"],
      "bool":["^1|0","requires a boolean value of 0 or 1"],
      "email":["^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$","the email address is not the right formated"],
      "single":["^[a-zA-Z0-9]","requires a single value"]});
   return this;
};
//============================================================================//LOGGER
/*
 * @cons:the representation of the console.log
 * @stack:the stack used to display the line number
 * @obj: an array of object are passed and consoled for each
 * @info:permanent,preferably a single line of formated colour text
 * @msg: displays a message on the interphase
 * @deb: the debbuger for all viriables
 * @sync:ajax obj call with the parms {method,format,url,var}
 */
iyona={
   view: true,
   cons: console.log,
   stack:function(){
      var isChrome = navigator.userAgent.indexOf("Chrome") !== -1;
      if(isChrome||true){
         var stack = new Error().stack,n=isChrome?3:2;
         var file = stack.split("\n")[n].split("/");
         return '('+file[file.length-1]+')';}
      else{return '';}
   },
   obj:  function(){
      var l=arguments.length;
      for(var x=0;x<l;x++){
         if(typeof arguments[x]==="function") console.log(encodeURI(arguments[x].toString()));
         else if(typeof arguments[x]==="undefined"||arguments[x]===null){ console.log("<null>");}
         else if (typeof arguments[x]==="object") {for (var index in arguments[x]) console.log(index+'='+arguments[x][index]);}
         else console.log(arguments[x]);
      }
   },
   info: function(){
      arguments[arguments.length++]=this.stack();
      console.info('%c'+arguments[0],'background:#0099ff;color:#efefef;width:100%;display:block;font-weight:bold;',arguments);
   },
   err: function(){
      arguments[arguments.length++]=this.stack();
      console.warn('%c'+arguments[0],'background:#ff0000;color:#ececec;width:100%;display:block;font-weight:bold;',arguments);
   },
   msg:  function(msg,permanent,clss){
      console.info(arguments);
      clss=clss||'';
      _$("#notification").html(msg).removeClass().addClass('blink_me '+clss);
      if(permanent!==true)setTimeout(function(){_$("#notification").html("").removeClass('blink_me');},5000);
   },
   deb:  function(){
      if(this.view){
         arguments[arguments.length++]=this.stack();
         this.cons.apply(console,arguments);
      }
   }/*break down all set var into arr, custom debug msg re-created*/,
   off:  function(){},
   on:   this.deb,
   sync: function(settings){//{method,format,url,params,callback}
      var xhr=new XMLHttpRequest(),params;

      xhr.open(settings.method,settings.url,true);
      xhr.responseType=settings.format;
      xhr.onreadystatechange=function(e){
         if(this.readyState===4 && this.status===200){
            var response=this.response||"{}";//@fix:empty object so as to not cause an error
            if(typeof response==="string"&&settings.format==="json")response=JSON.parse(response);//wen setting responseType to json does not work
            if(typeof settings.callback==="function")settings.callback(response);
         }
      }//xhr.onload=function(e){iyona.deb("III",e,this.readyState,this.status,this.response);};

      if(typeof settings.params==="object"){
         xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");params=JSON.stringify(settings.params);
      }else{
         params=settings.params;xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      };
      if(settings.format==="json"){
         xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");//questionable, to be removed?
         xhr.setRequestHeader("Accept","text/html,application/xhtml+xml,application/xml;application/json;q=0.9,*/*;q=0.8");//used in FF
      }
      xhr.onerror=function(e){this.deb(e);};
      xhr.send(params);
   }
};
//============================================================================//STORAGE
/*
 * used to store to storage to json objects
 */
dynamis={
   set:function(_key,_value,_local){//chrome.app.window
      var set={},string;set[_key]=_value;var isChrome=(typeof chrome !== "undefined" && typeof chrome.app.window!=="undefined");string=JSON.stringify(_value);
      if(typeof chrome!=="undefined"&&chrome.hasOwnProperty("storage")&&_local===true){chrome.storage.local.set(set);sessionStorage.setItem(_key,string);}
      else if(typeof chrome!=="undefined"&&chrome.hasOwnProperty("storage")&&!_local){chrome.storage.sync.set(set);sessionStorage.setItem(_key,string);}
      else if(_local===true&&!isChrome){localStorage.setItem(_key,string);}
      else{sessionStorage.setItem(_key,string);}//endif
   },
   get:function(_key,_local){
      var value,isChrome=(typeof chrome !== "undefined" && typeof chrome.app.window!=="undefined");
      if(typeof chrome!=="undefined"&&chrome.hasOwnProperty("storage")&&_local===true){chrome.storage.local.get(_key,function(obj){return obj[_key];});value=sessionStorage.getItem(_key);return (value&&value.indexOf("{")!==-1)?JSON.parse(value):value;}
      else if(typeof chrome!=="undefined"&&chrome.hasOwnProperty("storage")&&!_local){chrome.storage.sync.get(_key,function(obj){return obj[_key];});value=sessionStorage.getItem(_key);return (value&&value.indexOf("{")!==-1)?JSON.parse(value):value;}
      else if(_local===true&&!isChrome){value=localStorage.getItem(_key);return (value&&value.indexOf("{")!==-1)?JSON.parse(value):value;}
      else{value=sessionStorage.getItem(_key);return (value&&value.indexOf("{")!==-1)?JSON.parse(value):value;}//endif
   },
   del:function(_key,_local){var isChrome=(typeof chrome !== "undefined" && typeof chrome.app.window!=="undefined");
      if(typeof chrome!=="undefined"&&chrome.hasOwnProperty("storage")&&_local===true){chrome.storage.local.remove(_key);sessionStorage.removeItem(_key);}
      else if(typeof chrome!=="undefined"&&chrome.hasOwnProperty("storage")&&!_local){chrome.storage.sync.remove(_key);sessionStorage.removeItem(_key);}
      else if(_local===true&&!isChrome){localStorage.removeItem(_key);}
      else{sessionStorage.removeItem(_key);}//endif
   },
   clear:function(_local){var isChrome=(typeof chrome !== "undefined" && typeof chrome.app.window!=="undefined");
      if(typeof chrome!=="undefined"&&chrome.hasOwnProperty("storage")&&_local===true){chrome.storage.local.clear();}
      else if(typeof chrome!=="undefined"&&chrome.hasOwnProperty("storage")&&!_local){chrome.storage.sync.clear();}
      else if(_local===true&&!isChrome){localStorage.clear();}
      else{sessionStorage.clear();}//endif
   }
};
//============================================================================//
(function(){var settings = new configuration();settings.config(); })();//run the configurations
_$=function(element){if(typeof element==="string")return angular.element(document.querySelectorAll(element)); else return angular.element(element);};
//============================================================================//
/*
 * check if the browser supports html5 validation
 * @author fredtma
 * @version 2.1
 * @category validation,form
 * @return bool
 */
function hasFormValidation() {
    return (typeof document.createElement( 'input' ).checkValidity === 'function');
}
//============================================================================//
/**
 * load a script dynamically in the header tag
 * @author fredtma *
 * @version 1.2
 * @category dynamic, script
 * @param string <var>url</var> the path of the script to be loaded
 * @param string <var>sync</var> load the script with async option on
 * @return void
 */
function load_script(urls,sync,position,fons){
   var s,ele,c,url;iyona.deb("LOADS",urls, typeof urls);
   var script=document.createElement('script');
   if(typeof urls==="string") url=urls;
   else {url=urls[0]; urls.shift();}

   s=document.querySelector('script[data-fons]');
   c=document.querySelector('script[src="'+url+'"]');
   if(c)return false;
   if(!position)ele=document.getElementsByTagName('head')[0];
   else if(position==='end')ele=document.getElementsByTagName('body')[0];

   if(s)_$(s).remove();//ele.removeChild(s);
   if (sync !== false) script.async = true;
   script.src  = url;script.type="text/javascript";
   if(fons){script.setAttribute('data-fons',fons);}
   script.onreadystatechange = function(){iyona.info("Loaded script StateChange "+url);};
   script.onload = function(){if(typeof urls==="object"&&urls.length>0) load_script(urls,sync,position,fons);};;
   ele.appendChild(script);
}
//============================================================================//
/**
 * get the size of an object
 *
 * It will verify all the variable sent to the function
 * @author tomwrong
 * @category object,size
 * @see http://stackoverflow.com/questions/1248302/javascript-object-size
 * @return bytes
 */
function objectSize(object) {
    var objectList=[];var stack=[object];var bytes=0; var cnt=0; var i;
    while ( stack.length ) {
        var value = stack.pop();
        if ( typeof value === 'boolean') {bytes += 4;}
        else if(typeof value === 'string') {bytes += value.length * 2;}
        else if(typeof value === 'number') {bytes += 8;}
        else if(typeof value === 'object'&& objectList.indexOf( value ) === -1)
        {
           objectList.push( value );
           for( i in value ){
              stack.push( value[ i ] );
              cnt++;
              if(cnt>500)return bytes;
           }
        }
    }
    return bytes;
}
//============================================================================//
/**
 * measure two time frame from the begining of the script TimeElapse
 * for the current script TimeFrame
 * @author fredtma
 * @version 0.8
 * @category performance
 */
function timeFrame(_from,_total){
   var endTime,from,elapse;
   endTime  = new Date().getTime();
   from     = endTime-sessionStorage.runTime;
   elapse   = endTime-sessionStorage.startTime;
   iyona.info('TimeFrame:'+_from+' '+from);
   if(_total)iyona.info('TimeElapse:'+_from+' '+elapse);
   sessionStorage.runTime=endTime;
}
//============================================================================//
/**
 * used in a similar way as the php version of ucwordsn
 * @author fredtma
 * @version 0.2
 * @category string
 * @param string <var>str</var> is the string that will be converted
 * @see PHP ucwords
 * @return string
 */
function ucwords(str)
{
    return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
        return $1.toUpperCase();
    });
}//end function
//============================================================================//
function ucfirst(word){if(!word)return false; return word.charAt(0).toUpperCase() + word.substring(1);}
//============================================================================//
/**
 * change into alpha numerical, with no spacing
 * @author fredtma
 * @version 0.3
 * @category string
 * @param string <var>the_str</var> the input string to be changed
 * @param boolean <var>transform</var> choses to make it upper case or not
 * @see ucwords
 * @return string
 */
function alphaNumeric(the_str,transform)
{
   the_str   = the_str.toLowerCase();
   the_str   = (transform)?ucwords(the_str.toLowerCase()): the_str;
   the_str   = the_str.replace(/[^A-Za-z0-9\s]*/ig,'');
   return the_str;
}
//============================================================================//
/**
 * the return value of the worker.
 * @author fredtma
 * @version 3.1
 * @category worker
 * @param object <var>notitiaWorker</var> the worket object
 */
function readWorker(notitiaWorker,callback){
   notitiaWorker.addEventListener('message',function(e){
      if(e.data==="licentia")licentia();
      if(e.data==="reset progress"){profectus("starting db reset",true,10);}
      if(e.data.progress===true){profectus(e.data.resetTable);}
      if(callback)callback(e.data,notitiaWorker);
   },false);
   notitiaWorker.addEventListener('error',function(e){
      iyona.info("Worker on strike "+e.message,true);
   },false);
}
//============================================================================//
/**
 * showrcut to make a call to the worker
 * @author fredtma
 * @version 3.2
 * @category worker, background
 * @param object <var>option</var> the option to be passed to the worker
 * @return void
 */
function callWorker(option,callback){
   var ext=(typeof $!=="undefined")?$.extend:angular.extend,moli=screen.height*screen.width;
   var opt=ext({},
      {
         "procus":dynamis.get("USER_NAME").singularis,
         "moli":moli,
         "DB_VERSION":sessionStorage.DB_VERSION,
         "eternalScope":dynamis.get("eternalScope",true),
         "SITE_SERVICE":sessionStorage.SITE_SERVICE,
         "SITE_MILITIA":sessionStorage.SITE_MILITIA
      },option);
   if(window.Worker&&impetroUser()){
      var notitiaWorker=new Worker("js/biliotheca/worker.notitia.js");
      notitiaWorker.postMessage(opt);
      readWorker(notitiaWorker,callback);
   }
}
//============================================================================//
/*
 * get the user's data whether saved in session or local session.
 */
function impetroUser(){
   var USER_NAME=dynamis.get("USER_NAME",true)?dynamis.get("USER_NAME",true):(dynamis.get("USER_NAME"))?dynamis.get("USER_NAME"):false;
   return USER_NAME;
}
//============================================================================//
/**
 * cette fonction et utiliser pour cree les donner a envoyer dans la DB
 * @author fredtma
 * @version 2.3
 * @category database, query
 * @param array </var>theValue</var> the desc Comment
 * @return object
 */
function setQuaerere(mensa,res,tau,consuetudinem) {
    var procus=impetroUser(),moli=screen.height*screen.width,cons=consuetudinem||0;
    var quaerere={"eternal":res,"Tau":tau,"mensa":mensa,"procus":procus.jesua||0,"moli":moli,"consuetudinem":cons,"cons":procus.cons||0,"location":sessionStorage.SITE_LOCA};
    dynamis.set("quaerere",JSON.stringify(quaerere));
    return quaerere;
}
//=============================================================================//
function checkConnection() {
   var networkState;
   if(typeof navigator.connection!=="undefined")var networkState = navigator.connection.type;
   else if(typeof navigator.network!=="undefined")var networkState = navigator.network.connection.type;
   else return navigator.onLine;


   var states = {};
   states[Connection.UNKNOWN] = 'an Unknown connection';
   states[Connection.ETHERNET] = 'an Ethernet connection';
   states[Connection.WIFI] = 'a WiFi connection';
   states[Connection.CELL_2G] = 'a Cell 2G connection';
   states[Connection.CELL_3G] = 'a Cell 3G connection';
   states[Connection.CELL_4G] = 'a Cell 4G connection';
   states[Connection.NONE] = 'with No network connection';
   iyona.info('Connection type is ' + states[networkState],networkState);
   return networkState;

}
//============================================================================//
/**
 * use prototype to add a function that searches an object value
 * @author fredtma
 * @version 2.3
 * @category search, object
 * @param array </var>value</var> the value to search in the object
 * @return bool
 */
function objSearch(ele,value){
   var key,l,found=false,obj;
   if(ele instanceof Array){
      l=ele.length;
      for(key=0;key<l;key++){obj=ele[key];
         if(typeof obj==='object' )found=objSearch(obj,value);
         if(found!==false) return [found,key];
         if(typeof obj==="string"&&obj.indexOf(value)!==-1 ) return [ele,key];
      }
   }
    for(key in ele ) {obj=ele[key];iyona.deb(key,obj)
        if(typeof obj==='object' )found=objSearch(obj,value);
        if(found!==false) return [found,key];
        if(typeof obj==="string"&&obj.indexOf(value)!==-1 ) return [ele,key];
    }
    return false;
}
//============================================================================//
/**
 * calculate the date difference and returns the value in human language.
 * @author fredtma
 * @version 0.5
 * @category iyona
 * @param array </var>Comment</var> the desc
 * @see get_rich_custom_fields(), $iyona
 * @return void|bool
 * @todo finish the function on this page
 * @uses file|element|class|variable|function|
 */
function timeDifference(t) {
    var day=1000*60*60*24,hour=1000*60*60,minute=1000*60,cur=new Date().getTime(),dif,set;
    var time = new Date(t).getTime();dif=(cur-time);
    var minutes = Math.ceil(dif/minute);
    if( minutes < 2) set=Math.ceil(dif/1000)+' Second';
    else if(minutes < 60) set=minutes+' minute';
    else if(minutes < 60*24) set=Math.ceil(dif/hour)+' hour';
    else set=Math.ceil(dif/day)+' day';
    if(dif>1)set+='s';
    return set;
}
//============================================================================//
//@http://stackoverflow.com/questions/3749231/download-file-using-javascript-jquery
function downloadURL(url) {
    var hiddenIFrameID = 'hiddenDownloader',
        iframe = document.getElementById(hiddenIFrameID);
    if (iframe === null) {
        iframe = document.createElement('iframe');
        iframe.id = hiddenIFrameID;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
    }
    iframe.src = url;
};
//============================================================================//
/**
 * creates a unique id based upon time
 * @author fredtma
 * @version 1.2
 * @category random,generation
 */
function uRand(len,num,date,bin) {
    var possible,
    d = new Date(),text=d.getDate()+''+d.getMonth(),l;
    possible = (num===true)?"0123456789":"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    l    = possible.length;
    len  = len||5;
    text = (date===true)?text:'';

    for( var i=0; i < len; i++ ){
       text += possible.charAt(Math.floor(Math.random() * l));
       if(i%2 && i!=0 && num!==true) {text+=Math.floor(Math.random() * 90)+10;i++;}
    }
    text = (date===true)?text+''+d.getMinutes()+''+d.getHours():text;
    text = (num===true && bin===true)? (+parseInt(text)).toString(2):text;
    return text;
}
//============================================================================//
function eternalCall(node,display){
   var eternal    = dynamis.get("eternal",true);
   if(!eternal) return false;
   var curNode    = eternal[node];
   var curMensa   = curNode.mensa;
   var curDisplay = curNode[display];
   var curTitle   = curDisplay.title;
   return {"scope":curNode,"mensa":curMensa,"display":curDisplay,"title":curTitle};
}
//============================================================================//


//============================================================================//
//GOOGLE API USER DETAILS                                                     //
//============================================================================//
function GPLUS_USER() {
   // @corecode_begin getProtectedData
   this.access_token, this.user_info,this.callFunction;//public
   var callback,retry,that=this;//private
   this.getToken = function(method, url, interactive, callBack) {
      retry = false;
      callback = callBack;
      chrome.identity.getAuthToken({"interactive": interactive}, function(token) {
         if (chrome.runtime.lastError) {
            callback(chrome.runtime.lastError); return;
         }
         that.access_token = token;
         that.requestStart(method, url);
      });
   };

   this.requestStart = function(method, url) {
      var xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.setRequestHeader('Authorization', 'Bearer ' + this.access_token);
      xhr.onload = this.requestComplete;
      xhr.send();
   };

   this.requestComplete = function() {
      if (this.status === 401 && retry) {
         retry = false;
         chrome.identity.removeCachedAuthToken({token: this.access_token}, this.getToken);
      } else {
         callback(null, this.status, this.response);
      }
   };

   this.getUserInfo = function(interactive,callFunction) {
      this.callFunction=callFunction;
      this.getToken('GET', 'https://www.googleapis.com/plus/v1/people/me', interactive, this.onUserInfoFetched);
   };

   this.onUserInfoFetched = function(error, status, response) {
      if (!error && status === 200) {
         that.user_info = JSON.parse(response);//displayName,image
         that.callFunction(that.user_info,that.access_token,true);
         iyona.deb("AUTO LOGIN",that.user_info,that.access_token);
      } else {
         that.user_info = {"id":0,"type":0,"emails":[{"value":0}]};
         that.callFunction(that.user_info,error, false);
         iyona.log("could not retrive user data:"+error.message,false,"danger",error,response);
      }
   };

   this.revokeToken = function() {
      chrome.identity.getAuthToken({'interactive': false},
      function(current_token) {
         if (!chrome.runtime.lastError) {
            chrome.identity.removeCachedAuthToken({token: current_token},
            function() {
            });
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://accounts.google.com/o/oauth2/revoke?token=' + current_token);
            xhr.send();
         }
      });
   };
};


//============================================================================//
//FETCH IMAGE
//============================================================================//
function GET_IAMGE(url,ele) {
   this.fetchImageBytes = function(url) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.onload = this.onImageFetched;
      xhr.send();
   };
   this.onImageFetched = function(e) {
      if (this.status !== 200) return;
      var imgElem = document.createElement('img');
      var objUrl  = window.webkitURL.createObjectURL(this.response);
      imgElem.src = objUrl;
      var element = document.querySelector(ele);element.appendChild(imgElem);
      imgElem.onload = function() {window.webkitURL.revokeObjectURL(objUrl);};
   };
   this.fetchImageBytes(url);
}
//============================================================================//
//CLASES
//============================================================================//
//MD5
function md5cycle(e,t){var n=e[0],r=e[1],i=e[2],s=e[3];n=ff(n,r,i,s,t[0],7,-680876936);s=ff(s,n,r,i,t[1],12,-389564586);i=ff(i,s,n,r,t[2],17,606105819);r=ff(r,i,s,n,t[3],22,-1044525330);n=ff(n,r,i,s,t[4],7,-176418897);s=ff(s,n,r,i,t[5],12,1200080426);i=ff(i,s,n,r,t[6],17,-1473231341);r=ff(r,i,s,n,t[7],22,-45705983);n=ff(n,r,i,s,t[8],7,1770035416);s=ff(s,n,r,i,t[9],12,-1958414417);i=ff(i,s,n,r,t[10],17,-42063);r=ff(r,i,s,n,t[11],22,-1990404162);n=ff(n,r,i,s,t[12],7,1804603682);s=ff(s,n,r,i,t[13],12,-40341101);i=ff(i,s,n,r,t[14],17,-1502002290);r=ff(r,i,s,n,t[15],22,1236535329);n=gg(n,r,i,s,t[1],5,-165796510);s=gg(s,n,r,i,t[6],9,-1069501632);i=gg(i,s,n,r,t[11],14,643717713);r=gg(r,i,s,n,t[0],20,-373897302);n=gg(n,r,i,s,t[5],5,-701558691);s=gg(s,n,r,i,t[10],9,38016083);i=gg(i,s,n,r,t[15],14,-660478335);r=gg(r,i,s,n,t[4],20,-405537848);n=gg(n,r,i,s,t[9],5,568446438);s=gg(s,n,r,i,t[14],9,-1019803690);i=gg(i,s,n,r,t[3],14,-187363961);r=gg(r,i,s,n,t[8],20,1163531501);n=gg(n,r,i,s,t[13],5,-1444681467);s=gg(s,n,r,i,t[2],9,-51403784);i=gg(i,s,n,r,t[7],14,1735328473);r=gg(r,i,s,n,t[12],20,-1926607734);n=hh(n,r,i,s,t[5],4,-378558);s=hh(s,n,r,i,t[8],11,-2022574463);i=hh(i,s,n,r,t[11],16,1839030562);r=hh(r,i,s,n,t[14],23,-35309556);n=hh(n,r,i,s,t[1],4,-1530992060);s=hh(s,n,r,i,t[4],11,1272893353);i=hh(i,s,n,r,t[7],16,-155497632);r=hh(r,i,s,n,t[10],23,-1094730640);n=hh(n,r,i,s,t[13],4,681279174);s=hh(s,n,r,i,t[0],11,-358537222);i=hh(i,s,n,r,t[3],16,-722521979);r=hh(r,i,s,n,t[6],23,76029189);n=hh(n,r,i,s,t[9],4,-640364487);s=hh(s,n,r,i,t[12],11,-421815835);i=hh(i,s,n,r,t[15],16,530742520);r=hh(r,i,s,n,t[2],23,-995338651);n=ii(n,r,i,s,t[0],6,-198630844);s=ii(s,n,r,i,t[7],10,1126891415);i=ii(i,s,n,r,t[14],15,-1416354905);r=ii(r,i,s,n,t[5],21,-57434055);n=ii(n,r,i,s,t[12],6,1700485571);s=ii(s,n,r,i,t[3],10,-1894986606);i=ii(i,s,n,r,t[10],15,-1051523);r=ii(r,i,s,n,t[1],21,-2054922799);n=ii(n,r,i,s,t[8],6,1873313359);s=ii(s,n,r,i,t[15],10,-30611744);i=ii(i,s,n,r,t[6],15,-1560198380);r=ii(r,i,s,n,t[13],21,1309151649);n=ii(n,r,i,s,t[4],6,-145523070);s=ii(s,n,r,i,t[11],10,-1120210379);i=ii(i,s,n,r,t[2],15,718787259);r=ii(r,i,s,n,t[9],21,-343485551);e[0]=add32(n,e[0]);e[1]=add32(r,e[1]);e[2]=add32(i,e[2]);e[3]=add32(s,e[3])}function cmn(e,t,n,r,i,s){t=add32(add32(t,e),add32(r,s));return add32(t<<i|t>>>32-i,n)}function ff(e,t,n,r,i,s,o){return cmn(t&n|~t&r,e,t,i,s,o)}function gg(e,t,n,r,i,s,o){return cmn(t&r|n&~r,e,t,i,s,o)}function hh(e,t,n,r,i,s,o){return cmn(t^n^r,e,t,i,s,o)}function ii(e,t,n,r,i,s,o){return cmn(n^(t|~r),e,t,i,s,o)}function md51(e){var txt="";var t=e.length,n=[1732584193,-271733879,-1732584194,271733878],r;for(r=64;r<=e.length;r+=64){md5cycle(n,md5blk(e.substring(r-64,r)))}e=e.substring(r-64);var i=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(r=0;r<e.length;r++)i[r>>2]|=e.charCodeAt(r)<<(r%4<<3);i[r>>2]|=128<<(r%4<<3);if(r>55){md5cycle(n,i);for(r=0;r<16;r++)i[r]=0}i[14]=t*8;md5cycle(n,i);return n}function md5blk(e){var t=[],n;for(n=0;n<64;n+=4){t[n>>2]=e.charCodeAt(n)+(e.charCodeAt(n+1)<<8)+(e.charCodeAt(n+2)<<16)+(e.charCodeAt(n+3)<<24)}return t}function rhex(e){var t="",n=0;for(;n<4;n++)t+=hex_chr[e>>n*8+4&15]+hex_chr[e>>n*8&15];return t}function hex(e){for(var t=0;t<e.length;t++)e[t]=rhex(e[t]);return e.join("")}function md5(e){return hex(md51(e))}function add32(e,t){return e+t&4294967295}var hex_chr="0123456789abcdef".split("");if(md5("hello")!="5d41402abc4b2a76b9719d911017c592"){function add32(e,t){var n=(e&65535)+(t&65535),r=(e>>16)+(t>>16)+(n>>16);return r<<16|n&65535}}
//TEMPUS
function getToday(){var e=new Date;var t=e.getDate();var n=parseInt(e.getMonth())+1;var r=e.getFullYear();var i=e.getHours();var s=e.getMinutes();var o=e.getSeconds();t=t<10?"0"+t:t;n=n<10?"0"+n:n;s=s<10?"0"+s:s;i=i<10?"0"+i:i;o=o<10?"0"+o:o;return r+"-"+n+"-"+t+" "+i+":"+s+":"+o}var dateFormat=function(){var e=/d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,t=/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,n=/[^-+\dA-Z]/g,r=function(e,t){e=String(e);t=t||2;while(e.length<t)e="0"+e;return e};return function(i,s,o){var u=dateFormat;if(arguments.length==1&&Object.prototype.toString.call(i)=="[object String]"&&!/\d/.test(i)){s=i;i=undefined}i=i?new Date(i):new Date;if(isNaN(i))throw SyntaxError("invalid date");s=String(u.masks[s]||s||u.masks["default"]);if(s.slice(0,4)=="UTC:"){s=s.slice(4);o=true}var a=o?"getUTC":"get",f=i[a+"Date"](),l=i[a+"Day"](),c=i[a+"Month"](),h=i[a+"FullYear"](),p=i[a+"Hours"](),d=i[a+"Minutes"](),v=i[a+"Seconds"](),m=i[a+"Milliseconds"](),g=o?0:i.getTimezoneOffset(),y={d:f,dd:r(f),ddd:u.i18n.dayNames[l],dddd:u.i18n.dayNames[l+7],m:c+1,mm:r(c+1),mmm:u.i18n.monthNames[c],mmmm:u.i18n.monthNames[c+12],yy:String(h).slice(2),yyyy:h,h:p%12||12,hh:r(p%12||12),H:p,HH:r(p),M:d,MM:r(d),s:v,ss:r(v),l:r(m,3),L:r(m>99?Math.round(m/10):m),t:p<12?"a":"p",tt:p<12?"am":"pm",T:p<12?"A":"P",TT:p<12?"AM":"PM",Z:o?"UTC":(String(i).match(t)||[""]).pop().replace(n,""),o:(g>0?"-":"+")+r(Math.floor(Math.abs(g)/60)*100+Math.abs(g)%60,4),S:["th","st","nd","rd"][f%10>3?0:(f%100-f%10!=10)*f%10]};return s.replace(e,function(e){return e in y?y[e]:e.slice(1,e.length-1)})}}();dateFormat.masks={"default":"ddd mmm dd yyyy HH:MM:ss",shortDate:"m/d/yy",mediumDate:"mmm d, yyyy",longDate:"mmmm d, yyyy",fullDate:"dddd, mmmm d, yyyy",shortTime:"h:MM TT",mediumTime:"h:MM:ss TT",longTime:"h:MM:ss TT Z",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd HH:MM:ss",isoUtcDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"};dateFormat.i18n={dayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],monthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","January","February","March","April","May","June","July","August","September","October","November","December"]};Date.prototype.format=function(e,t){return dateFormat(this,e,t)};Date.prototype.getWeek=function(){var e=new Date(this.valueOf());var t=this.getDay();e.setDate(e.getDate()-t+4);var n=new Date(e.getFullYear(),0,4);var r=(e-n)/864e5;var i=Math.ceil(r/7);return i};Date.prototype.getWeekYear=function(){var e=new Date(this.valueOf());e.setDate(e.getDate()-this.getDay()+4);return e.getFullYear()};moveToDayOfWeek=function(e,t,n,r){n=!n?1:n;var i=0;do{var s=e.setDate(e.getDate()+n);i++}while(dateFormat(s,"ddd")!=t);return s}