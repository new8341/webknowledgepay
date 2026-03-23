<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const activeAuthTab = ref<'login' | 'register'>('login')

// 登录表单
const loginPhone = ref('')
const loginPassword = ref('')
const rememberMe = ref(true)
const showLoginPassword = ref(false)
const focusedField = ref<string | null>(null)

// 注册表单
const registerPhone = ref('')
const registerCode = ref('')
const registerPassword = ref('')
const registerConfirmPassword = ref('')
const showRegisterPassword = ref(false)
const showRegisterConfirmPassword = ref(false)

const userLoading = computed(() => store.state.user.loading as boolean)
const userError = computed(() => store.state.user.error as any)

async function onLogin() {
  await store.dispatch('user/login', { phone: loginPhone.value.trim(), password: loginPassword.value })
  router.push('/learn-center')
}

async function onRegister() {
  await store.dispatch('user/register', {
    phone: registerPhone.value.trim(),
    code: registerCode.value.trim(),
    password: registerPassword.value,
    confirmPassword: registerConfirmPassword.value,
  })
  router.push('/profile')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl w-full">
      <!-- 顶部Logo -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center mb-4">
          <i class="fas fa-graduation-cap text-4xl text-blue-600 mr-3"></i>
          <span class="text-3xl font-bold text-gray-800">稀际课堂</span>
        </div>
        <p class="text-gray-600">专业的知识付费学习平台</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- 左侧登录/注册表单区 -->
        <div class="p-8 lg:p-12">
          <!-- 标签页切换 -->
          <div class="flex bg-gray-100 rounded-lg p-1 mb-8">
            <button
              type="button"
              :class="activeAuthTab === 'login' ? 'tab-active flex-1 py-3 px-4 text-sm font-medium rounded-lg form-transition' : 'flex-1 py-3 px-4 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 form-transition'"
              @click="activeAuthTab = 'login'"
            >
              <i class="fas fa-sign-in-alt mr-2"></i>登录
            </button>
            <button
              type="button"
              :class="activeAuthTab === 'register' ? 'tab-active flex-1 py-3 px-4 text-sm font-medium rounded-lg form-transition' : 'flex-1 py-3 px-4 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 form-transition'"
              @click="activeAuthTab = 'register'"
            >
              <i class="fas fa-user-plus mr-2"></i>注册
            </button>
          </div>

          <!-- 登录表单 -->
          <div v-if="activeAuthTab === 'login'" id="login-form">
            <form class="space-y-6" @submit.prevent="onLogin">
              <!-- 手机号输入 -->
              <div
                class="relative"
                :class="focusedField === 'loginPhone' ? 'input-focused' : ''"
              >
                <div class="relative">
                  <input
                    type="tel"
                    v-model="loginPhone"
                    class="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
                    placeholder=" "
                    @focus="focusedField = 'loginPhone'"
                    @blur="focusedField = loginPhone ? null : null"
                  />
                  <label
                    class="floating-label absolute left-4 top-4 text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-blue-600 peer-focus:text-sm peer-focus:bg-white peer-focus:px-2"
                  >
                    手机号
                  </label>
                  <div class="absolute right-4 top-4 text-gray-400">
                    <i class="fas fa-mobile-alt"></i>
                  </div>
                </div>
              </div>

              <!-- 密码输入 -->
              <div
                class="relative"
                :class="focusedField === 'loginPassword' ? 'input-focused' : ''"
              >
                <div class="relative">
                  <input
                    :type="showLoginPassword ? 'text' : 'password'"
                    v-model="loginPassword"
                    class="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
                    placeholder=" "
                    @focus="focusedField = 'loginPassword'"
                    @blur="focusedField = loginPassword ? null : null"
                  />
                  <label
                    class="floating-label absolute left-4 top-4 text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-blue-600 peer-focus:text-sm peer-focus:bg-white peer-focus:px-2"
                  >
                    密码
                  </label>
                  <button
                    type="button"
                    class="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                    @click="showLoginPassword = !showLoginPassword"
                    :aria-label="showLoginPassword ? '隐藏密码' : '显示密码'"
                  >
                    <i class="fas" :class="showLoginPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
                  </button>
                </div>
              </div>

              <!-- 记住登录和忘记密码 -->
              <div class="flex items-center justify-between">
                <label class="flex items-center">
                  <input v-model="rememberMe" type="checkbox" class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                  <span class="ml-2 text-sm text-gray-600">记住我</span>
                </label>
                <a href="#" class="text-sm text-blue-600 hover:text-blue-500" @click.prevent>忘记密码？</a>
              </div>

              <!-- 登录按钮 -->
              <button
                type="submit"
                class="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 font-medium text-lg form-transition disabled:opacity-60"
                :disabled="userLoading"
              >
                <i class="fas fa-sign-in-alt mr-2"></i> {{ userLoading ? '登录中...' : '登录' }}
              </button>

              <!-- 错误展示（统一错误结构） -->
              <div v-if="userError" class="text-sm text-red-600">
                {{ userError.message }}（{{ userError.code }}，requestId: {{ userError.requestId }}）
              </div>

              <!-- 分割线 -->
              <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-2 bg-white text-gray-500">或者使用</span>
                </div>
              </div>

              <!-- 第三方登录 -->
              <div class="grid grid-cols-3 gap-4">
                <button type="button" class="social-btn flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <i class="fab fa-weixin text-2xl text-green-500"></i>
                </button>
                <button type="button" class="social-btn flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <i class="fab fa-qq text-2xl text-blue-500"></i>
                </button>
                <button type="button" class="social-btn flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <i class="fab fa-weibo text-2xl text-red-500"></i>
                </button>
              </div>

              <!-- 验证码登录 -->
              <button type="button" class="w-full border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 font-medium form-transition">
                <i class="fas fa-sms mr-2"></i>验证码登录
              </button>
            </form>
          </div>

          <!-- 注册表单 -->
          <div v-else id="register-form" class="space-y-6">
            <form class="space-y-6" @submit.prevent="onRegister">
              <!-- 手机号 -->
              <div class="relative">
                <input
                  type="tel"
                  v-model="registerPhone"
                  class="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="手机号"
                />
                <div class="absolute right-4 top-4 text-gray-400">
                  <i class="fas fa-mobile-alt"></i>
                </div>
              </div>

              <!-- 验证码 -->
              <div class="flex space-x-3">
                <input
                  type="text"
                  v-model="registerCode"
                  class="flex-1 px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="验证码"
                />
                <button type="button" class="px-6 py-4 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 whitespace-nowrap">
                  获取验证码
                </button>
              </div>

              <!-- 设置密码 -->
              <div class="relative">
                <input
                  :type="showRegisterPassword ? 'text' : 'password'"
                  v-model="registerPassword"
                  class="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="设置密码"
                />
                <button type="button" class="absolute right-4 top-4 text-gray-400 hover:text-gray-600" @click="showRegisterPassword = !showRegisterPassword">
                  <i class="fas" :class="showRegisterPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
                </button>
              </div>

              <!-- 确认密码 -->
              <div class="relative">
                <input
                  :type="showRegisterConfirmPassword ? 'text' : 'password'"
                  v-model="registerConfirmPassword"
                  class="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="确认密码"
                />
                <button type="button" class="absolute right-4 top-4 text-gray-400 hover:text-gray-600" @click="showRegisterConfirmPassword = !showRegisterConfirmPassword">
                  <i class="fas" :class="showRegisterConfirmPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
                </button>
              </div>

              <!-- 用户协议 -->
              <div class="flex items-start">
                <input type="checkbox" class="mt-1 rounded border-gray-300 text-blue-600" required />
                <span class="ml-2 text-sm text-gray-600">
                  我已阅读并同意
                  <a href="#" class="text-blue-600 hover:text-blue-500" @click.prevent>《用户协议》</a>
                  和
                  <a href="#" class="text-blue-600 hover:text-blue-500" @click.prevent>《隐私政策》</a>
                </span>
              </div>

              <!-- 注册按钮 -->
              <button
                type="submit"
                class="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 font-medium text-lg form-transition disabled:opacity-60"
                :disabled="userLoading"
              >
                <i class="fas fa-user-plus mr-2"></i> {{ userLoading ? '注册中...' : '立即注册' }}
              </button>

              <!-- 错误展示（统一错误结构） -->
              <div v-if="userError" class="text-sm text-red-600">
                {{ userError.message }}（{{ userError.code }}，requestId: {{ userError.requestId }}）
              </div>
            </form>
          </div>
        </div>

        <!-- 右侧展示区域（对齐原型） -->
        <div class="gradient-bg p-8 lg:p-12 text-white flex items-center">
          <div>
            <h2 class="text-3xl font-bold mb-6">开启学习之旅</h2>
            <p class="text-lg mb-8 opacity-90">加入我们，与数万名学员一起学习成长，掌握最新技能，实现职业突破</p>

            <!-- 特色功能 -->
            <div class="space-y-6">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                  <i class="fas fa-video text-xl"></i>
                </div>
                <div>
                  <h4 class="font-semibold mb-1">高质量课程</h4>
                  <p class="text-sm opacity-80">专业讲师精心制作，内容实用易懂</p>
                </div>
              </div>

              <div class="flex items-center">
                <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                  <i class="fas fa-users text-xl"></i>
                </div>
                <div>
                  <h4 class="font-semibold mb-1">学习社区</h4>
                  <p class="text-sm opacity-80">与同学交流讨论，共同进步</p>
                </div>
              </div>

              <div class="flex items-center">
                <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                  <i class="fas fa-certificate text-xl"></i>
                </div>
                <div>
                  <h4 class="font-semibold mb-1">权威认证</h4>
                  <p class="text-sm opacity-80">完成学习获得权威结业证书</p>
                </div>
              </div>

              <div class="flex items-center">
                <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                  <i class="fas fa-mobile-alt text-xl"></i>
                </div>
                <div>
                  <h4 class="font-semibold mb-1">随时随地</h4>
                  <p class="text-sm opacity-80">支持手机电脑，随时随地学习</p>
                </div>
              </div>
            </div>

            <!-- 用户数据展示 -->
            <div class="mt-12 grid grid-cols-2 gap-6">
              <div class="text-center">
                <div class="text-2xl font-bold">10万+</div>
                <div class="text-sm opacity-80">注册用户</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold">500+</div>
                <div class="text-sm opacity-80">精品课程</div>
              </div>
            </div>

            <!-- 用户评价 -->
            <div class="mt-8 p-4 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
              <div class="flex items-center mb-2">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="用户头像" class="w-8 h-8 rounded-full mr-2" />
                <div>
                  <p class="text-sm font-medium">张同学</p>
                  <div class="flex text-yellow-400 text-xs">
                    <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                  </div>
                </div>
              </div>
              <p class="text-sm opacity-90">"课程质量很高，老师讲解清晰，学到了很多实用技能！"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.form-transition {
  transition: all 0.3s ease;
}
.tab-active {
  background: #3b82f6;
  color: white;
}
.floating-label {
  transition: all 0.2s ease;
}
.input-focused .floating-label {
  transform: translateY(-1.5rem) scale(0.875);
  color: #3b82f6;
}
.social-btn:hover {
  transform: translateY(-2px);
  transition: all 0.3s ease;
}
</style>
