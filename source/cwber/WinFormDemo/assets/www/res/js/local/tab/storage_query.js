var storage_data=[];
var entity_edit_model  = {
    manager: null,
    menu:null,
    url_index:0,
    url:erp_api_service.EntRelStorageItem,
    top_menu:null,
    checked_record:[],
    innerGrid:[],
    default_pages_size:15,//默认页面大小
    pages_size:[10, 15, 30,50,100],//定义分页时 页面的大小级别
    current_item_number:'0',
    dispaly_columns:
    	
    	[//``storage_name``item_number``actual_count``type`
    	 		{ display: '部品编号', name: 'item_number',width: 150 ,
    	            render:function(rowdata, rowindex, value){
    	            	 return "<a href=\"javascript:show_item_detail('" +value + "')\">"+value+"</a>";
    	            }
    	 		},
    	 		{
					display : '类型',
					width:100,
					name : 'type',
					editor: { type: 'select',emptyText: null, data:getStorageItemTypeArry(), valueColumnName: 'type', displayColumnName: 'name' },
					render: function (rowdata, rowindex, value) {
						 return getStorageItemTypeMap()[value];
					}
				},
    	 		{
    	 			display: '类型信息', name: 'type_info',width:100,
    	 			editor:{type:'text'}
    	 		},
    	 		{
    	 			display : '仓库位置',
    	 			name : 'storage_name',
    	 			align:'left',
    	 			width: 250,
    	 			editor:{type:'string'}
    	 		},
    	 		{ display: '库存数量', name: 'actual_count', type: 'int',width: 100,
    	 			editor:{type:'int'},
    	 			render:function (rowdata, rowindex, value)
    	 			{
    	 				if(!rowdata.actual_count)
    	 					return "0";
    	 				return rowdata.actual_count;
    	 			}
    	 		}
    	 		/*,
                {
                	width:100,
                    display: '操作', isSort: false, filter:false, render: function (rowdata, rowindex, value) {
                        var h = "";
                        if (!rowdata._editing) {

                            h += "<a href='javascript:beginEdit(" + rowindex + ",\""+entity_edit_model.current_item_number+"\")'>编辑</a> ";
                            if(rowdata.actual_count==null||rowdata.actual_count+''=='0')
                            	h += "<a href='javascript:deleteByXX(" + rowdata.id + ",\""+entity_edit_model.current_item_number+"\")'>删除</a> ";
                        }
                        else {
                            h += "<a href='javascript:endEdit(" + rowindex + ",\""+entity_edit_model.current_item_number+"\")'>提交</a> ";
                            h += "<a href='javascript:cancelEdit(" + rowindex + ",\""+entity_edit_model.current_item_number+"\")'>取消</a> ";
                        }
                        return h;
                    }
                }*/
//    	 		{
//    	 			display: '预期数量', name: "sum_future_count",width: 80,
//    	 			render:function (rowdata, rowindex, value)
//    	 			{
//    	 				if(!rowdata.sum_future_count)
//    	 					return "0";
//    	 				return rowdata.sum_future_count;
//    	 			}
//    	 		},
    	 		/*
              {
            	  display: '备注', name: 'remark',   align: 'center',type:'text'
            
              },*/
    	 		,
              {
                  display: '更新时间', name: 'u_time', type: 'date', format: 'yyyy年MM月dd hh:mm:ss', width: 150
                 //editor: { type: 'date' }
              }
              ]
};
$(function () {
    $(f_initGrid);
});

