var erp_order_item_parents_of_child=Class({
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
			tipOnce('错误','erp_order_item_parents_of_child参数错误。');
			throw new Error("erp_order_item_parents_of_child参数错误。");
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
			tipOnce('错误','erp_order_item_parents_of_child参数错误， 缺少 div。');
			throw new Error("erp_order_item_parents_of_child参数错误。");
		}
		this.param.div=$('#'+this.param.div.toString().replace(/(^#)/,""));
		this._id.index++;
		this.id=this._id.index;
		this.name='__erp_order_item_parents_of_child'+this.id;
		window[this.name]=this;
		$(this.param.div).empty();
		this.init_erp_order_item_parents_of_child();
//		this.setData();
		//arguments;
	},
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
                           editor: { type: 'select',emptyText: null, data:getFeedingGroupItemArry(), valueColumnName: 'forecast', displayColumnName: 'name' },
                     	  render: function (rowdata, rowindex, value) {
                     		  var h='';
                     		  //{forecast:0,name:"可直接发货"},{forecast:1,name:"预期可发货（在生产中）"},{forecast:2,name:"需要生产"}];
//                     		  console_info(value);
                     		  if(value+''=='1')
                     			  return "<a href='javascript:order_lead_from_storage(" + rowdata.order_id + ",\""+rowdata.t+"\","+rowdata.order_requirement+")'>"+getFeedingGroupItem()[value]+"</a> ";
                     			  
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
                       },
	init_erp_order_item_parents_of_child:function()
	{
		var init_erp_order_item_parents_of_child_target=this;
		this.erp_order_item_parents_of_child_grid=$(this.param.div).ligerGrid(
				ERPUtils
				.get_default_grid_option_for_url({
					url :erp_api_service.TmpOrderAnalysis[0],
					columns : [ this.dispaly_columns],
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
				                    	 init_erp_order_item_parents_of_child_target.erp_order_item_parents_of_child_grid.reload();
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
			        	url+='&actual_storage_time__isnull=true&item_number='+init_erp_order_item_parents_of_child_target.param.item_number;
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
		if(this.erp_order_item_parents_of_child_grid)
		{
			this.erp_order_item_parents_of_child_grid.reload();
		}
	},
	toggle:function()
	{
		$(this.param.div).slideToggle("slow");
//		$(this.param.div).toggle();
	}
});