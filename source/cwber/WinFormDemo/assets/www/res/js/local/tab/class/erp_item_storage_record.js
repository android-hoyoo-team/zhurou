var storage_data=[];
var erp_item_storage_record=Class({
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
			tipOnce('错误','erp_item_storage_record参数错误。');
			throw new Error("erp_item_storage_record参数错误。");
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
			tipOnce('错误','erp_item_storage_record参数错误， 缺少 div。');
			throw new Error("erp_item_storage_record参数错误。");
		}
		this.param.div=$('#'+this.param.div.toString().replace(/(^#)/,""));
		this._id.index++;
		this.id=this._id.index;
		this.name='__erp_item_storage_record'+this.id;
		window[this.name]=this;
		$(this.param.div).empty();
		this.init_item_storage_record();
//		this.setData();
		//arguments;
	},
	init_item_storage_record:function()
	{
		var init_item_storage_record_target=this;
		this.item_storage_record_grid=$(this.param.div).ligerGrid(
				ERPUtils
				.get_default_grid_option_for_url({
					url :erp_api_service.EntStorageChangesRecord[0],
					rowAttrRender:function (rowdata,rowid)
                   	{
//                   		if(rowdata.feeding_status_all>0&&rowdata.feeding_status_all==rowdata.feeding_status_now)
//						 function duibi(a) {
//							    var arr = a.split("-");
//							    var starttime = new Date(arr[0], arr[1], arr[2]);
//							    var starttimes = starttime.getTime();
//							    return starttimes
//
//							}
//                   		if(duibi(rowdata.order_lead_time)<new Date().getTime())
//                   			return "style='background-color:"+erp_colors.feeding_timeout+";'";
//                   		else
//                   			return '';
                   	},
                   	alternatingRow:false,
					columns : [
					              { display: '部品编号', name: 'item_number', width: 100, type: 'text',
					            	  render:function(rowdata, rowindex, value){
					 	            	 return "<a href=\"javascript:show_item_detail('" +value + "')\">"+value+"</a>";
					 	            }
					              },
					              {
										display : '仓库位置',
										name : 'storage_id',
										type:'int',
										width: 100,
										editor:{ 	
											type: 'select',
					            	  		emptyvalue:false, 
					            	  		data:storage_data, 
					            	  		valueColumnName: 'id', 
					            	  		displayColumnName: 'name',
					            	  		selectBoxWidth: 300 ,
					            	  		selectBoxHeight:300,
					            	  		//isShowCheckBox:false,
					            	  		emptyText: null,
					            	  		//emptyValue:0,
					            	  		valueType:"int",
					            	  		columns: [
					                                      //{ header: 'ID', name: 'id',type:'int', width: 20 },
					                                      { header: '名称', name: 'name' }
					                                  ]
					          },
					              render:function (item)
					              {
					              			for (var i = 0; i < storage_data.length; i++)
					              			{
					              					if (storage_data[i]['id']+"" == item.storage_id+"")
					              					{
					              						return storage_data[i]['name'];
					              					}
					              			}
					              			return "";
					              }
							},
					              {
					                  display: '出入库数量', name: "count", type:'int',width: 100
					              },
					              {
					                  display: '出入库状态', name: 'type', type:'text',width: 100

					              },
					              {
					                  display: '类别', name: 'item_type', width: 100,
					                  editor: { type: 'select',emptyText: null, data:getStorageItemTypeArry(), valueColumnName: 'type', displayColumnName: 'name' },
										 render: function (rowdata, rowindex, value) {
											 return getStorageItemTypeMap()[value];
										 }
					              },
					              {
					            	  display: '备注', name: 'remark',   align: 'center',type:'text'
					            
					              },
					              {
					                  display: '添加时间', name: 'i_time', type: 'date', format: 'yyyy年MM月dd hh:mm:ss', width: 150,
					                 editor: { type: 'date',options:{showTime:true} }
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
									text : '出入库记录'
//									icon : 'refresh'
								},
				                 { line: true },
				                 {
				                     text : '刷新',
				                     click : function() {
				                    	 init_item_storage_record_target.item_storage_record_grid.reload();
				                         },
				                     icon : 'refresh'
				                 }
				                 ]
					},
//					rowAttrRender:function (rowdata,rowid)
//                	{
//						console_info(init_item_storage_record_target.param.item_number);
////                		if(rowdata.feeding_status_all>0&&rowdata.feeding_status_all==rowdata.feeding_status_now)
//                		if(init_item_storage_record_target.param.item_number==rowdata.componentid)
//                			return "style='background-color:"+erp_colors.feeding_storage+";'";
//                		else
//                			return '';
//                	},
                	alternatingRow:true,
                	 urlFilter:function(){
                 		var op=arguments[1].options;
                		var ps=[];
                		var url=op.url+"?callback=?&item_number="+init_item_storage_record_target.param.item_number;
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
		            		$(init_item_storage_record_target.param.div).hide();
		            	}
		            }
					//detail : {}
				}));
		
	},
	refresh:function()
	{
		if(this.item_storage_record_grid)
		{
			this.item_storage_record_grid.reload();
		}
	},
	toggle:function()
	{
		$(this.param.div).slideToggle("slow");
//		$(this.param.div).toggle();
	}
});