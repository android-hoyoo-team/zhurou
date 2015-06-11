var erp_item_feeding_tracking=Class({
	item_info:null,
	_id:{index:0},
	id:null,
	name:null,
	param:{
		div:'',
		item_number:null
	},
	data:null,
	initialize:function()
	{
		if(!arguments[0])
		{
			tipOnce('错误','erp_item_feeding_tracking参数错误。');
			throw new Error("erp_item_feeding_tracking参数错误。");
		}
		
		if(arguments[0])
		{
			/**
			 * if() 参数判断
			 * */
			this.param=Util.extend(this.param,arguments[0]);
		}
		if(this.param.div==null||this.param.div.toString().trim()=='')
		{
			tipOnce('错误','erp_item_feeding_tracking参数错误， 缺少 div。');
			throw new Error("erp_item_feeding_tracking参数错误。");
		}
		this.param.div=$('#'+this.param.div.toString().replace(/(^#)/,""));
		this._id.index++;
		this.id=this._id.index;
		this.name='__erp_item_feeding_tracking'+this.id;
		window[this.name]=this;
		$(this.param.div).empty();
		this.init_item_feeding_tracking();
//		this.setData();
		//arguments;
	},
	init_item_feeding_tracking:function()
	{
		var init_item_feeding_tracking_target=this;
		this.item_feeding_tracking_grid=$(this.param.div).ligerGrid(
				ERPUtils
				.get_default_grid_option_for_url({
					url :erp_api_service.VFeedingTracking[0],
					columns : [ {
						display : '投料单号',
						name : 'id',
						filter : false,
						width : 50,
						type : 'int'
					}/*, {
						display : '部品编号',
						name : 'item_number',
						 width : 150,
						type : 'int'
					}*/, {
						display : '投料数量',
						name : 'feeding_count',
						width : 100
					}, {
						display : '投料日期',
						name : 'feeding_date',
						width : 150,
						type : 'date',
						format : 'yyyy-MM-dd hh:mm:ss'
					},{
				        display : '预计入库时间',
				        name : 'plan_storage_time',
				        editor: { type: 'date',format : 'yyyy-MM-dd'},
				        width : 100,
				        type : 'date',
				        format : 'yyyy-MM-dd'
					},
					{	display : '入库超期(天)',
						name : 'actual_storage_timeout',
						width : 100,
						type:'int'
					},/*, {
						display : '投料单状态',
						name : 'storage_mark',
						width : 70,
						filter:false,
						//editer:{type:'select',},
						render : function(rowdata, rowindex, value) {
							if (value + '' == '0') {
								return "未入库";
							}
							if (value + '' == '1') {
								return "已入库";
							}
						}
					}*/ {
						display : '已完成工序',
						name : 'feeding_status_now',
						width : 80
					}, {
						display : '总共工序',
						name : 'feeding_status_all',
						width : 80
					}],
					toolbar : {
						items : [
								/*{
									text : '高级自定义查询',
									click : function() {
										entity_edit_model.manager
												.showFilter("#filter");
									},
									icon : 'search2'
								},*/
				                 { line: true },
				                 {
				                     text : '刷新',
				                     click : function() {
				                    	 init_item_feeding_tracking_target.item_feeding_tracking_grid.reload();
				                         },
				                     icon : 'refresh'
				                 }
				                 ]
					},
					 rowAttrRender:ERPUtils.feeding_row_attr_render,
			        urlFilter:function(){
			        	var op=arguments[1].options;
			        	var ps=[];
			        	var url;
			        	if(op.url.match(/\?/))
			        		url=op.url+"&callback=?";
			        	else
			        		url=op.url+"?callback=?";
			        	url+='&actual_storage_time__isnull=true&item_number='+init_item_feeding_tracking_target.param.item_number;
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
														columns :[
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
																}]
													}));
							//entity_edit_model.innerGrid.push(g);
						}
					}
				}));
	},
	refresh:function()
	{
		if(this.item_feeding_tracking_grid)
		{
			this.item_feeding_tracking_grid.reload();
		}
	},
	toggle:function()
	{
		$(this.param.div).slideToggle("slow");
//		$(this.param.div).toggle();
	}
});