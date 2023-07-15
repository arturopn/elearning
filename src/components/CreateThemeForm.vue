<template>
  <div>
    <h4 class="title">Create New Theme</h4>

    <div class="form-container">
      <div class="row">
        <form @submit.prevent="createTheme" class="col s12 registration-form">
          <div class="row">
            <div class="input-field col s12">
              <input
                type="text"
                id="theme-name"
                v-model="themeName"
                class="validate"
              />
              <label for="theme-name">Theme Name</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <textarea
                id="theme-description"
                class="materialize-textarea"
                v-model="themeDescription"
              ></textarea>
              <label for="theme-description">Theme Description</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <label>
                <input
                  type="checkbox"
                  v-model="allowImages"
                  class="filled-in"
                />
                <span>Allow Images</span>
              </label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <label>
                <input
                  type="checkbox"
                  v-model="allowVideos"
                  class="filled-in"
                />
                <span>Allow Videos</span>
              </label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <label>
                <input type="checkbox" v-model="allowTexts" class="filled-in" />
                <span>Allow Texts</span>
              </label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12 buttonInput">
              <button
                type="submit"
                class="btn waves-effect waves-light createThemeButton"
              >
                Create Theme
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateThemeForm",
  data() {
    return {
      themeName: "",
      themeDescription: "",
      allowImages: false,
      allowVideos: false,
      allowTexts: false,
    };
  },
  methods: {
    async createTheme() {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        const response = await this.$axios.post(
          "http://localhost:3000/themes",
          {
            name: this.themeName,
            description: this.themeDescription,
            allowImages: this.allowImages,
            allowVideos: this.allowVideos,
            allowTexts: this.allowTexts,
          },
          {
            headers: {
              Authorization: `${token}`, // Include the token in the Authorization header
            },
          }
        );

        console.log(response.data); // You can customize this part according to your needs

        // Reset the form fields after submitting
        this.themeName = "";
        this.themeDescription = "";
        this.allowImages = false;
        this.allowVideos = false;
        this.allowTexts = false;
      } catch (error) {
        console.error(error); // Handle error
      }
    },
  },
};
</script>
<style scoped src="../styles.css"></style>
