﻿var tracking_data = [];
var entity_edit_model = {
    menu : null,
    url_index : 0,
    url:erp_api_service.VOrderAnalysisGroupByNumber,
    top_menu : null,
    default_pages_size : 15,// 默认页面大小
    pages_size : [ 10, 15, 30, 50, 100 ],// 定义分页时 页面的大小级别
    export_dispaly_columns : [
                       {
                           display: '部品', name: 'c', align: 'center', width:150
                       },
                       {
                    	   display: '类型', name: 'leaf_full_rel',  align: 'center', width: 50,type:'int' 
                       },
                       {
                           display: '库存数量', name: 'storage',  align: 'center', width: 50,type:'int' 
                       },
                       {
                           display: '已投数量', name: 'future_count',  align: 'center', width: 50,type:'int' 
                       },
                       {
                           display: '需要投料', name: 'from_product',  align: 'center', width: 50,type:'int' 
                       },
                       {
                           display: '最早纳期', name: 'order_lead_time', type: 'date',
                           format: 'yyyy年MM月dd',  align: 'center',width: 100
                       }
                       ],
    dispaly_columns : [
        {
            display: '部品', name: 'c', align: 'center', width:150,
            editor: { type: 'text', height: 60 },
            render:function(rowdata, rowindex, value){
            	 return "<a href=\"javascript:show_item_detail('" +value + "')\">"+value+"</a>";
            }
        },
        {
            display: '类型', name: 'leaf_full_rel',  align: 'center',  width:100,
            editor: { type: 'select',emptyText: null, data:getFeedingGroupItemArry(), valueColumnName: 'type', displayColumnName: 'name' },
      	  render: function (rowdata, rowindex, value) {
      		  var h='';
      		  //{forecast:0,name:"可直接发货"},{forecast:1,name:"预期可发货（在生产中）"},{forecast:2,name:"需要生产"}];
//      		  console_info(value);
      		  if(value+''=='1')
      			  return "<a href=\"javascript:ERPUtils.show_item_feeding_parent_item('"+rowdata.c+"')\">"+getFeedingGroupItem()[value]+"</a> ";
      			  
      		  return getFeedingGroupItem()[value];
      	  }
        },
        {
            display: '库存数量', name: 'storage',  align: 'center', width: 50,type:'int' ,
            editor: { type: 'int', height: 60 }
        },
        {
            display: '已投数量', name: 'future_count',  align: 'center', width: 50,type:'int' ,
            render: function (rowdata, rowindex, value) {
      		  if(rowdata.future_count>0)
      			  return "<a href=\"javascript:ERPUtils.show_item_feeding_tracking('" +rowdata.c + "')\">"+value+"</a>";
      		  return rowdata.future_count+"";
      		  //return "";
      	  },
            editor: { type: 'int', height: 60 }
        },
        {
            display: '需要投料', name: 'from_product',  align: 'center', width: 50,type:'int' ,
            editor: { type: 'int', height: 60 }
        },
        {
            display: '最早纳期', name: 'order_lead_time', type: 'date',
            format: 'yyyy年MM月dd',  align: 'center',width: 100,
            editor: { type: 'date',format: 'yyyy-MM-dd'}
        },
        {
            display: '投料',
            width : 50,
            filter:false,
            render : function(rowdata, rowindex, value) {
            	var h="";
            	
            	 h += "<a href='javascript:ERPUtils.item_feeding(\""+ rowdata.c+"\","+rowdata.from_product+")'>投料</a> ";
            	return h;
            }
        }
        ]
};
function refresh_grid()
{
	var res;
	dialogWait("正在分析订单，稍后......",function(){
		res=bridge_map.super_api(Util.formatString(erp_api_sql.procedure_sp_order_analysis,1,0,0,0));
//		console_info(res);
		if(res&&res.status>199&&res.status<300)
			if(res&&res.status)
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
	});
}

