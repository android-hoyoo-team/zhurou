var erp_bom_edit=Class({
	_id:{index:0},
	_objs:{},
	init_bom_grid:null,
	init_bom_grid_id:null,
	init_bom_grid_add:null,
	init_bom_grid_add_id:null,
	initialize:function()
	{
		
		this.param={
				div:'',
				item_number:null
				};
		if(!arguments[0])
		{
			tipOnce('错误','请刷新重试。');
			throw new Error("erp_bom_edit参数错误。");
		}
		if(!arguments[0]['item_number'])
		{
			tipOnce('错误','item_number不存在。');
			throw new Error("erp_bom_edit参数错误。");
			return;
		}
		if(arguments[0])
		{
			/**
			 * if() 参数判断
			 * */
			this.param=Util.extend(this.param,arguments[0]);
		}
		if(	typeof(this.param.div)=='string')
		{
			this.param.div=$('#'+this.param.div.toString().replace(/(^#)/,""));
		}
		this._id.index++;
		cd=this._id.index;
		window['__erp_bom_edit'+this.id]=this;
		$(this.param.div).empty();
		this.init_bom_grid_id="init_bom_grid_id"+this.id;
		this.init_bom_grid_add_id="init_bom_grid_add_id"+this.id;
		$(this.param.div).append($("<div id='"+this.init_bom_grid_add_id+"'></div>"));
		$(this.param.div).append($("<div id='"+this.init_bom_grid_id+"'></div>"));
		this.init_bom_grid();
		//arguments;
	},
	init_bom_grid:function()
	{
		var target=this;
		//getItemTree(this.param.item_number,true,function(tree){
			target.init_bom_grid=$('#'+target.init_bom_grid_id).ligerGrid(
					 ERPUtils.get_default_grid_option_for_url({
				toolbar: { items: [
				                    {
				                        text: '增加', click: function () {
				                        	window["__erp_bom_edit"+target.id].add_child();
				                        }, icon: 'add'
				                    },
				                    { line: true },
				                    {
				                    	text: '刷新结构', click: function () {
				                    		var res2=ERPUtils.item_item_update_after();
				        			 		if(res2)
				        			 			tipOnce("成功","刷新成功",5000);
				        			 		else
				        			 			tipOnce("失败","刷新失败。请重试",5000);
				        			 		target.init_bom_grid.reload();
				                    	}, icon: 'refresh'
				                    },
				                    { line: true }
				        ]
				        },
				columns:
					[
					 // { display: '序号', name: 'id', width: 30, type: 'int' },
					 {
						 display: '子件', name: 'c_item_number',  align: 'left',width:150,
						 editor:{
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
								selectBoxWidth: 400 ,
						  		selectBoxHeight:300,
								valueField : 'number',
								textField : 'number',
								grid : ERPUtils.getGridOptions()
							}
					 ,
					 render:function(rowdata, rowindex, value){
						 return "<a href=\"javascript:show_item_detail('" +value + "')\">"+value+"</a>";
					 }
					 },
//					 {
//						 display: '层次', name: 'l', width: 100,isSort: false
//						 // editor: { type: 'text', height: 60 }
//					 },
					 {
						 display: '数量', name: 'count', width: 100,isSort: false,type:'int',
						 editor: { type: 'int', height: 60 }
					 },
					 {
						 display: '备注', name: 'remark', width: 250,isSort: false,
						 editor: { type: 'text', height: 60 }
					 },
					 {
						 display: '操作', isSort: false, width: 120, filter:false,render: function (rowdata, rowindex, value) {
							var h = "";
								if (!rowdata._editing) {
									h += "<a href='javascript:window.__erp_bom_edit"+target.id+".beginEdit_child(" + rowindex + ")'>修改</a> ";
									h += "<a href='javascript:window.__erp_bom_edit"+target.id+".delete_child(\"" + rowdata.c_item_number + "\")'>删除</a> ";
								}
								else {
									h += "<a href='javascript:window.__erp_bom_edit"+target.id+".endEdit_child(" + rowindex + ")'>提交</a> ";
									h += "<a href='javascript:window.__erp_bom_edit"+target.id+".cancelEdit_child(" + rowindex + ")'>取消</a> ";
								}
							 return h;
						 }
					 }
					 ], 
					 onBeforeSubmitEdit:function()
					 {
						
						 if (arguments[0].record.__status == "add") {
//							 param = {
//									 url: erp_api_service.EntRelItemItem[0],
//									 method: "POST",
//									 data: Util.extend(arguments[0].record, arguments[0].newdata)
//									 //encode:"utf-8"
//							 };
						 }
						 else {
							 var _n=  arguments[0].newdata.count;
							 if(_n==null||_n<=0)
							{
								 tipOnce("提示", "子件数量不能小于0", 5000);
								 return false;
							}
							 var _c=arguments[0].newdata.c_item_number;
							 if(_c==null||_c.toString().trim()=='')
							{
								 tipOnce("提示", "子件不能为空", 5000);
								 return false;
							}
							 var check=ERPUtils.check_item_has_child(_c,target.param.item_number);
								if(check==null)
								{
									tipOnce("错误","检查参数失败，请重试",5000);
									return false;
								}
								if(check)
								{
									tipOnce("错误",target.param.item_number+"是"+_c+"子件",5000);
									return false;
								}
								var check1=ERPUtils.check_item_has_child(target.param.item_number,_c);
								if(check1==null)
								{
									tipOnce("错误","检查参数失败，请重试",5000);
									return false;
								}
								if(check1)
								{
									tipOnce("错误",this.param.item_number+"已经包含"+_c+"子件",5000);
									return false;
								}
							 param = {
									 url: erp_api_service.EntRelItemItem[0]+ arguments[0].record.id,
									 method: "PATCH",
									 //data: Util.extend(arguments[0].record, arguments[0].newdata)
									 data:{n:_n,c:_c}
									 //encode:"utf-8"
							 };
							 var res = JSON.parse(bridge_map.ajax(JSON.stringify(param)));
							 if (res != null && res.status > 199 && res.status<300) {
								 var res2=ERPUtils.item_item_update_after();
							 		if(res2)
							 			tipOnce("成功","修改成功",5000);
							 		else
							 			tipOnce("刷新失败","修改成功,但是刷新失败。",5000);
//								 tipOnce("提示", "修改成功", 5000);
								 target.init_bom_grid.reload();
								 return true;
							 }
							 else {
								 tipOnce("提示", Util.formatString("修改失败，请重试[失败码:{0}]", res?res.status:null), 10000)
								 return false;
							 }
						 }
						 
					 },
					 enabledEdit: true,
					 detailToEdit: false,
					 clickToEdit: false,
					 //height:'90%',
					// tree: { columnId: 'id1' },
					 isScroll: false,//当 父容器detail: { height:'auto', 。。设置后  此参数失效 
					 showToggleColBtn: false,
					 width: '90%',
					 url:erp_api_service.EntRelItemItem[0],
					 urlFilter:function(){
			        		var op=arguments[1].options;
			        		var ps=[];
			        		var url=op.url+"?callback=?&p_item_number="+target.param.item_number;
			        		if(op.parms&&op.parms.where)
			        		{
			        			var filter=JSON.parse(op.parms.where);
			        			if(filter&&filter!="")
			        				url+="&"+change_ligerui_filter_to_python(filter);
			        		}
			        		return url;
			        	},
					// data: {Rows:tree}, 
					 showTitle: false, 
					 //enabledSort:false,//不允许排序
					 // columnWidth: 100,
					// onAfterShowData: callback,
					 rownumbers:true,
					 frozen:false
			}));  
		
		},
	/*,function(){
			
			console_info('error');
		});*/
	
	_add:function(){
		var t=this;
		return function(){
				if(t.checkData())
				{
					var data=t.init_bom_grid_add.getData();
//					var inrecord_data={
//							"count": data.actual_count,
//							"item_number": t.param.item_number,
//							"item_type": data.type,
//							"remark": data.remark,
//							"storage_name": data.storage_name,
//							"type": "入库"
//					};
//					console_info(inrecord_data);
//					console_info(inrecord_data);
//					add_info_to_iorecord(inrecord_data);
					param = {
							url: erp_api_service.EntRelItemItem[0],
							method: "POST",
							data: {
								"p_item_number":t.param.item_number,
								"c_item_number":data.c_item_number, 
								"count":  Number(data.count),
								"remark":data.remark
							}
					//encode:"utf-8"
					};
					 var res = JSON.parse(bridge_map.ajax(JSON.stringify(param)));
                     if (res != null && res.status > 199 && res.status<300) {
                    	 var res2=ERPUtils.item_item_update_after();
     			 		if(res2)
     			 			tipOnce("成功","添加子件成功",5000);
     			 		else
     			 			tipOnce("刷新失败","添加子件成功,但是刷新失败。",5000);
//                         console_info(t.param);
                         t.init_bom_grid.reload();	
//                         t.setData();
//                         if(typeof(t.param.success)=='function')
//                        {
//                        	 t.param.success();
//                        }
                     }
                     else {
//                    	  if(typeof(t.param.error)=='function')
//                          {
//                          	 t.param.error();
//                          }
                         tipOnce("提示", Util.formatString("修改失败，请重试[失败码:{0}]", res?res.status:null), 10000)
                     }
					
					//t.form.refresh();
					//t.has_finish=true;
             	 
			}
		};
	},
	setData:function()
	{
		this.form.setData({

			//item_number:this.param.item_number?this.param.item_number:null,
			type:this.param.type?this.param.type:'',
			storage_name:this.param.storage_name?this.param.storage_name:'',
//			actual_count:this.param.actual_count?this.param.actual_count:0,
			type:this.param.type?this.param.type:''
			//remark:this.param.remark?this.param.remark:''
		});
	},
	checkData:function()
	{
		var d= this.init_bom_grid_add.getData();
//		if(d.item_number==null||d.item_number=="")
//		{
//			tipOnce("错误","部品号不能为空",5000);
//			return false;
//		}	
		if(d.c_item_number==null||d.c_item_number.toString().trim()=="")
		{
			tipOnce("错误","子件不能为空",5000);
			return false;
		}
		var check=ERPUtils.check_item_has_child(d.c_item_number,this.param.item_number);
		if(check==null)
		{
			tipOnce("错误","检查参数失败，请重试",5000);
			return false;
		}
		if(check)
		{
			tipOnce("错误",this.param.item_number+"是"+d.c_item_number+"子件",5000);
			return false;
		}
		var check1=ERPUtils.check_item_has_child(this.param.item_number,d.c_item_number);
		if(check1==null)
		{
			tipOnce("错误","检查参数失败，请重试",5000);
			return false;
		}
		if(check1)
		{
			tipOnce("错误",this.param.item_number+"已经包含"+d.c_item_number+"子件",5000);
			return false;
		}
		if(d.count==null||d.count.toString()==""||d.count<=0)
		{
			tipOnce("错误","数量不能小于0",5000);
			return false;
		}	
//		if(d.actual_count==null||d.actual_count=="")
//		{
//			
//			tipOnce("错误","入库数量不能为空",5000);
//			return false;
//		}else
//		{
//			var r= /^[0-9]*[1-9][0-9]*$/ ;
//       	 	var add;
//       		if(r.test(d.actual_count)){
//       		}
//       		else{
//       			tipOnce("提示", "入库数量不准确", 5000);
//       			return false;
//       		}
//		}
//		this.param.item_number=d.item_number;
//		this.param.type=d.type;
//		this.param.storage_name=d.storage_name;
//		this.param.actual_count=d.actual_count;
//		this.param.remark=d.remark;
		return true;
	},
	delete_child:function(item)
	{
		 if (confirm('确定删除?')) {
			 	var res=ERPUtils.item_item_delete_by_p_c(this.param.item_number,item);
			 	if(res)
			 	{
			 		var res2=ERPUtils.item_item_update_after();
			 		if(res2)
			 			tipOnce("成功","删除成功",5000);
			 		else
			 			tipOnce("刷新失败","删除成功,但是刷新失败。",5000);
			 	}
			 	else
			 		tipOnce("失败","删除失败,请重试。",5000);
			 	this.init_bom_grid.reload();	
		 }
	},
	add_child:function(id)
	{
		if(this.has_init_bom_grid_add)
		{
			$('#'+this.init_bom_grid_add_id).slideToggle("slow");
		}
		else
		{
			this.has_init_bom_grid_add=true;
			this.init_bom_grid_add=$('#'+this.init_bom_grid_add_id).ligerForm({
				inputWidth: 170, labelWidth: 90, space: 40,
				fields: 
					[
					//{ display: "部品号", name: "item_number",newline: true, type: "text",editor:{type: "text",readonly:true},newline: true,width:150},//, group: "基础信息", groupicon: groupicon},
					{ display: "子件", name: "c_item_number",newline: true, type: "select",editor:{
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
						selectBoxWidth: 400 ,
				  		selectBoxHeight:300,
						valueField : 'number',
						textField : 'number',
						grid : ERPUtils.getGridOptions(),
						readonly:false},newline: true,width:150},//, group: "基础信息", groupicon: groupicon},
					{ display: "数量", name: "count",newline: true, type: "int",editor:{type: "text",readonly:false},newline: true,width:150},//, group: "基础信息", groupicon: groupicon},
					{ display: "备注", name: "remark",newline: true, type: "textarea",editor:{readonly:false},newline: true,width:200}//, group: "基础信息", groupicon: groupicon},
					//{ display: "入库数量", name: "actual_count",newline: true, type: "int",editor:{readonly:false},width:150},
					//{ display: "备注", name: "remark",newline: true, type: "textarea",editor:{readonly:false},width:150}
					]
				, buttons: [
				            { 
				            	text: '添加', width: 50,newline: false, click:this._add()
				            }
				            ]
			});
		}
	},
	beginEdit_child:function(rowid) {
		 this.init_bom_grid .beginEdit(rowid);
	},
	 cancelEdit_child:function(rowid) {
		 this.init_bom_grid  .cancelEdit(rowid);
	},
	 endEdit_child:function(rowid) {
		 this.init_bom_grid  .endEdit(rowid);
	},
	toggle:function()
	{
		$(this.param.div).slideToggle("slow");
//		$(this.param.div).toggle();
	}
});
