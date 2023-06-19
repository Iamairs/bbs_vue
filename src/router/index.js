import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const MainContent = () => import('../views/MainContent.vue')
// const Home = () => import('../views/Home.vue');
// const ChatPlaza = () => import('../views/ChatPlaza.vue');
// const HelpCenter = () => import('../views/HelpCenter.vue');
// const Announcement = () => import('../views/Announcement.vue');
const PostDetailInfo = () => import('../views/PostDetailInfo.vue');

const routes = [
  {
    path: '',
    redirect: '/index'
  }, {
    path: '/index',
    name: "mainContent",
    component: MainContent
  }, 
  // {
  //   path: '/chat_plaza',
  //   name: "chatPlaza",
  //   component: ChatPlaza
  // }, {
  //   path: '/help_center',
  //   name: "helpCenter",
  //   component: HelpCenter
  // }, {
  //   path: '/announcement',
  //   name: "announcement",
  //   component: Announcement
  // }, 
  {
    path: "/post_info/:postId",
    name: "postInfo",
    component: PostDetailInfo
  },
]

// const routes = [
//   {
//     path: '',
//     redirect: '/home'
//   },
//   {
//     path:'/farm',
//     component: Farm,
//     children: [
//       {
//         path: '',
//         redirect: 'my_farm_1'
//       },
//       {
//         path: 'my_farm_1',
//         component: MyFarm_1
//       },
//     ]
//   },
// ]

const router = new Router({
  // base: '/bbs/',
  mode: 'history',  // 使用history模式时，url就像正常的url
  // base: process.env.BASE_URL, // 所有的请求都会在url之后加上process.env.BASE_URL
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name === 'postInfo') {
    console.log(router.app);
    // 隐藏导航栏
    // app.showNavbar = false;
  } else {
    // 显示导航栏
    // app.showNavbar = true;
  }
  next();
});

export default router