$.ligerDefaults.Grid.editors['textarea'] = {
    create: function (container, editParm) {
        var input = $("<textarea />");
        container.append(input);
        container.width('auto').height('auto');
        return input;
    },
    getValue: function (input, editParm) {
        return input.val();
    },
    setValue: function (input, value, editParm) {
        input.val(value);
    },
    resize: function (input, width, height, editParm) {
        var column = editParm.column;
        input.width(column.editor.width);
        input.height(column.editor.height);
    }
};
function f_initGrid() {
    entity_edit_model.menu = $.ligerMenu({
        top : 100,
        left : 100,
        width : 120,
        items : [] 
    });
	  $("#storage_query").bind("contextmenu", function (e)
	   {
		  	entity_edit_model.menu.show({ top: e.pageY, left: e.pageX });
		    return false;
		});
	  entity_edit_model.innerGrid[entity_edit_model.current_item_number]= entity_edit_model .manager = $("#storage_query").ligerGrid({
        columns: entity_edit_model.dispaly_columns,
        onSelectRow: function (rowdata, rowindex) {
        	//选择行操作
        },
        checkbox: false,//是否使用多选框
        isScroll: false,
        frozen: false,
        pageSize:entity_edit_model.default_pages_size,
        pageSizeOptions: entity_edit_model.pages_size,
        enabledEdit: true,
        detailToEdit: false,
        clickToEdit: false,
        url:entity_edit_model.url[entity_edit_model.url_index],
        method:"get",
        onBeforeSubmitEdit:function()
        {
            var param;
            if (arguments[0].record.__status == "add") {
//                param = {
//                    url: erp_api_service.EntRelStorageItem[0],
//                    method: "POST",
//                    data:{item_number:row.number,technology_rank:arguments[0].newdata.technology_rank,
//                   	   technology_info:arguments[0].newdata.technology_info,
//                   	   technology_id:arguments[0].newdata.technology_id,
//                   	   dimensions:arguments[0].newdata.dimensions}
//                    //encode:"utf-8"
//                };
            }
            else {
                param = {
                    url: erp_api_service.EntRelStorageItem[0]+ arguments[0].record.id,
                    method: "PATCH",
                    //data: Util.extend(arguments[0].record, arguments[0].newdata)
                    data:arguments[0].newdata
                    //encode:"utf-8"
                };
            }
             
             var res = JSON.parse(bridge_map.ajax(JSON.stringify(param)));
            if (res != null && res.status > 199 && res.status<300) {
                tipOnce("提示", "修改成功", 5000);
                entity_edit_model.innerGrid[entity_edit_model.current_item_number].reload();
                entity_edit_model .manager.reload();
                return true;
            }
            else {
                tipOnce("提示", Util.formatString("修改失败，请重试[失败码:{0}]", res?res.status:null), 10000)
                // entity_edit_model.innerGrid[entity_edit_model.current_item_number].reload();
                return false;
            }
        },
        detail: { height:'auto',onShowDetail: function (row, detailPanel,callback)
            {
            	var _data=getItemTree(row.item_number,true,function(tree){
            		var grid = document.createElement('div'); 
                    $(detailPanel).append(grid);
                    $(grid).css('margin',10).ligerGrid({
                        columns:
                        	[
                            // { display: '序号', name: 'id', width: 30, type: 'int' },
                             {
                           	  display: '子件', name: 'c', id:"id1", align: 'left',width:130
                             },
                             {
                           	  display: '层次', name: 'l', width: 40,isSort: false
                           	 // editor: { type: 'text', height: 60 }
                             },
                             {
                            	 display: '数量', name: 'n', width: 50,isSort: false,
                            	 editor: { type: 'text', height: 60 }
                             },
                             {
                            	 display: '成品库存', name: 'comp_storage', width: 80,isSort: false,
                            	 editor: { type: 'int', height: 60 }
                             },
                             {
                            	 display: '半成品库存', name: 'half_storage', width: 80,isSort: false,
                            	 editor: { type: 'int', height: 60 }
                             },
                             {
                            	 display: '预入库存', name: 'future_storage', width: 80,isSort: false,
                            	 editor: { type: 'int', height: 60 }
                             }
                             ], 
                             onSelectRow: function (rowdata, rowindex) {
                            	 item_NO=rowdata.c;
             					init_item_storage(rowdata.c);
             					show_item_storage_text(rowdata.c);
             					select._toggleSelectBox(true);
             		        },
                             enabledEdit: true,
                             detailToEdit: false,
                             clickToEdit: false,
                             //height:'90%',
                             tree: { columnId: 'id1' },
                             isScroll: false,//当 父容器detail: { height:'auto', 。。设置后  此参数失效 
                             showToggleColBtn: false,
                             width: '95%',
                             data: {Rows:tree}, 
                             showTitle: false, 
                             pageSize:30,
                             //enabledSort:false,//不允许排序
                            // columnWidth: 100,
                             onAfterShowData: callback,
                             rownumbers:true,
                             frozen:false
                    });  
            	}) ;
                
            }
		},
		/*detail : {
			height : 'auto',
			onShowDetail : function(row, detailPanel,
					callback) {
				entity_edit_model.current_item_number=row.item_number;
				var grid = document
						.createElement('div');
				$(detailPanel).append(grid);
				entity_edit_model.innerGrid[entity_edit_model.current_item_number]=$(grid)
						.css('margin', 10)
						.ligerGrid(
								ERPUtils
										.get_default_grid_option_for_url({
											url:erp_api_service.EntRelStorageItem[0]+"?item_number="+entity_edit_model.current_item_number+"&actual_count__isnull=false&future_count__isnull=true",
											width:"95%",
											height:270,
											isScoll:true,
											columns: [
												{
													width:80,
													display : '库存',
													type:'int',
													name : 'actual_count',
													editor:{type:'int'}
												},
												{
													display : '类型',
													width:80,
													name : 'type',
													editor:{type:'text'}
												},
												{
													width:100,
													display : '仓库位置',
													name : 'storage_name',
													type:'text',
													editor:{type:'text'}
												},
//												,
//												{ display: '增加库存数量', name: 'add_count',
//													width:100,
//													editor: { type: 'int'},
//													render: function (rowdata, rowindex, value) {
//							                  		  return "<input id='add_count"+rowindex+"' type='text' style='width:80px'/>";
//							                  	  }
//							                    },
//												{ display: '入库备注', name: 'add_remark', align: 'right', 
//							                    	width:200,
//													editor: { type: 'text'},
//													render: function (rowdata, rowindex, value) {
//								                  		  return "<input id='add_remark"+rowindex+"' type='text' style='width:170px'/>";
//								                  	  }
//							                    },
							                    {
							                    	width:100,
							                        display: '操作', isSort: false, filter:false, render: function (rowdata, rowindex, value) {
							                            var h = "";
							                            if (!rowdata._editing) {

							                                h += "<a href='javascript:beginEdit(" + rowindex + ",\""+entity_edit_model.current_item_number+"\")'>编辑</a> ";
							                                if(rowdata.actual_count==null||rowdata.actual_count+''=='0')
							                                	h += "<a href='javascript:deleteByXX(" + rowdata.id + ",\""+entity_edit_model.current_item_number+"\")'>删除</a> ";
							                            }
							                            else {
							                                h += "<a href='javascript:endEdit(" + rowindex + ",\""+entity_edit_model.current_item_number+"\")'>提交</a> ";
							                                h += "<a href='javascript:cancelEdit(" + rowindex + ",\""+entity_edit_model.current_item_number+"\")'>取消</a> ";
							                            }
							                            return h;
							                        }
							                    }
												],
												 onBeforeSubmitEdit:function()
							                     {
						                             var param;
						                             if (arguments[0].record.__status == "add") {
//						                                 param = {
//						                                     url: erp_api_service.EntRelStorageItem[0],
//						                                     method: "POST",
//						                                     data:{item_number:row.number,technology_rank:arguments[0].newdata.technology_rank,
//						                                    	   technology_info:arguments[0].newdata.technology_info,
//						                                    	   technology_id:arguments[0].newdata.technology_id,
//						                                    	   dimensions:arguments[0].newdata.dimensions}
//						                                     //encode:"utf-8"
//						                                 };
						                             }
						                             else {
						                                 param = {
						                                     url: erp_api_service.EntRelStorageItem[0]+ arguments[0].record.id,
						                                     method: "PATCH",
						                                     //data: Util.extend(arguments[0].record, arguments[0].newdata)
						                                     data:arguments[0].newdata
						                                     //encode:"utf-8"
						                                 };
						                             }
						                              
						                              var res = JSON.parse(bridge_map.ajax(JSON.stringify(param)));
						                             if (res != null && res.status > 199 && res.status<300) {
						                                 tipOnce("提示", "修改成功", 5000);
						                                 entity_edit_model.innerGrid[entity_edit_model.current_item_number].reload();
						                                 entity_edit_model .manager.reload();
						                                 return true;
						                             }
						                             else {
						                                 tipOnce("提示", Util.formatString("修改失败，请重试[失败码:{0}]", res?res.status:null), 10000)
						                                 // entity_edit_model.innerGrid[entity_edit_model.current_item_number].reload();
						                                 return false;
						                             }
						                         },
//												,
//												 toolbar: { items: [
//												                    
//												                    	{
//												                        text: '添加新库位', click: function () {
//												                        	if(!global_model.storage_add)
//												                        		global_model.storage_add =new erp_storage_add({div:'add_storage',item_number:item_NO,
//													                        		success:function(){
//													                        			 storage_item_grid.reload();
//													                                     item_info.refresh();
//													                        		},error:function(){
//													                        			
//													                        		}
//												                        		});
//												                        	else
//												                        	{
//												                        		global_model.storage_add.toggle();
//												                        	}
////												                        	add_storage
////												                        	storage_item_grid.addEditRow();
//												                        }, icon: 'add'
//												                    	}
//												                    ]
//												 	},
												 	enabledEdit: true, 
												 	checkbox:false,
												 	clickToEdit: false,
												 	rownumbers:true
										}));
			}
		},*/
        urlFilter:function(){
        	var op=arguments[1].options;
        	var ps=[];
        	//var url=op.url+"?callback=?";//+'&d_time__isnull=true||d_time__gt="+new Date().pattern("yyyy-MM-dd hh:mm:ss");
        	var url=op.url+"?callback=?"+"&actual_count__isnull=false&future_count__isnull=true";//+'&d_time__isnull=true||d_time__gt="+new Date().pattern("yyyy-MM-dd hh:mm:ss");
        	if(op.parms&&op.parms.where)
        	{
        		var filter=JSON.parse(op.parms.where);
        		if(filter&&filter!="")
        			url+="&"+change_ligerui_filter_to_python(filter);
        	}
        	return url;
        	
        },
        paramFilter:function(){
        	var op=arguments[1].options;
        	var ps=[];
    		var page=op.newPage;
    		var pageSize=op.pageSize;
    		var sortOrder=op.sortOrder=="asc"?"":"-";
        	if(op.sortName)
        		ps.push({name:"order_by",value:sortOrder+op.sortName});
        	ps.push({name:"offset",value:(page-1)*pageSize});
        	ps.push({name:"limit",value:pageSize});
        	return ps;
        },
        onSuccess:function()
        {
        	arguments[0].Rows=arguments[0].objects;
        	arguments[0].Total=arguments[0].meta.total_count;
        },
        toolbar: { items: [
                    { text: '高级自定义查询', click: function(){
                    	entity_edit_model .manager.showFilter("#filter");
                    }, icon: 'search2'}
                    ,
                    { line: true },
                    {
	                     text : '导出Excel',
	                     click : function() {
	                    	 if(!entity_edit_model.export_excel)
	                    	{
	                    		 entity_edit_model.export_excel =new  erp_export({
	                    			 div:'storage_export',
	                    			 //query:'SELECT `id`,`orderID`, `componentID`, `p`,`c`,`orderRequirement`,`splitRequirement`,`otherRequirement`,`defectRequirement`,`actualStorage`,`futureStorage`,`usedStorage`,`fromStorage`,`fromProduct`,`n_full_rel`, `nl_full_rel`,`l_full_rel` ,`order_lead_time_string` FROM `erp`.`tmp_order_analysis`',
	                    			 fields:entity_edit_model.dispaly_columns,
	                    			 table_name:'ent_rel_storage_item',
	                    			 file_path:null,
	                    			 file_name:null,
	                    			 charset:'utf-8',
	                    			 headers:null
	                    		 });
	                    	}else
	                    	{
	                    		entity_edit_model.export_excel.toggle();
	                    	}
	                    	 	/*$.ligerDialog.open(
	                    				{ 	
	                    					title:'导出excel',
	                    					target: $('#"order_analysis_export_div"'),
	                    					isResize:true,
	                    					height: 400,
	                    					width:500,
	                    					buttons: [
	                    					          { text: '确定',cls:'l-dialog-btn-highlight',onclick:this.param.ok!=null&&typeof(this.param.ok)=='function'?this.param.ok: function (item, dialog) {
	                    					        	  dialog.hidden(); 
	                    					          	}
	                    					          }
	                    					          ]
	                    				});*/
	                         },
	                     icon : 'refresh'
	                 }
                 
        ]
        },
        width: '100%'
    });
}
function beginEdit(rowid,itemId) {
	//entity_edit_model.innerGrid[entity_edit_model.current_item_number].reload();
	entity_edit_model.current_item_number=itemId;
	entity_edit_model.innerGrid[entity_edit_model.current_item_number].beginEdit(rowid);
}
function cancelEdit(rowid,itemId) {
	entity_edit_model.current_item_number=itemId;
	entity_edit_model.innerGrid[entity_edit_model.current_item_number].cancelEdit(rowid);
	entity_edit_model.innerGrid[entity_edit_model.current_item_number].reload();
}
function endEdit(rowid,itemId) {
	entity_edit_model.current_item_number=itemId;
	entity_edit_model.innerGrid[entity_edit_model.current_item_number].endEdit(rowid);
	entity_edit_model.innerGrid[entity_edit_model.current_item_number].reload();
}
function deleteByXX(id,current_item_number) {
    if (confirm('确定删除?')) {
    	if(ERPUtils.deleteEntityById(id,erp_api_service.EntRelStorageItem[0]))
    		tipOnce("提示", "删除成功", 10000)
    	else
    		tipOnce("提示", "删除失败，请重试.", 10000)
           entity_edit_model.innerGrid[entity_edit_model.current_item_number].reload();
        }
        
}