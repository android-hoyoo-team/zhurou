var materia_data=[];
var entity_edit_model  = {
    manager: null,
    grid_div:'#item_full_grid',
    filter_div:'#item_full_grid_filter',
    key:'id',
    menu:null,
    url_index:0,
    url:erp_api_service.VItemFullInfo,
    top_menu:null,
    checked_record:[],
    default_pages_size:15,//默认页面大小
    pages_size:[10, 15, 30,50,100],//定义分页时 页面的大小级别
    dispaly_columns: [
          //{ display: '序号', name: 'id', width: 50, type: 'int' },
           {
        	  display: '略图', name: 'drawings',  align: 'center',width: 50,filter:false,
        	  editor: { type: 'text', height: 60 },
        	  render: function(rowdata, index, value){
            	  var h="";
            	  if(value!=null&&value!='')
            	  {
            		  var drawing= JSON.parse(value);
            		  if(drawing['type2'])
            		  {
            			  var name=drawing['type2'].name;
            			  var location=drawing['type2'].location;
            			  if(name)
            			  {
            				  if(location==null)
            					  location='';
            				  h += "<img height='50px' src='"+erp_file_service_upload+"/"+location+"/"+name+"'></img> ";
            			  }
            			  
            		  }
            		 
            		  
            		  //h += "<a href='javascript:downloadAndOpen(\"" + drawing[0].name + "\")'>图纸</a> ";
            	  }
             	  return h;
              }
          }
           ,
           {
         	  display: '图纸', name: 'drawings',  align: 'center',width: 60,filter:false,
         	  editor: { type: 'text', height: 60 },
         	  render: function(rowdata, index, value){
             	  var h="";
             	  if(value!=null&&value!='')
             	  {
             		  var drawing= JSON.parse(value);
             		  if(drawing['type1'])
             		  {
             			  var name=drawing['type1'].name;
             			  var location=drawing['type1'].location;
             			  if(name)
             			  {
             				  if(location==null)
             					  location='';
             				 // h += "<img src='"+erp_file_service_upload+"/"+location+"/"+name+"'></a> ";
             				  h += "<a href='javascript: ERPUtils.downloadAndOpen(\"" + name + "\")'>图纸</a> ";
             			  }
             			  
             		  }
             		 
             		  
             	  }
              	  return h;
               }
           },
          {
              display: '部品号', name: 'number', width:100//,  frozen: true//,
             // editor: { type: 'text', height: 60 }
          },
          {
              display: '名称', name: 'name_cn', width:100//,  frozen: true//,
             // editor: { type: 'text' }
          },
          {
        	  display: '类型', name: 'type', width: 50,
        	  editor: { type: 'text' }
          },
          {
              display: '材料', name: 'material',  align: 'center', width: 80,
              editor: { type: 'text', height: 60 }
          },
          {
              display: '工艺/工序', name: 'technologys',  align: 'left',
              editor: { type: 'text', height: 60 }
          },
          {
        	  display: '所属机种', name: 'machines',  align: 'left',width: 160,type:'text' ,
        	  editor: { type: 'text', height: 150 }
          }/*,
          {
              display: '成品库存', name: 'sum_comp_storage',  align: 'center',width: 60,type:'int' ,
              editor: { type: 'text', height: 60 }
          },
          {
              display: '半成品库存', name: 'sum_half_storage',  align: 'center',width: 60,type:'int' ,
              editor: { type: 'text', height: 60 }
          },
          {
              display: '预入库存', name: 'future_storage',  align: 'center',width: 60,type:'int' ,
              editor: { type: 'text', height: 60 }
          }*/
          /*,
          {
              display: '最后修改时间', name: 'u_time', type: 'date', format: 'yyyy-MM-dd',  align: 'center',width: 100,
              editor: { type: 'date',format: 'yyyy-MM-dd'}
          }*/
     ]
    	
};


$(function () {
	  $(f_initGrid);
});

