import type { NavModule } from '../../types'

export interface AppState {
  platformName: string
  modules: NavModule[]
}

const state: AppState = {
  platformName: '稀际课堂',
  modules: [
    { key: 'home', name: '首页模块', description: '营销展示、推荐课程、入口导航', route: '/' },
    { key: 'auth', name: '登录模块', description: '账号登录、注册切换、记住登录', route: '/login' },
    { key: 'course', name: '课程模块', description: '课程筛选、列表展示、详情购买', route: '/courses' },
    { key: 'learn', name: '学习模块', description: '学习中心、进度管理、课程播放', route: '/learn-center' },
    { key: 'cart', name: '购物车模块', description: '课程结算、支付方式、优惠信息', route: '/cart' },
    { key: 'profile', name: '个人中心模块', description: '个人资料、订单管理、账户安全', route: '/profile' },
  ],
}

export default {
  namespaced: true,
  state: () => state,
}
