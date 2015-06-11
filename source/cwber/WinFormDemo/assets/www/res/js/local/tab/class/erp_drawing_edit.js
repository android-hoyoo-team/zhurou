var erp_drawing_edit=Class({
	_id:{index:0},
	_objs:{},
	init_drawing_grid:null,
	init_drawing_grid_id:null,
	init_drawing_grid_add:null,
	init_drawing_grid_add_id:null,
	initialize:function()
	{
		
		this.param={
				div:'',
				item_number:null
				};
		if(!arguments[0])
		{
			tipOnce('错误','请刷新重试。');
			throw new Error("erp_drawing_edit参数错误。");
		}
		if(!arguments[0]['item_number'])
		{
			tipOnce('错误','item_number不存在。');
			throw new Error("erp_drawing_edit参数错误。");
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
		this.id=this._id.index;
		window['__erp_drawing_edit'+this.id]=this;
		$(this.param.div).empty();
		this.init_drawing_grid_id="init_drawing_grid_id"+this.id;
		this.init_drawing_grid_add_id="init_drawing_grid_add_id"+this.id;
		$(this.param.div).append($("<div id='"+this.init_drawing_grid_add_id+"'></div>"));
		$(this.param.div).append($("<div id='"+this.init_drawing_grid_id+"'></div>"));
		this.init_drawing_grid();
		//arguments;
	},
	init_drawing_grid:function()
	{
		var target=this;
		//getItemTree(this.param.item_number,true,function(tree){
			target.init_drawing_grid=$('#'+target.init_drawing_grid_id).ligerGrid(
					 ERPUtils.get_default_grid_option_for_url({
				toolbar: { items: [
				                    {
				                        text: '增加', click: function () {
				                        	window["__erp_drawing_edit"+target.id].add_child();
				                        }, icon: 'add'
				                    },
//				                    { line: true },
//				                    {
//				                    	text: '刷新结构', click: function () {
//				                    		var res2=ERPUtils.item_item_update_after();
//				        			 		if(res2)
//				        			 			tipOnce("成功","刷新成功",5000);
//				        			 		else
//				        			 			tipOnce("失败","刷新失败。请重试",5000);
//				        			 		target.init_drawing_grid.reload();
//				                    	}, icon: 'refresh'
//				                    },
				                    { line: true }
				        ]
				        },
				columns:
					[

					 {
						 display : '图',
						 name : 'name',
						 width : 150,
						 editor:{type : 'file'},
			        	  render: function(rowdata, index, value){
			        		  
			        		  var h="";
			        		  if(rowdata.type==2)
			        		  {
			        			  var name=rowdata.name;
			        			  var location=rowdata.location;
			        			  if(name)
			        			  {
			        				  if(location==null)
			        					  location='';
			        				  h += "<img height='50px' src='"+erp_file_service_upload+"/"+location+"/"+name+"'></img> ";
			        			  }
			        		  }
			        		  else if(rowdata.type==1)
		            		  {
			        			  var name=rowdata.name;
			        			  var location=rowdata.location;
		            			  if(name)
		            			  {
		            				  if(location==null)
		            					  location='';
		            				  // h += "<img src='"+erp_file_service_upload+"/"+location+"/"+name+"'></a> ";
		            				  h += "<a href='javascript: ERPUtils.downloadAndOpen(\"" + name + "\")'>图纸</a> ";
		            			  }
		            		  }
			             	  return h;
			              }
					 },
					 {
						 display : '类型',
						 name : 'type',
						 width : 150,
						 type:'text',
						 render:function (item)
                         {
							 return getDrawingTypeMap()[item.type];
                         }
//						 editor:{type : 'text'}
					 },
//					 {
//						 display : '位置',
//						 name : 'location',
//						 width : 150,
//						 editor:{type : 'text'}
//					 },
////					 {
//					 display : '是否使用',
//					 name : 'disable',
//					 width : 150,
//					 editor:{type : 'string'}
//					 },
					 {
						 display : '添加时间',
						 name : 'i_time',
						 type : 'date',
						 format : 'yyyy-MM-dd hh:mm:ss',
						 width : 150
					 }, 
					 {
						 display : '更改时间',
						 name : 'u_time',
						 type : 'date',
						 format : 'yyyy-MM-dd hh:mm:ss',
						 width : 150
					 },
					 {
						 display: '操作', isSort: false, filter:false,
						 width : 100,
						 render: function (rowdata, rowindex, value)
						 {
							 var h = "";
							 if (!rowdata._editing) {
								 h += "<a href='javascript:window.__erp_drawing_edit"+target.id+".delete_child(" + rowdata.id + ")'>删除</a> ";
							 }
							 else {
								 h += "<a href='javascript:endEdit(" + rowindex + ","+current_id+")'>提交</a> ";
								 h += "<a href='javascript:cancelEdit(" + rowindex + ","+current_id+")'>取消</a> ";
							 }
							 return h;
						 }
					 }
					 ], 
					 onBeforeSubmitEdit:function()
					 {},
					 enabledEdit: true,
					 detailToEdit: false,
					 clickToEdit: false,
					 //height:'90%',
					// tree: { columnId: 'id1' },
					 isScroll: false,//当 父容器detail: { height:'auto', 。。设置后  此参数失效 
					 showToggleColBtn: false,
					 width: '90%',
					 url:erp_api_service.EntRelItemDrawing[0],
					 urlFilter:function(){
			        		var op=arguments[1].options;
			        		var ps=[];
			        		var url=op.url+"?callback=?&item_number="+target.param.item_number;
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
	__add:function(){
		var t=this;
		return function(){
				if(t.checkData())
				{
					var data=t.init_drawing_grid_add.getData();
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
					var d= t.init_drawing_grid_add.getData();
					var file_name=t.param.item_number+"."+d.name.substring(d.name.indexOf('.')+1);
					param = {
							url: erp_api_service.EntRelItemDrawing[0],
							method: "POST",
							data: {
								"item_number":t.param.item_number,
								"type":d.type, 
								"name":file_name,
								location:d.type==2?"1":null,
								"remark":d.remark
							}
					//encode:"utf-8"
					};
//					console_info(param);
					var upload ;
					if(d.type==2)
						upload = bridge_map.uploadFileByDir( erp_file_service_upload, d.name,file_name ,"1");
					else 
						upload = bridge_map.uploadFile( erp_file_service_upload, d.name,file_name );
						
//					console_info(upload);
					
					 var res = bridge_map.ajax_auto(param);
                     if (res != null && res.status > 199 && res.status<300) {
                    	 var res2=ERPUtils.item_item_update_after();
     			 			tipOnce("成功","添加图纸成功",5000);
//                         console_info(t.param);
                         t.init_drawing_grid.reload();	
                     }
                     else {
//                    	  if(typeof(t.param.error)=='function')
//                          {
//                          	 t.param.error();
//                          }
                         tipOnce("提示", Util.formatString("添加失败，请重试[失败码:{0}]", res?res.status:null), 10000)
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
		var d= this.init_drawing_grid_add.getData();
//		if(d.item_number==null||d.item_number=="")
//		{
//			tipOnce("错误","部品号不能为空",5000);
//			return false;
//		}	
		if(d.type==null||d.type.toString().trim()=="")
		{
			tipOnce("错误","图纸类型不能为空",5000);
			return false;
		}
		if(d.name==null||d.name.toString().trim()=="")
		{
			tipOnce("错误","没有选择图纸",5000);
			return false;
		}
		return true;
	},
	delete_child:function(item)
	{
		 if (confirm('确定删除?')) {
			    	if(ERPUtils.deleteEntityById(item,erp_api_service.EntRelItemDrawing[0]))
			    	{
			    		tipOnce("提示", "删除成功", 10000)
			    		this.init_drawing_grid.reload();	
			    	}
			    	else
			    		tipOnce("提示", "删除失败，请重试.", 10000)
		 }
	},
	add_child:function(id)
	{
		if(this.has_init_drawing_grid_add)
		{
			$('#'+this.init_drawing_grid_add_id).slideToggle("slow");
		}
		else
		{
			this.has_init_drawing_grid_add=true;
			this.init_drawing_grid_add=$('#'+this.init_drawing_grid_add_id).ligerForm({
				inputWidth: 170, labelWidth: 90, space: 40,
				fields: 
					[
					//{ display: "部品号", name: "item_number",newline: true, type: "text",editor:{type: "text",readonly:true},newline: true,width:150},//, group: "基础信息", groupicon: groupicon},
					{ display: "类型", name: "type",newline: true, type: "select",editor:{
			        	type : 'select',
						valueField : 'type',
						textField : 'name',
						emptyText: null, 
						data: getDrawingTypeArry(),
						readonly:false},newline: true,width:150},//, group: "基础信息", groupicon: groupicon},
					{ display: "图片", name: "name",newline: true, type: "file",editor:{type: "file",readonly:false,options:{filter:"图片/PDF|*.jpg;*.png;*.jpeg;*.bmp;*.pdf",max_size:10*1024*1024, min_size:0}},newline: true,width:150},//, group: "基础信息", groupicon: groupicon},
					{ display: "备注", name: "remark",newline: true, type: "textarea",editor:{readonly:false},newline: true,width:200}//, group: "基础信息", groupicon: groupicon},
					//{ display: "入库数量", name: "actual_count",newline: true, type: "int",editor:{readonly:false},width:150},
					//{ display: "备注", name: "remark",newline: true, type: "textarea",editor:{readonly:false},width:150}
					]
				, buttons: [
				            { 
				            	text: '添加', width: 50,newline: false, click:this.__add()
				            }
				            ]
			});
		}
	},
	beginEdit_child:function(rowid) {
		 this.init_drawing_grid .beginEdit(rowid);
	},
	 cancelEdit_child:function(rowid) {
		 this.init_drawing_grid  .cancelEdit(rowid);
	},
	 endEdit_child:function(rowid) {
		 this.init_drawing_grid  .endEdit(rowid);
	},
	toggle:function()
	{
		$(this.param.div).slideToggle("slow");
//		$(this.param.div).toggle();
	}
});
