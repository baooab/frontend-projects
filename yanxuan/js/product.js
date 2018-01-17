yx.public.navFn();

yx.public.topTopFn();

yx.public.shopFn();

var productId = yx.getQueryString('id');
if (!productId || !products) {
	window.location.href = "404.html";
}
var product = products[productId];

// 面包屑
(function () {
	var breadcrumbs = yx.g('.bread-crumbs');
	var tempHtml = '<a href="#">首页</a> &gt; ';
	for (var i = 0; i < product.categoryList.length; i++) {
		 tempHtml += '<a href="#">' + product.categoryList[i].name + '</a> &gt; ';
	}
	tempHtml += product.name;
	breadcrumbs.innerHTML = tempHtml;
})();

// 产品图功能
(function () {
	var bigImg = yx.g('#productImg .imgShow .big');
	var smallImages = yx.ga('#productImg .imgShow .small img');
	
	bigImg.src = smallImages[0].src = product.listPicUrl;
	
	var last = smallImages[0];
	for (var i = 0; i < smallImages.length; i++) {
		if (i > 0) {
			smallImages[i].src = product.itemDetail['picUrl' + i];
		}
		
		smallImages[i].onmouseenter = function () {
			bigImg.src = this.src;
			this.classList.add('active');
			last.classList.remove('active');
			
			last = this;
		};
	}
})();


// 产品信息
(function () {	
	yx.g('#productImg .info h2').innerHTML = product.name;
	yx.g('#productImg .info p').innerHTML = product.simpleDesc;
	yx.g('#productImg .info .price').innerHTML = '<div>'+
		'<span>售价</span><strong>¥' + product.retailPrice + '</strong>'+
	'</div>'+
	'<div>'+
		'<span>促销</span><a href="' + product.hdrkDetailVOList[0].huodongUrlPc + '" class="discount"><span class="tag">' + product.hdrkDetailVOList[0].activityType + '</span>' + product.hdrkDetailVOList[0].name + '</a>'+
	'</div>'+
	'<div class="serviceWrap">'+
		'<span>服务</span><a href="#" class="service"><i>30天无忧退换货</i><i>48小时快速退款</i><i>网易自营品牌</i><i>国内部分地区无法配送</i></a>'+
	'</div>';
	
	var dds = [];
	
	// 产品规格
	var formatSpec = yx.g('#productImg .format .spec');
	for (var i = 0; i < product.skuSpecList.length; i++) {
		var dl = document.createElement('dl');
		var dt = document.createElement('dt');
		
		dt.innerHTML = product.skuSpecList[i].name;
		dl.appendChild(dt);
		
		for (var j = 0; j < product.skuSpecList[i].skuSpecValueList.length; j++) {
			var dd = document.createElement('dd');
			dd.innerHTML = product.skuSpecList[i].skuSpecValueList[j].value;
			dd.setAttribute('data-id', product.skuSpecList[i].skuSpecValueList[j].id);
			
			dd.onclick = function () {
				changeProductSpec.call(this);
			};
			
			dds.push(dd);
			
			dl.appendChild(dd);
		}
		
		formatSpec.appendChild(dl);
	}
	
	function changeProductSpec() {
		if (this.classList.contains('noClick')) {
			return ;
		}
		
		var currId = this.getAttribute('data-id'); // 点击的那个规格的 ID
		var otherDds = []; // 对方所有的 dd（操作它们的 id）
		var mergeIds = []; // 组合 id 集合（用来查询组合产品的产量）
		
		for (var attr in product.skuMap) {
			if (attr.indexOf(currId) !== -1) {
				var otherId = attr.replace(currId, '').replace(';', '');
				
				for (var i = 0; i < dds.length; i++) {
					if (dds[i].getAttribute('data-id') === otherId) {
						otherDds.push(dds[i]);
					}
				}
				
				mergeIds.push(attr);
			}
		}
		
		/*
		点击的功能判断
		1. 点击时，自己是未选中状态
			1. 兄弟节点: 
				有选中的话就要取消选中,有不能点击的不用处理
			2. 自己选中
			3. 对方节点
				先去掉 .noClick 类, 再给不能点击的加上 .noClick.
		2. 点击时，自己是选中状态
			1. 取消自己的选中状态
				(不用处理兄弟节点)
			2. 对方节点
				如果有不能点击的要去掉 .noClick
		*/
		
		var brothers = this.parentNode.querySelectorAll('dd');
		
		if (this.classList.contains('active')) {
			// 点击时，自己是选中状态
			for (var j = 0; j < otherDds.length; j++) {
				if (otherDds[j].classList.contains('noClick')) {
					otherDds.classList.remove('noClick');
				}
			}
		} else {
			// 点击时，自己是未选中状态
			for (var i = 0; i < brothers.length; i++) {
				brothers[i].classList.remove('active');
			}
			
			for (var j = 0; j < otherDds.length; j++) {
				if (otherDds[j].classList.contains('noClick')) {
					otherDds[j].classList.remove('noClick');
				}

				if (product.skuMap[mergeIds[j]].sellVolume === 0) {
					otherDds[j].classList.add('noClick');
				}
			}
		}
		this.classList.toggle('active');
		
		// 加减数字按钮的样式
		var actives = yx.ga('#productImg .format .spec .active');
		var btnParent = yx.g('#productImg .number div');
		var btns = btnParent.children;
		
		var ln = product.skuSpecList.length;
		
		if (actives.length === ln) {
			btns[0].classList.remove('disabled');
			btns[2].classList.remove('disabled');
		} else {
			btns[0].classList.add('disabled');
			btns[2].classList.add('disabled');
		}
	}
	
})();

