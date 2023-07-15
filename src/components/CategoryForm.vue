<template>
  <div>
    <NavigationBar />
    <h4 class="title">Create New Category</h4>

    <div class="form-container">
      <div class="row">
        <form
          @submit.prevent="createCategory"
          class="col s12 registration-form"
        >
          <div class="row">
            <div class="input-field col s12">
              <input
                type="text"
                id="category-name"
                v-model="categoryName"
                class="validate"
              />
              <label for="category-name">Category Name</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input
                type="file"
                id="cover-image"
                ref="coverImage"
                class="validate"
              />
              <label for="cover-image">Cover Image</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12 buttonInput">
              <button
                type="submit"
                class="btn waves-effect waves-light createCategoryButton"
              >
                Create Category
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
  name: "CategoryForm",
  components: {
    NavigationBar,
  },
  data() {
    return {
      categoryName: "",
    };
  },
  methods: {
    async createCategory() {
      try {
        const formData = new FormData();
        console.log(this.categoryName);
        console.log(this.$refs.coverImage.files[0]);
        formData.append("name", this.categoryName);
        formData.append("coverImage", this.$refs.coverImage.files[0]);
        console.log(Array.from(formData.entries()));

        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        const response = await this.$axios.post(
          "http://localhost:3000/categories",
          formData,
          {
            headers: {
              Authorization: `${token}`, // Include the token in the Authorization header
              "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
            },
          }
        );

        console.log(response.data); // You can customize this part according to your needs

        // Reset the form fields after submitting
        this.categoryName = "";
        this.$refs.coverImage.value = null; // Reset the file input
      } catch (error) {
        console.error(error); // Handle error
      }
    },
  },
};
</script>

<style scoped src="../styles.css"></style>
