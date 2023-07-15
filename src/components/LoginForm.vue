<template>
  <div>
    <NavigationBar />
    <h4 class="title">Login to the best Elearning Platform</h4>

    <div class="form-container">
      <div class="row">
        <form @submit.prevent="loginUser" class="col s12 registration-form">
          <div class="row">
            <div class="input-field col s12">
              <input
                type="text"
                id="username"
                v-model="username"
                class="validate"
              />
              <label for="username">Username</label>
              <span
                class="helper-text"
                data-error="Please enter a valid username"
                v-if="usernameError"
              >
                {{ usernameError }}
              </span>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input
                type="password"
                id="password"
                v-model="password"
                class="validate"
              />
              <label for="password">Password</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12 buttonInput">
              <button
                type="submit"
                class="btn-login waves-effect waves-light createAccountButton"
              >
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import NavigationBar from "./NavigationBar.vue";
import M from "materialize-css";
import { setAuthenticated, setUserRole } from "@/router";

export default {
  components: {
    NavigationBar,
  },
  mounted() {
    // Initialize Materialize select component
    M.FormSelect.init(document.querySelectorAll("select"));
  },
  data() {
    return {
      username: "",
      password: "",
      usernameError: "",
    };
  },
  methods: {
    async loginUser() {
      // Clear previous error messages
      this.usernameError = "";

      // Make API request to login user
      try {
        const response = await this.$axios.post(
          "http://localhost:3000/auth/login",
          {
            username: this.username,
            password: this.password,
          }
        );

        // Store the token in local storage
        localStorage.setItem("token", response.data.token);
        console.log(localStorage.getItem("token"));

        // Make API request to get user information by username
        const userResponse = await this.$axios.get(
          `http://localhost:3000/users/byusername/${this.username}`
        );
        console.log(userResponse);
        // Set the user role in the authenticated state and user role state
        setAuthenticated(true);
        setUserRole(userResponse.data.role);

        // Redirect to the HomePage upon successful login
        this.$router.push("/home");
      } catch (error) {
        // Handle login error
        if (error.response && error.response.status === 400) {
          const { message } = error.response.data;
          if (message && message.includes("Username")) {
            this.usernameError = message;
          }
        }
      }
    },
  },
};
</script>

<style scoped src="../styles.css"></style>