(function () {
	// 点击加减数字按钮时的处理逻辑
	var btnParent = yx.g('#productImg .number div');
	var btns = btnParent.children;
	
	btns[0].onclick = function () {
		if (this.classList.contains('disabled')) {
			return ;
		}
		
		btns[1].innerHTML = --btns[1].value;
		
		if (btns[1].value == 1) {
			this.classList.add('disabled');
		}
	};
	
	btns[2].onclick = function () {
		if (this.classList.contains('disabled')) {
			return ;
		}
		
		btns[1].innerHTML = ++btns[1].value;
		
		if (btns[1].value > 1) {
			btns[0].classList.remove('disabled');
		}
	};
	
	btns[1].onfocus = function () {
		this.blur();
	};
	
	
})();

// 大家都在看
(function () {
	
	var data = tuijian.data.items;
	
	var look = yx.g('#allLook ul');
	var tempHtml = '';
	for (var i = 0; i < data.length; i++) {
		tempHtml += '<li class="product">'+
						'<a href="#" title="' + data[i].name + '"><img src="' + data[i].listPicUrl + '"></a>'+
						'<a href="#" class="name">' + data[i].name + '</a>'+
						'<span>¥' + data[i].retailPrice + '</span>'+
					'</li>';
	}
	
	look.innerHTML = tempHtml;
	
	// 大家都在看轮播图
	var allLook = new Carousel();
	allLook.init({
		id: 'allLook',
		totalNum: 8,
		moveNum: 4,
		circle: false,
		loop: false,
		moveStyle: 'position'
	});
})();

