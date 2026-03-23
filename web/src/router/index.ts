import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import CoursesView from '../views/CoursesView.vue'
import CourseDetailView from '../views/CourseDetailView.vue'
import LearnCenterView from '../views/LearnCenterView.vue'
import CoursePlayView from '../views/CoursePlayView.vue'
import CartView from '../views/CartView.vue'
import ProfileView from '../views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', name: 'home', component: HomeView, meta: { hideAppNav: true } },
        { path: 'login', name: 'login', component: LoginView, meta: { hideAppNav: true } },
        { path: 'courses', name: 'courses', component: CoursesView, meta: { hideAppNav: true } },
        { path: 'course-detail', name: 'course-detail', component: CourseDetailView, meta: { hideAppNav: true } },
        { path: 'learn-center', name: 'learn-center', component: LearnCenterView, meta: { hideAppNav: true } },
        { path: 'course-play', name: 'course-play', component: CoursePlayView, meta: { hideAppNav: true } },
        { path: 'cart', name: 'cart', component: CartView, meta: { hideAppNav: true } },
        { path: 'profile', name: 'profile', component: ProfileView, meta: { hideAppNav: true } },
      ],
    },
  ],
})

export default router
