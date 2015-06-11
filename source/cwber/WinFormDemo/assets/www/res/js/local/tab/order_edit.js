﻿var entity_edit_model = {
    manager: null,
    //filter:null,
    menu:null,
    url_index:0,
    url:erp_api_service.EntOrder,
    top_menu:null,
    default_pages_size:15,//默认页面大小
    pages_size: [15, 30, 50,100,200],//定义分页时 页面的大小级别
    checked_record:[]
};
$(function () {
    //confirm(Util.getBrowserVersion());
	//$.getJSON( 'http://192.168.0.100/test.php?callback=?', function ( data ) { console.info(data);; } );
	/* $.ajax
		({
			url:entity_edit_model.url[entity_edit_model.url_index]+ "?limit=10&d_time__isnull=true||d_time__gt="+new Date().pattern("yyyy-MM-dd hh:mm:ss")+"&callback=?",
			dataType:"json",
			//accepts:'json',
			//async:false,
			type:"GET",
			//ccept:"application/json",
			//contentType:"application/json",
			success:function(data)
			{
				if(data.status=="success")
				{
					//Leave_approval.FinishLeaveApplyuserBaseId=data.result.userBaseId;
				}else
				{
					console.info(data);
				}
			},
			error:function()
			{
			}
			
			
		}); */
   /* var s = bridge_map.ajax(JSON.stringify({ url: entity_edit_model.url[entity_edit_model.url_index]+ "?limit=10&d_time__isnull=true||d_time__gt="+new Date().pattern("yyyy-MM-dd hh:mm:ss")}));
    //alert(s);
    if(s)
       entity_edit_model.order_edit_data = JSON.parse(JSON.parse(s).result);
    */
    //alert(JSON.stringify(JSON.parse(s).result.meta));
   // console.info(entity_edit_model.order_edit_data);
    $(f_initGrid);
});

