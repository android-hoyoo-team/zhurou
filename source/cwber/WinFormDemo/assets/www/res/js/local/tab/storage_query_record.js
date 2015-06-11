$(function (){ 
	  $("#storage_query_record").ligerPortal({
          columns: [
            {
              width: "95%",
              align:'center',
              panels: [
                       {
                    	   title: '库存查询',
                    	   width: '100%',
                    	   height: 600,
                    	   url: '../tab/storage_query.html'
                       },
                       {
                    	   title: '出库入库记录',
                    	   width: '100%',
                    	   height: 600,
                    	   url: '../tab/storage_io_record.html'
                       }
              ]
           }
           ]
      }); 
});