yx.public.navFn();

yx.public.topTopFn();

yx.public.shopFn();

// 轮播图
var bannerPic = new Carousel();
bannerPic.init({
	id: 'bannerPic',
	autoplay: true,
	intervalTime: 5000
});

var newProdPic = new Carousel();
newProdPic.init({
	id: 'newProdPic',
	totalNum: 8,
	moveNum: 4,
	circle: false,
	loop: false,
	moveStyle: 'position'
});

newProdPic.on('leftClick', function () {
	console.log('左方向键被点击');
	this.nextBtn.classList.remove('is-disabled');
});

newProdPic.on('rightClick', function () {
	console.log('右方向键被点击');
	this.prevBtn.classList.remove('is-disabled');
});

newProdPic.on('leftEnded', function () {
	console.log('最左了');
	this.prevBtn.classList.add('is-disabled');
});

newProdPic.on('rightEnded', function () {
	console.log('最右了');
	this.nextBtn.classList.add('is-disabled');
});

var allSay = new Carousel();
allSay.init({
	id: 'allSay',
	totalNum: 4,
	moveNum: 1,
	circle: false,
	autoplay: true,
	loop: true,
	moveStyle: 'position',
	intervalTime: 4000
});

// 人气推荐选项卡
(function () {
	
	var titles = yx.ga('#recommend .recommendHead li');
	var contents = yx.ga('#recommend .content');
	var prevIndex = currIndex = 0;
	for (var i = 0; i < titles.length; i++) {
		titles[i].index = i;
		titles[i].onmouseenter = function () {
			prevIndex = currIndex;
			currIndex = this.index;
			titles[prevIndex].classList.remove('active');
			contents[prevIndex].style.display = 'none';
			titles[currIndex].classList.add('active');
			contents[currIndex].style.display = 'block';
		};
	}
})();

// 限时购
(function () {
	var timeBox = yx.g('#limite .timeBox');
	var spans = yx.ga('#limite .timeBox span');
	var timer = setInterval(showTime, 1000);
	
	showTime();
	
	// 倒计时
	function showTime() {
		var endTime = new Date(2018, 1, 15, 13);
		
		if (Date.now() < endTime) {
			var overTime = yx.cutTime(endTime);
			spans[0].innerHTML = yx.formatDate(overTime.h);
			spans[1].innerHTML = yx.formatDate(overTime.m);
			spans[2].innerHTML = yx.formatDate(overTime.s);
		} else {
			clearInterval(timer);
		}
	}
	
	// 商品数据
	var boxWrap = yx.g('#limite .boxWrap');
	var str = '';
	var items = json_promotion.itemList;
	
	for (var i = 0; i < 4; i++) {
		str += '<div class="limitBox product">'+
					'<a href="#" class="img pull-left">'+
						'<img class="img-lazyload" data-src="' + items[i].primaryPicUrl + '" alt="商品">'+
					'</a>'+
					'<div class="info pull-right">'+
						'<a href="javascript: void(0);">' + items[i].itemName + '</a>'+
						'<p>' + items[i].simpleDesc + '</p>'+
						'<div class="numBar clearfix">'+
							'<div class="numCon">'+
								'<span style="width: ' + parseInt(items[i].currentSellVolume/items[i].totalSellVolume*100) + '%"></span>'+
							'</div>'+
							'<span class="numTips">还剩' + items[i].currentSellVolume +  '件</span>'+
						'</div>'+
						'<div class="price">'+
							'<span class="xianshi">限时价</span><span class="RMB">¥</span><strong>' + items[i].actualPrice + '</strong><span class="origin">原价 <del>¥' + items[i].retailPrice + '</del></span>'+
						'</div>'+
						'<a class="buyBtn" href="javascript: void(0);">立即抢购</a>'+
					'</div>'+
				'</div>';
	}
	
	boxWrap.innerHTML = str;
})();

yx.public.lazyImgFn();