/**
 * @author Nick
 */

/* 图片原始尺寸 */
var maxWidth;
var maxHeight;
var MAX_W = 800; // 画布最大宽度
var MAX_H = 800; // 画布最大高度

/* <img> 元素尺寸 */
var preWidth;
var preHeight;

/* 截图框最大尺寸 */
var maxBlockSize = 300;
var blockSize = 200; // 截图框大小
var blockX = 0; // 截图框X
var blockY = 0; // 截图框Y
var imgLeft; // 图片左边距
var imgTop; // 图片顶边距

var ori = 1; // 方向（1， 6， 3， 8）

var clipDone = true;
var img = new Image(); // 图片对象
var canvas; // 画布,截图框----js对象
var image; // 画布，图片----js对象

var mpImg; // MegaPixImage对象
var uploadReq;// 头像上传ajax对象

function configImageView(isNeedToCenter) {

	if (image.width < preWidth) {
		imgLeft = (preWidth - image.width) / 2 + "px";
	} else {
		imgLeft = 0;
	}
	if (image.height < preHeight) {
		imgTop = (preHeight - image.height) / 2 + "px";
	} else {
		imgTop = 0;
	}
	image.style.left = imgLeft;
	image.style.top = imgTop;

	var greater = Math.min(image.width - 5, image.height - 5);
	if (greater < 300 && greater > 100) {
		maxBlockSize = greater;
	} else {
		maxBlockSize = 300;
	}
	if (isNeedToCenter) {
		if (blockSize > maxBlockSize - 5) {
			blockSize = maxBlockSize - 5;
		}
		blockX = (preWidth - blockSize) / 2;
		blockY = (preHeight - blockSize) / 2;
		drawBlock(blockX, blockY, blockSize);
	}

	if (image.width < 105 || image.height < 105) {
		alert("图片的宽或高小于规定的最小值，会导致无法截取图片，你可以先试试放大图片或缩小截图框，如果仍然小于规定的值，请更换大一点的图片。");
		return;
	}
}

window.onload = function() {
	canvas = document.getElementById("canvas");
	image = document.getElementById("image");
	var previewImage = document.getElementById("previewImage");
	var content = $(".content");
	var contentHeight = window.screen.availHeight - 100;
	content.height(contentHeight + "px");
	
	preWidth = parseInt(content.css("width"));
	preHeight = contentHeight * 0.7;
	previewImage.style.height = preHeight + "px";
	previewImage.style.width = preWidth + "px";

	canvas.setAttribute("width", preWidth);
	canvas.setAttribute("height", preHeight);
	image.setAttribute("width", preWidth);
	image.setAttribute("height", preHeight);

	canvas.addEventListener('touchstart', onTouchStart, false);
	canvas.addEventListener('touchmove', onTouchMove, false);
	canvas.addEventListener('touchend', onTouchEnd, false);

	blockX = (preWidth - blockSize) / 2;
	blockY = (preHeight - blockSize) / 2;

};

window.onresize = function() {
	var previewImage = $("#previewImage");
	var left = (preWidth - canvas.width) / 2
			+ parseInt(previewImage.css("margin-left")) + "px";
	canvas.style.left = left;
};

/**
 * 返回小写的文件后缀名
 * 
 * @param filename
 */
function lowercaseEx(filename) {
	var lowerFilename = filename.toLowerCase();
	var index = lowerFilename.lastIndexOf(".");
	if (index != -1) {
		return lowerFilename.substring(index + 1);
	} else {
		return null;
	}
}

/**
 * <input type="file" />的onchange事件
 * 
 * @param sender
 */
function selectedFile(sender) {
	var file = sender.files[0];
	var ex = lowercaseEx(file.name);
	if (ex != "jpg" && ex != "jpeg" && ex != "png" && ex != "gif") {
		alert("请选择有效的图片文件");
		return;
	}
	maxWidth = 400;
	maxHeight = 400;
	EXIF.getData(file, function() {
		var o = EXIF.getAllTags(this);
		ori = o.Orientation;
		r = ori;
		mpImg = new MegaPixImage(file);

		mpImg.render(image, {
			maxWidth : maxWidth,
			maxHeight : maxWidth,
			orientation : ori
		});

		mpImg.onrender = function() {
			configImageView(true);
		};
		var scaleButtons = document.getElementById("scaleButtons");
		scaleButtons.style.top = preHeight - 60 + "px";
		scaleButtons.style.display = "block";
		drawBlock(blockX, blockY, blockSize);
		clipDone = false;
	});
};

function zoomOut(e) { // 缩小
	if (maxWidth > 300) {
		maxWidth -= 100;
		maxHeight -= 100;
	}
	mpImg.render(image, {
		maxWidth : maxWidth,
		maxHeight : maxHeight,
		orientation : ori
	});
	configImageView(false);
}

