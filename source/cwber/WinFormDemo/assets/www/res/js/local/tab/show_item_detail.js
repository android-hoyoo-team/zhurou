
$(function (){  
	var data=bridge_map.get_web_data();
//	    if(!target.storage_add)
//    		target.storage_add =new erp_storage_add({div:'add_storage',item_number:target.param.item_number,
//        		success:function(){
//        			target.storage_item_grid.reload();
//        			target.item_info.refresh();
//        		},error:function(){
//        			
//        		}
//    		});
//    	else
//    	{
//    		target.storage_add.toggle();
//    	}
	    var _item_full_info=new erp_item_full_info({div:'item_full_info',item_number:data.number});
//            $("#portalMain").ligerPortal({
//                draggable : true,
//                rows: [ 
//                    {
//                        columns: [{
//                            width: '100%',
//                            panels: [
//                                     {
//                                title: dialogData.number+'的基本信息',
//                                width: '100%',
//                                height: 130,
//                                frameName:'content1',
//                                data: {
//                           			 number: dialogData.number
//                           		 },
//                                url:'../tab/item_info.html'
//                            },
//                            {
//                                title: dialogData.number+'的BOM结构',
//                                width: '100%',
//                                height:300,
//                                data: {
//                          			 number:dialogData.number
//                          		 },
//                                url:'../tab/item_bom_info.html'
//                            },
//                            {
//                                title: dialogData.number+'的工序',
//                                width: '100%',
//                                height:300,
//                                data: {
//                          			 number:dialogData.number
//                          		 },
//                                url:'../tab/item_technology_info.html'
//                            }
//                            ]
//                        } 
//                          ]
//                        }
//                        ]
//            }); 
}); 
