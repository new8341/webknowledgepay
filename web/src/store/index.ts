import { createStore } from 'vuex'
import app from './modules/app'
import user from './modules/user'
import course from './modules/course'
import learning from './modules/learning'
import cart from './modules/cart'

const store = createStore({
  modules: {
    app,
    user,
    course,
    learning,
    cart,
  },
})

export default store
