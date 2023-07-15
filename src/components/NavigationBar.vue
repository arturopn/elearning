<template>
  <header class="Header" id="header">
    <div class="Header-container u-wrapper u-clearfix">
      <div class="Header-menuContainer">
        <router-link to="/" class="Header-logo">Elearning</router-link>
      </div>
      <div class="Header-menuContainer">
        <template v-if="isAuthenticated">
          <router-link to="/home" class="Header-link">Inicio</router-link>
          <template v-if="isCreadorOrAdmin">
            <router-link to="/create-theme" class="Header-link"
              >Crear Tema</router-link
            >
            <router-link to="/create-content" class="Header-link"
              >Crear Contenido</router-link
            >
            <router-link to="/create-category" class="Header-link"
              >Crear Categoría</router-link
            >
            <router-link to="/logout" class="Header-link" @click="logout"
              >Salir</router-link
            >
          </template>
        </template>
        <template v-else>
          <router-link to="/login" class="Header-link"
            >Iniciar Sesión</router-link
          >
          <router-link to="/register" class="Header-link"
            >Regístrate</router-link
          >
        </template>
      </div>
    </div>
  </header>
</template>

<script>
import { setAuthenticated, setUserRole } from "@/router";

export default {
  name: "NavigationBar",
  computed: {
    isAuthenticated() {
      return localStorage.getItem("token") !== null;
    },
    isCreadorOrAdmin() {
      const userRole = localStorage.getItem("role");
      return userRole === "creador" || userRole === "admin";
    },
  },
  methods: {
    logout() {
      localStorage.removeItem("token"); // Remove the token from localStorage
      localStorage.removeItem("role"); // Remove the role from localStorage
      setAuthenticated(false);
      setUserRole(null);
      this.$router.push("/login"); // Redirect to the login page
    },
  },
};
</script>

<style scoped>
.Header {
  background: linear-gradient(to right, #1c3643 0%, #273b47 25%, #1e5372 100%);
  padding: 15px 30px;
  position: relative;
  z-index: 2;
}

.Header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 15px;
}

.Header-logo {
  font-family: monospace;
  font-size: 24px;
  color: white;
  text-decoration: none;
}

.Header-link {
  font-family: monospace;
  font-size: 16px;
  color: white;
  text-decoration: none;
  margin-left: 20px;
}

.Header-link:hover {
  text-decoration: underline;
}
</style>
