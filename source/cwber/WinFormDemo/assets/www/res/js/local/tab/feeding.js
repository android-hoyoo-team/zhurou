var entity_edit_model = {
    menu : null,
    url_view_index : 0,
    url_view : erp_api_service.VFeedingTracking,
    url_ent_index : 0,
    url_ent : erp_api_service.EntFeeding,
    top_menu : null,
    default_pages_size : 15,// 默认页面大小
    pages_size : [ 10, 15, 30, 50, 100 ],// 定义分页时 页面的大小级别
    innerGrid : [],
    dispaly_columns : [ {
        display : '投料单号',
        name : 'id',
        filter : false,
        width : 80,
        type : 'int'
    },{
        display : '部品编号',
        name : 'item_number',
         width : 150,
        type : 'select',
        render:function(rowdata, rowindex, value){
       	 return "<a href=\"javascript:show_item_detail('" +value + "')\">"+value+"</a>";
       },
        editor : {
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
    }, {
        display : '投料数',
        name : 'feeding_count',
        editor: { type: 'int'},
        render:function(rowdata, rowindex, value){
          	 return "<a href=\"javascript:ERPUtils.show_item_feeding_tracking('" +rowdata.item_number + "')\">"+value+"</a>";
        },
        type:'int',
        width : 80
    }, {
        display : '投料日期',
        name : 'feeding_date',
        editor: { type: 'date',format : 'yyyy-MM-dd hh:mm:ss',options:{showTime:true}},
        width : 150,
        type : 'date',
        format : 'yyyy-MM-dd hh:mm:ss'
    },
    {
        display : '预计入库时间',
        name : 'plan_storage_time',
        editor: { type: 'date',format : 'yyyy-MM-dd'},
        width : 100,
        type : 'date',
        format : 'yyyy-MM-dd'
    }
 , {
        display : '备注',
        name : 'remark',
        width : 150,
        type : 'string',
        editor: { type: 'string'}
    }, {
        display: '操作', isSort: false, width: 120, filter:false, isSort: false,
        render: function (rowdata, rowindex, value) {
            var h = "";
            if (rowdata._editing) {
            	h += "<a href='javascript:endEdit(" + rowindex + ")'>提交</a> ";
    			h += "<a href='javascript:cancelEdit(" + rowindex + ")'>取消</a> ";
            }
            if(!rowdata.actual_storage_time)
            {
            	if(rowdata.feeding_status_now>0)//正在生产
    			{
    				if(rowdata.feeding_status_all==rowdata.feeding_status_now)//可以入库
    					return "等待入库";
    				else//在生产中
    					return "在生产中";
    					
    			}
            	else if(rowdata.feeding_status_now==0)
            	{
            		h += "<a href='javascript:deleteRow(" + rowindex + ")'>删除</a> ";
            	}
            }	
            else
            {
            	h+='已入库';
            }
            return h;
        }
    } ]
};
function refresh_grid()
{
	if(entity_edit_model.manager)
	{
		entity_edit_model.manager.reload();
	}
	else
	{
		f_initGrid();
	}
}
$(function() {
	refresh_grid();
//	entity_edit_model.timerTask=new TimerTask();
//	entity_edit_model.timerTask.setTask(1,function(){
//		entity_edit_model.manager.reload();
//	},null,erp_refresh_interval,0);
//	entity_edit_model.timerTask.runTask(1,erp_refresh_interval);
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
    // 添加顶层菜单栏
    $("#top_menu").ligerMenuBar({
        items : [ {
            text : '文件',
            menu : {
                width : 120,
                items : [ {
                    text : '保存',
                    click : function() {
                    }
                }, {
                    text : '列存为',
                    click : function() {
                    }
                }, {
                    line : true
                }, {
                    text : '关闭',
                    click : function() {
                    }
                } ]
            }
        } ]
    });
    // 鼠标右键
    entity_edit_model.menu = $.ligerMenu({
        top : 100,
        left : 100,
        width : 120,
        items : []
    });
    $("#item").bind("contextmenu", function(e) {
        entity_edit_model.menu.show({
            top : e.pageY,
            left : e.pageX
        });
        return false;
    });
    entity_edit_model.manager = $("#item").ligerGrid(
        ERPUtils.get_default_grid_option_for_url({
        rowAttrRender:ERPUtils.feeding_row_attr_render,
        url : entity_edit_model.url_view[entity_edit_model.url_view_index],
        columns : entity_edit_model.dispaly_columns,
        toolbar : {
        items : [
                 {
                     text : '高级自定义查询',
                     click : function() {
                         entity_edit_model.manager.showFilter("#filter");
                         },
                     icon : 'search2'
                 },
                 { line : true },
                 {
                     text : '添加投料单',
                     click : function() {
                    	 if(entity_edit_model.erp_feeding_div)
                    	 {
                    		 entity_edit_model.erp_feeding_div.toggle();
                    	 }
                    	 else
                    	 {
                    		 entity_edit_model.erp_feeding_div=new erp_feeding_div({
                    			 open_div:'add_feed',
                    			 feeding_success:function(){
                    				 entity_edit_model.manager.reload();
                    			 },
                    			 feeding_error:function(){
                    				 entity_edit_model.manager.reload();
                    			 }}); 
                    	 }
                    	 //entity_edit_model.manager.addEditRow();
                     },
                     icon: 'add'
                 },
                 { line: true },
                 {
                	 text : '导出Excel',
                	 click : function() {
                		 if(entity_edit_model.manager.__filter==null)
	         			 {
	         				 tipOnce("提示", "查询条件不能为空,请查询后导出", 5000);
	         				 return;
	         			 }
                		 if(!entity_edit_model.lead_export_excel)
                		 {
                			 entity_edit_model.lead_export_excel =new  erp_export({
                				 div:'feeding_export_excel',
                				// other_query:' and forecast=0',
                				 //query:'SELECT `id`,`orderID`, `componentID`, `p`,`c`,`orderRequirement`,`splitRequirement`,`otherRequirement`,`defectRequirement`,`actualStorage`,`futureStorage`,`usedStorage`,`fromStorage`,`fromProduct`,`n_full_rel`, `nl_full_rel`,`l_full_rel` ,`order_lead_time_string` FROM `erp`.`tmp_order_analysis`',
                				 grid:entity_edit_model.manager,
                				 table_name:'v_feeding_tracking',
                				 file_path:null,
                				 file_name:null,
                				 charset:'utf-8',
                				 headers:null
                			 });
                		 }else
                		 {
                			 entity_edit_model.lead_export_excel.toggle();
                		 }
                	 },
                	 icon : 'attibutes'

                 },
                 { line: true },
                 {
                     text : '刷新',
                     click : function() {
                    	 refresh_grid();
                         },
                     icon : 'refresh'
                 },
                 { line: true },
                 {
                     text : '便捷投料',
                     click : function() {
                    	 ERPUtils.item_select_feeding();
                         },
                         img: '../lib/ligerUI/ligerUI/skins/icons/basket.png'
                 }
                 ]
        },
        onBeforeSubmitEdit:function()
        {
            var param;
            if (arguments[0].record.__status == "add") {
            	var item_number=arguments[0].newdata.item_number;
            	if(!item_number)
            	{
            		tipOnce("错误","部品号不能为空！",5000);
            		return false;
            	}
            	var feeding_count=arguments[0].newdata.feeding_count;
            	if(!feeding_count||!Number(feeding_count))
            	{
            		tipOnce("错误","投料数量不能小于等于0！",5000);
            		return false;
            	}	
            	var feeding_date=arguments[0].newdata.feeding_date;
            	if(!feeding_date)
            	{
            		feeding_date=new Date().toString(true);
            	}
            	var plan_storage_time=arguments[0].newdata.plan_storage_time;
            	if(!plan_storage_time)
            	{
            		tipOnce("错误","预计入库时间不能为空！",5000);
            		return false;
            		//plan_storage_time=new Date().toString(true);
            	}
            	
//                param = {
//                    url: entity_edit_model.url_ent[entity_edit_model.url_ent_index],
//                    method: "POST",
//                    data: {"feeding_date":feeding_date,"feeding_count":feeding_count,"item_number":item_number,plan_storage_time:plan_storage_time}
//                };
                return  ERPUtils.feeding_and_tracking(
                		{
                			"feeding_date":feeding_date,
                			"feeding_count":feeding_count,
                			"item_number":item_number,
                			plan_storage_time:plan_storage_time,
                			remark:arguments[0].newdata.remark
                		}
                );
            }
            else {
                /*param = {
                    url: entity_edit_model.url_ent[entity_edit_model.url_ent_index] + 
                    								arguments[0].record.id,
                    method: "PATCH",
                    data:arguments[0].newdata
                };
                var res = JSON.parse(bridge_map.ajax(JSON.stringify(param)));
                if (res != null && res.status > 199 && res.status<300) {
                	tipOnce("提示", "添加成功",5000);
                	return true;
                }
                else {
                    tipOnce("提示", Util.formatString("添加失败，请重试[失败码:{0}]", res?res.status:null), 10000);
                    return false;
                }*/
            }
           
        },
        onAfterSubmitEdit:function()
        {
        	entity_edit_model.manager.reload();
        },
        onBeforeCancelEdit:function()
        {
        },
        isScroll : false,
        width : '100%',
        checkbox: false,
        allowHideColumn:true,
        // rownumbers:true,
        colDraggable:false,
        rowDraggable:false,
        // rownumbers:true,
        frozen: false,
        pageSize:entity_edit_model.default_pages_size,
        pageSizeOptions: entity_edit_model.pages_size,
        enabledEdit: true,
        detailToEdit: false,
        clickToEdit: false,
        // url:entity_edit_model.url[entity_edit_model.url_index],
        method:"get",
        urlFilter:function(){
        	var op=arguments[1].options;
        	var ps=[];
        	var url=op.url+"?callback=?";
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
        }
        }));
}
function beginEdit(rowid) {
    entity_edit_model.manager.beginEdit(rowid);
}
function cancelEdit(rowid) {
    entity_edit_model.manager.cancelEdit(rowid);
}
function endEdit(rowid) {
    entity_edit_model.manager.endEdit(rowid);
}
function deleteRow(rowid,not_confirm) {
	if (not_confirm||confirm('确定删除?')) {
		var row = entity_edit_model.manager.getRow(rowid);
        if (row&&row.id)
        {
        	//var param = {
        	//		url: entity_edit_model.url_ent[entity_edit_model.url_ent_index] + row.id + "/",
        	//		method: "DELETE"
        	//};
        	//var res = JSON.parse(bridge_map.ajax(JSON.stringify(param)));
        	var args=arguments;
        	var feeding_delete_res;
        	feeding_delete_res =(bridge_map.super_api(
        			Util.formatString(erp_api_sql.procedure_feeding_delete, row.id)));
        	if (feeding_delete_res.status!= null && feeding_delete_res.status > 199 && feeding_delete_res.status <300){
        		tipOnce("提示", "删除成功",5000);
	        	entity_edit_model.manager.reload();
        	}
        	else{
                tipOnce("提示", Util.formatString("删除失败，请重试[失败码:{0}]"), 10000);
            	entity_edit_model.manager.reload();
        	}
        }
    }
}


var select;