<template>
  <div>
    <NavigationBar />
    <h4 class="title">Register to the best Elearning Platform</h4>

    <div class="form-container">
      <div class="row">
        <form @submit.prevent="registerUser" class="col s12 registration-form">
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
              <input type="email" id="email" v-model="email" class="validate" />
              <label for="email">Email</label>
              <span
                class="helper-text"
                data-error="Please enter a valid email"
                v-if="emailError"
              >
                {{ emailError }}
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
            <div class="input-field col s12">
              <select id="userType" v-model="userType" class="validate">
                <option value="lector">Lector</option>
                <option value="creador">Creador</option>
              </select>
              <label for="userType">User Type</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12 buttonInput">
              <button
                type="submit"
                class="btn-create-account waves-effect waves-light createAccountButton"
              >
                Create Account
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
      email: "",
      password: "",
      userType: "lector",
      usernameError: "",
      emailError: "",
    };
  },
  methods: {
    async registerUser() {
      // Clear previous error messages
      this.usernameError = "";
      this.emailError = "";

      // Make API request to register user
      try {
        const response = await this.$axios.post(
          "http://localhost:3000/auth/register",
          {
            username: this.username,
            email: this.email,
            password: this.password,
            role: this.userType,
          }
        );

        // Handle successful registration
        console.log(response.data);
        this.$router.push("/home");
      } catch (error) {
        // Handle registration error
        if (error.response && error.response.status === 400) {
          const { message } = error.response.data;
          if (message && message.includes("Username")) {
            this.usernameError = message;
          } else if (message && message.includes("Email")) {
            this.emailError = message;
          }
        }
      }
    },
  },
};
</script>

<style scoped src="../styles.css"></style>
