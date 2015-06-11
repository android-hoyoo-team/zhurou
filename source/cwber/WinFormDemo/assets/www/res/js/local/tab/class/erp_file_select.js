var erp_file_select=Class({
	
	data:null,
	initialize:function()
	{
		this.param={
			select:null,
		    initial_directory:null,
		    filter:"所有文件|*.*",
		    max_size:0,
		    min_size:0,
		    filter_index:1
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
			 var res=bridge_map.open_filed_dialog({
				    initial_directory: t.param.initial_directory,
				    filter: t.param.filter,
				    filter_index: t.param.filter_index
				});
			 if(res&&res.status=="success")
			{
				 var file=res.result;
				 if(t.param.max_size>0||t.param.min_size>0)
				{
					 var file_size_res=bridge_map.get_file_size(file);
					 if(file_size_res&&file_size_res.status=="success")
					 {
						 if(file_size_res.result>t.param.max_size)
						{
							 tipOnce("提示","文件不能超过"+t.getSizeString(t.param.max_size),10000);
						}
						 else if(file_size_res.result<t.param.min_size)
						 {
							 tipOnce("提示","文件不能小于"+t.getSizeString(t.param.min_size),10000);
						 }
						 else
						{
							 t.param.select.val(file);
							 t.data=file;
						}
					 }
				}
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
	},
	getSizeString:function(s)
	{
		return s>1024?(s/1024>1024?(s/1024/1024>1024?(s/1024/1024/1024)+'GB':(s/1024/1024+'MB')):s/1024+'KB'):s+"B";
	}
});
