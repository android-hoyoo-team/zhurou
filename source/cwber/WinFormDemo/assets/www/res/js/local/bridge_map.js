//var is_ie_tag = fdocument.all ? true : false;
var use_bridge_tag = true;
var exec=function(f)
{
	
}
//window.onload=function(){
//	bridge_map.system_parameters=bridge_map.get_system_parameters();
//};
var bridge_map = {
	    test:function(param)
	    {
	        if (use_bridge_tag) {
	            return JSON.parse(window.CallCSharpMethod("test",null));
	        }
	    },
	    test1:function(param)
	    {
	        alert(JSON.stringify(param));
	    },
    ajax_callbacks:{index:0},
      /*
        requestEncoding:"utf-8"
        method:"get"
        userAgent:"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)"
        contentType:"application/json"
        accept:"application/json"
        timeout:20
        data:{}
      */
    
    ajax: function (o)
    {
        if (use_bridge_tag)
            return window.external.ajax(o);
        return null;
    },
    ajax_1_auto: function (o)
    {
//    	console_info(JSON.parse(JSON.stringify(o)));
    	if (use_bridge_tag)
    	{
    		if(o.callBack&&typeof o.callBack =='function')
    		{
    			this.ajax_callbacks["___callback"+this.ajax_callbacks.index]= o.callBack;
    			o.callBack="bridge_map.ajax_callbacks.___callback"+this.ajax_callbacks.index;
    			var _i=-1;
    			for(var i =0;i<window.top.frames.length;i++)
    			{
    				if(top.frames[i]==self)
    				{
    					_i=i;
    				}
    			}
    			if(!window.name||window.name.trim()=="")
    			{
    				window.name=this.get_frame_name();
    			}
    			//o.callBack=o.callBack;
    			//console_info(top.frames[window.name].name);
    			if(!o.window_name)
    				o.window_name=window.name;
    			//o.window_index=_i;
    			if(!o.parent_window)
    			{
    				if(self==top)
    				{
    					o.parent_window="self";
    				}
    				else
    				{
    					o.parent_window="top";
    				}	
    				
    			}
//    			o.callBack="console_info(top.frames.length);";
//    			o.callBack="console_info(top.frames["+_i+"].name);";
    			//o.callBack="frames["+window.name+"].css_init();";
    		//	o.callBack=" if(top==self) console_info(0)";
//    			console_info(o.callBack);
    			//eval(o.callBack+"(111)");
    			this.ajax_callbacks.index++;
    		}
    		window.external.ajax_1(JSON.stringify(o));
    	}
    },
    ajax_auto:function (param)
    {
    	if (use_bridge_tag)
    	{
    		if(param)
    		{
    			var res= window.external.ajax(JSON.stringify(param));
    			if(res)
    			{
    				return JSON.parse(res)
    			}
    		}
    	}
    	return null;
    },
    /**
     *  provider:"Microsoft.Jet.OLEDB.4.0"
     *  extended_properties:"Excel 8.0;HDR=Yes;IMEX=2"
     *  data_source:            *
     *  sql:                    *
     */
    import_order: function (param) {
        if (use_bridge_tag)
        {
        	var res= window.external.import_order0(JSON.stringify(param));
        	//alert(res);
        	if(res)
			{
				return JSON.parse(res);
			}
        }
        return null;
    },
    import_orders: function (param) {
    	if (use_bridge_tag)
    	{
    		var res= window.external.import_orders(JSON.stringify(param));
    		//alert(res);
    		if(res)
    		{
    			return JSON.parse(res);
    		}
    	}
    	return null;
    },
    get_excel_info:function ()
    {
        if (use_bridge_tag) {
            return window.external.get_excel_info();
        }
        return null;
    },
    /*
     query
     file_name
      file_path
		sheet_name
		charset
		headers
     * */
    export_excel:function (param)
    {
    	if (use_bridge_tag) {
    		
    		var p= JSON.stringify({method:"get",
        		url:erp_api_service_super+param.query+"/",
        		timeout:120000});
    		var p2=JSON.stringify({
    			file_name:param.file_name,
    			file_path:param.file_path,
    			sheet_name:param.sheet_name,
    			charset:param.charset,
    			headers:param.headers
    			});
    		return  JSON.parse(window.external.export_excel(p,p2));
    	}
    	return null;
    },
    super_api:function (sql)
    {
    	return this.ajax_auto({
    		method:"get",
    		url:erp_api_service_super+sql+"/",
    		timeout:120000
    	});
    },
    super_api_1:function (sql,callBack)
    {
    	return this.ajax_1_auto({
    		method:"get",
    		url:erp_api_service_super+sql+"/",
    		timeout:120000,
    		callBack:callBack
    	});
    },
    save_user_info:function( key , value)
    {
    	 if (use_bridge_tag) {
             return window.external.save_user_info(key,value);
         }
    },
    get_user_info:function( key )
    {
    	if (use_bridge_tag) {
    		return window.external.get_user_info(key);
    	}
    },
    get_frame_name:function()
    {
    	if (use_bridge_tag) {
    		return window.external.get_frame_name();
    	}
    },
    downloadFile:function( serverUrl, localFile )
    {
    	if (use_bridge_tag) {
    		return window.external.downloadFile(serverUrl,localFile);
    	}
    },
    uploadFile:function( serverUrl, localFile,new_file_name )
    {
    	if (use_bridge_tag) {
    		return window.external.uploadFile(serverUrl,localFile,new_file_name);
    	}
    },
    uploadFileByDir:function( serverUrl, localFile,new_file_name,dir_name )
    {
    	if (use_bridge_tag) {
    		return window.external.uploadFileByDir(serverUrl,localFile,new_file_name,dir_name);
    	}
    },
    start_process:function(process)
    {
    	if (use_bridge_tag) {
    		return window.external.start_process(process);
    	}
    },
    base_directory:function()
    {
    	if (use_bridge_tag) {
    		return window.external.base_directory();
    	}
    },
    /**
     * default_file_path
     * */
    folder_browser_dialog:function(param)
    {
    	if (use_bridge_tag) {
    		var res= window.external.folder_browser_dialog(JSON.stringify(param));
			if(res)
			{
				return JSON.parse(res)
			}
    	}
    	
    },
    /**
     * initial_directory
     * filter
     * filter_index
     */
    open_filed_dialog:function(param)
    {
    	if (use_bridge_tag) {
    		var res= window.external.open_filed_dialog(JSON.stringify(param));
			if(res)
			{
				return JSON.parse(res)
			}
    	}
    	
    },
    close:function()
    {
    	 window.external.close();
    },
    get_file_size:function(file_name)
    {
    	if (use_bridge_tag) {
    		var res= window.external.get_file_size(file_name);
    		if(res)
    		{
    			return JSON.parse(res)
    		}
    	}
    	
    },
    open_web:function(param)
    {
    	if (use_bridge_tag) {
    		var init_param={
    			width:780,
    			height:650,
    			title:"信息"
    		};
    		init_param=Util.extend(init_param,param.init_param);
    		if(!init_param.top)
    		{
    			init_param.top=(bridge_map.system_parameters.workarea_height-init_param.height)/2;
    		}
    		if(!init_param.left)
    		{
    			init_param.left=(bridge_map.system_parameters.workarea_width-init_param.width)/2;
    		}
    		param.init_param=init_param;
    		var res= window.external.open_web(JSON.stringify(param));
    		if(res)
    		{
    			return JSON.parse(res);
    		}
    	}
    	
    },
    control_open_web:function(key,param){
    	var res= window.external.control_open_web(key,JSON.stringify(param));
		if(res)
		{
			return JSON.parse(res);
		}
    },
    get_web_index:function()
    {
    	if (use_bridge_tag) {
    		return window.external.get_web_index();
    	}
    	
    },   
    get_web_data:function()
    {
    	if (use_bridge_tag) {
    		var data=window.external.get_web_data();
    		return JSON.parse(data);
    	}
    },
    get_web_data_by_index:function(index)
    {
    	if (use_bridge_tag) {
    		return window.external.get_web_data_by_index(index);
    	}
    }
    
};
var console_info=function(s)
{
    if (!use_bridge_tag)
    {
        console.info(s);
    }
    else
    {
    	alert(JSON.stringify(s));
    }	
};
