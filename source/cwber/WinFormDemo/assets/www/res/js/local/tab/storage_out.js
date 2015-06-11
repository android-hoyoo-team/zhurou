var storage_data=[];
var item_NO;
$(function() {
	new erp_item_list({div:'item_list',onSelectRow1: function (rowdata, rowindex) {
			ERPUtils.show_item_storage_out(rowdata.number);
    	},
    	onSelectRow2: function (rowdata, rowindex) {
   			ERPUtils.show_item_storage_out(rowdata.c);
       	}
	});
//	init_item_grid();
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
	 $("#choose_item").ligerForm({
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
var item_grid;
function init_item_grid()
{
	item_grid=$("#choose_item").ligerGrid(getGridOptions());
}
var storage_item_grid;
function init_item_storage(item_number)
{
	storage_item_grid=$("#show_item").ligerGrid(ERPUtils.get_default_grid_option_for_url(
			{url:erp_api_service.EntRelStorageItem[0]+"?item_number="+item_number+"&actual_count__isnull=false&future_count__isnull=true",
				width:"95%",
				height:270,
				isScoll:true,
				columns: [
					{
						display : '实际库存',
						type:'int',
						width:80,
						name : 'actual_count'
					},
					/*{
						display : '预期库存',
						width:80,
						name : 'future_count'
					},*/
					{
						display : '状态',
						width:80,
						name : 'type',
						editor: { type: 'select',emptyText: null, data:getStorageItemTypeArry(), valueColumnName: 'type', displayColumnName: 'name' },
						render: function (rowdata, rowindex, value) {
							 return getStorageItemTypeMap()[value];
						}
					},
					{
	    	 			display: '类型信息', name: 'type_info',width:100,
	    	 			editor:{type:'text'}
	    	 		},
					{
						display : '仓库位置',
						name : 'storage_name',
						type:'text',
						editor:{type:'text'}
						/*name : 'storage_id',
						type:'int',
						width:100,
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
                    /*render:function (item)
                    {
                    			for (var i = 0; i < storage_data.length; i++)
                    			{
                    					if (storage_data[i]['id']+"" == item.storage_id+"")
                    					{
                    						return storage_data[i]['name'];
                    					}
                    			}
                    			return "";
                    }*/
					},
					{ display: '出库数量', name: 'add_count', align: 'right', 
						editor: { type: 'int'},
						width:100,
						render: function (rowdata, rowindex, value) {
                  		  return "<input id='add_count"+rowindex+"' type='text' style='width:80px'/>";
                  	  }
                    },
					{ display: '出库备注', name: 'add_remark', align: 'right', 
						editor: { type: 'text'},
						width:200,
						render: function (rowdata, rowindex, value) {
							return "<select id='add_remark"+rowindex+"' style='width:130px'>"+
							  "<option value ='发货'>发货</option>"+  
							  "<option value ='外协'>外协</option>"+
							  "<option value='外协'>领料</option>"+ 
							  "<option value='其他'>其他</option>"+
							"</select>"; 
	                  		  //return "<input id='add_remark"+rowindex+"' type='text' style='width:170px'/>";
	                  	  }
                    },
                    {
                    	width:100,
                        display: '操作', isSort: false, filter:false, render: function (rowdata, rowindex, value) {
                            var h = "";
                                h += "<a href='javascript:addCount(" + rowindex + ")'>出库</a> ";
                            return h;
                        }
                    }
					],
					 	checkbox:false,
					 	clickToEdit: false,
					 	rownumbers:true
			})
	);
}
var addCount_index=0;
function addCount(rowid) {
	var row=storage_item_grid.getRow(rowid);
	var old=Number(row.actual_count);
	var string_add=$("#add_count"+row.__index).val();
	var string_remark=$("#add_remark"+row.__index).val();
	var add;
	/*验证 是否合法
	 * */
	var r= /^[0-9]*[1-9][0-9]*$/ ;
	if(r.test(string_add)&&(Number(string_add))){//<=(Number(row.actual_count))
		
		add=Number(string_add);
	}
	else{
		tipOnce("提示", "出库数量不准确", 5000);
		return;
	}
	var inrecord_data={"count": add,
	           "item_number": item_NO,
	           "item_type": row.type,
	           "remark": string_remark,
	           "storage_id": row.storage_id,
	           "type": "出库"
	           };
	 var param = {
             url: erp_api_service.EntRelStorageItem[0] + row.id,
             method: "PATCH",
             //data: Util.extend(arguments[0].record, arguments[0].newdata)
             data:{actual_count:old-add}
             //encode:"utf-8"
         };
      
      var res = JSON.parse(bridge_map.ajax(JSON.stringify(param)));
     if (res != null && res.status > 199 && res.status<300) {
    	 addCount_index=0;
    	 add_info_to_iorecord_index=0;
    	 add_info_to_iorecord(inrecord_data);
         tipOnce("提示", "出库成功", 5000);
         item_info.refresh();
     }
     else
     {
    	 addCount_index++;
    	 if(addCount_index==5)
    		 tipOnce("提示", "出库失败，请重试", 5000);
    	 else
    	{
    		 addCount(rowid);
    	}
     }
     storage_item_grid.reload();
}
var item_info;
function show_item_storage_text(item_number){
	item_info=new erp_item_info({
		div:'show_item_storage',
		item_number:item_number
	});
}
var add_info_to_iorecord_index;
function add_info_to_iorecord(data)
{
	add_info_to_iorecord_index++;
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
    	  if(add_info_to_iorecord_index==10)
    	  {
    		  tipOnce("提示", Util.formatString("已经尝试若干次，添加库存记录失败,", res?res.status:null), 10000)
    		  return false;
    		  
    	  }
    	  else
    	  {
    		  return add_info_to_iorecord(data);
    	  }  
      }
}