// 详情功能
(function () {
	
	// 详情与评价的选项卡
	var tabs = yx.ga('.bottom .feedback .title a');
	var tabsContents = yx.ga('.bottom .feedback .content > div');
	var prevIndex = 0;
	for (var i = 0; i < tabs.length; i++) {
		tabs[i].index = i;
		tabs[i].onclick = function () {
			if (this.index === prevIndex) {
				return ;
			}
			
			tabs[prevIndex].classList.remove('is-active');
			tabsContents[prevIndex].style.display = 'none';
			
			this.classList.add('is-active');
			tabsContents[this.index].style.display = 'block';
			
			prevIndex = this.index;
		};
	}
	
	var attrList = yx.g('.bottom .feedback .attrList');
	var dataAttrList = product.attrList;
	var tempHtml = '';
	for (var i = 0; i < dataAttrList.length; i++) {
		tempHtml += '<li ' + ((dataAttrList[i].attrValue.length) > 20 ? ('style="width: 100%"') : '') + '>'+
						'<span class="name">' + dataAttrList[i].attrName + '</span>'+
						'<span class="value">' + dataAttrList[i].attrValue + '</span>'+
					'</li>';
	}
	
	attrList.innerHTML = tempHtml;
	
	// 商品图片
	var imgDetails = yx.g('.bottom .feedback .details > .img');
	imgDetails.innerHTML = product.itemDetail.detailHtml;
	
	// 常见问题
	var issues = yx.g('.bottom .feedback .details > .other ul');
	var dataIssueList = product.issueList;
	tempHtml = '';
	for (var j = 0; j < dataIssueList.length; j++) {
		tempHtml += '<li class="issue">'+
						'<p class="question">' + dataIssueList[j].question + '</p>'+
						'<div class="answer">' + dataIssueList[j].answer + '</div>'+
					'</li>';
	}
	issues.innerHTML = tempHtml;
	
})();

