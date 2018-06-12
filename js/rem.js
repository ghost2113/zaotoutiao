(function(doc, win) {
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function() {
			var clientWidth = docEl.clientWidth;
			if(!clientWidth) return;
			if(clientWidth >= 640) {
				/*docEl.style.fontSize = '100px';*/
				docEl.style.fontSize = 100 * (clientWidth / 375) + 'px';
			} else {
				docEl.style.fontSize = 100 * (clientWidth / 375) + 'px';
			}
		};
	if(!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
var onlineUrl="https://zhishun888.com:9443/toutiaotv-api-home-1.0.0",
	testUrl="47.104.250.104:8081/toutiaotv-api-home-1.0.0";
var ajaxUrl = onlineUrl;

var urlPre = "https://zhishun888.com:9443";
