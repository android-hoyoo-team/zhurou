var storage_data=[];
var entity_edit_model  = {
    manager: null,
    menu:null,
    url_index:0,
    url:erp_api_service.EntStorageChangesRecord,
    top_menu:null,
    checked_record:[],
    default_pages_size:15,//默认页面大小
    pages_size:[10, 15, 30,50,100],//定义分页时 页面的大小级别
    dispaly_columns:
    	
    	[
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
              ]
};
$(function () {
    $(f_initGrid);
});

$.ligerDefaults.Grid.editors['textarea'] = {
    create: function (container, editParm) {
        var input = $("<textarea />");
        container.append(input);
        container.width('auto').height('auto');
        return input;
    },
    getValue: function (input, editParm) {
        return input.val();
    },
    setValue: function (input, value, editParm) {
        input.val(value);
    },
    resize: function (input, width, height, editParm) {
        var column = editParm.column;
        input.width(column.editor.width);
        input.height(column.editor.height);
    }
};
function f_initGrid() {
	  $("#storage_io_record").bind("contextmenu", function (e)
	   {
		  	entity_edit_model .menu.show({ top: e.pageY, left: e.pageX });
		    return false;
		});
    entity_edit_model .manager = $("#storage_io_record").ligerGrid({
        columns: entity_edit_model.dispaly_columns,
        onSelectRow: function (rowdata, rowindex) {
        	//选择行操作
        },
        checkbox: false,//是否使用多选框
        isScroll: false,
        frozen: false,
        pageSize:entity_edit_model.default_pages_size,
        pageSizeOptions: entity_edit_model.pages_size,
        enabledEdit: true,
        detailToEdit: false,
        clickToEdit: false,
        url:entity_edit_model.url[entity_edit_model.url_index],
        method:"get",
        urlFilter:function(){
        	var op=arguments[1].options;
        	var ps=[];
        	var url=op.url+"?callback=?"+"&d_time__isnull=true||d_time__gt="+new Date().pattern("yyyy-MM-dd hh:mm:ss");
        	if(op.parms&&op.parms.where)
        	{
        		var filter=JSON.parse(op.parms.where);
        		if(filter&&filter!="")
        			url+="&"+change_ligerui_filter_to_python(filter);
        	}
        	return url;
        	
        },
        paramFilter:function(){
        	var op=arguments[1].options;
        	var ps=[];
    		var page=op.newPage;
    		var pageSize=op.pageSize;
    		var sortOrder=op.sortOrder=="asc"?"":"-";
        	if(op.sortName)
        		ps.push({name:"order_by",value:sortOrder+op.sortName});
        	ps.push({name:"offset",value:(page-1)*pageSize});
        	ps.push({name:"limit",value:pageSize});
        	return ps;
        },
        onSuccess:function()
        {
        	arguments[0].Rows=arguments[0].objects;
        	arguments[0].Total=arguments[0].meta.total_count;
        },
        toolbar: { items: [
                    { text: '高级自定义查询', click: function(){
                    	entity_edit_model .manager.showFilter("#storage_io_record_filter");
                    }, icon: 'search2'}
        ]
        },
        width: '100%'
    });
}