function change(data)
{

}
//添加Grid.editors['textarea'] 
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
$.ligerDefaults.Grid.formatters['_data'] = function (num, column) {
    //num 当前的值
    //column 列信息
    if (!num) 
    	return "";
   return new Date(num.replace(/-/g,"/")).pattern("yyyy年MM月dd");
};
var select_sheet;
var excel_in_error;
function f_initGrid() {
	$("#top_menu").ligerMenuBar(
			{ items: [
			          /*{ text: '文件',
	                                    	menu: 
	                                      		{ width: 120, items:
	                                      				[
	                                      				 	{ text: '保存', click: function(){} },
	                                      				 	{ text: '列存为', click: function(){} },
	                                      				 	{ line: true },
	                                      				 	{ text: '关闭', click: function(){} }
	                                      				 	]
	                                      		} 
	                                      },*/
			          { text: '导入数据', 
			        	  menu: { width: 120, items:
			        		  [
			        		   {
			        			   text: '文件', children:
			        				   [
			        				    { text: 'Excel', click: function(){
			        				    	var _excel_info=bridge_map.get_excel_info();
			        				    	if(_excel_info)
			        				    	{
			        				    		var excel_info=JSON.parse(_excel_info);
			        				    		if(excel_info.status=="success")
			        				    		{
			        				    			var res=excel_info.result;
			        				    			var file_location=res.info;
			        				    			var _sheets=res.names;
			        				    			//alert(_sheets);
			        				    			var sheets=[];
			        				    			for(var i in _sheets)
			        				    			{
			        				    				var s=_sheets[i].replace(new RegExp(/(')/g),'');
			        				    				sheets.push({text:s,id:s});
			        				    			}
			        				    			if(!select_sheet)
			        				    				select_sheet=$("#excel_sheets").ligerComboBox({ 
			        				    					emptyText:null,
			        				    					data:sheets ,//, valueFieldID: 'test3'
			        				    					onSelected:function(value,text){
			        				    						if(value)
			        				    						{
			        				    							if(confirm('确定导入数据?'))
			        				    							{

			        				    								$.ligerDialog.waitting('正在清空缓存订单');
			        				    								setTimeout(function ()
			        				    										{
			        				    									var res1 =bridge_map.super_api(erp_api_sql.truncate_tmp_order);
			        				    									if(res1.status<200||res1.status>299)
			        				    									{
			        				    										alert("清空缓存失败！！请重试");
			        				    										//alert(JSON.stringify(res1));
			        				    										$.ligerDialog.closeWaitting();
			        				    										return ;
			        				    									}
			        				    									$.ligerDialog.closeWaitting();
			        				    									$.ligerDialog.waitting('正在导入数据,请稍候...');
			        				    									setTimeout(function ()
			        				    											{
			        				    										var res =bridge_map.import_order(
			        				    												{
			        				    													data_source:file_location,
			        				    													sql:"SELECT  * FROM ["+value+"]",
			        				    													url:erp_api_service.TmpOrder[0]
			        				    												});
			        				    										$.ligerDialog.closeWaitting();
			        				    										if(res.status=="success")
			        				    										{
			        				    											tipOnce("提示", res.message);
			        				    											excel_div.close();

			        				    											$("#excel_in_total").val(res.result.total);
			        				    											$("#excel_in_error_count").val(res.result.error);
			        				    											var map=[
			        				    											         {width:50,display:"行号"},
			        				    											         {width:80,display:"订单号"},
			        				    											         {width:50,display:"序号"},
			        				    											         {width:100,display:"订单类型"},
			        				    											         {width:80,display:"发注日期"},
			        				    											         {width:100,display:"部品号"},
			        				    											         {width:80,display:"纳期"},
			        				    											         {width:50,display:"订单数量"},
			        				    											         {width:200,display:"出错原因", align: 'left'}
			        				    											         ];
			        				    											if(!excel_in_error)
			        				    												excel_in_error =$("#excel_in_error").ligerGrid(get_default_grid_option_for_array(res.result.error_list,map));
			        				    											else{
			        				    												excel_in_error.data=get_array_data_4_grid(res.result.error_list);
			        				    												excel_in_error.reload();
			        				    											}
			        				    											$("#excel_in_error").ligerGrid(get_default_grid_option_for_array(res.result.error_list,map));
			        				    											var excel_in_error_div=$.ligerDialog.open(
			        				    													{ target: $("#excel_in_error_div"),
			        				    														height: 300,
			        				    														width:null,
			        				    														buttons: [
			        				    														          { text: '忽略错误继续导入',cls:'l-dialog-btn-highlight',onclick: function (item, dialog) {
			        				    														        	  $.ligerDialog.waitting('正在导入数据');
			        				    														        	  setTimeout(function ()
			        				    														        			  {//import_order_from_tmp
			        				    														        		  bridge_map.super_api(erp_api_sql.import_order_from_tmp);
			        				    														        		  $.ligerDialog.closeWaitting();
			        				    														        		  entity_edit_model.manager.reload();
			        				    														        			  },1000);
			        				    														        	  dialog.close(); 
			        				    														          }
			        				    														          },
			        				    														          { text: '取消导入', onclick: function (item, dialog) {
			        				    														        	  dialog.close(); 
			        				    														          }
			        				    														          }]
			        				    													});
			        				    										}
			        				    										else
			        				    										{
			        				    											tipOnce("提示", "导入的文件错误错误信息["+res.message+"]");
			        				    										}	 
			        				    										//alert(res.message);
			        				    											}, 200);
			        				    										}, 200);

			        				    								/**
			        				    								 *  provider:"Microsoft.Jet.OLEDB.4.0"
			        				    								 *  extended_properties:"Excel 8.0;HDR=Yes;IMEX=2"
			        				    								 *  data_source:            *
			        				    								 *  sql:                    *
			        				    								 */

			        				    							}

			        				    						}
			        				    						//alert(value+"|"+text);
			        				    					}
			        				    				}); 
			        				    			else
			        				    			{
			        				    				select_sheet.data=sheets;
			        				    				select_sheet.reload();
			        				    			}
			        				    			var excel_div=$.ligerDialog.open({ target: $("#excel") });
			        				    		}
			        				    		else
			        				    		{
			        				    			tipOnce("提示", "获取 导入文件错误,请检查文件是否正确.", 10000);
			        				    		} 
			        				    	}
			        				    	// entity_edit_model.manager.addEditRow();
			        				    } },
			        				    { line: true },
			        				    { text: 'XML', click: function(){} }
			        				    ]
			        		   },
			        		   ]
			        	  } 
			          }
			          ]
			});
	entity_edit_model.menu = $.ligerMenu({ top: 100, left: 100, width: 120, items:
		[
		 /*{ text: '增加', click: function(){},icon:'add' },
	        { text: '修改', click: function(){},disable:true },
	        { line: true },
	        { text: '查看', click: function(){} },
	        { text: '关闭', click: function(){} }*/
		 ]
	});
	  $("#order_edit").bind("contextmenu", function (e)
	   {
		  	entity_edit_model.menu.show({ top: e.pageY, left: e.pageX });
		    return false;
		});
    entity_edit_model.manager = $("#order_edit").ligerGrid({
    	 alternatingRow:false,
    	rowAttrRender:function(rowdata,rowid){
    		if(rowdata.status==1)
    			return "style='background-color:"+erp_colors.order_has_lead+";'";
    	},
        columns: [
        { display: '序号', name: 'id', width: 50, type: 'int' },
        {
            display: '订单号', name: 'number', width: 100,
            editor: { type: 'text', height: 60 }
        },
        {
            display: '批号', name: 'batch_number', width: 50,
            editor: { type: 'text' }
        },
        {
            display: '类型', name: 'type',  align: 'center', width: 80,
            editor: { type: 'text', height: 60 }
        },
        {
        	display: '部品', name: 'item_number', width: 120,
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
        },
        {
        	display: '替代部品', name: 'replace_item_number',  width: 120,
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
        },
        {
            display: '订单量', name: 'count',   align: 'center',type:'int' ,width: 60,
            editor: { type: 'int', height: 60 }
        },
        {
            display: '纳期', name: 'order_lead_time', type: 'date', format: 'yyyy-MM-dd',  align: 'center', width: 100,
            editor: { type: 'date',format: 'yyyy-MM-dd'}
        },
        {
             display: '发货状态', name: 'status', align: 'center',  width:100,type : 'select',
             editor: { type: 'select',emptyText: null, data:getOrderStatusArry(), valueColumnName: 'status', displayColumnName: 'name' },
      	  	 render: function (rowdata, rowindex, value) {
      		  var h='';
      		  return getOrderStatus()[value];
      	  }
        },
        {
            display: '添加时间', name: 'i_time', type: 'date', format: 'yyyy-MM-dd hh:mm:ss', width: 150
           //editor: { type: 'date' }
        },
        {
            display: '操作', isSort: false, width: 120, filter:false,render: function (rowdata, rowindex, value) {
                var h = "";
                if (!rowdata._editing) {
                    h += "<a href='javascript:beginEdit(" + rowindex + ")'>修改</a> ";
                    h += "<a href='javascript:deleteRow(" + rowindex + ")'>删除</a> ";
                }
                else {
                    h += "<a href='javascript:endEdit(" + rowindex + ")'>提交</a> ";
                    h += "<a href='javascript:cancelEdit(" + rowindex + ")'>取消</a> ";
                }
                return h;
            }
        }
        ],
        onSelectRow: function (rowdata, rowindex) {
            $("#txtrowindex").val(rowindex);
        },
        checkbox: true,
        onCheckAllRow:function(checked)
        {
        	 for (var rowid in this.records)
            {
                if(checked)
                    addChecked(this.records[rowid]['id']);
                else
                    removeChecked(this.records[rowid]['id']);
            }
        	
        },
        onCheckRow: function(checked, data)
        {
        	 if (checked) 
        		 addChecked(data.id);
             else removeChecked(data.id);
        },
        isChecked: function(rowdata)
        {
        	 if (findChecked(rowdata.id) == -1)
        		   return false;
        	return true;
        },
        onBeforeSubmitEdit:function()
        {
            var param;
            if (arguments[0].record.__status == "add") {
            	var _new=arguments[0].newdata;
            	if(_new.number==null||_new.number==''||_new.number.toString().trim()==''||_new.batch_number==null||_new.batch_number==''||_new.batch_number.toString().trim()==''||_new.order_lead_time==null||_new.order_lead_time=='')
            	{
            		tipOnce("提示", "订单信息不完整", 5000);
            		return false;
            	}
            	var count =Number(_new.count);
            	if(count==null||count<=0)
            	{
            		tipOnce("提示", "数量不能小于等于0", 5000);
            		return false;
            	}
            	var d={};
                param = {
                    url: entity_edit_model.url[entity_edit_model.url_index],
                    method: "POST",
                    data: Util.extend(Util.extend(arguments[0].record, arguments[0].newdata), { i_time: new Date().pattern("yyyy-MM-dd hh:mm:ss") })
                    //encode:"utf-8"
                };
            }
            else {
                param = {
                    url: entity_edit_model.url[entity_edit_model.url_index] + arguments[0].record.id,
                    method: "PATCH",
                    data: Util.extend(arguments[0].record, arguments[0].newdata)
                    //encode:"utf-8"
                };
            }
             
             var res = JSON.parse(bridge_map.ajax(JSON.stringify(param)));
            if (res != null && res.status > 199 && res.status<300) {
                tipOnce("提示", "修改成功", 5000);
                return true;
            }
            else {
                tipOnce("提示", Util.formatString("修改失败，请重试[失败码:{0}]", res?res.status:null), 10000)
                return false;
            }
           
           /* $.ligerDialog.confirm("提示", "确认保存？", function (t) {

                if (t)
                {
                    //验证信息

                }
                //console.info(arguments);
            });*/
            
            //return false;
        },
        onAfterSubmitEdit:function()
        {
        	entity_edit_model.manager.reload();
        },

        onBeforeCancelEdit:function()
        {
        },
        isScroll: false,
        frozen: false,
        pageSize:entity_edit_model.default_pages_size,
        pageSizeOptions:entity_edit_model.pages_size,
        enabledEdit: true,
        detailToEdit: false,
        clickToEdit: false,
        //alternatingRow: true,
        //colDraggable:true,
        url:entity_edit_model.url[entity_edit_model.url_index],
        //parms:{},
        method:"get",
        //pageParmName:
        //sortnameParmName:"order_by",
        //pagesizeParmName:"limit",
        //pageParmName:"offset",
        //sortorderParmName:
        /*data: {
            Rows:entity_edit_model.order_edit_data.objects,
            Total:entity_edit_model.order_edit_data.meta.total_count
        },*/
        urlFilter:function(){
        	var op=arguments[1].options;
        	var ps=[];
        	var url=null;
        	//console.info(op.url);
        	//console.info(op.url.match("callback"));
        	if(op.url.indexOf("callback")==-1)
        	{
        		url=op.url+"?callback=?"
        	}
        	else
        	{
        		url=op.url;
        	}
        	//url+="&d_time__isnull=true||d_time__gt="+new Date().pattern("yyyy-MM-dd hh:mm:ss");
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
        onBeforeShowData:function()
        {
        	
        },
        onAfterEdit:function(){
        	 entity_edit_model.manager.reload();
        },
        loadData:function()
        {
        },
        loadServerData:function()
        {
        },
        toolbar: { items: [
                    { text: '高级自定义查询', click: function(){
                    	//entity_edit_model.manager.options.data = $.extend(true,{}, CustomersData);
                    	
                    	//var group = filter.getData();
                    	entity_edit_model.manager.showFilter("#filter");
                    }, icon: 'search2'},
                    {
                        text: '增加', click: function () {
                           
                            entity_edit_model.manager.addEditRow();
                        }, icon: 'add'
                    },
                  /* {
                       text: '导入', click: function () {
                           bridge_map.import_order(JSON.stringify({data_source:'e:\\test.xls',sql:'select * from [3_4$]'}));
                           entity_edit_model.manager.addEditRow();
                       }, icon: 'add'
                   },*/
                    {
		         		 text: '删除查询后订单',click:function(){
		         			 if(entity_edit_model.manager.__filter==null)
		         			 {
		         				 tipOnce("提示", "查询条件不能为空,请查询后删除", 5000);
		         				 return;
		         			 }
		         			 var fData=entity_edit_model.manager.__filter.getData();
		         			 
		         			 var filter=ERPUtils.change_ligerui_filter_to_query(fData);
		         			 if(filter==null||filter.toString().trim()=='')
		         			 {
		         				 tipOnce("提示", "查询条件不能为空,请查询后删除", 5000);
		         				 return;
		         			 }
		         			 if(confirm('确定删除查询出来的订单?'))
		         			 {
		         				 //var _url=erp_api_service.VOrder[0]
		         				 var query_insert= erp_api_sql.delete_order_by_filter+' and '+filter;
		         				 var super_res=bridge_map.super_api(query_insert);
		         				 if (super_res != null && super_res.status > 199 && super_res.status < 300) {
		         					entity_edit_model.manager.reload();
		         					 tipOnce("提示", "导入成功", 5000);
		         				 }
		         				 else {
		         					entity_edit_model.manager.reload();
		         					 tipOnce("提示", "导入失败", 10000)
		         				 }
		         			 }
		         			 else
		         			 {
		         				 tipOnce("提示", "取消导入。", 5000);
		         			 }
		                    }, icon:'delete' 
		         	},
                    { line: true },
                    { text: '删除选中订单',click:function(){
                    	if(entity_edit_model.checked_record&&entity_edit_model.checked_record.length>0)
                    	{
                    		if(confirm('确定删除'+entity_edit_model.checked_record.join(',')+'?'))
                    		{
                    			var errors=[];
                    			var rights=[];
                    			if(entity_edit_model.checked_record&&entity_edit_model.checked_record.length>0)
                    			{
                    				for(var i in entity_edit_model.checked_record)
                    				{
                    					if(!deleteById(entity_edit_model.checked_record[i],true))
                    						errors.push(entity_edit_model.checked_record[i]);
                    					else
                    						rights.push(entity_edit_model.checked_record[i]);
                    				}
                    				if(errors.length>0)
                    					tipOnce("提示", Util.formatString("[{0}]删除失败", errors.join(",")), 10000);
                    				else
                    					tipOnce("提示", Util.formatString("[{0}]删除成功", rights.join(",")), 5000);
                    				entity_edit_model.checked_record=[];
                    				entity_edit_model.manager.reload();
                    			}
                    		}
                    		else
                    		{
                    			tipOnce("提示", "取消删除。", 5000);
                    		}
                    	}
                    	else
                    	{
                    		tipOnce("提示", "请选择后删除。", 5000);
                    	}
                    }, img: '../lib/ligerUI/ligerUI/skins/icons/delete.gif' }
        ]
        },
        width: '100%'
    });
    //entity_edit_model.filter = $("#filter").ligerFilter({ fields: entity_edit_model.manager.data });
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
function findChecked(id)
{
    for(var i =0;i<entity_edit_model.checked_record.length;i++)
    {
        if(entity_edit_model.checked_record[i] == id) return i;
    }
    return -1;
}
function addChecked(id)
{
    if(findChecked(id) == -1)
    	entity_edit_model.checked_record.push(id);
}
function removeChecked(id)
{
    var i = findChecked(id);
    if(i==-1) 
    	return;
    entity_edit_model.checked_record.splice(i,1);
}
function deleteRow(rowid,not_confirm) {
    if (not_confirm||confirm('确定删除?')) {
        var row = entity_edit_model.manager.getRow(rowid);
        if (row&&row.id)
        {
           var  param = {
               url: entity_edit_model.url[entity_edit_model.url_index] + row.id + "/",
                method: "DELETE"
                //data: {de}
           };
           var res = JSON.parse(bridge_map.ajax(JSON.stringify(param)));
           if (res != null && res.status > 199 && res.status < 300) {
        	   if(!not_confirm)
        		   tipOnce("提示", "删除成功", 5000);
        	  // entity_edit_model.manager.deleteRow(rowid);
        	   // return true;
           }
           else {
        	   if(!not_confirm)
        		   tipOnce("提示", Util.formatString("修改失败，请重试[失败码:{0}]", res ? res.status : null), 10000)
        	   //return false;
           }
           entity_edit_model.manager.reload();
        }
        else
        {
        	tipOnce("提示", "删除的行不存在,请刷新后重试。", 5000);
        }
    }
}
function deleteById(id,not_confirm) {
    if (not_confirm||confirm('确定删除?')) {
        //var row = entity_edit_model.manager.getRow(rowid);
        if (id)
        {
           var  param = {
               url: entity_edit_model.url[entity_edit_model.url_index] + id + "/",
                method: "DELETE"
                //data: {de}
           };
           var res = JSON.parse(bridge_map.ajax(JSON.stringify(param)));
           if (res != null && res.status > 199 && res.status < 300) {
        	   if(!not_confirm)
        		   tipOnce("提示", "删除成功", 5000);
        	   //entity_edit_model.manager.deleteRow(rowid);
        	    return true;
           }
           else {
        	   if(!not_confirm)
        		   tipOnce("提示", Util.formatString("修改失败，请重试[失败码:{0}]", res ? res.status : null), 10000)
        	   return false;
           }
        }
    }
}