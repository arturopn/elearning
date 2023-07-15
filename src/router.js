import { createRouter, createWebHistory } from 'vue-router';
import RegistrationForm from './components/RegistrationForm.vue';
import LoginForm from './components/LoginForm.vue';
import HomePage from './components/HomePage.vue';
import CreateThemeForm from './components/CreateThemeForm.vue';
import CategoryForm from './components/CategoryForm.vue';
import ContentForm from './components/ContentForm.vue';
import { ref } from 'vue';

const isAuthenticated = ref(localStorage.getItem('token') !== null);
const userRole = ref(localStorage.getItem('role'));

const routes = [
  {
    path: '/',
    component: RegistrationForm,
  },
  {
    path: '/login',
    component: LoginForm,
  },
  {
    path: '/register',
    component: RegistrationForm,
  },
  {
    path: '/home',
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/create-theme',
    component: CreateThemeForm,
    meta: { requiresAuth: true, allowedRoles: ['creador', 'admin'] },
  },
  {
    path: '/create-category',
    component: CategoryForm,
    meta: { requiresAuth: true, allowedRoles: ['creador', 'admin'] },
  },
  {
    path: '/create-content',
    component: ContentForm,
    meta: { requiresAuth: true, allowedRoles: ['creador', 'admin'] },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated.value) {
    next('/home');
  } else if (to.meta.allowedRoles) {
    const allowedRoles = to.meta.allowedRoles.map(role => role.toLowerCase());
    if (isAuthenticated.value && allowedRoles.includes(userRole.value.toLowerCase())) {
      next();
    } else {
      next('/home');
    }
  } else {
    next();
  }
});

export function setAuthenticated(value) {
  isAuthenticated.value = value;
  if (!value) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
}

export function setUserRole(role) {
  userRole.value = role;
  localStorage.setItem('role', role);
}

export default router;
