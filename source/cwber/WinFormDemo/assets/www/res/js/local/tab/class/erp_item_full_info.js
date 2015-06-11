var erp_item_full_info=Class({
	item_info:null,
	_id:{index:0},
	id:null,
	name:null,
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
		this.name='__erp_item_full_info'+this.id;
		window[this.name]=this;
		this.param.div='#'+this.param.div.replace(/^#/,'');
		$(this.param.div).empty();
		this.init_item_drawing();
		this.init_item_info();
		this.setData();
		this.init_item_material_info();
		this.init_technonogy_info();
		this.init_item_orders();
		this.init_item_storage_record();
		//arguments;
	},
	init_item_material_info:function()
	{
		var res=ERPUtils.get_item_material(this.param.item_number);
		$(this.param.div).append(res);
		//console_info(ERPUtils.get_item_material(this.param.item_number));
	},
	init_item_storage_record:function()
	{
		$(this.param.div).append($("<div id='"+this.name+"_erp_item_storage_record'></div>"));
		this._erp_item_storage_record=new erp_item_storage_record({
			div:this.name+"_erp_item_storage_record",
			item_number:this.param.item_number
		});
	},
	init_item_orders:function()
	{
		
		$(this.param.div).append($("<div id='"+this.name+"_erp_item_orders'></div>"));
		this._erp_item_orders=new erp_item_orders({
			div:this.name+"_erp_item_orders",
			item_number:this.param.item_number
		});
	},
	init_item_drawing:function()
	{
		//var item_info =$("<div id='item_info'></div>");
		$(this.param.div).append($("<div id='"+this.name+"_drawing'></div>"));
		this.item_drawing=new erp_item_drawing({
			div:this.name+"_drawing",
			item_number:this.param.item_number
		});
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
				 { display: "部品号", name: "item_number",newline: true, type: "text",editor:{readonly:true},newline: true,width:100},//, group: "基础信息", groupicon: groupicon},
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
						  },newline: false,width:100},
//				 { display: "工艺信息", name: "technology_array",newline: true, type: "text",editor:{readonly:true},newline: true,width:560},
				 { display: "所属机种", name: "machine_array",newline: true, type: "textarea",editor:{readonly:true},newline: true,width:560,height:30}
				 ]
		});
	},
	init_technonogy_info:function(){
		var init_technonogy_info=$("<div id='"+this.name+"init_technonogy_info'></div>");
		var target=this;
		$(this.param.div).append(init_technonogy_info);
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
								},
								{
									display : '更改时间',
									name : 'u_time',
									type : 'date',
									format : 'yyyy-MM-dd hh:mm:ss',
									width : 150
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
		var target=this;
		ERPUtils.get_item_future_storage_1(this.param.item_number,function(future){
			//console_info(future);
			if(future==null)
				future='0';
			target.data={
					future_storage:future
				};
			target.item_info.setData(target.data);
		});
		ERPUtils.get_item_comp_storage_1(this.param.item_number,function(comp){
			//console_info(comp)
			if(comp==null)
				comp='0';
			target.data={
					comp_storage:comp
			};
			target.item_info.setData(target.data);
		});
		ERPUtils.get_item_half_storage_1(this.param.item_number,function(half){
			//console_info(half);
			if(half==null)
				half='0';
			target.data={
					half_storage:half
			};
			target.item_info.setData(target.data);
		});
//		var future=ERPUtils.get_item_future_storage(this.param.item_number);
//		if(future==null)
//			future='';
//		var comp=ERPUtils.get_item_comp_storage(this.param.item_number);
//		if(comp==null)
//			comp='';
//		var half=ERPUtils.get_item_half_storage(this.param.item_number);
//		if(half==null)
//			half='';
////		var technology_arry=ERPUtils.item_find_technology_info_array(this.param.item_number);
////		if(technology_arry==null)
////			technology_arry='';
		this.data={
			item_number:this.param.item_number
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
	}
});