import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('@/views/login')
const Home = () => import('@/views/home')
const Article = () => import('@/views/article')
const Image = () => import('@/views/image')
const Publish = () => import('@/views/publish')
const Comment = () => import('@/views/comment')
const Fans = () => import('@/views/fans')
const Settings = () => import('@/views/settings')
const Layout = () => import('@/components/layout')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/layout',
    component: Layout,
    children: [
      {
        path: '/',//path为空 会作为默认子路由渲染
        redirect: '/home' //默认跳转路由
      },
      {
        path: '/home',
        name: 'home',
        component: Home
      },
      {
        path: '/article',
        name: 'article',
        component: Article
      },
      {
        path: '/image',
        name: 'image',
        component: Image
      },
      {
        path: '/publish',
        name: 'publish',
        component: Publish,
      },
      {
        path: '/comment',
        name: 'comment',
        component: Comment
      },

      {
        path: '/fans',
        name: 'fans',
        component: Fans
      },

      {
        path: '/settings',
        name: 'settings',
        component: Settings
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//全局路由导航守卫：就是所有页面的导航都会经过这里
//守卫页面导航的
//to: 要去的路由页面信息
// from: 来自哪的路由信息
// next：放行的方法
router.beforeEach((to, from, next) => {
  //如果要访问的页面不是login 校验登录状态
  // 如果没有登录则跳转到登陆页面 
  // 如果登录了则允许通过

  const user = JSON.parse(window.localStorage.getItem('user'))

  //校验非登录页面的登录状态
  if (to.path !== '/login') {
    if (user) {
      // 已登录 允许通过
      next()
    } else {
      // 没有登录跳转到的登陆页面
      next('/login')
    }
  } else {
    // 登录页面正常允许通过
    // 允许通过
    next()
  }



})

export default router