// 评价功能
(function () {
	
	var tagsTitle = yx.g('.bottom .feedback .evaluate .eTitle');
	var tempHtml = '';
	for (var i = 0; i < 2; i++) {
		if (tags.data[i].name === '全部') {
			tempHtml += '<span class="tag is-active">' + tags.data[i].name + '(' + tags.data[i].strCount + ')</span>';
		} else {
			tempHtml += '<span class="tag">' + tags.data[i].name + '(' + tags.data[i].strCount + ')</span>';	
		}
	}
    tagsTitle.innerHTML = tempHtml;
    
    var tabs = yx.ga('.bottom .feedback .title a');
    var total = listComments.data.pagination.total;
    if (total > 1000) {
    	total = '999+';
    }
    tabs[1].innerHTML = '评价(' + total + ')';
    
    var allComments = listComments.data.result;
    var picComments = [];
    for (var j = 0; j < allComments.length; j++) {
    	if (allComments[j].picList.length > 0) {
    		picComments.push(allComments[j]);
    	}
    }
   	var sortedComments = [allComments, picComments]; 
   
    var currComments = sortedComments[0];
    
    var prevTag = 0;
    var titleTags = yx.ga('.bottom .feedback .evaluate .eTitle .tag');

    for (var z = 0; z < titleTags.length; z++) {
    	titleTags[z].index = z;
    	titleTags[z].onclick = function () {
    		titleTags[prevTag].classList.remove('is-active');
    		this.classList.add('is-active');
    		prevTag = this.index;
    		
    		currComments = sortedComments[this.index];
    		createPage(); 
    	};
    }
    
    // 显示评价数据
    function showComment(pageNumber, currentPage) {
    	var ul = yx.g('.bottom .feedback .border > ul');
    	
    	var start = pageNumber * currentPage,
    		end = start + pageNumber;
    	
    	if (end > currComments.length) {
    		end = currComments.length;
    	}
    	
    	var str = '';
    	ul.innerHTML = '';
    	
    	for (var i = start; i < end; i++) {
    		var avatar = currComments[i].frontUserAvatar ? currComments[i].frontUserAvatar : 'img/avatar.png';
    		
    		// 小图的父级
			var smallImage = '';
			// 轮播图的父级
			var dialog = '';

    		// 处理评论小图
    		if (currComments[i].picList.length) {
    			// 评论小图片
    			var span = '';
    			// 轮播图图片
    			var li = '';
    			
    			for (var j = 0; j < currComments[i].picList.length; j++) {
    				span += '<span><img src="' + currComments[i].picList[j] + '" alt=""></span>';
    				li += '<li><img src="' + currComments[i].picList[j] + '" alt=""></li>';
    			}
    			
    			smallImage = '<div class="smallImg clearfix">'+ span + '</div>';
    			
    			dialog = '<div class="dialog" id="commentImg' + i + '" data-imagenum="' + currComments[i].picList.length + '">'+
				            '<div class="carouselImgCon">'+
				                '<ul>'+
				                	li+
				                '</ul>'+
				            '</div>'+
				            '<div class="close">x</div>'+
				        '</div>';	
    		}
    		
    		str += '<li>'+
				    '<div class="avatar">'+
				        '<img src="' + avatar + '" alt="">'+
				        '<a href="#" class="vip1"></a><span>' + currComments[i].frontUserName + '</span>'+
				    '</div>'+
				    '<div class="text">'+
				        '<p>' + currComments[i].content + '</p>'+
				       	smallImage +
				        '<div class="color clearfix">'+
				            '<span class="pull-left">' + currComments[i].skuInfo.join(' ') + '</span>'+
				            '<span class="pull-right">' + yx.formatDateString(currComments[i].createTime) + '</span>'+
				        '</div>'+
				        dialog+
				    '</div>'+
				'</li>';
    	}
    	
    	ul.innerHTML = str;
    	
    	showImage();
    }
    
    // 调用轮播图插件
    function showImage() {
    	var spans = yx.ga('.bottom .smallImg span');

    	for (var i = 0; i < spans.length; i++) {
    		spans[i].onclick = function () {
    			var dialog = this.parentNode.parentNode.lastElementChild;
    			dialog.style.opacity = 1;
    			dialog.style.height = '510px';
    			
    			var en = 0;
    			dialog.addEventListener('transitionend', function () {
    				en++;
    				if (en === 1) {
    					var commentImg = new Carousel();
    					commentImg.init({
    						id: dialog.id,
    						totalNum: dialog.getAttribute('data-imagenum'),
    						moveNum: 1,
    						circle: false,
							loop: false,
							moveStyle: 'position'
    					});
    				}
    			});
    			
    			var close = dialog.querySelector('.close');
    			close.onclick = function () {
    				dialog.style.opacity = 0;
    				dialog.style.height = 0;
    			};
    		};
    	}
    	
    }   

	createPage();
    
    // 项目的  currentPage 是 page 的索引值；插件里的 page 不是索引，而是真实的页码
	function createPage(pageNumber, currentPage) {		
		var pageNumber = pageNumber || 10;
		var currentPage = currentPage ? currentPage : 0;
		var pageSize = Math.ceil(currComments.length / pageNumber);
		
		yx.public.pagination.Init(yx.g('.page'), {
	        size: pageSize, // pages size
	        page: (currentPage + 1),  // selected page
	        step: 3,   // pages before and after current
	        callback: function () {
	        	showComment(10, (this.page - 1));
	        }
    	});
	}

})();

// 加入购物车功能
(function () {
	
	var joinBtn = yx.g('#productImg .join');
	
	joinBtn.onclick = function () {
		var actives = yx.ga('#productImg .format .active');
		var selectNum = yx.g('#productImg .format input').value;

		if (actives.length < product.skuSpecList.length || selectNum < 1) {
			alert('请选择正确的规格以及数量。');
			return ;
		}
		
		var id = '';
		var spec = [];
		
		for (var i = 0; i < actives.length; i++) {
			id += actives[i].getAttribute('data-id') + ';';
			spec.push(actives[i].innerHTML);
		}
		id = id.substring(0, id.length - 1);
		
		var select = {
			'id': id,
			'name': product.name,
			'price': product.retailPrice,
			'number': selectNum,
			'spec': spec,
			'img': product.skuMap[id].itemSkuSpecValueList[0].skuSpecValue.picUrl || product.listPicUrl,
			'sign': 'productLocal',
		};
		
		localStorage.setItem(id, JSON.stringify(select));
		
		yx.public.shopFn();
	};
	
})();


yx.public.lazyImgFn();