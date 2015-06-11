var erp_folder_select=Class({
	
	data:null,
	initialize:function()
	{
		this.param={
			select:null,
			default_file_path:null
		};
		if(!arguments[0])
		{
			tipOnce('错误','请刷新重试。');
			throw new Error("erp_file_select参数错误。");
		}
		
		if(arguments[0])
		{
			/**
			 * if() 参数判断
			 * */
			this.param=Util.extend(this.param,arguments[0]);
		}
		//$(this.param.div).empty();
		this.init();
		this.setData();
		//arguments;
	},
	init:function()
	{
//		this.select = $("<input type='text'/>");
//		 $(this.param.div).append(this.select);
		 var t=this;
		 this.param.select.unbind().bind('click', function() {
			    /**
			     * initial_directory
			     * filter
			     * filter_index
			     */
			 var res=bridge_map.folder_browser_dialog({
				 default_file_path: t.param.default_file_path
				});
			 if(res&&res.status=="success")
			{
				 var file=res.result;
//				 console_info(file);
				 t.param.select.val(file);
				 t.data=file;
			}
			 else if(res&&res.status=="cancle")
			{
				 tipOnce("提示","取消",10000);
			}
			 else
			{
				 tipOnce("提示","错误"+res.message,10000);
			}
	    });
		 
	},
	getData:function()
	{
		return this.data;
	},
	setData:function(d)
	{
		this.data=d;
		if(this.param.select)
			this.param.select.val(this.data);
	}
});
