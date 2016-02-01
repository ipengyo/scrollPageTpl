   /**
    * 基于模版(jsp)的滚动加载封装插件
    * @author myfun0244 (ipengyo@qq.com)
    * @version 0.1
    * @date 2016-1-27 
    */
	$.fn.scrollPageTpl = function(opt){
	   if(!opt.dataURL){
		   console.error("没有传入地址，scrollPage 无法进行初始化:dataURL");
		   return ;
	   }
	   
	   //默认配置
	   var dafaultConfig = {
		 content: ".pagelist-content",
		 loading: ".pagelist-loading",
		 nodata : ".pagelist-nodata",
		 nomore : ".pagelist-nomore",
		 hiddenValue: ".pagelist-hiddenValue"
	   };
	   //默认的状态
	   var defaultPageStatus = {
			   P_pageNumber : 0,
			   p_pagesize : 20,
			   totalPages : null,
	   };
	   
	   var isload = true; //判断是否可以继续进行加载
	   
       var config = JSON.parse(JSON.stringify(dafaultConfig));
       config = $.extend(config, opt);
	   
       var pageStatus = JSON.parse(JSON.stringify(defaultPageStatus));
       
       config.pagesize && (pageStatus.p_pagesize = config.pagesize );
       
       //初始化参数
	   var $t = $(this[0]),
	   	   $content =  $t.find(config.content);
	       $loading  = $t.find(config.loading),
	       $nodatatips = $t.find(config.nodata);
	       $hiddenValue = $t.find(config.hiddenValue);
	       $nomoretips  = $t.find(config.nomore);
       
	   $t.setQuerydata = function(data){
		   $hiddenValue.val(JSON.stringify(data));
	   }
	   
	   $t.getQuerydata = function(){
		   try{
			var json =  JSON.parse($hiddenValue.val());
			return json;
		   }catch(e){
			   
			   return null;
		   }
	   }
	   if(!$t.getQuerydata()){
		   config.pageData && $t.setQuerydata(config.pageData);
	   }
	   
	   //加载数据     
	   var _loadData = function (){
		   var sendData = JSON.parse($hiddenValue.val() || "{}");
		   sendData = sendData || {};
		   sendData.P_pageNumber = pageStatus.P_pageNumber + 1;
		   sendData.p_pagesize = pageStatus.p_pagesize;
		   $.ajax({
				url : config.dataURL,
				type : 'get',
				data : sendData,
				dataType : 'html',
				beforeSend:function(){
					
				},
				success : function(data) {
					
					$content.append(data);
					
					//显示没有更多了
					if(pageStatus.P_pageNumber  == pageStatus.totalPages){
						$nomoretips.show();
						isload = false;
					}
					
					//显示没有数据
					if (pageStatus.totalPages == 0){
						$nodatatips.show();
						$nodatatips.find("img").each(function(){
							this.src = $(this).data("src");
						})
						isload = false;
					}
					
					if(!isload){
						$loading.hide();
						return ;
					}
					
				},
			});
	   }; 
       
	   //滚动加载
	   $(window).scroll(function () {
			if ($(window).scrollTop() >= $(document).height() - $(window).height() - $loading.height() && isload){
				_loadData();
			}
	   })
	   
	   $t.pageStatus = pageStatus;
	   
	   $t.reload = function(){
		   pageStatus = JSON.parse(JSON.stringify(defaultPageStatus));
	       config.pagesize && (pageStatus.p_pagesize = config.pagesize );

		   _loadData()
	   }
	   
	  
	   _loadData();
	   
	   
	   return $t;
	       
   };