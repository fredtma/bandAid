'use strict'
angular.module('KingsServices',['ngResource']).service('notitia',['$resource','$rootScope',notitia]).service('fetch',['$http','$rootScope',fetch]).service('crud',['notitia','$routeParams','$modal','$log','fetch','$timeout',crud]);
//############################################################################//
//NOTITIA                                                                     //
//############################################################################//
function notitia($resource,$rootScope){iyona.log("BEGIN NOTITIA...");
   var that=this,eternal=eternalCall();

   if(dynamis.get("CONFIG").openDatabase===false&&dynamis.get("CONFIG").indexedDB===false&&dynamis.get("CONFIG").Online===false)return false;
   if(eternal){that.name=eternal.form.field.name;that.frmName='frm_'+that.name;that.frmID='#frm_'+that.name;}

   that.patterns=dynamis.get("EXEMPLAR");
   var option={"users":0,"contacts":0,"version_db":0,"servers":0,"log_mails":0,"log_servers":0,"lists":0,"clients":0};//used in resetdb && iresetdb
   var IDBTransaction   =window.IDBTransaction||window.webkitIDBTrasaction;
   var indexedDB        =window.indexedDB||window.webkitIndexedDB||window.mozIndexedDB||window.msIndexedDB;
   var IDBKeyRange      =window.IDBKeyRange||window.webkitIDBKeyRange||window.msIDBKeyRange;
   this.IDBReady        =false;

   //=========================================================================//SET DB AND VERSION
   this.principio=function(){iyona.log("DB inspection");
      if(dynamis.get("CONFIG").openDatabase)that.db=window.openDatabase(sessionStorage.DB_NAME,'',sessionStorage.DB_DESC,sessionStorage.DB_SIZE*1024*1024,this.creatorWebsql);

      if(dynamis.get("CONFIG").iDB===false){indexedDB.deleteDatabase(sessionStorage.DB_NAME);iyona.log("Deleted IndexedDB");}
      else if((dynamis.get("CONFIG").indexedDB&&dynamis.get("CONFIG").iDB)&&typeof window.chrome!=="undefined") {//chrome uses web worker to upgrade
         sessionStorage.SITE_NEW=1;//prevent idb from firing until ready
         callWorker({"progredior":true,"option":true},function(data){iyona.deb("Checking IDB",data);
            if(data==="Upgradding")sessionStorage.SITE_NEW=1;
            else if(data==="Worker iDB Ready"){
               var event = new CustomEvent("IDBReady", {"detail":{"success":true}});iyona.deb("Checking IDB",data,event);
               sessionStorage.SITE_NEW=0;
               that.IDBReady = true;
               that.iRequest=indexedDB.open(sessionStorage.DB_NAME);
               that.setIndexeddb();}
               document.dispatchEvent(event);
            iyona.log("AS A WORKER::",data,sessionStorage.SITE_NEW);
         });
      }
      else if(dynamis.get("CONFIG").indexedDB&&dynamis.get("CONFIG").iDB)this.iRequest=indexedDB.open(sessionStorage.DB_NAME,parseInt(sessionStorage.DB_VERSION));

      if(dynamis.get("CONFIG").openDatabase&&that.db.version!=sessionStorage.DB_VERSION){
         iyona.log("Changing webSql version.");
         that.version={};that.version.ver=sessionStorage.DB_VERSION;
         that.version.revision={"servers":1};
         that.db.changeVersion(
            that.db.version,sessionStorage.DB_VERSION,
            function(trans){
               //check if the new tables exists.
               for(var key in that.version.revision){var q="SELECT name FROM sqlite_master WHERE type='table' AND name='"+key+"'",newTables={};
                  that.agito(q,{},"searching table "+key,function(results){if(results.rows.length==0){newTables[key]=true;that.resetDB(newTables); } });  }
               if(dynamis.get("CONFIG").Online&&false)version_db(that.db.version,that.version,trans)
            },//@todo
            function(e){iyona.log(e.message)},
            function(e){iyona.log('PASSED');});
            dynamis.set("DB",JSON.stringify(that.db),true);_$("footer").data("db version",1);
      }
   }
   this.principio();
   //=========================================================================//
   this.agito=function(_quaerere,_params,_msg,_callback,_reading){
      var params=_params||[];
      if(sessionStorage.quaerere&&that.basilia!==false)that.basilia=JSON.parse(sessionStorage.quaerere);
      if(_reading)that.db.transaction=that.db.readTransaction();
      that.db.transaction(function(trans){
         trans.executeSql(_quaerere,params,function(trans,results){
            if(_msg)iyona.log('Success DB transaction: '+_msg);console.log('%c'+_quaerere,'background:#222;color:#48b72a;width:100%;font-weight:bold;',params);
            var rows=that.db2json(results);
            if(_msg)notice("Successful: "+_msg);
            //================================================================//ONLINE
            //if(that.basilia&&dynamis.get("CONFIG").Online)this.secondKings();

            if(_callback)_callback(results,rows);return true;
         },function(_trans,_error){
            if(_msg.search('no such table')!=-1){
               dynamis.del('DB',true);//@todo:fix this,ensure u give proper notification and create only missing
               _$('#userLogin .alert-info').removeClass('alert-info').addClass('alert-error').find('span').html('The application yet to be installed on this machine.<br/> We will run the installation on the next refresh')
            }
            iyona.log('Failed DB: '+_msg+':'+_error.message);
            console.log('%c ::QUAERERE='+_quaerere, 'background:#222;color:#ff0000;font-weight:bold;');
            notice("<div class='text-error'>"+_error.message+'</div>');return false;
         });
      });
      sessionStorage.removeItem('quaerere');
   }
   //=========================================================================//
   this.db2json=function(_results,_type){
      var j={},row,col,len,x,k;
      switch(_type){
         case 1:break;
         case 2:break;
         default:
            len=_results.rows.length;
            for(x=0;x<len;x++){
               row=_results.rows.item(x);
               col=0;
               for(k in row){row[col]=row[k];col++;}
               j[x]=row;
            }//endfor
            j['rows']={"length":len,"source":"generated"}
            break;
      }//endswith
      return j;
    }
   //=========================================================================//
   this.sanatio=function(_val,_field,_properties,_actum){
      var ele=_$(that.frmID+' #'+_field)[0]||_$('.'+this.frmName+'_'+_field+' .btn-group')[0];
      var type=_properties.field.type;
      var err=creo('span',{"clss":"help-block error-block"});
      var title=_properties.field.title||_properties.title||'';
      var omega=true;var msg;
      if(!_val&&_properties.field.required=="new"&&_actum==2){}//seulment avec une nouvelle donner
      else if(!_val&&"required" in _properties.field) {msg='Missing `'+_field+'`';omega=false;}
      else if (!sessionStorage.formValidation){
         if(_properties.pattern&&_val.search(this.patterns[_properties.pattern][0])==-1){msg=title+', '+this.patterns[_properties.pattern][1];omega=false;}
         else if(_properties.field.pattern&&_val.search(_properties.field.pattern)==-1){msg=title+', missing a requirment';omega=false;}
         else if(type=="email"&&_val.search(this.patterns["email"][0])==-1){msg=title+', '+this.patterns["email"][1];omega=false;}
         else if(type=="number"&&_val.search(this.patterns["number"][0])==-1){msg=title+', '+this.patterns["number"][1];omega=false;}
         else if(type=="color"&&_val.search(this.patterns["color"][0])==-1){msg=title+', '+this.patterns["color"][1];omega=false;}
         else if(type=="url"&&_val.search(this.patterns["url"][0])==-1){msg=title+', '+this.patterns["url"][1];omega=false;}
         else if(type=="date"&&_val.search(this.patterns["fullDate"][0])==-1){msg=title+', '+this.patterns["fullDate"][1];omega=false;}
      }
      else if(type=="password"&&_val.search(this.patterns["password"][0])==-1){msg=title+', '+this.patterns["password"][1];omega=false;}
      if(type=="password"&&_$('#signum').length&&_val&&_val!==_$('#signum').val()){msg=title+' passwords do not match';omega=false;}
      if(omega===false){ele.parentNode.insertBefore(err, ele.nextSibling);err.innerHTML=msg;_$('#notification').html('<div class="text-error">'+msg+'</div>');_$('.control-group.'+this.frmName+'_'+_field).addClass('error');}
      return omega;
   }
   //=========================================================================//
   this.constraintForeignKey = function(_jesua,_mensa,_Tau) {
      var l,x,l2,x2;
      var omega=[],alpha=[],delta=[];var tt=['users','groups','permissions'];//to speed up process on pf table
      if(tt.indexOf(_mensa)==-1) return false;
      switch (_mensa) {
         case'users':
            omega.push({"mensa":"link_users_groups","child":"user","parent":"username"});omega.push({"mensa":"link_permissions_users","child":"user","parent":"username"});break;
         case'groups':
            omega.push({"mensa":"link_users_groups","child":"`group`","parent":"name"});omega.push({"mensa":"link_permissions_groups","child":"`group`","parent":"name"});break;
         case'permissions':
            omega.push({"mensa":"link_permissions_groups","child":"`permission`","parent":"name","sub":true});omega.push({"mensa":"link_permissions_users","child":"`permission`","parent":"name","sub":true});break;
      }
      try{
         if(_Tau){
            l=omega.length;
            for(x=0;x<l;x++)this.agito("UPDATE "+omega[x].mensa+" SET "+omega[x].child+"=? WHERE "+omega[x].child+" IN (SELECT "+omega[x].parent+" FROM "+_mensa+" WHERE jesua=?  )",[_Tau,_jesua], "Ref updated "+omega[x].child+" from:"+_mensa);
         }else{
            l=omega.length;
            for(x=0;x<l;x++){
               if(omega[x].sub){
                  this.agito("SELECT id,name,jesua FROM "+_mensa+" WHERE sub=?",[_jesua],'',function(r,j){
                     if(j.rows.length){l2=j.rows.length;
                        for(x2=0;x2<l2;x2++){iyona.log(j[x2],"j[x2]");this.constraintForeignKey(j[x2]['jesua'],_mensa,false);}//end for
                     }//endif row
                  });
               }//if sub
               this.agito("DELETE FROM "+omega[x].mensa+" WHERE "+omega[x].child+" IN (SELECT "+omega[x].parent+" FROM "+_mensa+" WHERE jesua=?  )",[_jesua],"Ref deleted "+omega[x].child+" from:"+_mensa);
            }//for omega
         }//if Tau
      } catch (err) {iyona.log("Error selecting reference:" + err.message)}
   }
   //=========================================================================//
   this.resetDB=function(_option){
      if(angular.isString(_option)&&option.hasOwnProperty(_option))option[_option]=true; else if (_option===true)option=true; else if(angular.isObject(_option))option=_option;
      var defaultScope = dynamis.get("defaultScope",true);
      for (var profile in defaultScope){
         var table=defaultScope[profile].mensa;
         iyona.deb(table,"creating",option,option[table]);
         if(option[table]||option===true){
            var mensa=defaultScope[profile].creation,quaerere='',ref='',l,x,indexes=[],references=[],names=[];
            that.agito("DROP TABLE "+table,[],"DROP table "+table);
            for(var field in mensa){
               var current=mensa[field];
               quaerere+="`"+field+"` "+current.type;names.push(field);
               if(current.key===true)quaerere+=" PRIMARY KEY AUTOINCREMENT";
               if(current.key==="unique")quaerere+=" PRIMARY KEY";
               if(current.null)quaerere+=" NOT NULL";
               if(current.unique)quaerere+=" UNIQUE";
               if(current.default)quaerere+=" DEFAULT "+current.default;
               if(current.ndx)indexes.push("CREATE INDEX "+current.ndx+" ON "+table+"(`"+field+"`)");
               if(current.ref)references.push("FOREIGN KEY (`"+field+"`) REFERENCES "+current.ref['table']+"("+current.ref['field']+")");
               quaerere+=",";
            }//foreach
            quaerere=quaerere.substr(0,quaerere.length-1);
            if(references.length>0)ref=","+references.join(','); else ref='';
            var sql="CREATE TABLE IF NOT EXISTS "+table+"("+quaerere+ref+")";
            that.agito(sql,[],"Table "+table+" created");
            l=indexes.length;for(x=0;x<l;x++){that.agito(indexes[x],[],"Index created");}
            that.novaNotitia(table,"get"+table,names);
         }//if table
      }//for database
   }
   //=========================================================================//
   /*
    * Used when restoring all the data from the server
    */
   this.novaNotitia=function(_mensa,_comand,_fields){
      var fields='',values=[],sql;var x,l,f=[],n=[];

      $http({url:dynamis.get("SITE_SERVICE")+',creo,'+_comand,data:{militia:_comand},method:"POST",responseType:'json'}).success(function(json,status,headers,config){
         l=_fields.length;iyona.deb(json);
         for(x=0;x<l;x++){f.push('?');n.push('`'+_fields[x]+'`');}
         $.each(json,function(i,v){
            if(i==='rows')return true;
            l=_fields.length;
            for(x=0;x<l;x++){values.push(v[_fields[x]]);}
            if(_comand=="getUsers")v.gender=v.gender=='Male'?'1':'2';
            fields+=fields==''?"SELECT "+f.join():" UNION SELECT "+f.join();
         });
         sql="INSERT INTO "+_mensa+" ("+n.join()+") "+fields;
         that.agito(sql,values,"added "+_mensa);
      }).error(function(jqxhr,textStatus,error){var err=textStatus+','+error;iyona.log('failed to get json:'+err)});
   }
   //=========================================================================//
   /**
   * update text in table from a single field
   * @author fredtma
   * @version 4.3
   * @category update, notitia
   * @param object <var>_set</var> the object containing the field to be updated
   * @return void
   */
   this.deltaNotitia=function(_set){
      var agrum=_set.className.replace(/col_/,'');
      var jesua=_$(_set).parents('tr').data('jesua');
      var name=eternal.form.field.name;
      var valor=_$(_set).text();
      var t = new Date().format('isoDateTime');//var jesua=md5(valor+t);
      var delta='UPDATE `'+eternal.mensa+'` SET `'+agrum+'`=?,modified=? WHERE jesua=?';var msg='  Updated field '+agrum;
      var quaerere={};quaerere.eternal={'blossom':{"alpha":jesua,"delta":"!@=!#"},"modified":t};quaerere.eternal[agrum]=valor;
      quaerere.Tau='deLta';quaerere.iyona=eternal.mensa;sessionStorage.quaerere=JSON.stringify(quaerere);
      this.agito(delta,[valor,t,jesua],msg,function(){
         _$('.table-msg-'+name).html(msg).animate({opacity:0},200,"linear",function(){_$(this).animate({opacity:1},200);});
      });
   }
   //=========================================================================//
   /**
    * when a new row is created via a table
    * @author fredtma
    * @version 4.5
    * @category insert, db
    * @param object <var>_row</var> the row containing the default data
    * @param object <var>_tr</var> the new row created
    */
   this.alphaNotitia=function(_row,_tr){
      var fields,field;var name=eternal.form.field.name;
      if(eternal.child) {for (fields in eternal.child) break; fields=eternal.child[fields].fields}//child et seulment un seul.
      else fields=eternal.fields;
      var valor = Math.floor((Math.random()*100)+1);
      var t = new Date().format('isoDateTime');var jesua=md5(valor+t);
      var agris=['jesua','modified']; valor=[jesua,t]; var res={"jesua":jesua,"modified":t};
      //get all the fields set in the config, takes value from colums if it exist, other wise from the default config or null
      for(field in fields){agris.push('`'+field+'`');if(_row[field]){val=_row[field]}else{var val=fields[field].value||'';}valor.push(val);res[field]=val;}
      var l=agris.length;var q=[],x; for(x=0;x<l;x++)q.push('?');
      var delta='INSERT INTO `'+eternal.mensa+'` ('+agris+') VALUES ('+q.join()+')';var msg='  New record created ';
      var quaerere={};quaerere.eternal=res;
      quaerere.Tau='Alpha';quaerere.iyona=eternal.mensa;sessionStorage.quaerere=JSON.stringify(quaerere);
      this.agito(delta,valor,msg,function(r,j){
         var iota=jesua||r.insertId;
         _$(_tr).data('jesua',iota);
         _$('.table-msg-'+name).html(msg).animate({opacity:0},200,"linear",function(){_$(this).animate({opacity:1},200);});
      });
      return true;
   }
   //=========================================================================//
   /**
    * removes a row from the db and table
    * @author fredtma
    * @version 4.6
    * @category delete, database
    * @param object <var>_set</var> the element cliented
    * @param integer <var>_iota</var>
    */
   this.omegaNotitia=function(_set){
      var name=eternal.form.field.name;
      var jesua=_$(_set).parents('tr').data('jesua');
      _$(_set).parents('tr').hide();var msg = " Record removed ";
      var quaerere={"eternal":{"blossom":{"alpha":jesua,"delta":"!@=!#"}},"iyona":eternal.mensa,"Tau":"oMegA"};sessionStorage.quaerere=JSON.stringify(quaerere);
      this.agito("DELETE FROM "+eternal.mensa+" WHERE jesua=?",[jesua],msg,function(){
         _$('.table-msg-'+name).html(msg).animate({opacity:0},200,"linear",function(){_$(this).animate({opacity:1},200);});
      });
   };
   //=========================================================================//
   this.notitia=function(_reset){
      that.reset=_reset||false;
      if(that.reset){
         dynamis.set("DB",JSON.stringify(that.db),true);
         //callWorker({"novaNotitia":true});
         that.resetDB(that.reset);}
   }
   this.creatorWebsql=function(){iyona.log('Creating a new DB');this.notitia(true);}//called when openDatabase() is upgrading
   //=========================================================================//
   if(this.iRequest)this.setIndexeddb();

   this.setIndexeddb=function(){
      that.iRequest.onerror=function(e){iyona.log("Database error code: "+e.target.error.message, e);}
      that.iRequest.onblocked=function(e){iyona.msg("Please close all other tabls with that application",true);}
      that.iRequest.onsuccess=function(e){
         that.idb=that.iResult||e.target.result||that.iRequest.result;iyona.log("iDB Ready internal");
         that.IDBReady = true;
         if(sessionStorage.SITE_NEW==="1"&&typeof window.chrome=="undefined"){var defaultScope = dynamis.get("defaultScope",true);
            //place the addition of data in seperate loop, in order to prevent `transaction running`
            var data=$resource(dynamis.get("SITE_SERVICE"),{},{"query":{"method":"POST",isArray:false,"cache":false,"responseType":"json"}});
            for(var profile in defaultScope){var table = defaultScope[profile].mensa;
               data.query({"militia":"imple","mensa":table},function(e){iyona.deb("RESOURCE",e);if("notitia" in e===false){iyona.log("could not auto update iDB");return false;}
                  var x,l=e.notitia.rows.length;
                  for(x=0;x<l;x++){that.iWrite(e.notitia.mensa,e.notitia.rows[x],true);}
               });
            }sessionStorage.SITE_NEW=0;
         }
         that.idb.onversionchange=function(e){iyona.msg("A version change has occured please close and reload the application",true);}
//         that.idb.close();
      }
      that.iRequest.onupgradeneeded=function(e){iyona.log("Upgrading DB")
         that.idb=e.target.result;
         if(e.oldVersion < sessionStorage.DB_VERSION){/*do changes for lower version*/}
         if(that.idb.version < 5){/*do changes for lower version*/}
         sessionStorage.SITE_NEW=1;
         that.iResetDB(true,e);
      }
   }//if this.iRequest
   //=========================================================================//
   this.iResetDB=function(_option,e){
      if(that.iRequest.readyState!="done"){that.iRequest.addEventListener("success",function(){that.iResetDB(_option,e)},false); return false;}
      else {this.idb=that.iRequest.result;}

      var store;
      if(angular.isString(_option)&&option.hasOwnProperty(_option))option[_option]=true; else if (_option===true)option=true; else if(angular.isObject(_option))option=_option;
      var defaultScope = dynamis.get("defaultScope",true);
      for(var profile in defaultScope){var table = defaultScope[profile].mensa;
         //if(option!==true||(typeof option=="object" && option.hasOwnProperty(profile)==false ))continue;
         if(option[table]||option===true){iyona.deb("RESSETING "+table,that.iRequest,e);
            var mensa=defaultScope[profile].creation;

            if(this.idb.objectStoreNames.contains(table)!==true){//new store creation
               store=that.iRequest.result.createObjectStore(table,{keyPath:"jesua"});
               for(var field in mensa){//@note:no need to add store as the store is dynamic.
                  var current=mensa[field]; if(field==='jesua')continue;
                  if(current.unique) store.createIndex('uniq_'+field,field,{unique:true});//keyname,keypath
                  if(current.ndx) store.createIndex(current.ndx,field);
               }//for field in mensa.fields
            }else{//to update the object store's index
               store=(that.iRequest.transaction)?that.iRequest.transaction.objectStore(table):e.currentTarget.transaction.objectStore(table);
               var x,l=store.indexNames.length;
               iyona.deb("COLUMN",typeof store.indexNames,angular.isArray(store.indexNames),store.indexNames);
               for(x=0;x<l;x++){if(typeof store.indexNames[x]==='string')store.deleteIndex(store.indexNames[x]);}//remove all indexs

               for(var field in mensa){//@note:no need to add store as the store is dynamic.
                  var current=mensa[field];
                  try{
                     if(current.unique&&!objSearch(store.indexNames,'uniq_'+field)) {store.createIndex('uniq_'+field,field,{unique:true});}
                     if(current.ndx&&!objSearch(store.indexNames,current.ndx)) {store.createIndex(current.ndx,field);}
                  }catch(e){iyona.log("An error occured in creating the index::"+e.message, field,e)}

               }//for field in mensa.fields
            }
            that.iRequest.transaction.onerror=function(e){iyona.log("A database error code: "+e.target.errorCode,e);}
         }//if if(option[table]||option===true)
      }//for table in that.database
   }
   //=========================================================================//
   /*
    * @check : worker.muneris.js @twin
    */
   this.iWrite=function(_store,_data,_update){var crud;
      if(that.iRequest&&that.iRequest.readyState!="done"){that.iRequest.addEventListener("success",function(){that.iWrite(_store,_data,_update)},false); return false;}
      else if(that.iRequest) {this.idb=that.iRequest.result;}
      else {iyona.log("No iRequest");return false;}
      if(this.idb.objectStoreNames.contains(_store)!==true){iyona.log("iWrite No store iFound: "+_store);return false;}

      var store=_store||"users",
              transaction=this.idb.transaction(store,"readwrite"),
              request;
      var objectStore=transaction.objectStore(store);
      if(typeof _data!=="object") {iyona.log("No iData");return false;}

      if(!_update){request=objectStore.add(_data);crud='inserted';}
      else {request=objectStore.put(_data);crud='updated';}
      request.onsuccess=function(e){iyona.log("Successfully "+crud+" iWrite to "+store);}
      request.oncomplete=function(e){iyona.log("Successfully completed iWrite to "+store+"::"+e.target.error.message);}
      request.onerror=function(e){iyona.log("Error while writing to "+store+"::"+e.target.error.message,_data);}
   }
   //=========================================================================//
   this.iRead=function(_store,_index,_callback,_passVar){
      if(that.iRequest&&that.iRequest.readyState!="done"){that.iRequest.addEventListener("success",function(){that.iRead(_store,_index,_callback,_passVar)},false); return false;}
      else if(that.iRequest) {this.idb=that.iRequest.result;}
      else {iyona.log("No iRequest...",_store);return false;}
      if(this.idb.objectStoreNames.contains(_store)!==true){iyona.log("iRead No store iFound: "+_store);return false;}

      var store=_store||"users",transaction=this.idb.transaction(store),request;
      var objectStore=transaction.objectStore(store),ndx=null,order,keyRange=null;

      if(_index!==null&&typeof _index=="object"&&_index.hasOwnProperty("where")){ndx=objectStore.index(_index.where);}
      if(_index!==null&&typeof _index=="object"&&_index.hasOwnProperty("order"))order=(_index.order.search(/desc/i)!=-1||_index.order.search(/prev/i)!=-1)?'prev':'next';

      if(_index!==null&&(typeof _index=="number"||typeof _index=="string")){iyona.deb("INDEX",_index);request=objectStore.get(_index);//for the pk
      }else if(_index!==null&&typeof _index=="object"&&_index.hasOwnProperty("top")){keyRange=IDBKeyRange.lowerBound(_index.top); request=ndx.openCursor(keyRange,order);//limit top
      }else if(_index!==null&&typeof _index=="object"&&_index.hasOwnProperty("bot")){keyRange=IDBKeyRange.upperBound(_index.bot); request=ndx.openCursor(keyRange,order);//limit bottome
      }else if(_index!==null&&typeof _index=="object"&&_index.hasOwnProperty("between")){keyRange=IDBKeyRange.bound(_index.between[0],_index.between[1],true,true); request=ndx.openCursor(keyRange,order);//between
      }else if(_index!==null&&typeof _index=="object"&&_index.hasOwnProperty("is")){request=ndx.get(_index.is);iyona.deb("IS",_index.is);//where field1=value
      }else if(_index!==null&&angular.isArray(_index)){request=objectStore.openCursor(_index);//where field1=value1 and field2=value2
      }else if(_index!==null&&typeof _index=="object"&&_index.hasOwnProperty("like")){keyRange=IDBKeyRange.bound(_index.like,_index.like+'\uffff'); request=ndx.openCursor(keyRange,'prev');//where like...
      }else if(ndx){request=ndx.openCursor(keyRange,order);
      }else{request=objectStore.openCursor();}

      request.onsuccess=function(e){if(_callback)_callback(e,_passVar);}//e.target.result
      request.oncomplete=function(e){iyona.log("Successfully iRead  addeding to "+store,e);}
      request.onerror=function(e){iyona.log("Error while writing to "+store+"::"+request.error,e);}
   }
   //=========================================================================//
   this.iErase=function(_store,_index,_callback){
      if(that.iRequest&&that.iRequest.readyState!="done"){that.iRequest.addEventListener("success",function(){that.iErase(_store,_index,_callback)},false); return false;}
      else if(that.iRequest) {this.idb=that.iRequest.result;}
      else {iyona.log("No iRequest");return false;}
      if(this.idb.objectStoreNames.contains(_store)!==true){iyona.log("iErase No store iFound: "+_store);return false;}

      var store=_store||"users",transaction=this.idb.transaction(store,"readwrite");
      var objectStore=transaction.objectStore(store);
      var request=objectStore.delete(_index);
      request.onsuccess=function(e){iyona.log("Successfully iErased record.");if(_callback)_callback(e);}
      request.onerror=function(e){iyona.log("failed to deleted record.",e);}
   }
   //=========================================================================//
   this.firstKings=function(profile,scope,tau,callback,options){//@todo: add offline message//@todo:validation this.sanatio
      var field,params=[],fields=[],set=[],res={},consuetudinem={"uProfile":profile},val,modified=new Date(),quaerere,msg,ubi,precipio=[],gamma="ASC",limit=10,reading,ndx={},iContent;
      var jesua,alpha;var r=Math.floor((Math.random()*179)+1);
      var profileScope=dynamis.get("defaultScope",true)[profile],mensa=profileScope.mensa,
              caller = options.rumorConf||false/*when there is a called it will prevent  eternal from collection*/;

      if(isset(scope.jesua)){
         jesua =(hasValue(scope.jesua.alpha)) ?scope.jesua.alpha :(hasValue(scope.jesua)) ?scope.jesua:0;
         alpha =jesua;
      } else{scope.jesua=0;alpha=0;}

      if(caller===false){//if there is a caller you do not need to run and examin the expression
         for (field in scope) {
            val=scope[field];
            var alphaVal=(val&&val.hasOwnProperty("alpha"))?val.alpha:val;
            if(angular.isObject(val)){
               if("beta" in val) precipio.push(val.beta===true?field:val.beta);
               if("gamma" in val) gamma = val.gamma;
               if("zeta" in val) limit = val.zeta;
               if("delta" in val){
                  if(typeof profileScope.creation[field].unique!="undefined")ndx={"where":"uniq_"+field,"is":alphaVal};//get index
                  else if(typeof profileScope.creation[field].ndx!="undefined")ndx={"where":profileScope.creation[field].ndx,"is":alphaVal};//get index
                  ndx[field]=alphaVal;//used in iDB to overwrite obj field
               }; //todo
            }
         if ( (typeof profileScope.creation!=="undefined" && field in profileScope.creation)
                 || (val !== null && typeof val==='object' && "eta" in val)
                 || (val !== null && typeof val==='object' && "epsilon" in val)
            ){} //allow custom fields and fields in creation
            else {consuetudinem[field]=val; continue;}//when field is not in eternal add it to consuetudinem
            jesua=jesua||md5(alphaVal+modified+r);

            if(field==="jesua"&&(tau==='Alpha'||alpha)){//set jesua for all transc//if u r inserting, 4 update & select u need an original value
               val=jesua;
               if(typeof scope.jesua==="object")scope.jesua.alpha=jesua;
               else scope.jesua=jesua;

               res['blossom']={"delta":"!@=!#","alpha":jesua};
            }else if(field=="modified"&&tau=='deLta'){}
            else{
               res[field]=val;
               params.push(alphaVal);fields.push('`'+field+'`');set.push("?");}
         }//for loop
      }//if caller// for custom call
      angular.extend(consuetudinem,options);
      iContent = angular.extend({},res,{"jesua":jesua,"option":consuetudinem},ndx);//will over write the initial column that hv obj with the ndx,places the option/consuetudinem column as well, adds index as well
      that.basilia=setQuaerere(mensa,res,tau,consuetudinem);
      iyona.log("RES",res);iyona.log("SCOPE",scope);iyona.log("BASILIA",JSON.parse(that.basilia),objectSize(JSON.parse(that.basilia)));iyona.log("CONSUETUDINEM",consuetudinem);iyona.log("iContent",iContent);iyona.log("LINE 408",alpha,jesua,params,fields,set,tau,ndx);
      //----------------------------------------------------------------------//INDEXEDDB
      if(dynamis.get("CONFIG").indexedDB&&dynamis.get("CONFIG").iDB){
         if(!isset(iContent.jesua))iContent.jesua = isset(iContent.blossom,iContent.blossom.alpha)?iContent.blossom.alpha:iContent.blossom;
         switch(tau){
            case"omega":case"omegA":that.iErase(mensa,jesua,function(e){iyona.log("iDELETE",e.target.result)});break;
            case"alpha":case"Alpha":that.iWrite(mensa,iContent,false);break;
            case"delta":case"deLta":that.iWrite(mensa,iContent,true);break;
            default:
               if(alpha)that.iRead(mensa,jesua,function(e){iyona.log("iFOUND.",e.target.result)});
               else if(ndx&&objectSize(ndx)) {that.iRead(mensa,ndx,function(e){iyona.log("iFOUND",e.target.result)});}
               break;
         }
      }
      //----------------------------------------------------------------------//WEBSQL
      if(dynamis.get("CONFIG").openDatabase){
         switch(tau){
            case "omegA":
   //            this.constraintForeignKey(jesua,mensa);@todo
               quaerere='DELETE FROM '+mensa+' WHERE jesua=?';
               setTimeout(function(){that.agito(quaerere,[jesua],'Deleted record from '+mensa,callback)},15);break;
            case "Alpha":
               _$('footer').data('jesua',jesua);//@see: insert it replacesinsertId
               quaerere='INSERT INTO '+mensa+' ('+fields.join()+')VALUES('+set.join()+')';
               msg='record added to '+mensa;break;
            case "deLta":
               val=scope['name']||scope['username'];//get the reference field
   //            if(val)this.constraintForeignKey(jesua,mensa,val);//update reference field @todo
               quaerere='UPDATE '+mensa+' SET '+fields.join('=?,')+'=? WHERE jesua=?';
               msg='record updated in '+mensa;break;
            case 3:
            default:
               params=[];reading=true;
               ubi=('quaerere' in eternal.hasOwnProperty() && 'ubi' in eternal.quaerere)?eternal.quaerere.ubi:'';//wen there is a physical search included
               precipio=(precipio.length>0)?" ORDER BY "+precipio.join(",")+" "+gamma:'';//wen there is an order
               if(alpha){ubi=' WHERE jesua=? '+ubi+' '+precipio+' LIMIT '+limit;}
               else{ubi=' WHERE 1=1 '+ubi+' '+precipio+' LIMIT '+limit;}//ADD the where clasue in both
               quaerere='SELECT '+quaerere.join()+' FROM '+mensa+ubi;
               msg='Selected '+mensa;break;
         }
         this.agito(quaerere,params,msg,callback,reading);
      }else{
         this.secondKings(callback,caller);//if there is a caller, meaning it will not run the form NOTITIA but a custom quaerre
      };
   }//end firstKing
   //=========================================================================//ONLINE
   this.secondKings=function(callback,caller){
      var view = (caller)?",rumor,"+caller:"";
      if(dynamis.get("CONFIG").Online){$rootScope.isViewLoading = {"width":"100%","display":"block"};
         that.basilia=that.basilia||dynamis.get("quaerere",true);//,"headers":{"Content-Type":"application/x-www-form-urlencoded;charset=utf-8"}
         var service=$resource(dynamis.get("SITE_MILITIA")+view,{},{"militia":{"method":"POST" ,isArray:false,"cache":false,"responseType":"json","withCredentials":true}});

         if(typeof that.basilia==='string')that.basilia = JSON.parse(that.basilia);
         if(!PASCO&&dynamis.get("CONFIG").isOnline) {
            service.militia(that.basilia,function(j){
               $rootScope.isViewLoading = {"display":"none"};
               if(j.notitia&& (typeof j.notitia.sql!=="undefined"||typeof j.notitia.quaerre!=="undefined"))iyona.log("QUAERRE",j.notitia.sql||j.notitia.quaerre);
               if(j.notitia&&j.notitia.idem!='0'){var u=dynamis.get("USER_NAME",true)||{};u.cons=j.notitia.idem;dynamis.set("USER_NAME",u,true)}//pour maitre un autre biscuit
               iyona.log(j,'Online');if(typeof callback=="function")callback(j);
            })
         ;}

         else if(!dynamis.get("CONFIG").isOnline){
            iyona.msg("You are currently offline",true,"danger bold");
            $rootScope.isViewLoading = {"display":"none"};}

         else if(PASCO){
            var Connection=checkConnection();
            if(Connection==Connection.NONE){iyona.msg("You are currently offline",true,"danger bold");}//@doto: connection
            else{service.militia(that.basilia,function(j){
               $rootScope.isViewLoading = {"display":"none"};
               if(j.notitia)iyona.log(j.notitia.sql);
               if(j.notitia&&j.notitia.idem!=0){var u=dynamis.get("USER_NAME",true);u.cons=j.notitia.idem;dynamis.set("USER_NAME",u)}//pour maitre un autre biscuit
               iyona.log(j,'Online');if(typeof callback=="function")callback(j);
            });}
         }//endif PASCO
      }//endif online
   }
   //=========================================================================//
}
//############################################################################//
//FETCH                                                                       //
//############################################################################//
function fetch($http,$rootScope){
   this.responseType=this.responseType||"json";
   if(!dynamis.get("CONFIG").isOnline){iyona.msg("Your device is currently Offline.",true,"danger bold"); return false;}//@todo
   this.post=function(url,params,callback){$rootScope.isViewLoading = {"width":"100%","display":"block"};
      $http.post(url,params,{"responseType":this.responseType,"cache":true,"headers":{"Content-Type":"application/x-www-form-urlencoded"},"withCredentials":true})
      .success(function(server){$rootScope.isViewLoading = {"display":"none"};callback(server);})
      .error(function(data,status,headers,config){$rootScope.isViewLoading = {"display":"none"};
         if(status==404&&PASCO&&navigator.connection.type=="none") iyona.msg("Please check your internet connection::"+navigator.connection.type,true,'danger bold');
         if(status==404&&PASCO) iyona.msg("Please check your internet connection::"+navigator.connection.type,true,'danger bold');
         iyona.log("There was an error in handling the transaction.");
         if(data&&"err" in data)iyona.msg(data.err,true,"danger",true);
         iyona.deb(data,status,headers,config,config.url);
      });
   }
}
//############################################################################//
//CRUD                                                                        //
//############################################################################//
function crud(notitia,$routeParams,$modal,$log,fetch,$timeout){
   var that=this,defaultScope,defaultMensa,defaultProfile,defaultTitle;

   this.get=function($scope,title,profile,_defaultScope){if(!_defaultScope){iyona.log("The defaultScope was not found"); return false;}
      defaultScope   = _defaultScope;//get default scope
      var view       = $routeParams.view||'list',jesua=$routeParams.jesua||'',reports=$routeParams.reports||null,now = new Date().format("isoDateTime");
      //set the menu values
      var menu=defaultScope.menu,options={};$scope.crud={};
      $scope.menu=(view=='list')?menu.list:(view=='reports'&&menu.reports)?menu.reports:(view=='reports'&&!menu.reports)?menu.list:menu.details;
      $scope.crud.alpha=menu.alpha;
      $scope.crud.omega=view=='list'?false:true;
      reports = (view === 'reports')?jesua:reports;
      //set the option values
      if(typeof defaultScope.call!=="undefined") options.rumorConf = defaultScope.call[reports||view];
      options.consuetudinem= defaultScope.consuetudinem;
      options.foreignConf  = defaultScope.foreignConf||[];
      options.listsConf    = defaultScope.listsConf||[];
      options.itemsConf    = defaultScope.itemsConf||[];
      options.extra        = defaultScope.extra;
      options.messenger    = defaultScope.messenger;
      options.join         = defaultScope.join;
      $scope.view          = view||'list';
      $scope.jesua         = jesua;
      $scope.cons          = {};
      $scope.opt           = options;
      $scope.btn           = "Add a new "+title;
      $scope.btnClass      = 'form-control btn btn-primary';
      defaultMensa         = defaultScope.mensa;//get the current mensa
      defaultProfile       = profile;
      defaultTitle         = title;
      $scope.pattern       = dynamis.get("EXEMPLAR");
      this.scope           = $scope;//make the scope available to all modules
      that.scope.data      = {};

      if(view==='view'&&defaultScope.details){notitia.firstKings(profile,defaultScope.details,3,this.details,options)}
      else if(view==='list'&&defaultScope.list){notitia.firstKings(profile,defaultScope.list,3,this.lists,options);}
      else if(view==='reports'&&defaultScope.reports){notitia.firstKings(profile,defaultScope.reports[jesua],3,this.lists,options);}
      else {angular.extend($scope.data,defaultScope.details);
         that.typeahead();
         $scope.data.created=now;$scope.data.modified=now}//new record
      return view;
   };
   this.details=function(server){
      if("notitia" in server&&angular.isArray(server.notitia.iota)){//angular.extend(that.scope.data,server.notitia.iota[0]);
         var result=server.notitia.iota[0],row;
         for(var field in defaultScope.details){//merge the result with defaultScope setting
            row=defaultScope.details[field];
            if (row!==null&&row.hasOwnProperty("alpha"))row["alpha"]=result[field];
            else row=result[field];
            that.scope.data[field]=row;
         }
         iyona.msg(server.notitia.msg);
         if("consuetudinem" in server.notitia&&server.notitia.consuetudinem){
            var cons=server.notitia.consuetudinem;iyona.deb("cons.listsVal",cons);
            that.scope.opt.foreignVal=cons.foreignVal;
            that.scope.opt.listsVal=cons.listsVal;
            that.scope.opt.customVal=cons.customVal;
         }
         that.scope.btn="Update "+defaultTitle;that.scope.$broadcast("readyForm",server.notitia);
         that.typeahead();
      }else{
         var msg=("notitia" in server)?server.notitia.err:null;
         iyona.msg(msg||"There was an error fetching the selected detail record.",true,"danger");
      }
   };
   this.lists=function(server){
      var view = $routeParams.view
      if("notitia" in server&&"err" in server.notitia){iyona.msg(server.notitia.err,false,'success',true);
      }else if("notitia" in server){
         that.scope.data=server.notitia.iota;
         if("consuetudinem" in server.notitia && server.notitia.consuetudinem && typeof server.notitia.consuetudinem.customVal!="undefined"){
            var cons=server.notitia.consuetudinem;
            that.scope.opt.customVal=cons.customVal;
         }
         var iscroll = (typeof defaultScope.functions!=="undefined"&& typeof defaultScope.functions[view]!=="undefined")?defaultScope.functions[view].iscroll:true;
         if(iscroll) setTimeout(SETiSCROLL,1000);/*set scroller*/
         if(view!=='reports')that.offlineDuty(that.scope.data);
         that.scope.$broadcast("readyList",server.notitia);

         if(view==='reports')reports(that.scope.data,cons);
         iyona.msg(server.notitia.msg,false,"");
         //that.typeahead();
      }else{iyona.msg("There was an error fetching the selected list record",true,"danger",true);}
   };
   function reports(rows,cons){
      that.scope.table = {};that.scope.table.title = [];that.scope.footer = {};
      var report = $routeParams.jesua;
      var len=rows.length,x,labels=[],y,l,field,key,element,firstName,elapse=1000;
      var graphOptions = {"dataSet":{},"fillColor":[],"strokeColor":[],"pointStrokeColor":[],"pointColor":[],"legend":[],"prop":[]};
      load_script("js/libs/chart.js-master/Chart.mim-mod.js",false,'end',true);

      element=defaultScope.functions.reports.report[report];//gets the json settings and iterats trough the options
      for(key in element){field = element[key];
         if(typeof field.set!="undefined"){//only fields with set will be used in the graph
            graphOptions.prop.push(key);//get the field name to be used in dataSet and in conjunstion with the rows fetched from the server
            graphOptions.dataSet[key] = [];
            if(field.fillColor) graphOptions.fillColor.push(field.fillColor);
            if(field.strokeColor) graphOptions.strokeColor.push(field.strokeColor);
            if(field.pointColor) graphOptions.pointColor.push(field.pointColor);
            if(field.pointStrokeColor) graphOptions.pointStrokeColor.push(field.pointStrokeColor);
            graphOptions.legend.push(field.title);
         }
         //TITLES: are used to loop through the td||th, it contains column info (filter's display, the title, the field key)
         if(field.title){
            that.scope.table.title.push({"title":field.title,"key":key,"display":field.display||null});
         }
         var tmp = (typeof defaultScope.messenger!=="undefined"&&typeof defaultScope.messenger.run_consue!=="undefined")?defaultScope.messenger.run_consue:'';
         if(key==="summary" && typeof cons.customVal[tmp] !=="undefined") {//iyona.deb("Results",tmp,defaultScope.messenger,cons.customVal);
            that.scope.footer = cons.customVal[tmp].rows[0];
         }
      }//end for elements
      that.scope.opt.legend=graphOptions.legend;
      that.scope.opt.strokeColor=graphOptions.strokeColor;
      that.scope.opt.graphTitle=element.graphTitle;

      for(x=0;x<len;x++){
         for(firstName in rows[x])break;//get the name of the first element
         labels.push(rows[x].client||rows[x].account||rows[x][firstName]);
         l=graphOptions.prop.length;//add the data that are only available in the property
         //gets the key from `graphOptions.prop[y]`, pushes into the array the value from `rows[x][graphOptions.prop[y]` the row that has the same key
         for(y=0;y<l;y++){
            graphOptions.dataSet[graphOptions.prop[y]].push(Math.round(rows[x][graphOptions.prop[y]]));
         }
      }
      elapse=dynamis.get("CONFIG").app?1500:elapse;
      if(element.graphType==='bar') $timeout(function(){var line = new jsGraph(labels,graphOptions.dataSet,'canvas',graphOptions).barChart();},elapse);
      else if(element.graphType==='line') $timeout(function(){var line = new jsGraph(labels,graphOptions.dataSet,'canvas',graphOptions).lineChart();},elapse);
      else if(element.graphType==='radar') $timeout(function(){var line = new jsGraph(labels,graphOptions.dataSet,'canvas',graphOptions).radarChart();},elapse);
   };

   this.submit=function($scope,profile){
      var tau=(isset($scope.data.jesua)&&isset($scope.data.jesua.alpha)) ?"deLta" :(typeof $scope.data.jesua!=="object" && typeof $scope.data.jesua!=="undefined") ?"deLta":"Alpha";
         if(this.check($scope,'dataForm')===false)return false;

      if(tau=="deLta"){delete $scope.data.created;}//upon update do not change the creation date.
      else if (tau=="Alpha"&&defaultScope.details.created) {var d=new Date().format("isoDateTime");$scope.data.created=d;$scope.data.modified=d;}
      try{
         notitia.firstKings(profile,$scope.data,tau,
         function(server){if("notitia" in server===false){iyona.msg("There was an error from the server",server);return false;}
            var notitia=server.notitia,consuetudinem=notitia.consuetudinem,err="err" in notitia?true:false,clss=err?"danger bold":"success";
            if(tau=="Alpha"&&err)$scope.data.jesua=null;//if there is an error when adding data reset the form jesua
            else $scope.btn="Update "+defaultTitle;
            if(consuetudinem&&consuetudinem.foreignVal){$scope.opt.foreignVal=consuetudinem.foreignVal;} //do not overflow the update
            if(consuetudinem&&consuetudinem.listsVal){$scope.opt.listsVal=consuetudinem.listsVal;} //do not overflow the update
//            $scope.btnClass=err?"form-control btn btn-danger":"form-control btn btn-success";//somehow this is not working
            var tmp=$scope.btn;$scope.btn=notitia.msg;setTimeout(function(){$scope.btn=tmp;$scope.$apply();},2000);
            that.scope.$broadcast("readySubmit",server.notitia);
            iyona.msg(notitia.msg,false,clss);
         },$scope.opt);
      }catch(e){
         iyona.msg("There was an internal error. return to the previous page and try again.");
         iyona.log("Internal error::"+e.message,e);iyona.deb("testing",$scope.data.jesua);
         if(tau=="Alpha"&&hasValue($scope.data.jesua))$scope.data.jesua=null;
         else if(tau=="Alpha"&&isset($scope.data.jesua,$scope.data.jesua.alpha));$scope.data.jesua.alpha=null;
      }
   }
   this.delete=function($scope,profile){
      if(!$scope.data.jesua){iyona.msg("You need to add a new record first.",false,"danger bold"); return false;}
      this.modalMessage("Would you like to remove the current record?",function(selected){$scope.modalSelected=selected;that.remove($scope,profile);},function(selected){$log.debug("The button selected is::",selected);})      ;
      return;
   }
   this.remove=function($scope,profile){
      var tau="omegA";iyona.deb($scope.opt,$scope);
      notitia.firstKings(profile,$scope.data,tau,function(server){
         if(!server.notitia) {iyona.log("There was an error retrieving notitia"); return false};
         if("err" in server.notitia) {iyona.log(server.notitia.err,true,'danger',true); return false};
         var notitia=server.notitia,err="err" in notitia?true:false,clss=err?"danger bold":"success";
         $scope.data=defaultScope;$scope.opt.foreignVal={};$scope.opt.listsVal={};
         $scope.btn="Add a new "+defaultTitle;$scope.opt.reference=null;//empty scope
         if(notitia.consuetudinem&&notitia.consuetudinem.servers&&notitia.consuetudinem.servers.length>0){}
         iyona.msg(notitia.msg,true,clss);
      },$scope.opt);
   }
   this.savItem=function(mensa,list){iyona.deb("SAVE",list,mensa);
      var parent=defaultScope.listsConf[mensa].ref;
      fetch.post(dynamis.get("SITE_SERVICE")+',creo,novum album',{"mensa":mensa,"list":list,"parent":parent,"uProfile":defaultProfile},function(results){if(!results){iyona.msg("no result was return."); return false;}
            iyona.deb("RESULTS",results);
         if("msg" in results)iyona.msg(results.msg); else iyona.msg(results.err,false,"danger");
      });
   };
   this.addItem=function(key,custValue){
      if(!that.scope.opt.listsVal){that.scope.opt.listsVal={};that.scope.opt.listsVal[key]=[];}
      var obj={"isNew":1},listsObj=defaultScope.listsConf[key],node;//,{"lists_name":"Add a name here","description":"Add a description here","isNew":1}

      if("parent" in listsObj){
         var parent = typeof that.scope.data[listsObj.parent]!=="undefined"?that.scope.data[listsObj.parent]:null;
         var parentVal =(parent &&typeof parent.alpha!=="undefined") ?parent.alpha :parent;}
      else {parentVal=null;}
      for(var field in listsObj.fields) {
         node =listsObj.fields[field];
         if(node && typeof node.alpha!=="undefined") obj[field] = node.alpha;
         else if(node && typeof node.parent!=="undefined") obj[field] = parentVal;
         else if(typeof custValue[field]!=="undefined") obj[field] = custValue[field];
         else obj[field] = node;
      }//the new obj will take the default value or the parent value when empty

      that.scope.opt.listsVal[key].push(obj);//iyona.deb("HERE",that.scope.opt.listsVal[key],key,obj);
   };
   this.remItem=function(no,ref,list){
      if("$$hashKey" in list) delete list['$$hashKey'];
      fetch.post(dynamis.get("SITE_SERVICE")+',creo,tollere album',{"mensa":ref,"list":list},function(results){iyona.deb("resulTs",results);
         if(isset(results,results.msg) ){
             iyona.msg(results.msg);that.scope.opt.listsVal[ref].splice(no,1);}
         else {iyona.msg(results.err,false,"danger");}
      });
   }
   this.DBenum=function(links,parent,col1,key,type){
      links=("rows" in links)?links.rows:links;var x,l=links.length;
      if(type=="radio"){
         for (x=0;x<l;x++){links[x][col1]=null;}//reset all options on click
         links[key][col1]=parent;
      }else{iyona.deb(links[key][col1],'links[key][col1]');
         links[key][col1]=(links[key][col1])?null:parent;
      }//endif
      return links;
   }//enum
   this.DBset=function(field,val){iyona.deb(field,"start",val);
      var reg = new RegExp(',?'+val,"g");
      if(field.indexOf(val)!=-1){field=field.replace(reg,'');iyona.deb(field,"first");}
      else if (!field) {field=val;iyona.deb(field,"second");}
      else {field+=','+val;iyona.deb(field,"third");}
      return field;
   }
   /*
    * VALIDATIONS
    */
   this.check=function($scope,name){ if (name in $scope===false){iyona.deb("The "+name+" cannot be found in the form",$scope); return false;}
      var frm=$scope[name],invalid=frm.$invalid,x,l,row,title,msg=[],
      message={"email":"is not a valid email","required":"is not valid","number":"is not numerical","min":"is less then minimum","max":"is greater then maximum","date":"is not valid date","url":"is not a valid url","pattern":"is not correctly formated"};
      iyona.deb("CHECKING.............",frm.$error,name,frm);
      if(invalid){$scope.err=true;$scope.errMsg={};
         for(var type in frm.$error){l=frm.$error[type].length;
            for(x=0;x<l;x++){
               row=frm.$error[type][x];title=ucfirst(row.$name);//gets the name field
               if(row.$error.hasOwnProperty("number")&&!row.$error.hasOwnProperty("max")&&!row.$error.hasOwnProperty("min")) type = "number";//number values in angular display as required field
               if(row.$error.hasOwnProperty("date")) type = "date";
               $scope.errMsg[row.$name]=true;//this will enable the angular error class
               msg.push(" "+title+" "+message[type]);//push the messages
            }}
         if(frm){}iyona.deb("SCOPE",frm,$scope);
         $scope.msg=msg.join();iyona.msg(msg);return false;}
      $scope.errMsg=null;$scope.err=false;$scope.msg=null;return true;
   }
   this.checkboxValue=function($scope,defaultField,field){
      var e=[],tmpVal,x,l=defaultField.enum.length;
      var scopeField=$scope.data[field];
      scopeField = scopeField?scopeField.split(","):[];
      for(x=0;x<l;x++){
         tmpVal=defaultField.enum[x];
         if(scopeField.indexOf(tmpVal)!=-1)e.push(tmpVal);
         else e.push(null);
      }
      $scope.data[field]=e;
   }
   /*
    * creates an offline iDB from the list
    */
   this.offlineDuty=function(results,mensa){
      var x,l=(angular.isArray(results))?results.length:0;iyona.deb("OFFlineDUTY",results,sessionStorage.SITE_NEW,mensa);
      if(sessionStorage.SITE_NEW=="1") return false;//when a new db is placed it will get the data from server.
      mensa=mensa||defaultMensa;
      for(x=0;x<l;x++)notitia.iWrite(mensa,results[x],true);
   }
   this.typeahead=function(){
      var runOnce=false;
      function callBack(e,field){var set=defaultScope.typeahead[field];
         that.scope.typeahead[field]=that.scope.typeahead[field]||[];
         var cursor = e.target.result,show;//iyona.deb("Blessing...",field,set,cursor,runOnce);

         if(cursor===null&&runOnce===false) {
            if(dynamis.get("CONFIG").isWorker){
               callWorker({"enkele":true,"option":false,"militia":"imple","mensa":set.mensa},function(data){iyona.log("Returning worker from single creation IDB::",data);});
            }else{
               fetch.post(dynamis.get("SITE_SERVICE")+',creo,imple',{"mensa":set.mensa},function(results){iyona.log("Typeahead addition for",field); that.offlineDuty(results.notitia.rows,set.mensa);});
         }}
         if(cursor){runOnce=true;//place this here, it will ensure that there is a cursor and that it does not need to fetch from the server anymore
            if(angular.isArray(set.display)){
               var displayFields="";
               for(var x=0;x<set.display.length;x++){ displayFields += cursor.value[set.display[x]]+' ';}
               show = {"alpha":cursor.value[set.agro], "display": displayFields}
            }
            else {show = {"alpha":cursor.value[set.agro],"display":cursor.value[set.agro]}}
            that.scope.typeahead[field].push(show);cursor.continue();
         }
         else {iyona.log("END OF CURSOR+"+field,that.scope.typeahead[field]);}
      }
      //set typeahead
      if(notitia.IDBReady === true){
         if(defaultScope.typeahead){iyona.log("Already IDB ready typeahead");
            that.scope.typeahead=that.scope.typeahead||{};var cnt=0;
            for(var field in defaultScope.typeahead){var set=defaultScope.typeahead[field];
               notitia.iRead(set.mensa,{"where":set.index,"order":"asc"},callBack,field);}
         }
      }else{
         document.addEventListener("IDBReady",function(e){iyona.log("On IDB ready typeahead",e.detail.success);
            if(defaultScope.typeahead){
               that.scope.typeahead=that.scope.typeahead||{};var cnt=0;
               for(var field in defaultScope.typeahead){var set=defaultScope.typeahead[field];
                  notitia.iRead(set.mensa,{"where":set.index,"order":"asc"},callBack,field);}
            }
         });
      }


   }
   this.modalMessage=function(msg,callOK,callCancel){
      var modalInstance=$modal.open({
         "templateUrl":"cera/templates/ModalContent.html",
         "windowClass":"modalClass",
         "controller":modalShow,
         "resolve":{passing:function(){return msg;}}
      });
      modalInstance.result.then(callOK,callCancel);
   }
}
//############################################################################//
//CRUD                                                                        //
//############################################################################//