function zoomIn(e) { // 放大
	if (maxWidth < MAX_W) {
		maxWidth += 100;
		maxHeight += 100;
	}
	mpImg.render(image, {
		maxWidth : maxWidth,
		maxHeight : maxHeight,
		orientation : ori
	});
	configImageView(false);
}

function rotate(e) { // 旋转
	if (ori == null) {
		ori = 1;
	}
	if (ori == 1) {
		ori = 6;
	} else if (ori == 6) {
		ori = 3;
	} else if (ori == 3) {
		ori = 8;
	} else if (ori == 8) {
		ori = 1;
	}
	mpImg.render(image, {
		maxWidth : maxWidth,
		maxHeight : maxHeight,
		orientation : ori
	});
	configImageView(true);
}

function clip(e) {

	var clipedImage = new Image();
	clipedImage.src = image.toDataURL("image/*");
	clipedImage.onload = function() {
		var previewImage = $("#previewImage");
		var context = canvas.getContext("2d");
		var x = previewImage.scrollLeft() + blockX - parseInt(imgLeft);
		var y = previewImage.scrollTop() + blockY - parseInt(imgTop);
		var left = (preWidth - blockSize) / 2
				+ parseInt(previewImage.css("margin-left")) + "px";
		var top = (preHeight - blockSize) / 2 + "px";

		canvas.setAttribute("width", blockSize);
		canvas.setAttribute("height", blockSize);

		context.save();
		context.drawImage(clipedImage, x, y, blockSize, blockSize, 0, 0,
				blockSize, blockSize);
		context.restore();
		image.style.display = "none";
		canvas.style.left = left;
		canvas.style.top = top;
		$("#scaleButtons").css("display", "none");
		$("#uploadBlock").css("display", "inline");
		$("#previewImage").css("overflow", "hidden");

		document.getElementById("file").style.display = "none"; // 隐藏选择文件按钮
		clipDone = true;
	};
}

/**
 * 重置画布
 * 
 * @param e
 */
function resetCanvas(e) {
	var canvas = document.getElementById("canvas");

	$("#scaleButtons").css("display", "block");
	$("#uploadBlock").css("display", "none");
	$("#previewImage").css("overflow", "scroll");
	image.style.display = "block";
	canvas.setAttribute("width", preWidth);
	canvas.setAttribute("height", preHeight);
	canvas.style.left = 0;
	canvas.style.top = 0;
	canvas.getContext("2d").clearRect(0, 0, preWidth, preWidth);
	drawBlock(blockX, blockY, blockSize);

	document.getElementById("file").style.display = "block"; // 显示选择文件按钮

	// 清空上传状态
	var bar = $('.bar');
	var percent = $('.percent');
	var status = $('#status');
	bar.width(0);
	percent.html(0);
	status.html("");
	clipDone = false;
}

/**
 * 上传
 * 
 * @param e
 */
function upload(e) {
	var dataUri = canvas.toDataURL("image/png");
	var imageData = dataUri.substring(22, dataUri.length);
	var data = {
		imagename : "headicon.png",
		imagedata : imageData,
		user_id : queryString["user_id"]
	};

	var bar = $('.bar');
	var percent = $('.percent');
	var status = $('#status');
	if (status.html() == '完成') {
		if (!confirm("你已经上传过这张图片了，是否要重新上传？")) {
			return;
		}
	} else if (status.html().length > 0) {
		if (confirm("这张图片还没有上传完成，是否要重新上传？") && uploadReq != null) {
			uploadReq.abort();
		} else if (uploadReq != null) {
			return;
		}
	}

	uploadReq = $.ajax({
		xhr : function() {
			var req = $.ajaxSettings.xhr();
			if (req) {
				status.html("正在上传");
				req.upload.addEventListener('progress', function(event) {
					if (event.lengthComputable) {
						var percentValue = (event.loaded / event.total)
								.toFixed(4)
								* 100 + "%";
						$('.percent').html(percentValue);
						bar.width(percentValue);
						if (percentValue == "100%") {
							status.html("处理中......");
						}
					}
				}, false);
			}
			return req;
		},
		type : "POST",
		url : "upload",
		data : data,
		success : function() {
			status.html("完成");
			var percentVal = '100%';
			bar.width(percentVal);
			percent.html(percentVal);
		},
		complete : function(xhr) {
			if (null == xhr) {
				alert("网络连接错误！");
			} else if (xhr.status == 400) {
				var percentValue = "0%";
				$('.percent').html(percentValue);
				bar.width(percentValue);
				status.html("上传失败");


				var iframe = document.getElementById("result");
				var doc = iframe.document;
				if (iframe.contentDocument)
					doc = iframe.contentDocument; // For NS6
				else if (iframe.contentWindow)
					doc = iframe.contentWindow.document; // For IE5.5 and IE6

				doc.open();
				doc.writeln(xhr.responseText);
				doc.close();
				// document.write(xhr.responseText);
			}
		}
	});
}

/**
 * 画截图框
 * 
 * @param x
 * @param y
 * @param size
 */
