var storage_data=[];
var global_model={};
var item_NO;
$(function() {
	init_form();
});
var selectGrid;
function getGridOptions() {
	var options = ERPUtils.get_default_grid_option_for_url({url:erp_api_service.EntItem[0],columns: [ {
			display : '部品编号',
			name : 'number',
			width : 150
		},
		{
      	  display: '类别', name: 'type', width: 150,type:'int',
      	  editor: { type: 'select',emptyText: null, data:getItemTypeArry(), valueColumnName: 'type', displayColumnName: 'name' },
      	  render: function (rowdata, rowindex, value) {
      		  return getItemTypeMap()[value];
      	  }
        }],
        isShowDetailToggle:function(rowData){
        	if("2"==rowData.type)
        		return true;
        	return false;
        },detail: { height:'auto',onShowDetail: function (row, detailPanel,callback)
            {
            	var _data=getItemTree(row.number,true,function(tree){
            		var grid = document.createElement('div'); 
                    $(detailPanel).append(grid);
                    $(grid).css('margin',10).ligerGrid({
                        columns:
                        	[
                            // { display: '序号', name: 'id', width: 30, type: 'int' },
                             {
                           	  display: '子件', name: 'c', id:"id1", align: 'left'
                             },
                             {
                           	  display: '层次', name: 'l', width: 40,isSort: false
                           	 // editor: { type: 'text', height: 60 }
                             },
                             {
                            	 display: '数量', name: 'n', width: 50,isSort: false,
                            	 editor: { type: 'text', height: 60 }
                             }
                             ], 
                             onSelectRow: function (rowdata, rowindex) {
                            	 item_NO=rowdata.c;
             					init_item_storage(rowdata.c);
             					show_item_storage_text(rowdata.c);
             					select._toggleSelectBox(true);
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
		onLoaded:function(g)
		{
			selectGrid=g;
		},
		/*toolbar: { items: [
		                      { text: '高级自定义查询', 
		                    	  click: function()
		                    	  {
		                    		  selectGrid.showFilter();
		                    	  }, 
		                    	  icon: 'search2'
		                    }
		                   ]
				},*/
				checkbox:false, 
				onSelectRow: function (rowdata, rowindex) {
					item_NO=rowdata.number;
					init_item_storage(rowdata.number);
					show_item_storage_text(rowdata.number);
		        }
		                      
	});
	
	return options;
}
var select;

function init_form() {
	var item_form= $("#choose_item").ligerForm({
		inputWidth : 300,
		labelWidth : 90,
		space : 40,
		fields : [{
			name : "id",
			type : "hidden"
		}, {
			display : '部品编号',
			type : 'select',
			name : 'item_number',
			isSort : false,
			isMultiSelect: false,
			editor : {
				condition: {
                    //prefixID : 'conditio',
                    fields: [
                        { label: '部品号', name: 'number', type: 'text' }
                    ]
                },
                onButtonClick:function(){
                	select=this;
                },
				selectBoxWidth: 400 ,
    	  		selectBoxHeight:300,
				valueField : 'number',
				textField : 'number',
				grid : getGridOptions()
			}
		}]
	});
}
var storage_item_grid;
function init_item_storage(item_number)
{
	storage_item_grid=$("#show_item").ligerGrid(ERPUtils.get_default_grid_option_for_url(
			{	url:erp_api_service.EntRelItemItem[0]+"?p_item_number="+item_number,
				width:"95%",
				height:270,
				isScoll:true,
				//minColToggle:10,
				columns: [
					{
						width:100,
						display : '子件',
						type:'text',
						name : 'c_item_number'
					},
					/*{
						width:80,
						display : '预期库存',
						name : 'future_count'
					},*/
					{
						display : '数量',
						name : 'count',
						width:70,
						 editor: { type: 'select',emptyText: null, data:getStorageItemTypeArry(), valueColumnName: 'type', displayColumnName: 'name' },
						 render: function (rowdata, rowindex, value) {
							 return getStorageItemTypeMap()[value];
						 }
					},
					{
						display : '备注',
						name : 'remark',
						width:150,
						editor: { type: 'text'}
					},
                    {
                    	width:100,
                        display: '操作', isSort: false, filter:false, render: function (rowdata, rowindex, value) {
                            var h = "";
                            if (!rowdata._editing) {

                                h += "<a href='javascript:addCount(" + rowindex + ")'>入库</a> ";
                                if(rowdata.actual_count==null||rowdata.actual_count+''=='0')
                                	h += "<a href='javascript:delete_storage(" + rowindex + ")'>删除</a> ";
                            }
                            else {
                                h += "<a href='javascript:endEdit(" + rowindex + ")'>提交</a> ";
                                h += "<a href='javascript:cancelEdit(" + rowindex + ")'>取消</a> ";
                            }
                            return h;
                        }
                    }
					],
					 onBeforeSubmitEdit:function()
                     {
                         var param;
                         if (arguments[0].record.__status == "add") {
                        	 //alert(arguments[0].newdata.__index).val());
                        	 var r= /^[0-9]*[1-9][0-9]*$/ ;
                        	 var add;
                        		if(r.test(arguments[0].newdata.add_count)){
                        			add=arguments[0].newdata.add_count;
                        		}
                        		else{
                        			tipOnce("提示", "入库数量不准确", 5000);
                        			return false;
                        		}
                        		var inrecord_data={"count": add,
                        		           "item_number": item_NO,
                        		           "item_type": arguments[0].newdata.type,
                        		           "remark": arguments[0].newdata.add_remark,
                        		           "storage_name": arguments[0].newdata.storage_name,
                        		           "type": "入库"
                        		           };
                        		add_info_to_iorecord(inrecord_data);
                             param = {
                                 url: erp_api_service.EntRelStorageItem[0],
                                 method: "POST",
                                 data: {"actual_count":add,
                                	 "item_number":item_NO, "storage_name": arguments[0].newdata.storage_name,
                                	 "type":arguments[0].newdata.type
                                 }
                                 //encode:"utf-8"
                             };
                         }
                         else {
                             param = {
                                 url: erp_api_service.EntRelStorageItem[0] + arguments[0].record.id,
                                 method: "PATCH",
                                 //data: Util.extend(arguments[0].record, arguments[0].newdata)
                                 data:arguments[0].newdata
                                 //encode:"utf-8"
                             };
                         }
                          var res = JSON.parse(bridge_map.ajax(JSON.stringify(param)));
                         if (res != null && res.status > 199 && res.status<300) {
                             tipOnce("提示", "入库成功", 5000);
                             storage_item_grid.reload();
                             item_info.refresh();
                             return true;
                         }
                         else {
                             tipOnce("提示", Util.formatString("修改失败，请重试[失败码:{0}]", res?res.status:null), 10000)
                             return false;
                         }
                     },
					 toolbar: { items: [
					                    
					                    	{
					                        text: '添加新库位', click: function () {
					                        	if(!global_model.storage_add)
					                        		global_model.storage_add =new erp_storage_add({div:'add_storage',item_number:item_NO,
						                        		success:function(){
						                        			 storage_item_grid.reload();
						                                     item_info.refresh();
						                        		},error:function(){
						                        			
						                        		}
					                        		});
					                        	else
					                        	{
					                        		global_model.storage_add.toggle();
					                        	}
//					                        	add_storage
//					                        	storage_item_grid.addEditRow();
					                        }, icon: 'add'
					                    	}
					                    ]
					 	},
					 	enabledEdit: true, 
					 	checkbox:false,
					 	clickToEdit: false,
					 	rownumbers:true
			})
	);
}
function delete_storage(rowid)
{
	var row=this.storage_item_grid.getRow(rowid);
	if(row.id)
	{
		if(confirm("确定删除?"))
		{
			if(ERPUtils.deleteEntityById(row.id,erp_api_service.EntRelStorageItem[0]))
			{
				tipOnce("提示", "删除成功", 5000);
				this.storage_item_grid.reload();
				this.item_info.refresh();
			}
			else
			{
				tipOnce("提示", "删除失败,请刷新后重试", 5000);
			}
		}
	}
	
}
function addCount(rowid) {
	var row=storage_item_grid.getRow(rowid);
	var old=Number(row.actual_count);
	var string_add=$("#add_count"+row.__index).val();
	var string_remark=$("#add_remark"+row.__index).val();
	var add;
	/*验证 是否合法
	 * */
	var r= /^[0-9]*[1-9][0-9]*$/ ;
	if(r.test(string_add)){
		add=Number(string_add);
	}
	else{
		tipOnce("提示", "入库数量不准确", 5000);
		return;
	}
	var inrecord_data={"count": add,
	           "item_number": item_NO,
	           "item_type": row.type,
	           "remark": string_remark,
	           "storage_id": row.storage_id,
	           "type": "入库"
	           };
	add_info_to_iorecord(inrecord_data);
	 var param = {
             url: erp_api_service.EntRelStorageItem[0] + row.id,
             method: "PATCH",
             //data: Util.extend(arguments[0].record, arguments[0].newdata)
             data:{actual_count:old+add}
             //encode:"utf-8"
         };
      
      var res = JSON.parse(bridge_map.ajax(JSON.stringify(param)));
     if (res != null && res.status > 199 && res.status<300) {
         tipOnce("提示", "入库成功", 5000);
         storage_item_grid.reload();
         item_info.refresh();
     }
     else{
         tipOnce("提示", "入库失败", 5000);
        console_info(res);
     }
}
function cancelEdit(rowid) {
	storage_item_grid.cancelEdit(rowid);
	storage_item_grid.deleteRow(rowid);
}
function endEdit(rowid) {
	storage_item_grid.endEdit(rowid);
}
var　item_info;
function show_item_storage_text(item_number){
	item_info=new erp_item_info({
		div:'show_item_storage',
		item_number:item_number
	});
}
function add_info_to_iorecord(data)
{
	var param = {
            url: erp_api_service.EntStorageChangesRecord[0],
            method: "POST",
            data: data
            };
	  var res = JSON.parse(bridge_map.ajax(JSON.stringify(param)));
      if (res != null && res.status > 199 && res.status<300) {
          storage_item_grid.reload();
          return true;
      }
      else {
          tipOnce("提示", Util.formatString("修改失败，请重试[失败码:{0}]", res?res.status:null), 10000)
          return false;
      }
}