function f_initGrid() {
	//添加顶层菜单栏
	$("#top_menu").ligerMenuBar({ items: [
	                                     /* { text: '文件',
	                                    	  menu: 
	                                    	  { width: 120, items:
	                                    		  [
	                                    		   { text: '保存', click: function(){} },
	                                    		   { text: '列存为', click: function(){} },
	                                    		   { line: true },
	                                    		   { text: '关闭', click: function(){} }
	                                    		   ]
	                                    	  } 
	                                      }*/
	                                      ]
	});
	 //鼠标右键
	entity_edit_model.menu = $.ligerMenu({ top: 100, left: 100, width: 120, items:
	        [
	        /*{ text: '增加', click: function(){},icon:'add' },
	        { text: '修改', click: function(){},disable:true },
	        { line: true },
	        { text: '查看', click: function(){} },
	        { text: '关闭', click: function(){} }*/
	        ]
	        });
	  $("#contextmenu").bind("contextmenu", function (e)
	   {
		  	entity_edit_model .menu.show({ top: e.pageY, left: e.pageX });
		    return false;
		});
        entity_edit_model .manager = $(entity_edit_model.grid_div).ligerGrid(ERPUtils.get_default_grid_option_for_url({
        	toolbar: { 
        		items: [
        		       /* { text: '删除',click:function()
        		        	{
        		        		if(entity_edit_model.checked_record&&entity_edit_model.checked_record.length>0)
        		        		{
        		        			if(confirm('确定删除'+entity_edit_model.checked_record.join(',')+'?'))
        		        			{
        		        				var errors=[];
        		        				var rights=[];
        		        				if(entity_edit_model.checked_record&&entity_edit_model.checked_record.length>0)
        		        				{
        		        					for(var i in entity_edit_model.checked_record)
        		        					{
        		        						if(!ERPUtils.deleteEntityById(entity_edit_model.checked_record[i],erp_api_service.TmpOrderFilter[0]))
        		        							errors.push(entity_edit_model.checked_record[i]);
        		        						else
        		        							rights.push(entity_edit_model.checked_record[i]);
        		        					}
        		        					if(errors.length>0)
        		        						tipOnce("提示", Util.formatString("[{0}]删除失败", errors.join(",")), 10000);
        		        					else
        		        						tipOnce("提示", Util.formatString("[{0}]删除成功", rights.join(",")), 5000);
        		        					entity_edit_model.manager.reload();
        		        				}
        		        			}
        		        			else
        		        			{
        		        				tipOnce("提示", "取消删除。", 5000);
        		        			}
        		        		}
        		        		else
        		        		{
        		        			tipOnce("提示", "请选择后删除。", 5000);
        		        		}
        		        	}, img: '../lib/ligerUI/ligerUI/skins/icons/delete.gif' },*/
        		        	
        		        { line: true },
        		        { text: '高级自定义查询', click: function(){
        		        	entity_edit_model.manager.showFilter(entity_edit_model.filter_div);
        		        }, icon: 'search2'},
        		        { line: true }
        		     ]
        	},
        	onBeforeSubmitEdit:function()
            {
                var param;
                if (arguments[0].record.__status == "add") {
                    param = {
                        url: entity_edit_model.url[entity_edit_model.url_index],
                        method: "POST",
                        data: Util.extend(arguments[0].record, arguments[0].newdata)
                        //encode:"utf-8"
                    };
                }
                else {
                    param = {
                        url: erp_api_service.EntOrder[0] + arguments[0].record.id+"/",
                        method: "PATCH",
                        //data: Util.extend(arguments[0].record, arguments[0].newdata)
                        data:arguments[0].newdata
                        //encode:"utf-8"
                    };
                }
                 
                 var res = JSON.parse(bridge_map.ajax(JSON.stringify(param)));
                if (res != null && res.status > 199 && res.status<300) {
                    tipOnce("提示", "修改成功", 5000);
                    entity_edit_model .manager.reload();
                    return true;
                }
                else {
                    tipOnce("提示", Util.formatString("修改失败，请重试[失败码:{0}]", res?res.status:null), 10000)
                    return false;
                }
            },
        	onCheckAllRow:function(checked)
        	{
        		 for (var rowid in this.records)
        		{
        			if(checked)
        				addChecked(this.records[rowid][entity_edit_model.key]);
        			else
        				removeChecked(this.records[rowid][entity_edit_model.key]);
        		}
        	},
        	onCheckRow: function(checked, data)
        	{
        		 if (checked) 
        			 addChecked(data[entity_edit_model.key]);
        		 else removeChecked(data[entity_edit_model.key]);
        	},
        	isChecked: function(rowdata)
        	{
        		 if (findChecked(rowdata.order_id) == -1)
        			   return false;
        		return true;
        	},
        	rowHeight:50,
        	 enabledEdit: true,
             detailToEdit: false,
             clickToEdit: false,
        	selectRowButtonOnly:true,
        	pageSize:entity_edit_model.default_pages_size,
            pageSizeOptions:entity_edit_model.pages_size,
        	url:entity_edit_model.url[entity_edit_model.url_index],
        	columns:entity_edit_model.dispaly_columns
        }));
}
function deleteRow_child(rowid,not_confirm) {
    if (not_confirm||confirm('确定删除?')) {
        var row = entity_edit_model .child_manager.getRow(rowid);
        if (row&&row.id)
        {
           var  param = {
               url: entity_edit_model.child_url[entity_edit_model.child_url_index] + row.id + "/",
                method: "DELETE"
           };
           var res = JSON.parse(bridge_map.ajax(JSON.stringify(param)));
           entity_edit_model .manager.reload();
           if (res != null && res.status > 199 && res.status < 300) {
        	   if(!not_confirm)
        		   tipOnce("提示", "删除成功", 5000);
           }
           else {
        	   if(!not_confirm)
        		   tipOnce("提示", Util.formatString("修改失败，请重试[失败码:{0}]", res ? res.status : null), 10000)
           }
        }
        
    }
}
function findChecked(id)
{
    for(var i =0;i<entity_edit_model .checked_record.length;i++)
    {
        if(entity_edit_model .checked_record[i] == id) return i;
    }
    return -1;
}
function addChecked(id)
{
    if(findChecked(id) == -1)
    	entity_edit_model .checked_record.push(id);
}
function removeChecked(id)
{
    var i = findChecked(id);
    if(i==-1) 
    	return;
    entity_edit_model .checked_record.splice(i,1);
}
function beginEdit(rowid) {
    entity_edit_model .manager.beginEdit(rowid);
}
function cancelEdit(rowid) {
    entity_edit_model .manager.cancelEdit(rowid);
}
function endEdit(rowid) {
    entity_edit_model .manager.endEdit(rowid);
}