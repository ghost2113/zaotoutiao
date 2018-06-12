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
	/**
	 * 接口地址
	 */
	var urlOnline = "https://zhishun520.com/zaotoutiao-api-home-1.0.0";
	var urlTest = "http://47.104.250.210:8084/zaotoutiao-api-home-1.0.0";
	var ajaxUrl = urlOnline;
	var type = 0;// 0 返利列表，1 返利记录;
	var renderDom = ".taskList";
	var isTelephone = false;
	/**
	 * 获取用户信息 是否绑定手机
	 */
	$.ajax({
		url:"https://zhishun520.com/zaotoutiao-api-home-1.0.0/user/get?userId="+userID,
		type:"post",
		async:false,
		success:function(res){	
			console.log(res);
			if(res.data.telephone.length) isTelephone = true;
		},
		error:function(error){
			console.log(error);
		}
	})	
	/**
	 * 选项卡
	 */
	$(".rebate_tab span").eq(1).on("click",function(){
		window.location.href="./highRebateRecord.html?userId="+userID;
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
        scrollArea :window,
        loadDownFn : function(me){
            page++;
            // 拼接HTML
            var html = '';
            $.ajax({
                type: "GET",
                url: "https://zhishun520.com/zaotoutiao-api-home-1.0.0/investment/task/list?pageNo="+page,
                dataType: 'json',
                success: function(data){  
                	console.log(data);
                    if(data.state=="success"){  
                    	var result = data.data;  
                    	var strLen = data.data.length;
                        for(var i=0; i<strLen; i++){
                    		html+= `
                        	<div class="taskItem">
								<div class="taskInfo">
									<div class="l">
										<span><img src="${result[i].logoUrl}" alt="" /></span>
										${result[i].taskName}
									</div>
								</div>
								<div class="taskCon">
									<div class="taskWrap">
										<div class="l">
											<span>${result[i].annualizedReturn}<span style="font-size:0.16rem;">%</span></span>
											<span>预计年化</span>
										</div>
										<div class="r">
											<span >${result[i].additionalRebates}<span style="font-size:0.16rem;">元</span></span>
											<span>首次投资返利</span>
										</div>
									</div>
									<button class="btn" onclick="getRebate(${isTelephone+","+userID+","+result[i].id})">投资拿返利</button>
								</div>
							</div>
                        	`;                            
                        }
                    // 如果没有数据
                    }else{
                    	console.log("数据加载完成");
                        // 锁定
                        me.lock();
                        // 无数据
                        me.noData();
                    }
                    // 为了测试，延迟1秒加载
                    setTimeout(function(){
                        // 插入数据到页面，放到最后面
                        $(".taskList").append(html);
                        // 每次数据插入，必须重置
                        me.resetload();
                    },1000);
                },
                error: function(xhr, type){
                    //alert('Ajax error!');
                    // 即使加载出错，也得重置
                    me.resetload();
                }
            });
        }
    });
})
/**
 * 立即赚返利
 */
function getRebate(isTelephone,userID,id){
	if(isTelephone){
		/*window.location.href = "https:zhishun520.com/zttH5/investment/instrTask.html?userId="+userID+"&id="+id;*/
		window.location.href = "./instrTask.html?userId="+userID+"&id="+id;
	}else{
		bindTele(userID);
	}
}
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
