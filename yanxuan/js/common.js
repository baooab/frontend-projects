window.yx = {
	g: function (selector) {
		return document.querySelector(selector);
	},
	ga: function (selector) {
		return document.querySelectorAll(selector);
	},
	addEvent: function (elem, type, callback) {
		if (elem.addEventListener) {
			elem.addEventListener(type, callback);
		} else {
			elem.attachEvent('on' + type, callback);
		}
	},
	removeEvent: function (elem, type, callback) {
		if (elem.removeEventListener) {
			elem.removeEventListener(type, callback);
		} else {
			elem.detachEvent('on' + type, callback);
		}
	},
	// 获取元素距离 HTML 的顶部距离
	getTopValue: function (elem) {
		var top = 0;
		
		while (elem.offsetParent){
			top += elem.offsetTop;
			elem = elem.offsetParent;
		}
		
		return top;
	},
	getQueryString: function (variable) {
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){ return pair[1]; }
       }
       return '';
	},
	cutTime: function (target) {
		var currDate = new Date();
		var v = Math.abs(target - currDate);
		
		return {
			d: parseInt(v / (24 * 3600 * 1000)),
			h: parseInt(v % (24 * 3600 * 1000) / (60 * 60 * 1000)),
			m: parseInt(v % (24 * 3600 * 1000) % (60 * 60 * 1000) / (60 * 1000)),
			s: parseInt(v % (24 * 3600 * 1000) % (60 * 60 * 1000) % (60 * 1000) / 1000)
		};
	},
	formatDate: function (v) {
		return v < 10 ? ('0' + v) : v; 
	},
	formatDateString: function (timestamps) {
		var d = new Date(timestamps);
		
		return d.getFullYear() + '-' + yx.formatDate(d.getMonth() + 1) + '-' + yx.formatDate(d.getDate()) + ' ' + yx.formatDate(d.getHours()) + ':' + yx.formatDate(d.getMinutes());
	},
	public: {
		// 吸顶导航实现
		navFn: function () {
			var nav = yx.g('.nav');
			var navLis = yx.ga('.navBar li');
			var subNav = yx.g('.subNav');
			var subUls = yx.ga('.subNav ul');
			
			var newLis = []; // 有子菜单项的菜单项
			
			for (var i = 1; i < navLis.length-3; i++) {
				newLis.push(navLis[i]);
			}
			
			for (var j = 0; j < newLis.length; j++) {
				newLis[j].index = subUls[j].index = j; 
				newLis[j].onmouseenter = subUls[j].onmouseenter = function () {
					subUls[this.index].style.display = 'block';
				};
				
				newLis[j].onmouseleave = subUls[j].onmouseleave = function () {
					subUls[this.index].style.display = 'none';
				};
			}
			
			var navOffsetTop = nav.getBoundingClientRect().top;
			if (navOffsetTop < 0) {
				navOffsetTop = 186;
			}
			
			function setNavPos() {
				if (window.pageYOffset > navOffsetTop) {
					nav.classList.add('nav-fixed');
				} else {
					nav.classList.remove('nav-fixed');
				}
			}
			setNavPos();
			yx.addEvent(window, 'scroll', setNavPos);
		},
		// 图片懒加载
		lazyImgFn: function () {
			var allImg = yx.ga('.img-lazyload');
			var topValue = 0;
			
			function listen() {
				topValue = window.innerHeight + window.pageYOffset;
				
				for (var i = 0; i < allImg.length; i++) {
					// 图片未进入可视区
					// 或者图片已经加载过了
					// 直接 PASS
					if (
						topValue < yx.getTopValue(allImg[i]) ||
						allImg[i].src
					) {
						continue;
					};
					
					allImg[i].src = allImg[i].getAttribute('data-src');
				}
				
				// 当所有图片加载完毕后，移除图片侦测事件
				if (allImg[allImg.length-1].getAttribute('src')) {
					yx.removeEvent(window, 'scroll', listen);
				}
			}
			
			listen();
			yx.addEvent(window, 'scroll', listen);
		},
		// 回到顶部
		topTopFn: function () {
			var toTop = yx.g('.fixedtoolToTop');
			var timer;
	
			if (!toTop) {
				return ;
			}
			
			toTop.onclick = function () {
				var top = window.pageYOffset;
				
//				clearInterval(timer);
//				timer = setInterval(function () {
//					top -= 150;
//					
//					if (top < 0) {
//						top = 0;
//						clearInterval(timer);
//					}
//					
//					window.scrollTo(0, top);
//				}, 17);

				cancelAnimationFrame(timer);
				
				timer = requestAnimationFrame(function fn() {
					top -= 150;
					
					if (top < 0) {
						top = 0;
					}
					
					window.scrollTo(0, top);
					
			        if (top === 0) {
			        	cancelAnimationFrame(timer);
			        } else {
			        	timer = requestAnimationFrame(fn);
			        }
			    });
			}
		},
		shopFn: function () {
			var productNum = 0;
			(function (local) {
				
				var totalPrice = 0;
				var ul = yx.g('.nav .cart ul');
				var li = '';
				
				ul.innerHTML = '';
				
				for (var i = 0; i < local.length; i++) {
					var attr = local.key(i);
					var value = JSON.parse(local[attr]);
					
					if (value && value.sign === 'productLocal') {
						li += '<li data-id="' + value.id + '">'+
								'<a href="#" class="img"><img src="' + value.img + '"></a>'+
								'<div class="message">'+
									'<p><a href="#">' + value.name + '</a></p>'+
									'<p>' + value.spec + ' x ' + value.number + '</p>'+
								'</div>'+
								'<div class="price">¥' + value.price + '</div>'+
								'<div class="close">'+
									'<i class="icon-top icon-top-close"></i>'+
								'</div>'+
							'</li>';
						totalPrice += (value.price * value.number);
					}
				}
				
				yx.g('.nav .cart .total span').innerHTML = '¥' + totalPrice;
				
				ul.innerHTML = li;
				
				productNum = ul.children.length;
				yx.g('.nav .cartWrap .icon-top-badge').innerHTML = productNum;
				
				// 删除商品
				var closeBtns = yx.ga('.nav .cart .list .close');
				for (var i = 0 ; i < closeBtns.length; i++) {
					closeBtns[i].onclick = function () {
						localStorage.removeItem(this.parentNode.getAttribute('data-id'));
						
						yx.public.shopFn();
						
						if (ul.children.length < 1) {
							yx.g('.nav .cart').style.display = 'none';
						}
					};
				}
				
				var cartWrap = yx.g('.nav .cartWrap');
				var timer;
				
				cartWrap.onmouseenter = function () {
					clearTimeout(timer);
					yx.g('.nav .cart').style.display = 'block';
				};
				
				cartWrap.onmouseleave = function () {
					timer = setTimeout(function () {
						yx.g('.nav .cart').style.display = 'none';
					}, 100);
				};
				
			})(localStorage);
		}
	}
};

