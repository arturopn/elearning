<template>
  <div>
    <NavigationBar />

    <div class="container">
      <h2>Content List</h2>

      <div class="search-bar">
        <input
          type="text"
          v-model="searchTerm"
          @input="searchContents"
          placeholder="Search content"
        />
      </div>

      <!-- Content Count Cards -->
      <div class="content-count">
        <!-- Content count cards code here -->
      </div>

      <!-- Content Table -->
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Credits</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="content in sortedContents" :key="content.id">
            <td>{{ content.type }}</td>
            <td>{{ content.credits }}</td>
            <td>
              <button class="eye-icon" @click="openModal(content)">
                <i class="material-icons">remove_red_eye</i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div class="modal" :class="{ 'modal-open': isModalOpen }">
      <!-- Modal content here -->
    </div>
  </div>
</template>

<script>
import NavigationBar from "./NavigationBar.vue";
import axios from "axios";

export default {
  components: {
    NavigationBar,
  },
  data() {
    return {
      contents: [],
      sortedContents: [],
      isModalOpen: false,
      selectedContent: null,
      searchTerm: "",
    };
  },
  mounted() {
    this.fetchContents();
  },
  methods: {
    async fetchContents() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/contents", {
          headers: {
            Authorization: `${token}`,
          },
        });
        this.contents = response.data;
        this.sortAndFilterContents();
      } catch (error) {
        console.error(error);
      }
    },
    sortAndFilterContents() {
      this.sortedContents = this.contents
        .filter((content) => {
          const searchRegex = new RegExp(this.searchTerm, "i");
          return searchRegex.test(content.type);
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    searchContents() {
      this.sortAndFilterContents();
    },
    openModal(content) {
      this.selectedContent = content;
      this.isModalOpen = true;
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.search-bar input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  border: 1px solid #ccc;
}

.eye-icon {
  border: none;
  background-color: transparent;
  padding: 0;
  margin: 0;
  cursor: pointer;
}

.eye-icon:hover {
  color: #555;
}

.eye-icon i {
  font-size: 1.5rem;
}

.modal {
  /* Modal styles here */
}
</style>
