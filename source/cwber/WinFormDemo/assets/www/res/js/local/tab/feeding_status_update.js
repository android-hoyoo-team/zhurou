var entity_edit_model = {
	menu : null,
	url_index : 0,
	url : erp_api_service.VFeedingTracking,
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
	}, {
		display : '部品编号',
		name : 'item_number',
		width : 150,
		type : 'int'
	}, {
		display : '投料数量',
		name : 'feeding_count',
		width : 100
	}, {
		display : '投料日期',
		name : 'feeding_date',
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
    },/*,    {
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
    },*/
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
		width : 50
	}, {
		display : '总工序',
		name : 'feeding_status_all',
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
				display : '主键',
				name : 'id',
				filter : false,
				width : 50,
				type : 'int'
			},
			{
				display : '部品编号',
				name : 'item_number',
				width : 150
			},
			{
				display : '投料单ID',
				name : 'feeding_id',
				width : 50,
				type : 'int'
			},
			{
				display : '工艺ID',
				name : 'step_tie_id',
				width : 50,
				type : 'int'
			},*/
			{
				display : '步骤',
				name : 'step_name',
				width : 150
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
			},
			{
				display : '操作',
				name : 'step_status',
				width : 50,
				render : function(rowdata, rowindex, value) {
					if (value + '' == '0') 
					{
						return "<button onClick='change_status_to_complete("
						+ rowdata.id+ ")'>完成</button>";
					}
				}
			}/*, {
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
			}*/ ]
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
								rowAttrRender:ERPUtils.feeding_row_attr_render,
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
							                     text : '刷新',
							                     click : function() {
							                    	 refresh_grid();
							                         },
							                     icon : 'refresh'
							                 }
							                 ]
								},
								urlFilter:function(){
						        	var op=arguments[1].options;
						        	var ps=[];
						        	var url;
						        	if(op.url.match(/\?/))
						        		url=op.url+"&callback=?";
						        	else
						        		url=op.url+"?callback=?";
						        	url+='&actual_storage_time__isnull=true';
						        	if(op.parms&&op.parms.where)
						        	{
						        		var filter=JSON.parse(op.parms.where);
						        		if(filter&&filter!="")
						        			url+="&"+change_ligerui_filter_to_python(filter);
						        	}
						        	if(op.parms&&op.parms.condition)
						        	{
						        		var condition=JSON.parse(op.parms.condition);
						        		url+="&"+change_ligerui_rule_to_python(condition[0]);
						        	}
						        	return url;
						        },
								isScroll : false,
								width : 'auto',
						        checkbox: false,
						        rowDraggable:false,
								detail : {
									height:'auto',
									width : 'auto',
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
function change_status_to_complete(status_id) {
	param = {
		url : erp_api_service.EntFeedingStatus[0] + status_id + '/',
		method : "PATCH",
		data : {
			'step_status' : '1'
		}
	};
	var res = bridge_map.ajax_auto(param);
	if (res.status == 202) {
		tipOnce("提示", Util.formatString("修改成功", res ? res.status : null), 10000)
		for ( var i in entity_edit_model.innerGrid)
			entity_edit_model.innerGrid[i].reload();
		refresh_grid();
	} else {
		tipOnce("提示", Util.formatString("修改失败，请重试[失败码:{0}]", res ? res.status
				: null), 10000)
	}
}