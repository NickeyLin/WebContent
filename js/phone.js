
function getinfo() {
	var s = "";
	var wrap = document.getElementById("wrap");
	s += " wrap区域宽：" + wrap.clientWidth + "\n";
	s += " wrap区域高：" + wrap.clientHeight + "\n";
	s += " 网页可见区域宽：" + document.body.clientWidth + "\n";
	s += " 网页可见区域高：" + document.body.clientHeight + "\n";
	s += " 网页可见区域宽：" + document.body.offsetWidth + " (包括边线和滚动条的宽)" + "\n";
	s += " 网页可见区域高：" + document.body.offsetHeight + " (包括边线的宽)" + "\n";
	s += " 网页正文全文宽：" + document.body.scrollWidth + "\n";
	s += " 网页正文全文高：" + document.body.scrollHeight + "\n";
	s += " 网页被卷去的高(ff)：" + document.body.scrollTop + "\n";
	s += " 网页被卷去的高(ie)：" + document.documentElement.scrollTop + "\n";
	s += " 网页被卷去的左：" + document.body.scrollLeft + "\n";
	s += " 网页正文部分上：" + window.screenTop + "\n";
	s += " 网页正文部分左：" + window.screenLeft + "\n";
	s += " 屏幕分辨率的高：" + window.screen.height + "\n";
	s += " 屏幕分辨率的宽：" + window.screen.width + "\n";
	s += " 屏幕可用工作区高度：" + window.screen.availHeight + "\n";
	s += " 屏幕可用工作区宽度：" + window.screen.availWidth + "\n";
	s += " 你的屏幕设置是 " + window.screen.colorDepth + " 位彩色" + "\n";
	s += " 你的屏幕设置 " + window.screen.deviceXDPI + " 像素/英寸" + "\n";
	alert(s);
}
$.ready = function() {
	$('dd b').height($('dd b').width() * 1.4);
};
$(window).resize(function(){
	$('dd b').height($('dd b').width() * 1.4);
});

// 根据className获取元素
function getElementsByClassName(n) {
	var classElements = [], allElements = document.getElementsByTagName('*');
	for ( var i = 0; i < allElements.length; i++) {
		if (allElements[i].className == n) {
			classElements[classElements.length] = allElements[i];
		}
	}
	return classElements;
}

$(function() {
	$("div.boxbar").each(function() {
		$(this).click(function() {
			var id = this.id;
			var index = id.substr(3);

			var bars = getElementsByClassName('boxbar');
			for ( var i = 0; i < bars.length; i++) {
				if (i + 1 == index) {
					var imgs = bars[i].getElementsByTagName('img');
					if (imgs[0].style.display == 'block') {
						imgs[0].style.display = 'none';
						imgs[1].style.display = 'block';
					} else {
						imgs[0].style.display = 'block';
						imgs[1].style.display = 'none';
					}

				} else {
					var imgs = bars[i].getElementsByTagName('img');
					imgs[0].style.display = 'none';
					imgs[1].style.display = 'block';
				}
			}

			var rankboxes = getElementsByClassName('rankbox');
			for ( var i = 0; i < rankboxes.length; i++) {
				if (i + 1 == index) {
					if (rankboxes[i].style.display == 'block') {
						rankboxes[i].style.display = 'none';
					} else {
						rankboxes[i].style.display = 'block';
					}
				} else {
					rankboxes[i].style.display = 'none';
				}
			}
		});
	});

	$("div.headbox").each(function() {
		$(this).click(function() {
			var head1 = document.getElementById('hb1');
			var head2 = document.getElementById('hb2');
			var recomend = document.getElementById('recomend');
			var navigation = document.getElementById('navigation');
			var id = this.id;

			if (id == "hb1") {
				head1.style.background = "";
				head1.style.color = "#FFFFFF";
				head1.style.fontSize = "30px";
				head2.style.background = "";
				head2.style.color = "#999999";
				head2.style.fontSize = "30px";
				recomend.style.display = 'block';
				navigation.style.display = 'none';
				arrow1.style.display = 'block';
				arrow2.style.display = 'none';
			} else {
				head1.style.background = "";
				head1.style.color = "#999999";
				head1.style.fontSize = "30px";
				head2.style.color = "#FFFFFF";
				head2.style.fontSize = "30px";
				head2.style.background = "";
				recomend.style.display = 'none';
				navigation.style.display = 'block';
				arrow1.style.display = 'none';
				arrow2.style.display = 'block';
			}
		});
	});
});
