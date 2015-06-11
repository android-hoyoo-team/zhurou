var materia_data=[];
var entity_edit_model  = {
    manager: null,
    grid_div:'#order_can_lead',
    filter_div:'#order_can_lead_filter',
    key:'id',
    menu:null,
    url_index:0,
    url:erp_api_service.VOrderAnalysis2,
    top_menu:null,
    checked_record:[],
    erp_storage_out:null,
    default_pages_size:15,//默认页面大小
    pages_size:[10, 15, 30,50,100],//定义分页时 页面的大小级别
    width:'95%',
    dispaly_columns: [
         /* { display: '序号', name: 'order_id', width: 50, type: 'int' },*/
          {
              display: '订单号', name: 'order_number', width: 100,
              editor: { type: 'text', height: 60 }
          },
          {
              display: '订单项', name: 'order_batch_number', width: 50,
              editor: { type: 'text' }
          },
          {
              display: '部品', name: 't',  align: 'center',width: 150,
              editor: { type: 'text', height: 60 },
              render: function (rowdata, rowindex, value) {
        		  //row,
        		  return "<a href=\"javascript:show_item_detail('" +value + "')\">"+value+"</a>";
        		  //return "";
        	  }
          },
          {
              display: '订单量', name: 'order_requirement',   align: 'center',type:'int' ,width: 60,
              editor: { type: 'int', height: 60 }
          },
          {
              display: '纳期', name: 'order_lead_time', type: 'date', format: 'yyyy年MM月dd',  align: 'center',width: 100,
              editor: { type: 'date',format: 'yyyy-MM-dd'}
          },
          {
              display: '库存', name: 'actual_storage',  align: 'center', width: 80,
              editor: { type: 'int', height: 60 }
          },
          {
              display: '预入库存', name: 'future_storage',  align: 'center', width: 80,
              editor: { type: 'int', height: 60 }
          },
          {
              display: '可发货状态', name: 'forecast',filter:false,  align: 'center',  width:100,
              editor: { type: 'select',emptyText: null, data:getOrderLeadStatusArry(), valueColumnName: 'forecast', displayColumnName: 'name' },
        	  render: function (rowdata, rowindex, value) {
        		  var h='';
        		  //{forecast:0,name:"可直接发货"},{forecast:1,name:"预期可发货（在生产中）"},{forecast:2,name:"需要生产"}];
//        		  console_info(value);
        		  if(value+''=='0')
        			  return "<a href='javascript:order_lead_from_storage(" + rowdata.order_id + ",\""+rowdata.t+"\","+rowdata.order_requirement+")'>发货</a> ";
        			  
        		  return getOrderLeadStatus()[value];
        	  }
          }
     ]
    	
};
function order_lead_from_storage(order_id ,item,order_requirement)
{
	entity_edit_model.erp_storage_out =new erp_storage_out(
		{
		open_div:'order_lead_from_storage',
		item_number:item,
		type:'订单出库',
		count:order_requirement,
		name:'entity_edit_model.erp_storage_out',
		success:function(){
			
			param = {
					url: erp_api_service.EntOrder[0] + order_id,
					method: "PATCH",
					//data: Util.extend(arguments[0].record, arguments[0].newdata)
					data:{status:1}
					//encode:"utf-8"
			};
			var res = JSON.parse(bridge_map.ajax(JSON.stringify(param)));
			if (res != null && res.status > 199 && res.status<300) {
				var del=ERPUtils.deleteEntityById(order_id,erp_api_service.TmpOrderFilter[0]);
				if(del)
				{
					tipOnce("提示", "订单已发货", 5000);
				}
				entity_edit_model.manager.reload();
			}
			else {
				tipOnce("提示", Util.formatString("修改失败，请重试[失败码:{0}]", res?res.status:null), 10000)
				entity_edit_model.manager.reload();
			}
		},
		error:function(){
			
		},
		ok:null,
		cancle:null});
}
function refresh_grid()
{
	var res;
	dialogWait("正在统计订单，稍后......",function(){
		res =bridge_map.super_api(Util.formatString(erp_api_sql.procedure_sp_order_analysis,0,1,0,0));
		
		if(res&&res.status>199&&res.status<300)
			return true;
	},null,function(){
		setTimeout(function(){
			if(entity_edit_model.manager)
			{
				entity_edit_model.manager.reload();
			}
			else
			{
				$(f_initGrid);
			}
				
		},1000);
	},null,function(){
		tipOnce("提示",'分析错误，请刷新。', 10000);
		$(f_initGrid);
	});
}
$(function () {
	refresh_grid();
});

function f_initGrid() {
	//添加顶层菜单栏
	$("#top_menu").ligerMenuBar({ items: [
	                                     /* { text: '文件',
	                                    	  menu: 
	                                    	  { width: 120, items:
	                                    		  [
	                                    		   { text: '保存', click: function(){} },
	                                    		   { text: '列存为', click: function(){} },
	                                    		   { line: true },
	                                    		   { text: '关闭', click: function(){} }
	                                    		   ]
	                                    	  } 
	                                      }*/
	                                      ]
	});
	 //鼠标右键
	entity_edit_model.menu = $.ligerMenu({ top: 100, left: 100, width: 120, items:
	        [
	        /*{ text: '增加', click: function(){},icon:'add' },
	        { text: '修改', click: function(){},disable:true },
	        { line: true },
	        { text: '查看', click: function(){} },
	        { text: '关闭', click: function(){} }*/
	        ]
	        });
	  $("#contextmenu").bind("contextmenu", function (e)
	   {
		  	entity_edit_model .menu.show({ top: e.pageY, left: e.pageX });
		    return false;
		});
        entity_edit_model .manager = $(entity_edit_model.grid_div).ligerGrid(ERPUtils.get_default_grid_option_for_url({
        	toolbar: { 
        		items: [
        		        { text: '高级自定义查询', click: function(){
        		        	entity_edit_model.manager.showFilter(entity_edit_model.filter_div);
        		        }, icon: 'search2'},
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
		                				 div:'order_can_lead_export_excel',
		                				 other_query:' and forecast=0',
		                				 //query:'SELECT `id`,`orderID`, `componentID`, `p`,`c`,`orderRequirement`,`splitRequirement`,`otherRequirement`,`defectRequirement`,`actualStorage`,`futureStorage`,`usedStorage`,`fromStorage`,`fromProduct`,`n_full_rel`, `nl_full_rel`,`l_full_rel` ,`order_lead_time_string` FROM `erp`.`tmp_order_analysis`',
		                				 grid:entity_edit_model.manager,
		                				 table_name:'v_order_analysis2',
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

		                 }
        		     ]
        	},
        	url:entity_edit_model.url[entity_edit_model.url_index],
        	urlFilter:function(){
        		var op=arguments[1].options;
        		var ps=[];
        		var url=op.url+"?callback=?&forecast=0";
        		if(op.parms&&op.parms.where)
        		{
        			var filter=JSON.parse(op.parms.where);
        			if(filter&&filter!="")
        				url+="&"+change_ligerui_filter_to_python(filter);
        		}
        		return url;
        	},
        	columns:entity_edit_model.dispaly_columns
        }));
}
