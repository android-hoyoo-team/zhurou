var erp_item_list=Class({
	item_info:null,
	_id:{index:0},
	data:null,
	initialize:function()
	{
		this.param={
			div:'',
			onSelectRow1: function (rowdata, rowindex) {
//            	 item_NO=rowdata.c;
//					init_item_storage(rowdata.c);
//					show_item_storage_text(rowdata.c);
//					select._toggleSelectBox(true);
		        },
		    onSelectRow2: function (rowdata, rowindex) {
//	            	 item_NO=rowdata.c;
//						init_item_storage(rowdata.c);
//						show_item_storage_text(rowdata.c);
//						select._toggleSelectBox(true);
			        }
		};
		if(!arguments[0])
		{
			tipOnce('错误','请刷新重试。');
			throw new Error("erp_item_list参数错误。");
		}
		
		if(arguments[0])
		{
			/**
			 * if() 参数判断
			 * */
			this.param=Util.extend(this.param,arguments[0]);
		}
		this._id.index++;
		this.id=this._id.index;
		this.name='__erp_item_list'+this.id;
		window[this.name]=this;
		this.param.div='#'+this.param.div.replace(/^#/,'');
		$(this.param.div).empty();
		this.init_item_search();
		this.init_item_grid();
		//arguments;
	},
	init_item_search:function()
	{
		$(this.param.div).append($('<h5 style="display:inline;margin-left:10px">部品号:</h5><input style="margin-left:5px" id="'+this.name+'_txtKey" type="text"><input style="margin-left:5px" id="'+this.name+'_btnOK" type="button" value="搜索" onclick="'+this.name+'.f_get_where()">'));
		var target=this;
		$("#"+this.name+'_txtKey').keydown(
				function(event){
					if(event.keyCode == 13){
						target.f_get_where();   
				    }
			});
	},
	f_get_where:function()
	{
		var key = $("#"+this.name+"_txtKey").val();
		if(key)
		{
			this.item_grid.set('parms', { where: JSON2.stringify({"rules":[{"field":"number","op":"like","value":key,"type":"string"}]}) });
		}
		this.item_grid.loadData();
	},
	init_item_grid:function()
	{
		 $(this.param.div).append($("<div id='"+this.name+"_item_grid'></div>"));
		this.item_grid=$("#"+this.name+"_item_grid").ligerGrid(this.get_grid_options());
	},
	get_grid_options:function() {
		var target=this;
		var options = ERPUtils.get_default_grid_option_for_url({
			url:erp_api_service.EntItem[0],
//			width:'95%',
			columns: [ {
				display : '部品编号',
				name : 'number',
				width : 350
			},
			{
	      	  display: '类别', name: 'type', width: 250,type:'int',
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
	                             onSelectRow: target.param.onSelectRow2,
	                             enabledEdit: true,
	                             detailToEdit: false,
	                             clickToEdit: false,
	                             //height:'90%',
	                             tree: { columnId: 'id1' },
	                             isScroll: false,//当 父容器detail: { height:'auto', 。。设置后  此参数失效 
	                             showToggleColBtn: false,
	                             width: "95%",
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
			onSelectRow: this.param.onSelectRow1
		});
		
		return options;
	}
});