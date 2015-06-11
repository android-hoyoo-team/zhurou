

var erp_api_service = {
	EntFeeding : [ erp_api_service_base + "EntFeeding/",
					erp_api_service_trash + "EntFeeding/" ],
	EntFeedingStatus : [ erp_api_service_base + "EntFeedingStatus/",
					erp_api_service_trash + "EntFeedingStatus/" ],
	EntUser : [ erp_api_service_base + "EntUser/",
			erp_api_service_trash + "EntUser/" ],
	EntMenu : [ erp_api_service_base + "EntMenu/",
			erp_api_service_trash + "EntMenu/" ],
	EntMaterial : [ erp_api_service_base + "EntMaterial/",
			erp_api_service_trash + "EntMaterial/" ],
	EntMachine : [ erp_api_service_base + "EntMachine/",
			erp_api_service_trash + "EntMachine/" ],
	EntRelItemItem : [ erp_api_service_base + "EntRelItemItem/",
			erp_api_service_trash + "EntRelItemItem/" ],
	EntOrder : [ erp_api_service_base + "EntOrder/",
			erp_api_service_trash + "EntOrder/" ],

	EntItem : [ erp_api_service_base + "EntItem/",
			erp_api_service_trash + "EntItem/" ],
	EntTechnology : [ erp_api_service_base + "EntTechnology/",
			erp_api_service_trash + "EntTechnology/" ],
	
	EntStorage:[erp_api_service_base + "EntStorage/"],
	EntStorageChangesRecord:[erp_api_service_base + "EntStorageChangesRecord/"],
	
	EntRelTechnologyItemEquipment : [ erp_api_service_base
			+ "EntRelTechnologyItemEquipment/" ],

	EntRelMachineItem : [ erp_api_service_base + "EntRelMachineItem/" ],
	EntRelItemItem : [ erp_api_service_base + "EntRelItemItem/" ],
	EntRelItemDrawing : [ erp_api_service_base + "EntRelItemDrawing/" ],
	
	EntRelStorageItem:[ erp_api_service_base + "EntRelStorageItem/" ],

	TmpOrderFilter : [ erp_api_service_base + "TmpOrderFilter/" ],
	TmpItemFullRel : [ erp_api_service_base + "TmpItemFullRel/" ],
	TmpOrderAnalysis : [ erp_api_service_base + "TmpOrderAnalysis/" ],

	VFeedingTracking : [erp_api_service_base + "VFeedingTracking/"],
	VOrder : [ erp_api_service_base + "VOrder/" ],
	VOrderAnalysis : [ erp_api_service_base + "VOrderAnalysis/" ],
	VOrderFilterExtract : [ erp_api_service_base + "VOrderFilterExtract/" ],
	VOrderAnalysis2 : [ erp_api_service_base + "VOrderAnalysis2/" ],
	VItemFullInfo : [ erp_api_service_base + "VItemFullInfo/" ],
	VOrderAnalysisGroupByNumber : [ erp_api_service_base + "VOrderAnalysisGroupByNumber/" ],
	VStorageItemGroupByItem : [ erp_api_service_base + "VStorageItemGroupByItem/" ],

	VItemFullStorage : [ erp_api_service_base + "VItemFullStorage/" ],

	TmpOrder : [ erp_api_service_base + "TmpOrder/" ],
	SuperAPI : [ erp_api_service_super + "superAPI/" ]
};
var erp_api_sql = {
	truncate_tmp_order : "TRUNCATE TABLE `tmp_order`",
	truncate_ent_order : "TRUNCATE TABLE `ent_order`",
	truncate_ent_feeding : "TRUNCATE TABLE `ent_feeding`",
	truncate_ent_feeding_status : "TRUNCATE TABLE `ent_feeding_status`",
	truncate_ent_storage_changes_record : "TRUNCATE TABLE `ent_storage_changes_record`",
	truncate_tmp_order_filter : "TRUNCATE TABLE `tmp_order_filter`",
	delete_future_count : "DELETE FROM `ent_rel_storage_item` WHERE future_count IS NOT NULL",
	
	
	import_order_from_tmp:'CALL order_insert_tmp_to_ent()',
	procedure_item_tree_create_all : "call item_tree_create_all()",
	procedure_item_tree_create_by_number : "call item_tree_create_by_number('{0}')",
	procedure_sp_order_analysis : "call sp_order_analysis({0},{1},{2},{3})",
	procedure_order_analysis4 : "call order_analysis4({0},{1},{2})",
	procedure_order_analysis3 : "call order_analysis3({0},{1},{2})",
	procedure_order_analysis2 : "call order_analysis2({0},{1})",
	procedure_feeding_status_init : "call p_feeding_status_init({0})",
	procedure_item_item_delete_by_p_c : "call item_item_delete_by_p_c('{0}','{1}')",
	p_feeding_into_stroage : "call p_feeding_into_storage({0})",
	item_type_create_all : "CALL `item_type_create_all`()",
	item_tree_create_all_leaf : "CALL `item_tree_create_all_leaf`()",
	
	
	procedure_feeding_delete : "call p_feeding_delete({0})",
	item_need_feed : "SELECT CAST(order_need AS SIGNED) -future_count FROM `v_order_analysis_group_by_number` WHERE c='{0}'",
	item_future_storage : "select f_get_component_future_storage('{0}',0)",
	item_material_info : "SELECT ent_material.`name`,  ent_material.`material_type`,  ent_material.`length`,ent_material.`width`, ent_material.`height`,ent_material.`radius`,ent_material.`unit`,  ent_material.`remark` FROM `ent_item`,`ent_material` WHERE ent_item.`material`=ent_material.`id` AND ent_item.`number`='{0}' AND (ent_item.`d_time` IS  NULL OR ent_item.`d_time`>NOW()) AND (ent_material.`d_time`>NOW()OR ent_material.`d_time` IS NULL);",
	item_comp_storage : "select f_get_component_comp_storage('{0}')",
	item_half_storage : "select f_get_component_half_storage('{0}')",
	item_actual_storage : "select f_get_component_actual_storage('{0}',0)",
	item_half_storage : "select f_get_component_half_storage('{0}')",
	item_find_drawing_array : "select item_find_drawing_array('{0}')",
	item_find_technology_array : "select item_find_technology_array('{0}')",
	item_find_technology_info_array : "select item_find_technology_info_array('{0}')",
	check_item_has_child : "select check_item_has_child('{0}','{1}')",
	machine_item_find_machines_by_item : "select machine_item_find_machines_by_item('{0}')",
	query_to_order_filter : "INSERT INTO `tmp_order_filter` SELECT id FROM v_order WHERE sys_status LIKE '000_00_' AND (d_time IS NULL OR d_time >NOW()) ",
	delete_order_by_filter : "DELETE  FROM `ent_order` WHERE (d_time IS NULL OR d_time >NOW()) AND `status` IS NULL"
};
var erp_api_order_sys_status = {
	lead_overtime : '.0.1...',// 订单纳期超时(.0.1...)|(.0..1..)|(.0...1.)
	item_not_exists : '.0..1..',
	info_miss : '.0...1.',
	has_dead : '.1.....',
	has_analysis : '..1....'
};
var erp_api_order_sys_status_regexp = {
	lead_overtime : new RegExp(erp_api_order_sys_status.lead_overtime, "g"),
	item_not_exists : new RegExp(erp_api_order_sys_status.item_not_exists, "g"),
	info_miss : new RegExp(erp_api_order_sys_status.info_miss, "g"),
	has_dead : new RegExp(erp_api_order_sys_status.has_dead, "g"),
	has_analysis : new RegExp(erp_api_order_sys_status.has_analysis, "g")
};