function drawBlock(x, y, size) {
	var width = canvas.width;
	var height = canvas.height;
	var m = height - y - size;
	var n = width - x - size;

	var context = canvas.getContext("2d");
	context.clearRect(0, 0, width, height);
	context.save();
	context.beginPath();
	context.rect(0, 0, width, y);
	context.rect(0, y, x, size);
	context.rect(width - n, y, n, size);
	context.rect(0, y + size, width, m);
	context.closePath();
	context.fillStyle = "rgba(0,0,0,0.8)";
	context.strokeStyle = "white";
	context.strokeRect(x, y, size, size);
	context.fill();
	context.restore();
}
/** *********************************************** */
/**
 * 移动端webkit上ontouch事件
 */
var lastX;
var lastY;
var left_top;
var right_top;
var left_bottom;
var right_bottom;
var innerBlock;
function onTouchStart(event) {
	if (clipDone)
		return;
	event.preventDefault();
	if (!event.touches.length)
		return;

	var touch = event.touches[0];

	/* touch相对于窗口的坐标 */
	lastX = touch.clientX;
	lastY = touch.clientY;

	/* touch相对于画布的坐标 */
	var touchInCanvasX = lastX - parseInt($(".content").css("margin-left"))
			- parseInt($("#previewImage").css("margin-left"));
	var touchInCanvasY = lastY - parseInt($("#headerDiv").height())
			- parseInt($(".content").css("margin-top"))
			+ parseInt($("body").scrollTop());

	var delta_x = touchInCanvasX - blockX;// touch在画布上的X坐标与blockX坐标的差值
	var delta_y = touchInCanvasY - blockY;// //touch在画布上的Y坐标与blockY坐标的差值

	left_top = Math.abs(delta_x) <= 20 && Math.abs(delta_y) <= 20;
	right_top = Math.abs(delta_x - blockSize) <= 20 && Math.abs(delta_y) <= 20;
	left_bottom = Math.abs(delta_x) <= 20
			&& Math.abs(delta_y - blockSize) <= 20;
	right_bottom = Math.abs(delta_x - blockSize) <= 20
			&& Math.abs(delta_y - blockSize) <= 20;
	innerBlock = touchInCanvasX > blockX && touchInCanvasX < blockX + blockSize
			&& touchInCanvasY > blockY && touchInCanvasY < blockY + blockSize;
}

function onTouchMove(event) {
	if (clipDone)
		return;
	var touch = event.touches[0];
	var currentX = touch.clientX;
	var currentY = touch.clientY;
	var deltaX = currentX - lastX;
	var deltaY = currentY - lastY;
	var block = $("#canvas");
	if (left_top) {
		// 左上角
		blockX += deltaX;
		blockY += deltaY;
		blockSize -= deltaX;
	} else if (right_top) {
		// 右上角
		blockY += deltaY;
		blockSize -= deltaY;
	} else if (left_bottom) {
		// 左下角
		blockX += deltaX;
		blockSize -= deltaX;
	} else if (right_bottom) {
		// 右下角
		blockSize += deltaX;
	} else if (innerBlock) {
		// 内部
		blockX += deltaX;
		blockY += deltaY;
	} else {
		return;
	}

	var imgMarginTop = parseInt(block.css("margin-top")) + parseInt(imgTop);
	var imgMarginLeft = parseInt(block.css("margin-left")) + parseInt(imgLeft);
	var imgMarginBottom = parseInt(block.css("margin-bottom"))
			+ parseInt(imgTop) + 5;
	var imgMarginRight = parseInt(block.css("margin-right"))
			+ parseInt(imgLeft) + 5;

	if (parseInt(blockX) < imgMarginLeft) {
		blockX = imgMarginLeft;
		$("#previewImage").scrollLeft($("#previewImage").scrollLeft() + deltaX);

	} else if (parseInt(blockX) >= preWidth - blockSize - imgMarginRight) {
		blockX = preWidth - blockSize - imgMarginRight;
		$("#previewImage").scrollLeft($("#previewImage").scrollLeft() + deltaX);
	}

	if (parseInt(blockY) < imgMarginTop) {
		blockY = imgMarginTop;
		$("#previewImage").scrollTop($("#previewImage").scrollTop() + deltaY);
	} else if (parseInt(blockY) >= preHeight - blockSize - imgMarginBottom) {
		blockY = preHeight - blockSize - imgMarginBottom;
		$("#previewImage").scrollTop($("#previewImage").scrollTop() + deltaY);
	}

	if (parseInt(blockSize) >= parseInt(maxBlockSize)) {
		blockSize = maxBlockSize;
	} else if (parseInt(blockSize) <= 100) {
		blockSize = 100;
	}
	drawBlock(blockX, blockY, blockSize);
	lastX = currentX;
	lastY = currentY;
}

function onTouchEnd(event) {
	if (clipDone)
		return;
}
