var erp_item_info_select=Class({
	item_info:null,
	_id:{index:0},
	id:null,
	name:null,
	param:{
		div:''
	},
	data:null,
	initialize:function()
	{
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
		this.name='__erp_item_info_select'+this.id;
		this.param.div='#'+this.param.div.replace(/^#/,'');
		window[this.name]=this;
		$(this.param.div).empty();
//		$(this.param.div).attr("width","300px");
		this.init_item_info();
//		this.setData();
		//arguments;
	},
	init_item_material_info:function()
	{
		var res=ERPUtils.get_item_material(this.param.item_number);
		if(res)
		{
			var item_material_info=$("#"+this.name+"_item_material_info");
			
			if(item_material_info.length>0)
			{
				item_material_info.remove();
			}
			item_material_info=$("<div id='"+this.name+"_item_material_info'>"+res+"</div>");
			$(this.param.div).append(item_material_info);
		}

	},
	init_item_info:function()
	{
		var item_info=$("<div id='"+this.name+"item_info'></div>");
		var target=this;
		$(this.param.div).append(item_info);
		this.item_info=$(item_info).ligerForm({
			inputWidth: 70, labelWidth: 75, space: 5,
			fields: 
				[
				 { display: "部品号", name: "item_number",newline: true, type: "select",editor:{
			        	type : 'select',
						condition: {
			                //prefixID : 'conditio',
			                fields: [
			                    { label: '部品号', name: 'number', type: 'text' }
			                ]
			            },
			            onButtonClick:function(){
			            	select=this;
			            },
			            onSelected:function(value,text)
			            {
			            	if(target.item_info_has_init)
			            	{
			            		target.param.item_number=value;
			            		target.setData();
			            		target.init_item_material_info();
			            		target.init_technonogy_info();
			            	}
			            },
						selectBoxWidth: 400 ,
				  		selectBoxHeight:300,
						valueField : 'number',
						textField : 'number',
						grid : ERPUtils.getGridOptions()},newline: true,width:150},//, group: "基础信息", groupicon: groupicon},
				 { display: "成品库存", name: "comp_storage",newline: true, type: "text",editor:{readonly:true},width:100},
				 { display: "半成品库存", name: "half_storage",newline: true, type: "text",editor:{readonly:true},width:100,newline: false},
				 { display: "预入库存", name: "future_storage",newline: true, type: "text",
					 editor:{readonly:true,
					 	   onFocus:function(){
					 		   this.hasOnFocus=true;
					 		   if(this.getValue()&&Number(this.getValue())>0)
					 		   {
					 			   ERPUtils.show_item_feeding_tracking(target.param.item_number)
					 		   }
					 		},
					 		  onBlur:function(){
						 		   this.hasOnFocus=false;
						 		   
						 		}
						  },newline: false,width:100}
				 ]
		});
		this.item_info_has_init=true;
	},
	init_technonogy_info:function(){
		var init_technonogy_info=$("#"+this.name+'init_technonogy_info');
		if(init_technonogy_info.length>0)
		{
			init_technonogy_info.remove();
		}
		init_technonogy_info=$("<div id='"+this.name+"init_technonogy_info'></div>");
		$(this.param.div).append(init_technonogy_info);
		var target=this;
		init_technonogy_info.css('margin', 10).ligerGrid(ERPUtils.get_default_grid_option_for_url(
				{
					width : '95%',
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
				 	 detailToEdit: false,
			            onBeforeShowData:function(g)
			            {
			            	if(!g||g.Total<=0)
			            	{
			            		init_technonogy_info.hide();
			            	}
			            }
				}));
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
			//item_number:this.param.item_number,
			comp_storage:comp,
			half_storage:half,
			future_storage:future
		};
		this.item_info.setData(this.data);
	},
	getData:function()
	{
		return this.data;
	},
	refresh:function()
	{
		this.setData();
	},
	toggle:function()
	{
		$(this.param.div).slideToggle("slow");
//		$(this.param.div).toggle();
	}
});