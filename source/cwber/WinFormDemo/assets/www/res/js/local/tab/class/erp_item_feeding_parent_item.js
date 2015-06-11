var erp_item_feeding_parent_item=Class({
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
			tipOnce('错误','erp_item_feeding_parent_item参数错误。');
			throw new Error("erp_item_feeding_parent_item参数错误。");
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
			tipOnce('错误','erp_item_feeding_parent_item参数错误， 缺少 div。');
			throw new Error("erp_item_feeding_parent_item参数错误。");
		}
		this.param.div=$('#'+this.param.div.toString().replace(/(^#)/,""));
		this._id.index++;
		this.id=this._id.index;
		this.name='__erp_item_feeding_parent_item'+this.id;
		window[this.name]=this;
		$(this.param.div).empty();
		this.init_item_feeding_parent_item();
//		this.setData();
		//arguments;
	},
	init_item_feeding_parent_item:function()
	{
		var init_item_feeding_parent_item_target=this;
		this.item_feeding_parent_item_grid=$(this.param.div).ligerGrid(
				ERPUtils
				.get_default_grid_option_for_url({
					url :erp_api_service.TmpOrderAnalysis[0],
					rowAttrRender:function (rowdata,rowid)
                   	{
//                   		if(rowdata.feeding_status_all>0&&rowdata.feeding_status_all==rowdata.feeding_status_now)
                   		if(init_item_feeding_parent_item_target.param.item_number==rowdata.componentid)
                   			return "style='background-color:"+erp_colors.feeding_storage+";'";
                   		else
                   			return '';
                   	},
                   	alternatingRow:false,
					columns : [
					           {
					               display: '部品', name: 'componentid', align: 'center', width:150,
					               editor: { type: 'text', height: 60 },
					               render:function(rowdata, rowindex, value){
					               	 return "<a href=\"javascript:show_item_detail('" +value + "')\">"+value+"</a>";
					               }
					           },
					           {
					               display: '类型', name: 'xxx',  align: 'center',  width:120,
					         	  render: function (rowdata, rowindex, value) {
					         		if(rowdata.componentid==init_item_feeding_parent_item_target.param.item_number)
					         		{
					         			  return '成品（非合成）';
					         		}
					         		else
					         			return '合成件';
					         	  }
					           },
					           {
					               display: '库存数量', name: 'storage',  align: 'center', width: 80,type:'int' ,
					               editor: { type: 'int', height: 60 },
	                            	 render : function(rowdata, rowindex, value) {

	                            			var comp=ERPUtils.get_item_comp_storage(rowdata.componentid);
	                            			if(comp==null)
	                            				comp='获取失败';
		                                 	return comp+"";
		                                 }
					           },
					           {
					               display: '已投数量', name: 'future_count',  align: 'center', width: 80,type:'int' ,
					               render: function (rowdata, rowindex, value) {
                           			var future=ERPUtils.get_item_future_storage(rowdata.componentid);
                        			if(future==null)
                        				future='获取失败';
                                 	if(Number(future)>0)
                                 		return "<a href=\"javascript:ERPUtils.show_item_feeding_tracking('" +rowdata.componentid + "')\">"+future+"</a>";
					         		  return future+"";
					         	  },
					               editor: { type: 'int', height: 60 }
					           },
					           {
					               display: '需要投料', name: 'from_product',  align: 'center', width: 80,type:'int' ,
					               editor: { type: 'int', height: 60 },
	                            	 render : function(rowdata, rowindex, value) {
	                            		 var need_feed=ERPUtils.get_item_need_feed(rowdata.componentid);
	                            		 if(need_feed==null)
	                            			 need_feed='获取失败';
	                            		 return need_feed+"";
	                            	 }
					           },
					           {
					               display: '投料',
					               width : 50,
					               filter:false,
					               render : function(rowdata, rowindex, value) {
					               	var h="";
					               	
					               	 h += "<a href='javascript:ERPUtils.item_feeding(\""+ rowdata.componentid+"\","+rowdata.from_product+")'>投料</a> ";
					               	return h;
					               }
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
				                    	 init_item_feeding_parent_item_target.item_feeding_parent_item_grid.reload();
				                         },
				                     icon : 'refresh'
				                 }
				                 ]
					},
//					rowAttrRender:function (rowdata,rowid)
//                	{
//						console_info(init_item_feeding_parent_item_target.param.item_number);
////                		if(rowdata.feeding_status_all>0&&rowdata.feeding_status_all==rowdata.feeding_status_now)
//                		if(init_item_feeding_parent_item_target.param.item_number==rowdata.componentid)
//                			return "style='background-color:"+erp_colors.feeding_storage+";'";
//                		else
//                			return '';
//                	},
                	alternatingRow:true,
			        urlFilter:function(){
			        	var op=arguments[1].options;
			        	var ps=[];
			        	var url;
			        	if(op.url.match(/\?/))
			        		url=op.url+"&callback=?";
			        	else
			        		url=op.url+"?callback=?";
			        	url+='&c='+init_item_feeding_parent_item_target.param.item_number;
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
			        isShowDetailToggle:function(rowData){
		            	if(init_item_feeding_parent_item_target.param.item_number==rowData.componentid)
		            		return false;
		            	return true;
		            },
					detail : { height:'auto',onShowDetail: 
		            	function (row, detailPanel,callback)
		            	{
			            	var _data=getItemTree(row.componentid,true,function(tree){
			            		var grid = document.createElement('div'); 
			                    $(detailPanel).append(grid);
			                    $(grid).css('margin',10).ligerGrid({
			                    	rowAttrRender:function (rowdata,rowid)
			                    	{
//			                    		if(rowdata.feeding_status_all>0&&rowdata.feeding_status_all==rowdata.feeding_status_now)
			                    		if(init_item_feeding_parent_item_target.param.item_number==rowdata.c)
			                    			return "style='background-color:"+erp_colors.feeding_storage+";'";
			                    		else
			                    			return '';
			                    	},
			                    	alternatingRow:false,
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
//			                            			var half=ERPUtils.get_item_half_storage(rowdata.c);
//			                            			if(half==null)
//			                            				half='获取失败';
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
//			                            	 item_NO=rowdata.c;
//			             					init_item_storage(rowdata.c);
//			             					show_item_storage_text(rowdata.c);
//			             					select._toggleSelectBox(true);
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
		            }
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