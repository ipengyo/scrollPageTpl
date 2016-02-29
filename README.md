#scrollPageTpl v0.1版本 使用

## scrollPageTpl 简单介绍：



* 基于模版(jsp)的滚动加载封装插件   
* 使用简单 
* 为防止 点击进入详情 然后 又返回 导致搜索查询条件丢失 使用了 hidden 进行存储每次的搜索条件
* [源码](jquery-scrollPageTpl.js)

##  必需使用 以下htnl结构代码

```html 
    <div id="list" >
    	
    	<%--列表内容 --%>
    	<div id="list-content" class="pagelist-content">
					
		</div>
	  	
	  	
	  	<%-- 加载菊花图 --%>
	   <div class="newloading pagelist-loading" id="loading" ></div>
	  	
	    <%-- 没有更多了 --%>
	   <div class="pagelist-nomore" style="color: #989898;text-align:center; margin: 12px;display: none;" id="nomore">没有更多</div>
	     
	    <%--当没有数据的时候显示这里--%>
	    <div id="nodata" class="separation-line pagelist-nodata" style="display:none;">
	    	<img src="" data-src="${staticsDomain}/apisflorea/images/none.png">
	        <div class="txt">暂无数据</div>
	    </div>
	    
	    <%-- 存放搜索条件 --%>
	    <input type="hidden" class="pagelist-hiddenValue" >
    </div>

```

## javascript 代码 进行初始化

```javascript 

$(function(){
	   var schedulePage = $("#list").scrollPageTpl({
		   dataURL: Xarch.url("/developer/beeheadManage!search"),
		   pageData : {
			   'Q_EQ_delStatus': 'false' ,
		       'Q_EQ_developers.id' : '${user.developers.id}',
		       'P_orders': 'firstDate,desc',
		   }
	   });

	   //向外暴露可操作的参数
	   window.schedulePage = schedulePage;
})

```

## jsp模版中 需进行的一些处理


```javascript 
 <c:choose>
	<c:when test="${model.total != null && model.total > 0 }">
    	<c:forEach items="${model.data}" var="db">
	    	<div class="beeList" onclick="window.location.href=Xarch.url('/developer/beeheadManage/${db.id}')">
				<div class="bee-sl1">
					<div class="t1">${db.user.name }</div>
					<div class="t2">${db.user.loginName}</div>
				</div>
				<div class="bee-arrow1"></div>
				<div class="bee-sr1" >查看详情</div>
			</div>
    	</c:forEach>	
	</c:when>
	<c:otherwise>
    </c:otherwise>
</c:choose> 

<%-- 重点 --%>
<script>
	schedulePage.pageStatus.totalPages = ${model.totalPages};
	schedulePage.pageStatus.P_pageNumber = ${model.pageNumber};
</script>

```

## 参数解释

```javascript 

 //配置参数
 var schedulePage = $("#list").scrollPageTpl({
 			dataURL:   // 该列表每次请求数据的地址
 			pagesize: //每次分页的数据长度（默认为20)
			content: ".pagelist-content", //承载内容的区域 （有默认值）
		 	loading: ".pagelist-loading", // 菊花图 （有默认值）
		 	nodata : ".pagelist-nodata", // 没有数据的显示 （有默认值）
			nomore : ".pagelist-nomore", // 没有更多的显示 （有默认值）
			hiddenValue: ".pagelist-hiddenValue" //存搜索条件 （有默认值）
			pageData: // 第一次初始化时的搜索条件
	   });
 }
 
 //提供的api  
 schedulePage.reload() // 设置为第一页 然后刷新
 schedulePage.setQuerydata(obj) // 往存放搜索条件的hidden覆盖值 
 schedulePage.getQuerydata() // 获取搜索条件的hidden值 返回 对象



```
