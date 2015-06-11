var erp_item_orders=Class({
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
			tipOnce('错误','erp_item_orders参数错误。');
			throw new Error("erp_item_orders参数错误。");
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
			tipOnce('错误','erp_item_orders参数错误， 缺少 div。');
			throw new Error("erp_item_orders参数错误。");
		}
		this.param.div=$('#'+this.param.div.toString().replace(/(^#)/,""));
		this._id.index++;
		this.id=this._id.index;
		this.name='__erp_item_orders'+this.id;
		window[this.name]=this;
		$(this.param.div).empty();
		this.init_item_orders();
//		this.setData();
		//arguments;
	},
	init_item_orders:function()
	{
		var init_item_orders_target=this;
		this.item_feeding_parent_item_grid=$(this.param.div).ligerGrid(
				ERPUtils
				.get_default_grid_option_for_url({
					url :erp_api_service.VOrderFilterExtract[0],
					rowAttrRender:function (rowdata,rowid)
                   	{
//                   		if(rowdata.feeding_status_all>0&&rowdata.feeding_status_all==rowdata.feeding_status_now)
						 function duibi(a) {
							    var arr = a.split("-");
							    var starttime = new Date(arr[0], arr[1], arr[2]);
							    var starttimes = starttime.getTime();
							    return starttimes

							}
                   		if(duibi(rowdata.order_lead_time)<new Date().getTime())
                   			return "style='background-color:"+erp_colors.feeding_timeout+";'";
                   		else
                   			return '';
                   	},
                   	alternatingRow:false,
					columns : [
					           { display: '序号', name: 'order_id', width: 50, type: 'int' },
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
					               display: '部品', name: 'item_number',  align: 'center',
					               editor: { type: 'text', height: 60 }
					           },
					           {
					               display: '订单量', name: 'count',   align: 'center',type:'int' ,width: 60,
					               editor: { type: 'int', height: 60 },
					               totalSummary:
				                    {
				                        type: 'sum,max,min'
				                    }
					           },
					           {
					               display: '纳期', name: 'order_lead_time', type: 'date', format: 'yyyy年MM月dd',  align: 'center',
					               editor: { type: 'date',format: 'yyyy-MM-dd'}
					           }
					      ],
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
				                    	 init_item_orders_target.item_feeding_parent_item_grid.reload();
				                         },
				                     icon : 'refresh'
				                 }
				                 ]
					},
//					rowAttrRender:function (rowdata,rowid)
//                	{
//						console_info(init_item_orders_target.param.item_number);
////                		if(rowdata.feeding_status_all>0&&rowdata.feeding_status_all==rowdata.feeding_status_now)
//                		if(init_item_orders_target.param.item_number==rowdata.componentid)
//                			return "style='background-color:"+erp_colors.feeding_storage+";'";
//                		else
//                			return '';
//                	},
                	 urlFilter:function(){
                 		var op=arguments[1].options;
                		var ps=[];
                		var url=op.url+"?callback=?&item_number="+init_item_orders_target.param.item_number;
                		//var url=op.url+"?callback=?&sys_status__regex=("+erp_api_order_sys_status.info_miss+")|("+erp_api_order_sys_status.item_not_exists+")";
//                		var url=op.url+"?callback=?&sys_status__regex=("+erp_api_order_sys_status.lead_overtime+")|("+erp_api_order_sys_status.info_miss+")|("+erp_api_order_sys_status.item_not_exists+")";
                		if(op.parms&&op.parms.where)
                		{
                			var filter=JSON.parse(op.parms.where);
                			if(filter&&filter!="")
                				url+="&"+change_ligerui_filter_to_python(filter);
                		}
                		return url;
                	},
					isScroll : false,
					width : 'auto',
			        checkbox: false,
			        rowDraggable:false,
			        isShowDetailToggle:function(rowData){
		            	return false;
		            },
		            onBeforeShowData:function(g)
		            {
		            	if(!g||g.Total<=0)
		            	{
		            		$(init_item_orders_target.param.div).hide();
		            	}
		            }
					//detail : {}
				}));
		
	},
	refresh:function()
	{
		if(this.item_feeding_parent_item_grid)
		{
			this.item_feeding_parent_item_grid.reload();
		}
	},
	toggle:function()
	{
		$(this.param.div).slideToggle("slow");
//		$(this.param.div).toggle();
	}
});