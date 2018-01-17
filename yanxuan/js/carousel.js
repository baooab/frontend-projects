;(function (window, undefined) {
	
	var Carousel = function () {
		this.settings = {
			id: 'carousel', // 轮播图 id
			autoplay: false, // 是否自动播放
			intervalTime: 2000, // 轮播间隔
			loop: true, // 是否启用无缝滚动
			totalNum: 5, // 总的图片量
			moveNum: 1, // 一次切换的图片数量，必须能整除 totalNum
			circle: true, // 侦测圆点
			moveStyle: 'opacity' // 两个可选值：'opacity' 为透明度过渡；position 为切换过渡
		};
	};
	
	Carousel.prototype = {
		constructor: Carousel,
		init: function (options) {
			options = options || {};
			
			for (var attr in options) {
				this.settings[attr] = options[attr];
			}
			
			this.createDOM();
		},
		createDOM: function () {
			var box = document.getElementById(this.settings.id);
			var self = this;
			
			// 上一个按钮
			var prevBtn = document.createElement('div');
			prevBtn.classList.add('prev');
			prevBtn.style.zIndex = 1;
			prevBtn.onclick = function () {
				self.prev();
			};
			box.appendChild(prevBtn);
			
			// 下一个按钮
			var nextBtn = document.createElement('div');
			nextBtn.classList.add('next');
			nextBtn.style.zIndex = 1;
			nextBtn.onclick = function () {
				self.next();
			};
			box.appendChild(nextBtn);
			
			// 小圆点
			var dots = document.createElement('div');
			dots.classList.add('dots');
			var dotsNum = Math.ceil(this.settings.totalNum/this.settings.moveNum);
			var circles = [];
			for (var i = 0; i < dotsNum; i++) {
				var span = document.createElement('span');
				
				span.index = i;
				
				span.onclick = function () {
					self.prevIndex = self.currIndex;
					self.currIndex = this.index;
					self[self.settings.moveStyle + 'Fn']();
				};
				
				dots.appendChild(span);
				circles.push(span);
			}
			if (this.settings.circle) {
				box.appendChild(dots);
			}
			
			// 将函数中的变量放在全局作用域中供使用
			// 1. 轮播图原点数量
			this.dotsNum = dotsNum;
			// 2. 轮播图容器
			this.box = box;
			// 3. 小圆点元素结合
			this.circles = circles;
			// 4. 前一个、后一个按钮
			this.prevBtn = prevBtn;
			this.nextBtn = nextBtn;
			
			this.moveInit();
		},
		moveInit: function () {
			var currIndex = 0;
			this.circles[currIndex].classList.add('active');
			
			var prevIndex = 0;
			var moving = false; // 当前是否在运动
			
			var opacityItems = this.box.children[0].children; // 参与透明度切换的所有元素
			var positionItemWrap = opacityItems[0]; // 参与位置切换的所有元素的父级 ul
			var positionItems = positionItemWrap.children; // 参与位置切换的所有元素 li
			
			switch (this.settings.moveStyle) {
				case 'opacity':
					for (var i = 0; i < opacityItems.length; i++) {
						opacityItems[i].style.opacity = 0;
						opacityItems[i].style.transition = 'opacity .3s';
					}
					opacityItems[currIndex].style.opacity = 1;
					opacityItems[currIndex].style.zIndex = 1;
					break;
				case 'position':
					var leftMargin = parseInt(getComputedStyle(positionItems[0]).marginLeft);
					var rightMargin = parseInt(getComputedStyle(positionItems[0]).marginRight);
					
					var itemMoveWidth = positionItems[0].offsetWidth + leftMargin + rightMargin;
					
					// 如果是循环运动，复制一份
					if (this.settings.loop) {
						positionItemWrap.innerHTML += positionItemWrap.innerHTML;
					}
	
					positionItemWrap.style.width = itemMoveWidth * positionItems.length + 'px';
					break;
				default: ;
			}
			
			// 将函数中的变量放在全局作用域中供使用
			this.currIndex = currIndex;
			this.prevIndex = prevIndex;
			this.positionItemWrap = positionItemWrap;
			this.positionItems = positionItems;
			this.opacityItems = opacityItems;
			this.itemMoveWidth = itemMoveWidth;
			this.moving = moving;
			
			this[this.settings.moveStyle + 'Fn']();
			
			// 设定自动播放
			this.settings.autoplay && this.autoplay();
		},
		// 透明度切换逻辑
		opacityFn: function () {
			// 处理越界左边界的情况
			if (this.currIndex < 0) {
				if (this.settings.loop) {
					this.currIndex = this.dotsNum - 1;
				} else {
					this.currIndex = 0;
					
					// 对于不循环且达到边界的情况，不需要执行下面的逻辑，在此停止
					this.moving = false;
					this.endFn();
					return ;
				}
				
			// 处理越界右边界的情况
			} else if (this.currIndex >= this.dotsNum) {
				if (this.settings.loop) {
					this.currIndex = 0;
				} else {
					this.currIndex = this.dotsNum - 1;
					
					// 对于不循环且达到边界的情况，不需要执行下面的逻辑，在此停止
					this.moving = false;
					this.endFn();
					return ;
				}
			}
 			
			var self = this;
			
			this.opacityItems[this.prevIndex].style.opacity = 0;
			this.opacityItems[this.prevIndex].style.zIndex = 0;
			this.circles[this.prevIndex].classList.remove('active');
			
			this.opacityItems[this.currIndex].style.opacity = 1;
			this.opacityItems[this.currIndex].style.zIndex = 1;
			this.circles[this.currIndex].classList.add('active');
			
			// 过渡效果结束后，设置 moving 状态为 false。
			var counter = 0;
			this.opacityItems[this.currIndex].addEventListener('transitionend', function () {
				counter++;
				
				if (counter > 1) {
					return ;
				}
				
				self.moving = false;
				
				if (!self.settings.loop) {
					self.endFn();
				}
			})
		},
		positionFn: function () {
			// 处理越界左边界的情况
			if (this.currIndex < 0) {
				if (this.settings.loop) {
					// ul 立即定位到中间
					this.positionItemWrap.style.left = -(this.positionItemWrap.offsetWidth/2) + 'px';
					// 然后设置到最后的一屏，看起来是往前走一屏了
					this.currIndex = this.dotsNum - 1;
				} else {
					this.currIndex = 0;
					
					// 对于不循环且达到边界的情况，不需要执行下面的逻辑，在此停止
					this.moving = false;
					this.endFn();
					return ;
				}
				
			// 处理越界右边界的情况
			} else if (this.currIndex >= this.dotsNum) {
				if (this.settings.loop) {
					// 这块逻辑，在运动结束后处理。参见 move 函数里的判断逻辑
				} else {
					this.currIndex = this.dotsNum - 1;
					
					// 对于不循环且达到边界的情况，不需要执行下面的逻辑，在此停止
					this.moving = false;
					this.endFn();
					return ;
				}
			}
			
			var self = this;
			
			move(this.positionItemWrap, { left: -(this.currIndex * this.itemMoveWidth *  this.settings.moveNum)  }, 300, function () {
				
				// 循环且右边越界的情况，重置 ul 的偏移位置为 0
				if (self.currIndex >= self.dotsNum) {
					self.positionItemWrap.style.left = 0;
					self.currIndex = 0;
				}
				
				self.moving = false;
				
				if (!self.settings.loop) {
					self.endFn();
				}
			});
		},
		prev: function () {
			if (this.moving) {
				return ;
			}
			
			this.moving = true;
			
			this.trigger('leftClick');
			
			this.prevIndex = this.currIndex--;
			this[this.settings.moveStyle + 'Fn']();
		},
		next: function () {
			if (this.moving) {
				return ;
			}
			
			this.moving = true;
			
			this.trigger('rightClick');
			
			this.prevIndex = this.currIndex++;
			this[this.settings.moveStyle + 'Fn']();
		},
		autoplay: function () {
			var self = this;
			
			var timer = setInterval(function () {
				self.next();
			}, this.settings.intervalTime);
			
			this.box.onmouseenter = function () {
				clearInterval(timer);
			};
			this.box.onmouseleave = function () {
				self.autoplay();
			};
		},
		// 添加自定义事件
		on: function (type, listener) {
			this.events = this.events || {};
			this.events[type] = this.events[type] || [];
			this.events[type].push(listener);
			
		},
		// 触发自定义事件
		trigger: function (type) {
			if (!this.events || !this.events[type]) {
				return ;
			}
			
			for (var i = 0; i < this.events[type].length; i++) {
				this.events[type][i].call(this);
			}
		},
		endFn: function () {
			// 添加自定义事件函数，运动结束后添加。循环轮播图不给。
			if (this.settings.loop) {
				return ;
			}
			
			if (this.currIndex === 0) {
				this.trigger('leftEnded');
			} else if (this.currIndex === (this.dotsNum - 1)) {
				this.trigger('rightEnded');
			}
		}
	};
	
	window.Carousel = Carousel;
	
})(window, undefined);
