$(function(){
	//获取Url地址中userId参数
	function getUrlParams(name) { 
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); //定义正则表达式 
	    var r = window.location.search.substr(1).match(reg);  
	    if (r != null) return unescape(r[2]); 
	    return null; 
	};	
	/**
	 * @param   userId 用户Id
	 */
	var userID = getUrlParams("userId");
	var type = 0;// 0 返利列表，1 返利记录;
	var renderDom = ".taskList";
	var isTelephone = false;
	var ajaxType = "get";
	/**
	 * 选项卡
	 */
	$(".rebate_tab span").eq(0).on("click",function(){
		window.location.href="./highRebate.html?userId="+userID;
	})
	/**
	 * 上拉加载
	 */
    // 页数
    var page = 0;
    // 每页展示5个
    /*var size = 5;*/
    // dropload
    $('.content').dropload({   	
        scrollArea : window,
        loadDownFn : function(me){
            page++;
            // 拼接HTML
            var html = '';
            $.ajax({
                type: "post",
                url: ajaxUrl+"/investment/record/list?userId="+userID+"&pageNo="+page,
                dataType: 'json',
                success: function(data){ 
                	console.log(data);
                    if(data.state=="success"){                    	
                    	var result = data.data;  
                    	var strLen = data.data.length;
                    	var recordState;
                    	var taskProcess;
                        for(var i=0; i<strLen; i++){  
                        	if(result[i].recordState==1){
                        		recordState=`<span class="red">审核中</span>`;
                        		taskProcess="人工审核中请耐心等待";
                        	}else if(result[i].recordState==2){
                        		recordState="已通过";
                        		taskProcess="奖励已发放，请在我的奖励内查看";
                        	}else if(result[i].recordState==3){
                        		recordState="未通过";
                        		taskProcess="没有相关投资记录，如有疑问请咨询客服";
                        	}                        	
                    		html+=`
                    			<li class="instrucItem">
                    				<span class="logoUrl"><img src="${result[i].logoUrl}" alt="" /></span>
									<p class="p1">
										<span class="task">${result[i].taskName}</span>
										<span class="status gray">${recordState}</span>
									</p>
									<p class="p2 taskProcess">
										${taskProcess}
									</p>
								</li>
                    		`;                            
                        }  
                    // 如果没有数据
                    }else{
                    	console.log("数据已经加载全部!");
                        // 锁定
                        me.lock();
                        // 无数据
                        me.noData();
						if(page==1){
                    		$(".noDataTip").show();
                    		$(".dropload-load").remove();
                    	}
                    }
                    // 为了测试，延迟1秒加载
                    setTimeout(function(){
                        // 插入数据到页面，放到最后面
                        $(".instruc").append(html);
                        // 每次数据插入，必须重置
                        me.resetload();
                    },1000);
                },
                error: function(xhr, type){
                    //alert('Ajax error!');
                    // 即使加载出错，也得重置
                    //me.resetload();
                }
            });
        }
    });
});
/**
 * 绑定手机
 */
function bindTele(userID){  
   var u = navigator.userAgent;
   var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
   var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
   if(isAndroid){
        /*alert('是否是Android：'+isAndroid);*/
       window.jsi.bindTele(userID)
   }else if(isiOS){
       /* alert('是否是iOS：'+isiOS);*/
       window.webkit.messageHandlers.bindTele.postMessage(userID);
   }		       	  
}
