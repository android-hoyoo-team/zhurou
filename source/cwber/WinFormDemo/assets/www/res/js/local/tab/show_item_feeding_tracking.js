
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
	    var _erp_item_feeding_tracking=new erp_item_feeding_tracking({div:'item_feeding_tracking',item_number:data.number});
}); 
