var erp_export=Class({
	form:null,
	export_filter:null,
	param:null,
	data:null,
	initialize:function()
	{
		this.param={
				div:'',
				query:null,
				fields:null,
				grid:null,
			    table_name:null,
				file_path:null,
				file_name:null,
				charset:'utf-8',
				headers:null,
				other_query:null
				};
		if(!arguments[0])
		{
			tipOnce('错误','请刷新重试。');
			throw new Error("erp_admin参数错误。");
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
		if(this.param.table_name&&this.param.table_name!='')
		{
			this.init_filter();
		}
		this.init_form();
		this.setData();
		//arguments;
	},
	init_form:function()
	{
		 /*	query		*
			headers		*
			charset		*
			file_name
			file_path
			sheet_name
			
			*/
		 $(this.param.div).append($("<div id='export_form'></div>"));
		this.form=$('#export_form').ligerForm({
			inputWidth: 170, labelWidth: 90, space: 40,
			fields: 
				[
				 { display: "导出文件路径", name: "file_path",newline: true, type: "folder",editor:{type: "folder",readonly:false},newline: true,width:150},//, group: "基础信息", groupicon: groupicon},
				 { display: "导出文件名", name: "file_name",newline: true, type: "text",editor:{readonly:false},newline: true,width:150},//, group: "基础信息", groupicon: groupicon},
				 { display: "导出工作簿名", name: "sheet_name",newline: true, type: "text",editor:{readonly:false},width:150}
				 ]
				, buttons: [
		          { text: '导出', width: 50,newline: false, click:this._export()
		          }
		          ]
		});
	},
	init_filter:function()
	{
		 if(this.param.grid&&this.param.grid.__filter)
		 {
			 this.export_filter=this.param.grid.__filter;
		 }
		 else
		 {
			 $(this.param.div).append($("<div id='__export_filter'></div>"));
			 this.export_filter = $("#__export_filter").ligerFilter({ fields: this.param.fields });
		 }
//
//		 $("#Button1").click(function ()
//				 {
//			 var group = filter.getData();
//			 $("#txtGroup").val($.ligerui.toJSON(group));
//				 });
		    
	},
	change_fields_2_query:function()
	{
		var f=this.export_filter.options.fields;
		
//		console_info(f);
		var res=null;
		var j=0;
		for(var i in f)
		{
			if(!f[i].filter&&f[i].name&&f[i].name.toString().trim())
			{
				if(j==0)
				{
					this.param.headers=[];
					res='';
					if(f[i].type=='date')
						res+="f_change_date_to_string(`"+f[i].name+"`)";
					else
						res+=f[i].name;
					this.param.headers.push(f[i].display);
					j++;
				}
				else
				{
					if(f[i].type=='date')
						res+=",f_change_date_to_string(`"+f[i].name+"`)";
					else
						res+=","+f[i].name;
					this.param.headers.push(f[i].display);
				}
			}
		}	
		return res;
	},
	change_filter_2_query:function()
	{
		var fData=this.export_filter.getData();
		return this._change_ligerui_filter_to_query(fData);
	},
	_change_ligerui_filter_to_query:function(filter)
	{
		py=null;
		var rules=filter["rules"];
		var op=this._getOperatorQueryText(filter["op"]);
		var tag=0;
		for(var i in rules)
		{
			var r=rules[i];
			if(r["value"]&&r["value"]!="")
			{	var v=r["value"];
				if(r['type']!='int'&&r['type']!='number')
					v="'"+v+"'";
				if(tag==0)
				{
					py='';
					py+=r["field"]+Util.formatString(this._getOperatorQueryText(r["op"]),v);
					tag++;
				}
				else
				{
					py+=op+r["field"]+Util.formatString(this._getOperatorQueryText(r["op"]),v);
//					py+=op+r["field"]+_getOperatorQueryText(r["op"])+"="+r["value"];
				}
			}
		}
		if(this.param.other_query)
		{
			py+=this.param.other_query;
		}
		if(this.param.grid)
		{
			var op=this.param.grid.options;
			_sortOrder=op.sortOrder;
			_sortName=op.sortName;
			if(_sortName)
			{
				py+=" order by "+_sortName+" "+_sortOrder;
			}
		}
		return py;
	},
	 _getOperatorQueryText:function (op)
	{
		 switch (op)
		 {
		 case "equal":
			 return " = {0} ";
		 case "notequal":
			 return " <> {0} ";
		 case "greater":
			 return " > {0} ";
		 case "greaterorequal":
			 return " >= {0} ";
		 case "less":
			 return " < {0} ";
		 case "lessorequal":
			 return " <= {0} ";
		 case "startwith":
			 return " like '{0}%' ";
		 case "endwith":
			 return " like '%{0}' ";
		 case "like":
			 return " like '%{0}%' ";
		 case "contain":
			 return " like '%{0}%' ";
		 case "in":
			 return " in {0} ";
		 case "and":
			 return " and ";
		 case "or":
			 return " or ";
		 default:
			 return " = ";
		 }
	},
	
	_export:function(){
		var t=this;
		return function(){
			//console_info(t.export_filter.getData());
			if(!t.has_finish)
			{
				if(t.checkData())
				{
					if(t.export_filter)
					{
						var filter= t.change_filter_2_query();
						var fs=t.change_fields_2_query();
						var tb=t.param.table_name;
						if(fs&&tb)
						{
							
							t.param.query=Util.formatString("select {0} from {1} ",fs,tb);
							if(filter)
							{
								t.param.query=Util.formatString(t.param.query+"where {0} ",filter);
								
							}	
						}
					}	
					if(t.param.query)
					{
						var param={
								query:t.param.query,
								file_name:t.param.file_name,
								file_path:t.param.file_path,
								sheet_name:t.param.sheet_name,
								headers:t.param.headers,
								charset:t.param.charset
						};
						//console_info(param);
//						var res
						dialogWait("正在导出，请稍后......",function(){
							var res =bridge_map.export_excel(param);
							if(res.status=='success')
								return true;
							return false;
						},null,function(){
							tipOnce('提示','导出成功',5000);
						},null,function(){
							tipOnce('提示','导出失败，请重试',5000);
						});
						
					}	
				}
			}
			else
			{
				tipOnce('提示','不能重复投料',5000);
			}
		};
	},
	setData:function()
	{
		this.form.setData({
			file_path:this.param.file_path?this.param.file_path:'',
			sheet_name:this.param.sheet_name?this.param.sheet_name:'sheet',
			file_name:this.param.file_name?this.param.file_name:this.param.table_name
		});
	},
	checkData:function()
	{
		var d= this.form.getData();
		if(d.file_path==null||d.file_path=="")
		{
			tipOnce("错误","导出文件路径不能为空",5000);
			return false;
		}	
		if(d.file_name==null||d.file_name=="")
		{
			tipOnce("错误","导出文件名不能为空",5000);
			return false;
		}	
		this.param.sheet_name=d.sheet_name;
		this.param.file_path=d.file_path;
		this.param.file_name=d.file_name+".xls";
		return true;
	},
	toggle:function()
	{
		$(this.param.div).slideToggle("slow");
//		$(this.param.div).toggle();
	}
});
