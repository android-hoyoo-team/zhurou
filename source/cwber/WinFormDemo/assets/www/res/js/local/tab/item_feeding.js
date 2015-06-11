
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
	var feeding=new erp_feeding({
		open_div:'item_feeding',
		item_number:data.item_number,
		ok:null,
		feeding_count:data.feeding_count,
		cancle:null
	});
}); 
