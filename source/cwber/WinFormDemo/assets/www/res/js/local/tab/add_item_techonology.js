var detailGrid;
var current_id;
var entity_edit_model = {
	menu : null,
	url_index : 0,
	url : erp_api_service.EntItem,
	top_menu : null,
	default_pages_size : 15,// 默认页面大小
	pages_size : [ 10, 15, 30, 50, 100 ],// 定义分页时 页面的大小级别
	innerGrid : [],
	dispaly_columns : [ 
//	{
//		display : '主键',
//		name : 'id',
//		filter : false,
//		width : 50,
//		type : 'int'
//	},
	{
		display : '部品编号',
		name : 'number'
		// ,width : 150
		// type : 'int'
	}],
	dispaly_columns1 : [
			{
				display : '工序順序',
				name : 'technology_rank',
				width : 50,
				editor:{type : 'int'}
			},
			{
				display : '工序名字',
				name : 'technology_id',
				width : 50,
				type:'int',
				editor:{ 	
					type: 'select',
          	  		emptyvalue:false, 
          	  		data:global_data.technology_data, 
          	  		valueColumnName: 'id', 
          	  		displayColumnName: 'name',
          	  		selectBoxWidth: 300 ,
          	  		selectBoxHeight:300,
          	  		// isShowCheckBox:false,
          	  		emptyText: null,
          	  		// emptyValue:0,
          	  		valueType:"int",
          	  		columns: [
          	  		          // { header: 'ID', name: 'id',type:'int',
          	  		          // width: 20 },
          	  		          { header: '名称', name: 'name' }
          	  		          ]
					},
					render:function (item)
					{
            			for (var i = 0; i < global_data.technology_data.length; i++)
            			{
            				if (global_data.technology_data[i]['id']+"" == item.technology_id+"")
            				{
            					return global_data.technology_data[i]['name'];
            				}
            			}
            			return "";
            		}
				
			},
			{
				display : '工序信息',
				name : 'technology_info',
				width : 150,
				editor:{type : 'string'}
			},
			{
				display : '規格',
				name : 'dimensions',
				width : 150,
				editor:{type : 'string'}
			},
			{
				display : '添加时间',
				name : 'i_time',
				type : 'date',
				format : 'yyyy-MM-dd hh:mm:ss',
				width : 150
			}, 
			{
				display : '更改时间',
				name : 'u_time',
				type : 'date',
				format : 'yyyy-MM-dd hh:mm:ss',
				width : 150
			},
			{
                display: '操作', isSort: false, filter:false,
                width : 100,
                render: function (rowdata, rowindex, value)
                {
                    var h = "";
                    if (!rowdata._editing) {
                        h += "<a href='javascript:deleteTechnologyById(" + rowdata.id + ","+current_id+")'>删除</a> ";
                    }
                    else {
                        h += "<a href='javascript:endEdit(" + rowindex + ","+current_id+")'>提交</a> ";
                        h += "<a href='javascript:cancelEdit(" + rowindex + ","+current_id+")'>取消</a> ";
                    }
                    return h;
                }
            }
			]
};
$(function() {

	$(f_initGrid);
});

function f_initGrid() {
	// 鼠标右键
	entity_edit_model.menu = $.ligerMenu({
		top : 100,
		left : 100,
		width : 120,
		items : []
	});
	$("#add_item_technology").bind("contextmenu", function(e) {
		entity_edit_model.menu.show({
			top : e.pageY,
			left : e.pageX
		});
		return false;
	});
	$.ligerDefaults.Filter.operators['string'] = $.ligerDefaults.Filter.operators['text'] = [
			"like", "equal", "notequal", "startwith", "endwith" ];
	$.ligerDefaults.Filter.operators['int'] = [ "equal", "notequal" ];
	entity_edit_model.manager = $("#add_item_technology")
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
											}, {
												line : true
											} ]
								},
								isScroll : false,
								width : 'auto',
								detail : {
									height : 'auto',
									onShowDetail : function(row, detailPanel,
											callback) {
										current_id=row.id;
										var grid = document
												.createElement('div');
										$(detailPanel).append(grid);
										entity_edit_model.innerGrid[current_id]=$(grid)
												.css('margin', 10)
												.ligerGrid(
														ERPUtils
																.get_default_grid_option_for_url({
																	width : '90%',
																	height:'auto',
																	url : erp_api_service.EntRelTechnologyItemEquipment[0]
																			+ "?item_number="
																			+ row.number
																			+ "&order_by=technology_rank",
																	columns : entity_edit_model.dispaly_columns1,
																	toolbar: { items: [
																	                    
																                    	{id:current_id,
																                    	tag:true,
																                        text: '增加', click: function () {
																                        	entity_edit_model.innerGrid[arguments[0].id].addEditRow();
																                        }, icon: 'add'
																                    	}
																                    ]
																 	},
																 	 enabledEdit: true,
																 	 detailToEdit: true,
																     onBeforeSubmitEdit:function()
											                         {
											                             var param;
											                             if (arguments[0].record.__status == "add") {
											                                 param = {
											                                     url: erp_api_service.EntRelTechnologyItemEquipment[0],
											                                     method: "POST",
											                                     data:{item_number:row.number,technology_rank:arguments[0].newdata.technology_rank,
											                                    	   technology_info:arguments[0].newdata.technology_info,
											                                    	   technology_id:arguments[0].newdata.technology_id,
											                                    	   dimensions:arguments[0].newdata.dimensions}
											                                     //encode:"utf-8"
											                                 };
											                             }
											                             else {
											                                 param = {
											                                     url: erp_api_service.EntRelTechnologyItemEquipment[0]+ arguments[0].record.id,
											                                     method: "PATCH",
											                                     //data: Util.extend(arguments[0].record, arguments[0].newdata)
											                                     data:arguments[0].newdata
											                                     //encode:"utf-8"
											                                 };
											                             }
											                              
											                              var res = JSON.parse(bridge_map.ajax(JSON.stringify(param)));
											                             if (res != null && res.status > 199 && res.status<300) {
											                                 tipOnce("提示", "修改成功", 5000);
											                                 entity_edit_model.innerGrid[current_id].reload();
											                                 return true;
											                             }
											                             else {
											                                 tipOnce("提示", Util.formatString("修改失败，请重试[失败码:{0}]", res?res.status:null), 10000)
											                                  entity_edit_model.innerGrid[current_id].reload();
											                                 return false;
											                             }
											                         }
																}));
									}
								}
							}));
}
function beginEdit(rowid,itemId) {
	console_info(rowid+"|"+itemId);
	entity_edit_model.innerGrid[current_id].reload();
	current_id=itemId;
	entity_edit_model.innerGrid[current_id].beginEdit(rowid);
}
function cancelEdit(rowid,itemId) {
	current_id=itemId;
	entity_edit_model.innerGrid[current_id].cancelEdit(rowid);
	entity_edit_model.innerGrid[current_id].reload();
}
function endEdit(rowid,itemId) {
	current_id=itemId;
	entity_edit_model.innerGrid[current_id].endEdit(rowid);
	entity_edit_model.innerGrid[current_id].reload();
}
function deleteTechnologyById(id,current_id) {
    if (confirm('确定删除?')) {
    	if(ERPUtils.deleteEntityById(id,erp_api_service.EntRelTechnologyItemEquipment[0]))
    		tipOnce("提示", "删除成功", 10000)
    	else
    		tipOnce("提示", "删除失败，请重试.", 10000)
           entity_edit_model.innerGrid[current_id].reload();
        }
        
}
