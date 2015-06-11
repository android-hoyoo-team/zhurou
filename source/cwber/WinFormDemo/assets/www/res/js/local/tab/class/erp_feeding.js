var erp_feeding=Class({
	item_info:null,
	feeding_form:null,
	open_div:null,
	has_finish:null,
	param:{
		open_div:'',
		item_number:'',
		feeding_count:null,
		title:'',
		ok:null,
		cancle:null
	},
	initialize:function()
	{
		if(!arguments[0])
		{
			tipOnce('错误','请刷新重试。');
			throw new error("erp_feeding参数错误。");
		}
		
		if(arguments[0])
		{
			/**
			 * if() 参数判断
			 * */
			this.param=Util.extend(this.param,arguments[0]);
		}
		this.param.open_div='#'+this.param.open_div;
		$(this.param.open_div).empty();
		this.init_item_info();
		this.init_form();
		this.setData();
		
		//this.open_feeding_div();
		//arguments;
	},
	init_item_info:function()
	{
		//var item_info =$("<div id='item_info'></div>");
		$(this.param.open_div).append($("<div id='item_info'></div>"));
		this.item_info=new erp_item_info({
			div:'item_info',
			item_number:this.param.item_number
		});
	},
	init_form:function()
	{
		var _feeding_from =$("<div id='feeding_form'></div>");
		$(this.param.open_div).append(_feeding_from);
		//{"feeding_date":feeding_date,"feeding_count":feeding_count,"item_number":item_number,plan_storage_time:plan_storage_time}
		this.feeding_form=$("#feeding_form").ligerForm({
			inputWidth: 170, labelWidth: 90, space: 40,
			fields: 
				[
				 { display: "投料数量", name: "feeding_count", newline: true, type: "int" },
				 { display: "投料时间", name: "feeding_date", newline: true, type: "date" ,options:{showTime: true}},
				 { display: "预计入库时间", name: "plan_storage_time", newline: true, type: "date"  },
				 { display: "备注", name: "remark", newline: true, type: "text"  }
				 ]
			, buttons: [
		               { text: '投料', width: 60, click: this.feeding_save() }
		           ]
		});
		
		//console_info(this.feeding_form.getData());
	},
	setData:function()
	{
		this.feeding_form.setData({
			feeding_count:this.param.feeding_count?this.param.feeding_count:null,
			feeding_date:new Date()
		});
	},
	refresh:function(){
		this.setData();
	},
	feeding_save:function(){
		var t=this;
		return function(){
			if(!t.has_finish)
			{
				//{"feeding_date":feeding_date,"feeding_count":feeding_count,"item_number":item_number,plan_storage_time:plan_storage_time}
				var d=t.feeding_form.getData();
				d.item_number=t.param.item_number;
				if(ERPUtils.feeding_and_tracking(d))
				{
					t.item_info.refresh();
					t.has_finish=true;
				}
			}
			else
			{
				tipOnce('提示','不能重复投料',5000);
			}
		};
	},
	open_feeding_div:function()
	{
		var t=this;
		this.open_div=$.ligerDialog.open(
				{ 	
					title:this.param.title?this.param.title:'投料',
					target: $(this.param.open_div),
					isResize:true,
					height: 400,
					width:700,
					buttons: [
					          { text: '确定',cls:'l-dialog-btn-highlight',onclick:this.param.ok!=null&&typeof(this.param.ok)=='function'?this.param.ok: function (item, dialog) {
					        	  if(!t.has_finish)
					        	  {
					        		  if(confirm("没有进行投料操作，确定退出？"))
					        		  {
					        			  dialog.hidden(); 
					        		  }
					        	  }
					        	  else
					        	  {
					        		  dialog.hidden(); 
					        	  }  
					          	}
					          }
					          /*,
					          { text: '取消', onclick:this.param.cancle!=null&&typeof(this.param.cancle)=='function'?this.param.cancle:function (item, dialog) {
					        	  dialog.hidden(); 
					          	}
					          }*/
					          ]
				});
	}
});