(function () {
	
	var Pagination = {
		
		    code: '',
		
		    // --------------------
		    // Utility
		    // --------------------
		
		    // converting initialize data
		    Extend: function(data) {
		        data = data || {};
		        Pagination.size = data.size || 300;
		        Pagination.page = data.page || 1;
		        Pagination.step = data.step || 3;
				Pagination.callback = data.callback || function () {};
		    },
		
		    // add pages by number (from [s] to [f])
		    Add: function(s, f) {
		        for (var i = s; i < f; i++) {
		            Pagination.code += '<span>' + i + '</span>';
		        }
		    },
		
		    // add last page with separator
		    Last: function() {
		        Pagination.code += '<i>...</i><span>' + Pagination.size + '</span>';
		    },
		
		    // add first page with separator
		    First: function() {
		        Pagination.code += '<span>1</span><i>...</i>';
		    },
		
		
		
		    // --------------------
		    // Handlers
		    // --------------------
		
		    // change page
		    Click: function() {
		        Pagination.page = +this.innerHTML;
		        Pagination.Start();
		    },
		
		    // previous page
		    Prev: function() {
		        Pagination.page--;
		        if (Pagination.page < 1) {
		            Pagination.page = 1;
		        }
		        Pagination.Start();
		    },
		
		    // next page
		    Next: function() {
		        Pagination.page++;
		        if (Pagination.page > Pagination.size) {
		            Pagination.page = Pagination.size;
		        }
		        Pagination.Start();
		    },
			
				Prevest: function () {
					Pagination.page = 1;
					Pagination.Start();
				},
			
				Nextest: function () {
					Pagination.page = Pagination.size;
					Pagination.Start();
				},
		
		    // --------------------
		    // Script
		    // --------------------
		
		    // binding pages
		    Bind: function() {
		        var a = Pagination.e.getElementsByTagName('span');
		        for (var i = 0; i < a.length; i++) {
		            if (+a[i].innerHTML === Pagination.page) a[i].className = 'is-active';
		            a[i].addEventListener('click', Pagination.Click, false);
		        }
		    },
		
		    // write pagination
		    Finish: function() {
		        Pagination.e.innerHTML = Pagination.code;
		        Pagination.code = '';
		        Pagination.Bind();
						
				// 调用回调函数
				Pagination.callback();
		    },
		
		    // find pagination type
		    Start: function() {
		        if (Pagination.size < Pagination.step * 2 + 6) {
		            Pagination.Add(1, Pagination.size + 1);
		        }
		        else if (Pagination.page < Pagination.step * 2 + 1) {
		            Pagination.Add(1, Pagination.step * 2 + 4);
		            Pagination.Last();
		        }
		        else if (Pagination.page > Pagination.size - Pagination.step * 2) {
		            Pagination.First();
		            Pagination.Add(Pagination.size - Pagination.step * 2 - 2, Pagination.size + 1);
		        }
		        else {
		            Pagination.First();
		            Pagination.Add(Pagination.page - Pagination.step, Pagination.page + Pagination.step + 1);
		            Pagination.Last();
		        }
		        Pagination.Finish();
		    },
		
		
		
		    // --------------------
		    // Initialization
		    // --------------------
		
		    // binding buttons
		    Buttons: function(e) {
		        var nav = e.getElementsByTagName('span');
		        nav[0].addEventListener('click', Pagination.Prev);
		        nav[1].addEventListener('click', Pagination.Next);
		    },
		
		    // create skeleton
		    Create: function(e) {
		
		        var html = [
		            '<span>上一页</span>', // previous button
		            '<div class="mainPage"></div>',  // pagination container
		            '<span>下一页</span>'  // next button
		        ];
		
		        e.innerHTML = html.join('');
		        Pagination.e = e.getElementsByTagName('div')[0];
		        Pagination.Buttons(e);
		    },
		
		    // init
		    Init: function(e, data) {
		        Pagination.Extend(data);
		        Pagination.Create(e);
		        Pagination.Start();
		    }
		}
	
	yx.public.pagination = Pagination;
})();


