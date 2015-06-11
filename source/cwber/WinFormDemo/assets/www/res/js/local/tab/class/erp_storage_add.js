var erp_storage_add=Class({
	form:null,
	data:null,
	initialize:function()
	{
		this.param={
				div:'',
				item_number:null,
				type:null,
				type_info:null,
				storage_name:null,
				actual_count:null,
				remark:null,
				success:null
				};
		if(!arguments[0])
		{
			tipOnce('错误','请刷新重试。');
			throw new Error("erp_storage_add参数错误。");
		}
		if(!arguments[0]['item_number'])
		{
			tipOnce('错误','item_number不存在。');
			throw new Error("erp_storage_add参数错误。");
			return;
		}
		if(arguments[0])
		{
			/**
			 * if() 参数判断
			 * */
			this.param=Util.extend(this.param,arguments[0]);
		}
		this.param.div='#'+this.param.div;
		$(this.param.div).empty();
		//console_info(this.param);
		this.init_form();
		this.setData();
		//arguments;
	},
	init_form:function()
	{
		/* "item_number": item_NO,
                        		           "item_type": arguments[0].newdata.type,
                        		           "remark": arguments[0].newdata.add_remark,
                        		           "storage_name": arguments[0].newdata.storage_name,
                        		           "type": "入库"
			
			*/
		 $(this.param.div).append($("<div id='inner_form'></div>"));
		this.form=$('#inner_form').ligerForm({
			inputWidth: 170, labelWidth: 90, space: 40,
			fields: 
				[
//				 { display: "部品号", name: "item_number",newline: true, type: "text",editor:{type: "text",readonly:true},newline: true,width:150},//, group: "基础信息", groupicon: groupicon},
				 { display: "状态", name: "type",newline: true, type: "select",editor:{type: "select",emptyText: null, data:getStorageItemTypeArry(), valueColumnName: 'type', displayColumnName: 'name' ,readonly:false},newline: true,width:150},//, group: "基础信息", groupicon: groupicon},
				 { display: "类型", name: "type_info",newline: true, type: "text",editor:{type: "text",readonly:false},newline: true,width:150},//, group: "基础信息", groupicon: groupicon},
				 { display: "仓库位置", name: "storage_name",newline: true, type: "text",editor:{readonly:false},newline: true,width:150}//, group: "基础信息", groupicon: groupicon},
//				 { display: "入库数量", name: "actual_count",newline: true, type: "int",editor:{readonly:false},width:150},
//				 { display: "备注", name: "remark",newline: true, type: "textarea",editor:{readonly:false},width:150}
				 ]
				, buttons: [
				            { 
				            	text: '添加', width: 50,newline: false, click:this._add()
				            }
		          ]
		});
	},
	
	
	_add:function(){
		var t=this;
		return function(){
			if(!t.has_finish)
			{
				if(t.checkData())
				{
					var data=t.form.getData();
//					var inrecord_data={
//							"count": data.actual_count,
//							"item_number": t.param.item_number,
//							"item_type": data.type,
//							"remark": data.remark,
//							"storage_name": data.storage_name,
//							"type": "入库"
//					};
//					console_info(inrecord_data);
//					console_info(inrecord_data);
//					add_info_to_iorecord(inrecord_data);
					param = {
							url: erp_api_service.EntRelStorageItem[0],
							method: "POST",
							data: {
								"actual_count":0,
								"item_number":t.param.item_number, 
								"storage_name":  data.storage_name,
								"type":data.type,
								"type_info":data.type_info
							}
					//encode:"utf-8"
					};
					 var res = JSON.parse(bridge_map.ajax(JSON.stringify(param)));
                     if (res != null && res.status > 199 && res.status<300) {
                         tipOnce("提示", "添加库位成功", 5000);
//                         console_info(t.param);
                         
                         t.setData();
                         if(typeof(t.param.success)=='function')
                        {
                        	 t.param.success();
                        }
                     }
                     else {
                    	  if(typeof(t.param.error)=='function')
                          {
                          	 t.param.error();
                          }
                         tipOnce("提示", Util.formatString("修改失败，请重试[失败码:{0}]", res?res.status:null), 10000)
                     }
					
					//t.form.refresh();
					//t.has_finish=true;
				}
             	 
			}
			else
			{
				tipOnce('提示','不能重复添加',5000);
			}
		};
	},
	setData:function()
	{
		this.form.setData({

			//item_number:this.param.item_number?this.param.item_number:null,
			type:this.param.type?this.param.type:'',
			storage_name:this.param.storage_name?this.param.storage_name:'',
//			actual_count:this.param.actual_count?this.param.actual_count:0,
			type:this.param.type?this.param.type:''
			//remark:this.param.remark?this.param.remark:''
		});
	},
	checkData:function()
	{
		var d= this.form.getData();
//		if(d.item_number==null||d.item_number=="")
//		{
//			tipOnce("错误","部品号不能为空",5000);
//			return false;
//		}	
		if(d.type==null||d.type=="")
		{
			tipOnce("错误","类型不能为空",5000);
			return false;
		}	
		if(d.storage_name==null||d.file_name=="")
		{
			tipOnce("错误","位置不能为空",5000);
			return false;
		}	
//		if(d.actual_count==null||d.actual_count=="")
//		{
//			
//			tipOnce("错误","入库数量不能为空",5000);
//			return false;
//		}else
//		{
//			var r= /^[0-9]*[1-9][0-9]*$/ ;
//       	 	var add;
//       		if(r.test(d.actual_count)){
//       		}
//       		else{
//       			tipOnce("提示", "入库数量不准确", 5000);
//       			return false;
//       		}
//		}
//		this.param.item_number=d.item_number;
//		this.param.type=d.type;
//		this.param.storage_name=d.storage_name;
//		this.param.actual_count=d.actual_count;
//		this.param.remark=d.remark;
		return true;
	},
	toggle:function()
	{
		$(this.param.div).slideToggle("slow");
//		$(this.param.div).toggle();
	}
});