$(function() {
	//refresh_grid();
   $(f_initGrid);
});
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
            isShowDetailToggle:function(rowData){
            	if("0"==rowData.leaf_full_rel)
            		return true;
            	return false;
            },
            detail: { height:'auto',onShowDetail: 
            	function (row, detailPanel,callback)
            	{
	            	var _data=getItemTree(row.c,true,function(tree){
	            		var grid = document.createElement('div'); 
	                    $(detailPanel).append(grid);
	                    $(grid).css('margin',10).ligerGrid({
	                        columns:
	                        	[
	                            // { display: '序号', name: 'id', width: 30, type: 'int' },
	                             {
	                           	  display: '子件', name: 'c', id:"id1", align: 'left',width:150,
	                           	 render:function(rowdata, rowindex, value){
	                            	 return "<a href=\"javascript:show_item_detail('" +value + "')\">"+value+"</a>";
	                            }
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
	                            	 display: '库存数量', name: 'storage', width: 50,isSort: false,
	                            	 editor: { type: 'text', height: 60 },
	                            	 render : function(rowdata, rowindex, value) {

	                            			var comp=ERPUtils.get_item_comp_storage(rowdata.c);
	                            			if(comp==null)
	                            				comp='获取失败';
//	                            			var half=ERPUtils.get_item_half_storage(rowdata.c);
//	                            			if(half==null)
//	                            				half='获取失败';
		                                 	return comp+"";
		                                 }
	                             },
	                             {
	                            	 display: '已投数量', name: 'n', width: 50,isSort: false,
	                            	 editor: { type: 'text', height: 60 },
	                            	 render : function(rowdata, rowindex, value) {
	                            			var future=ERPUtils.get_item_future_storage(rowdata.c);
	                            			if(future==null)
	                            				future='获取失败';
	                                		  if(Number(future)>0)
	                                  			  return "<a href=\"javascript:ERPUtils.show_item_feeding_tracking('" +rowdata.c + "')\">"+future+"</a>";
	                            			return future+"";
		                                 }
	                             },
	                             {
	                            	 display: '需要投料', name: 'need_feed', width: 50,isSort: false,
	                            	 editor: { type: 'text', height: 60 },
	                            	 render : function(rowdata, rowindex, value) {
	                            		 var need_feed=ERPUtils.get_item_need_feed(rowdata.c);
	                            		 if(need_feed==null)
	                            			 need_feed='获取失败';
	                            		 return need_feed+"";
	                            	 }
	                             }
	                             ,
	                             {
	                                 display: '投料',
	                                 width : 50,
	                                 filter:false,
	                                 render : function(rowdata, rowindex, value) {
	                                 	var h="";
	                                 	
	                                 	 h += "<a href='javascript:ERPUtils.item_feeding(\""+ rowdata.c+"\",0)'>投料</a> ";
	                                 	return h;
	                                 }
	                             }
	                             ], 
	                             onSelectRow: function (rowdata, rowindex) {
//	                            	 item_NO=rowdata.c;
//	             					init_item_storage(rowdata.c);
//	             					show_item_storage_text(rowdata.c);
//	             					select._toggleSelectBox(true);
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
        url : entity_edit_model.url[entity_edit_model.url_index],
        columns : entity_edit_model.dispaly_columns,
        pageSize:entity_edit_model.default_pages_size,
        pageSizeOptions: entity_edit_model.pages_size,
        toolbar : {
        items : [
                 {
                     text : '高级自定义查询',
                     click : function() {
                         entity_edit_model.manager.showFilter("#filter");
                         },
                     icon : 'search2'
                 },
                 { line: true },
                 {
                     text : '重新分析订单',
                     click : function() {
                    	 refresh_grid();
                         },
                     icon : 'refresh'
                 },
                 { line: true },
                 {
 		        	text: '导出', click: function () {
 		        		$("#v_order_analysis_group_by_number").ligerGrid(ERPUtils.get_default_grid_option_for_url(
 		        				{
 		        					 toolbar : {
 		        					        items : [
 		        					                 {
 		        					                     text : '导出Excel',
 		        					                     click : function() {
 		        					                    	 if(!entity_edit_model.v_order_analysis_export_excel)
 		        					                    	{
 		        					                    		 entity_edit_model.v_order_analysis_export_excel =new  erp_export({
 		        					                    			 div:'v_order_analysis_group_by_number_export',
 		        					                    			 //query:'SELECT `id`,`orderID`, `componentID`, `p`,`c`,`orderRequirement`,`splitRequirement`,`otherRequirement`,`defectRequirement`,`actualStorage`,`futureStorage`,`usedStorage`,`fromStorage`,`fromProduct`,`n_full_rel`, `nl_full_rel`,`l_full_rel` ,`order_lead_time_string` FROM `erp`.`tmp_order_analysis`',
 		        					                    			 fields:entity_edit_model.export_dispaly_columns,
 		        					                    			 table_name:'v_order_analysis_group_by_number',
 		        					                    			 file_path:null,
 		        					                    			 file_name:null,
 		        					                    			 charset:'utf-8',
 		        					                    			 headers:null
 		        					                    		 });
 		        					                    	}else
 		        					                    	{
 		        					                    		entity_edit_model.v_order_analysis_export_excel.toggle();
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
 		        					                     icon : 'attibutes'
 		        					                 }
 		        					                 ]
 		        					        },
 		        					pageSizeOptions: [20,50,100,200,500],
 		        					url:entity_edit_model.url[entity_edit_model.url_index],
 		        		        	columns: entity_edit_model.export_dispaly_columns
 		        				}
 		        			));
             				var order_analysis_div=$.ligerDialog.open({ target: $("#v_order_analysis_group_by_number_div"),height: 500,width:null });
 		        	}, icon: 'attibutes'
 		        }
                 ]
        },
        isScroll : false,
        width : 'auto'
        }));
}