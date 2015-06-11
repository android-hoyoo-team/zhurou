 var CookieName = "index_page";

 function getRows() {
     var rows = $.cookie(CookieName);
     if (rows) return JSON2.parse(rows);
     return getDefault();
 }

 function saveRows() {
     var rows = g.get('rows');
     var rowsJson = JSON2.stringify(rows);
     $.cookie(CookieName, rowsJson);
     showCookie();
 }

 function showCookie() {
     var rowsJson = $.cookie(CookieName);
     $("#message").html(rowsJson);
 }

 function removeCookie() {
     $.cookie(CookieName, null);
     showCookie();
 }
 var g;
 var LINKWIDTH = 90, LINKHEIGHT = 90, TASKBARHEIGHT = 43;
 var winlinksul ;
 var all_links = {
		 id1: { icon: 'images/feeding.png', title: '快捷投料', click:function(){
//			 for(var n in window)
//			 {
//				 if(typeof window[n]=='string')
//				 console_info(window[n]);
//			 }
//			 bridge_map.ajax_1_auto({
//		    		method:"get",
//		    		url:"111",
//		    		timeout:120000,
//		    		callBack:function(o)
//		    		{
//		    			var s=JSON.parse(o);
//		    			console_info(o);
//		    		}
//		    	});
			 ERPUtils.item_select_feeding();
		 	} 
		 },
		 id2: { icon: 'images/storage_in.png', title: '快捷入库',click:function(){
			 show_storage_in();
		 	}  
		 },
		 id3: { icon: 'images/storage_out.png', title: '快捷出库',  click:function(){
			 show_storage_out();
		 	} 
		 },
		 id4: { icon: 'images/item_info.png', title: '部品信息', click:function(){
			 ERPUtils.show_item_list_detail();
		 	} 
		 },
		 id5: { icon: 'images/Program Files Folder.png', title: '可拖动',click:function(){}  },
		 id6: { icon: 'images/Alien Folder.png', title: '树', click:function(){}  },
		 id7: { icon: 'images/Xp-G5 006.png', title: '下拉框',click:function(){}  },
		 id8: { icon: 'images/Xp-G5 006.png', title: '下拉框', click:function(){}  },
		 id9: { icon: 'images/Alien Folder.png', title: 'menu', click:function(){}  },
		 id10:{ icon: 'images/Xp-G5 006.png', title: 'tab', click:function(){}  },
		 id11:{ icon: 'images/3DSMAX.png', title: '分组', click:function(){} },
		 id12:{ icon: 'images/Alien Folder.png', title: 'layout', click:function(){}  }
 };
 var links=[];
// var links=[{ icon: 'images/feeding.png', title: '快捷投料', click:function(){} }];
 $(function() {
//     g = $("#portalMain").ligerPortal({
//         draggable: true,
//         rows: getRows()
//     });
	 var _user_all_info=bridge_map.get_user_info("user_all_info");
	 if(_user_all_info)
	 {
		 var user_all_info=JSON.parse(_user_all_info);
		 var user_links=user_all_info.links;
		 for(var i in user_links)
		 {
			 if(all_links["id"+user_links[i]])
			 {
				 links.push(all_links["id"+user_links[i]]);
			 }
		 }
	 }
	 winlinksul =  $("#winlinks ul");
     $(window).resize(onResize);
//     $.ligerui.win.removeTaskbar = function () { }; //不允许移除
     $.ligerui.win.createTaskbar(); //页面加载时创建任务栏

     linksInit();
     onResize();
 });
 function getDefault() {
     return [{
         columns: [
         {
             width: '30%',
             panels: [{
                 title: '部品信息查询',
                 width: '100%',
                 height: 200,
                 content: '内容。。。',
                 showClose: true
             }, 
             {
                 title: '部品库存信息',
                 width: '100%',
                 height: 200,
                 content: '内容。。。'
             }
             ]
         }, 
         {
             width: '30%',
             panels: [{
                 title: '部品投料',
                 width: '100%',
                 height: 200,
                 content: '内容。。。'
             }]
         },
         {
             width: '30%',
             panels: [{
                 title: '订单信息',
                 width: '100%',
                 height: 200,
                 content: '内容。。。'
             }]
         }
         ]
     } 
//    , {
//         columns: [
//         {
//             width: 420,
//             panels: [{
//                 title: '行2-列1-模块1',
//                 width: '100%',
//                 height: 100,
//                 content: '内容。。。'
//             }, {
//                 title: '行2-列1-模块2',
//                 width: '100%',
//                 height: 100,
//                 content: '内容。。。'
//             }]
//         }, 
//         {
//             width: 250,
//             panels: [{
//                 title: '行2-列2-模块1',
//                 width: '100%',
//                 height: 100,
//                 content: '内容。。。'
//             }]
//         }]
//     }
     ];
 }
 

    function f_open(url, title, icon) {
        var win = $.ligerDialog.open(
        { height: 500, url: url, width: 600, showMax: true, showToggle: true, showMin: true, isResize: true, modal: false, title: title, slide: false, buttons: [
            { text: '确定', onclick: function (item, Dialog, index) {
            		win.hide();
            	}
            }
        ]
        });
        var task = jQuery.ligerui.win.tasks[win.id];
        if (task) {
            $(".l-taskbar-task-icon:first", task).html('<img src="' + icon + '" />');
        }
        return win;
    }

             
    function onResize() {
        var linksHeight = $(window).height() - TASKBARHEIGHT;
        var linksWidth = $(window).width() - TASKBARHEIGHT;
        var winlinks = $("#winlinks");
        winlinks.height(linksHeight);
        winlinks.width(linksWidth);
        var colMaxNumber = parseInt(linksWidth / LINKHEIGHT);//一列最多显示几个快捷方式
        for (var i = 0, l = links.length; i < l; i++) {
            var link = links[i];
            var jlink = $("li[linkindex=" + i + "]", winlinks);
            var left  = (i % colMaxNumber) * LINKHEIGHT, top = parseInt(i / colMaxNumber) * LINKWIDTH;
            if (isNaN(top) || isNaN(left)) continue;
            jlink.css({ top: top, left: left });
        }

    }
    function linksInit() {
        for (var i = 0, l = links.length; i < l; i++) {
            var link = links[i];
            var jlink;
            var jlink = $("<li></li>");
            jlink.attr("linkindex", i);
            jlink.append("<img src='" + link.icon + "' />");
            jlink.append("<span>" + link.title + "</span>");
            jlink.append("<div class='bg'></div>");
            jlink.hover(function () {
                $(this).addClass("l-over");
            }, function () {
                $(this).removeClass("l-over");
            }).click(link.click);
            jlink.appendTo(winlinksul);
        }

    }


