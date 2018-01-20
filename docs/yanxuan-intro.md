# 网易严选首页

这是模仿网易严选项目的 CSS 和 JavaScript 作品，下图是网站截图（[网站][link1]，[源码][link2]）。

![App Cover Image](../yanxuan/img/page.png)

## 页面

一共有三张：[首页][link3]、产品页（[1][link4], [2][link5]） 和 [404][link6]。

## 实现

1. 将页面用截图工具保存下来。
2. 在 PhotoShop 中测量尺寸，写好静态页面。
3. 按照网站 Ajax 接口请求的的产品数据为依据，渲染页面数据。

## 功能点

1. 吸顶导航
2. 切换条
3. 轮播图组件
4. 图片懒加载
5. 产品规格选择
6. 评论分页
7. 添加到购物车

## 技术点

网站使用原生 JavaScipt 和 CSS 书写，不依赖任何第三方库。

1. 吸顶导航

页面 DOM 结构准备好后，计算网站导航距离文档顶部距离。为 `window` 添加 `scroll` 监听事件，当 `pageYOffset` 大于导航距离文档顶部距离时，将导航固定定位到视口顶部。

2. 轮播图组件

使用轮播图的地方有首页（如：Banner，新品首发）和产品页（有图评论）；轮播图组件分两种：透明度过渡和位置偏移。

- 透明度过渡组件：控制 `opacity` 和 `z-index` 来显示隐藏轮播内容。
- 位置偏移组件：使用相对定位，设定 `left` 的值实现切换效果。

3. 图片懒加载

当图片出现在视口中时，将 `img` 标签的 `src` 属性设置为 `data-src` 属性值（`data-src` 保存要加载图片的地址）。

判断图片出现在视口中的逻辑是：图片顶部在视口中或者图片底部在视口中。

[link1]: https://baooab.github.io/frontend-projects/yanxuan/
[link2]: https://github.com/baooab/frontend-projects/tree/master/taobao-home
[link3]: https://baooab.github.io/frontend-projects/yanxuan/
[link4]: https://baooab.github.io/frontend-projects/yanxuan/product.html?id=1159002
[link5]: https://baooab.github.io/frontend-projects/yanxuan/product.html?id=1145003
[link6]: https://baooab.github.io/frontend-projects/yanxuan/404.html
