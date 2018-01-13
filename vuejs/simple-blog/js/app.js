// refer: https://vuejs.org/v2/guide/custom-directive.html#Directive-Hook-Arguments
// Define custom directive before Vue application.

Vue.directive('theme', {
	bind(el, binding) {
		let value = binding.value;
		if (value === 'wide') {
			el.classList.add('is-fluid');
		} else if (value === 'narrow') {
			el.classList.add('is-marginless', 'column', 'is-6');
		}
	},
});

Vue.filter('toUpperCase', function (value) {
	return value.toUpperCase();
});

let SearhBlogMixin = {
  computed: {
		filterBlogs() {
			return this.blogs.filter((blog) => {
				return blog.title.toLowerCase().match(this.search.toLowerCase());
			});
		},
	},
}

// Define component before Vue application.
let AddBlogComponent = Vue.component('add-blog', {
	template: '#add-blog-template',
	props: {
		requestRootUrl: {
			type: String,
			required: true,
		}
	},
	// Component data must be a funtion.
	data() {
		return {
			blog: {
				title: '',
				content: '',
				categories: [],
				author: '',
			},
			authors: [
				{ id: 1, name: 'Ruan Yifeng' },
				{ id: 2, name: 'Zhang Bao' },
			],
			submitted: false,
		}
	},
	methods: {
		storeBlog() {
			// refer: https://github.com/axios/axios
			axios.post(`${ this.requestRootUrl }/posts`, {
				userId: this.blog.author,
				title: this.blog.title,
				body: this.blog.content,
			})
				.then((response) => {
					if (response.data) {
						console.log(response.data);
						this.submitted = true;
					}
				})
				.catch((error) => {
					console.log('error', error);
				});
		},
	},
});

let ListBlogsComponent = Vue.component('list-blogs', {
	template: '#list-blog-template',
	props: {
		requestRootUrl: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			search: '',
			blogs: [],
		}
	},
	created() {
		axios.get(`${this.requestRootUrl}/posts`)
			.then((response) => {
				if (response.data) {
					this.blogs = response.data.slice(0, 15);
				}
			})
			.catch((error) => {
				console.log('error', error);
			});
	},
	methods: {
		deleteBlog(id) {
			axios.delete(`${ this.requestRootUrl }/posts/${ id }`)
			.then((response) => {
				this.blogs = this.blogs.filter((blog) => {
					return blog.id !== id;
				});
			})
			.catch((error) => {
				console.log('error', error);
			});
		},
	},
	filters: {
		shortPostDesc(value) {
			return value.slice(0, 120) + '...';
		},
	},
	directives: {
		colorful: {
			bind(el) {
				color = '#' + Math.random().toString(16).slice(2, 8);
				el.style.color = color;
			},
		},
	},
	mixins: [ SearhBlogMixin ],
});

let ShowBlogComponent = Vue.component('show-blog', {
	template: '#show-blog-template',
	props: {
		requestRootUrl: {
			type: String,
			required: true,
		}
	},
	data() {
		return {
			blog: {
				id: this.$route.params.id,
			},
		}
	},
	created() {
		axios.get(`${ this.requestRootUrl }/posts/${ this.blog.id }`)
			.then((response) => {
				if (response.data) {
					this.blog = response.data;
				}
			})
			.catch((error) => {
				console.log('error', error);
			});
	},
});

// Use Vue-Router
// 1). define routes.
const routes = [
	{ path: '/', redirect: '/blogs' },
    { path: '/blogs', component: ListBlogsComponent },
	{ path: '/blogs/new', component: AddBlogComponent },
	{ path: '/blogs/:id', component: ShowBlogComponent },
];
// 2) create Vue-Router instance
const router = new VueRouter({
	// mode: 'history',
    routes,
});
// 3) append to Vue application.

new Vue({
	el: '#app',
	data: {
		requestRootUrl: 'https://jsonplaceholder.typicode.com',
		site: {
			name: 'Blog System',
			description: 'Build by Vue.js, Axios & Bulma. API support from <a href="https://jsonplaceholder.typicode.com/" target="_blank" class="hero-text--underlined">jsonplaceholder</a>.'
		}
	},
	router,
});
