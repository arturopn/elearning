<template>
  <div>
    <NavigationBar />
    <h2>Content List</h2>

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

    <!-- Modal -->
    <div class="modal" :class="{ 'modal-open': isModalOpen }">
      <div class="modal-content">
        <div v-if="selectedContent !== null">
          <div v-if="selectedContent.type === 'text'">
            {{ selectedContent.text }}
          </div>
          <div v-else-if="selectedContent.type === 'video'">
            <div v-html="getEmbeddedVideo(selectedContent.videoUrl)"></div>
          </div>
          <div v-else-if="selectedContent.type === 'image'">
            <img
              :src="getImageUrl(selectedContent.filePath)"
              alt="Content Image"
            />
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="modal-close btn">Close</button>
      </div>
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
        console.log(response.data);
        this.contents = response.data;
        this.sortedContents = this.sortContentsByDate(this.contents);
      } catch (error) {
        console.error(error);
      }
    },
    sortContentsByDate(contents) {
      return contents.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    },
    openModal(content) {
      this.selectedContent = content;
      this.isModalOpen = true;
    },
    getImageUrl(filePath) {
      return `http://localhost:3000/${filePath}`;
    },
    getEmbeddedVideo(videoUrl) {
      const videoId = this.extractVideoId(videoUrl);
      return `
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/${videoId}"
            frameborder="0"
            allowfullscreen
          ></iframe>
        `;
    },
    extractVideoId(videoUrl) {
      const urlParams = new URLSearchParams(new URL(videoUrl).search);
      return urlParams.get("v");
    },
  },
};
</script>

<style scoped>
/* Styles here */
</style>
