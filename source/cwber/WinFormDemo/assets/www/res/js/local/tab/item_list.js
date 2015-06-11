var storage_data=[];
var item_NO;
$(function() {
	new erp_item_list({div:'show_item',onSelectRow1: function (rowdata, rowindex) {
			show_item_detail(rowdata.number);
    	},
    	onSelectRow2: function (rowdata, rowindex) {
   			show_item_detail(rowdata.c);
       	}
	});
//	init_item_grid();
});
