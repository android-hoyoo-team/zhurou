var entity_edit_model = {
	menu : null,
	url_index : 0,
	url : erp_api_service.VFeedingTracking,
	top_menu : null,
	default_pages_size : 15,// 默认页面大小
	pages_size : [ 10, 15, 30, 50, 100 ],// 定义分页时 页面的大小级别
	innerGrid : [],
	timerTask:null,
	dispaly_columns : [ {
		display : '投料单号',
		name : 'id',
		filter : false,
		width : 80,
		type : 'int'
	}, {
		display : '部品编号',
		name : 'item_number',
		width : 150,
		type : 'text'
	}, {
		display : '投料数量',
		name : 'feeding_count',
		type : 'int',
		width : 100
	}, {
		display : '投料日期',
		name : 'feeding_date',
		width : 150,
		type : 'date',
		format : 'yyyy-MM-dd hh:mm:ss'
	},
	{
		display : '预入库日期',
		name : 'plan_storage_time',
		width : 100,
		type : 'date',
		format : 'yyyy-MM-dd'
	},{
        display : '实际入库时间',
        name : 'actual_storage_time',
        //editor: { type: 'date',format : 'yyyy-MM-dd hh:mm:ss'},
        width : 150,
        type : 'date',
        format : 'yyyy-MM-dd hh:mm:ss'
    },
    {
        display : '实入库数',
        name : 'actual_storage_count',
        //editor: { type: 'date',format : 'yyyy-MM-dd hh:mm:ss'},
        width : 80,
        type : 'int'
    },
    /* {
		display : '投料单状态',
		name : 'storage_mark',
		width : 70,
		render : function(rowdata, rowindex, value) {
			if (value + '' == '0') {
				return "未入库";
			}
			else if (value + '' == '1') {
				return "已入库";
			}
			else {
				return "ERROR";
			}
		}
	},*/ {
		display : '已完工序',
		name : 'feeding_status_now',
		type : 'int',
		width : 50
	}, {
		display : '总工序',
		name : 'feeding_status_all',
		type : 'int',
		width : 50
	}/*, {
		display : '添加时间',
		name : 'i_time',
		width : 150,
		type : 'date',
		format : 'yyyy-MM-dd hh:mm:ss'
	} */],
	dispaly_columns1 : [
			/*{
				display : '投料单号',
				name : 'id',
				filter : false,
				width : 80,
				type : 'int'
			},
			{
				display : '部品编号',
				name : 'item_number',
				width : 100,
				type : 'int'
			},
			{
				display : '投料单ID',
				name : 'feeding_id',
				width : 50,
				type : 'int'
			},*/
			/*{
				display : '工艺ID',
				name : 'step_tie_id',
				width : 50,
				type : 'int'
			},*/
			{
				display : '步骤',
				name : 'step_name',
				width : 100
			},
			{
				display : '步骤顺序',
				name : 'step_rank',
				width : 50
			},
			{
				display : '步骤状态',
				name : 'step_status',
				width : 50,
				render : function(rowdata, rowindex, value) {
					if (value + '' == '0') {
						return "未完";
					}
					if (value + '' == '1') {
						return "已完";
					}
				}
			}/*,
			{
				display : '添加时间',
				name : 'i_time',
				type : 'date',
				format : 'yyyy-MM-dd hh:mm:ss',
				width : 150
			}, {
				display : '更改时间',
				name : 'u_time',
				type : 'date',
				format : 'yyyy-MM-dd hh:mm:ss',
				width : 150
			} */]
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
	entity_edit_model.timerTask=new TimerTask();
	entity_edit_model.timerTask.setTask(1,function(){
		entity_edit_model.manager.reload();
	},null,erp_refresh_interval,0);
	entity_edit_model.timerTask.runTask(1,erp_refresh_interval);
	
});
function f_initGrid() {
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
	entity_edit_model.manager = $("#item")
			.ligerGrid(
					ERPUtils
							.get_default_grid_option_for_url({
								url : entity_edit_model.url[entity_edit_model.url_index],
								columns : entity_edit_model.dispaly_columns,
								toolbar : {
									items : [
											{
												text : '高级自定义查询',
												click : function() {
													entity_edit_model.manager
															.showFilter("#filter");
												},
												icon : 'search2'
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
							                 }
											]
								},
								rowAttrRender:ERPUtils.feeding_row_attr_render,
								isScroll : false,
								width : 'auto',
						        checkbox: false,
						        colDraggable:false,
						        rowDraggable:false,
								detail : {
									height : 'auto',
									onShowDetail : function(row, detailPanel,
											callback) {
										var grid = document
												.createElement('div');
										$(detailPanel).append(grid);
										var g = $(grid)
												.css('margin', 10)
												.ligerGrid(
														ERPUtils
																.get_default_grid_option_for_url({
																	width : 'auto',
															        isScroll : false,
															        checkbox: false,
																	url : erp_api_service.EntFeedingStatus[0]
																			+ "?feeding_id="
																			+ row.id
																			+ "&order_by=step_rank",
																	columns : entity_edit_model.dispaly_columns1
																}));
										entity_edit_model.innerGrid.push(g);
									}
								}
							}));
}