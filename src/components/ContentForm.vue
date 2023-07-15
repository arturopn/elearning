<template>
  <div>
    <NavigationBar />
    <h4 class="title">Create New Content</h4>

    <div class="form-container">
      <div class="row">
        <form @submit.prevent="createContent" class="col s12 registration-form">
          <div class="row">
            <div class="input-field col s12">
              <label for="theme">Theme</label>
              <select
                v-model="selectedThemeId"
                id="theme"
                class="browser-default"
              >
                <option
                  v-for="theme in themes"
                  :value="theme.id"
                  :key="theme.id"
                >
                  {{ theme.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <label>Content Type</label>
              <div class="content-type">
                <label>
                  <input type="radio" v-model="contentType" value="image" />
                  <span>Image</span>
                </label>
                <label>
                  <input type="radio" v-model="contentType" value="video" />
                  <span>Video</span>
                </label>
                <label>
                  <input type="radio" v-model="contentType" value="text" />
                  <span>Text</span>
                </label>
              </div>
            </div>
          </div>
          <div v-if="contentType === 'image'" class="row">
            <div class="input-field col s12">
              <input type="file" id="image" ref="image" class="validate" />
              <label for="image">Upload Image</label>
            </div>
          </div>
          <div v-if="contentType === 'video'" class="row">
            <div class="input-field col s12">
              <input
                type="text"
                id="videoUrl"
                v-model="videoUrl"
                class="validate"
              />
              <label for="videoUrl">Video URL</label>
            </div>
          </div>
          <div v-if="contentType === 'text'" class="row">
            <div class="input-field col s12">
              <textarea
                id="textContent"
                v-model="textContent"
                class="materialize-textarea"
              ></textarea>
              <label for="textContent">Text Content</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12 buttonInput">
              <button
                type="submit"
                class="btn waves-effect waves-light createContentButton"
              >
                Create Content
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
export default {
  name: "ContentForm",
  data() {
    return {
      selectedThemeId: "",
      themes: [],
      contentType: "image",
      videoUrl: "",
      textContent: "",
    };
  },
  components: {
    NavigationBar,
  },
  mounted() {
    this.fetchThemes();
  },
  methods: {
    async fetchThemes() {
      try {
        const token = localStorage.getItem("token"); // Retrieve the access token from localStorage
        const response = await this.$axios.get("http://localhost:3000/themes", {
          headers: {
            Authorization: `${token}`, // Include the access token in the Authorization header
          },
        });
        this.themes = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async createContent() {
      try {
        const payload = new FormData();

        payload.append("type", this.contentType);
        payload.append("themeId", this.selectedThemeId);
        payload.append("userId", 2); // Replace with the actual user ID
        payload.append("credits", 0);

        if (this.contentType === "image") {
          payload.append("file", this.$refs.image.files[0]);
          payload.append("videoUrl", "");
          payload.append("textContent", "");
        } else if (this.contentType === "video") {
          payload.append("videoUrl", this.videoUrl);
          payload.append("textContent", "");
          payload.append("file", "");
        } else if (this.contentType === "text") {
          payload.append("textContent", this.textContent);
          payload.append("file", "");
          payload.append("videoUrl", "");
        }
        console.log(payload);
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        const response = await this.$axios.post(
          "http://localhost:3000/contents",
          payload,
          {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log(response.data);

        // Reset the form fields after submitting
        this.selectedThemeId = "";
        this.contentType = "image";
        this.videoUrl = "";
        this.textContent = "";
        this.$refs.image.value = null;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped src="../styles.css"></style>
