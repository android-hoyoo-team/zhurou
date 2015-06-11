
$(function (){  
	var data=bridge_map.get_web_data();
	var _show_item_storage_in=new erp_item_storage_in({div:'_item_storage_in',item_number:data.item_number,count:data.count,feeding_id:data.feeding_id});
}); 
