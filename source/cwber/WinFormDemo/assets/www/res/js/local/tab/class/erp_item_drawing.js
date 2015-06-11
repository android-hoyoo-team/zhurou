var erp_item_drawing=Class({
	item_info:null,
	_id:{index:0},
	data:null,
	initialize:function()
	{
		this.param={
				div:'',
				item_number:''
		};
		if(!arguments[0])
		{
			tipOnce('错误','请刷新重试。');
			throw new Error("erp_storage_info参数错误。");
		}
		
		if(arguments[0])
		{
			/**
			 * if() 参数判断
			 * */
			this.param=Util.extend(this.param,arguments[0]);
		}
		this._id.index++;
		this.id=this._id.index;
		this.name='__erp_item_drawing'+this.id;
		window[this.name]=this;
		this.param.div='#'+this.param.div.replace(/^#/,'');
		$(this.param.div).empty();
		this.init_item_drawing();
//		this.setData();
		//arguments;
	},
	init_item_drawing:function()
	{
		var target=this;
		this.getData(function(d){
			if(d&&d.type2)
			{
				var src;
				if(d.type2.location)
					src=erp_file_service_upload+"/"+d.type2.location+"/"+d.type2.name;
				else
					src=erp_file_service_upload+"/"+d.type2.name;
				
				var item_drawing2=$("<img id='"+target.name+"item_drawing2' src='"+src+"'></img>");
				$(target.param.div).append(item_drawing2);
			}
			if(d&&d.type1)
			{
				var src;
				if(d.type1.location)
					src=d.type1.location+"/"+d.type1.name;
				else
					src=d.type1.name;
				var item_drawing2=$("<a href='javascript: ERPUtils.downloadAndOpen(\"" + src + "\")'>点击查看图纸(pdf)</a> ");
				$(target.param.div).append(item_drawing2);
			}
		});
//		console_info(this.item_info);
	},
	setData:function()
	{
		var future=ERPUtils.get_item_future_storage(this.param.item_number);
		if(future==null)
			future='获取失败';
		var comp=ERPUtils.get_item_comp_storage(this.param.item_number);
		if(comp==null)
			comp='获取失败';
		var half=ERPUtils.get_item_half_storage(this.param.item_number);
		if(half==null)
			half='获取失败';
		
		this.data={
			item_number:this.param.item_number,
			comp_storage:comp,
			half_storage:half,
			future_storage:future
		};
		this.item_info.setData(this.data);
	},
	getData:function(callback)
	{
		ERPUtils.item_find_drawing_array_1(this.param.item_number,callback);
	},
	refresh:function()
	{
		this.setData();
	},
	init_technonogy_info:function(){
		var init_technonogy_info=$("<div id='"+this.name+"init_technonogy_info'></div>");
		var target=this;
		$(this.param.div).append(init_technonogy_info);
		init_technonogy_info.css('margin', 10).ligerGrid(ERPUtils.get_default_grid_option_for_url(
				{
					width : '90%',
					height:'auto',
					url : erp_api_service.EntRelTechnologyItemEquipment[0]
							+ "?item_number="
							+ target.param.item_number
							+ "&order_by=technology_rank",
					columns : [
								{
									display : '工序順序',
									name : 'technology_rank',
									width : 50,
									editor:{type : 'int'}
								},
								{
									display : '工序名字',
									name : 'technology_id',
									width : 50,
									type:'int',
									editor:{ 	
										type: 'select',
					          	  		emptyvalue:false, 
					          	  		data:global_data.technology_data, 
					          	  		valueColumnName: 'id', 
					          	  		displayColumnName: 'name',
					          	  		selectBoxWidth: 300 ,
					          	  		selectBoxHeight:300,
					          	  		// isShowCheckBox:false,
					          	  		emptyText: null,
					          	  		// emptyValue:0,
					          	  		valueType:"int",
					          	  		columns: [
					          	  		          // { header: 'ID', name: 'id',type:'int',
					          	  		          // width: 20 },
					          	  		          { header: '名称', name: 'name' }
					          	  		          ]
										},
										render:function (item)
										{
					            			for (var i = 0; i < global_data.technology_data.length; i++)
					            			{
					            				if (global_data.technology_data[i]['id']+"" == item.technology_id+"")
					            				{
					            					return global_data.technology_data[i]['name'];
					            				}
					            			}
					            			return "";
					            		}
									
								},
								{
									display : '工序信息',
									name : 'technology_info',
									width : 150,
									editor:{type : 'string'}
								},
								{
									display : '規格',
									name : 'dimensions',
									width : 150,
									editor:{type : 'string'}
								}
								],

				 	 enabledEdit: false,
				 	 detailToEdit: false
				}));
	}
});