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
      <div class="modal-content">
        <button class="modal-close" @click="closeModal">X</button>
        <div v-if="selectedContent !== null">
          <div v-if="selectedContent.type === 'text'">
            <p>{{ selectedContent.text }}</p>
          </div>
          <div v-else-if="selectedContent.type === 'video'">
            <div :id="'youtube-player-' + selectedContent.id"></div>
          </div>
          <div v-else-if="selectedContent.type === 'image'">
            <img :src="selectedContent.filePath" alt="Content Image" />
          </div>
        </div>
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
      if (content.type === "video") {
        this.loadYouTubePlayerAPI().then(() => {
          this.loadYouTubePlayer(content);
        });
      }
    },
    closeModal() {
      this.isModalOpen = false;
    },
    loadYouTubePlayerAPI() {
      return new Promise((resolve) => {
        if (window.YT && typeof window.YT.Player === "function") {
          resolve();
        } else {
          const tag = document.createElement("script");
          tag.src = "https://www.youtube.com/iframe_api";
          const firstScriptTag = document.getElementsByTagName("script")[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

          window.onYouTubeIframeAPIReady = resolve;
        }
      });
    },
    loadYouTubePlayer(content) {
      const playerContainerId = `youtube-player-${content.id}`;
      const playerContainer = document.getElementById(playerContainerId);
      if (
        playerContainer &&
        window.YT &&
        typeof window.YT.Player === "function"
      ) {
        const videoId = this.extractVideoId(content.videoUrl);
        new window.YT.Player(playerContainerId, {
          height: "315",
          width: "560",
          videoId: videoId,
        });
      }
    },
    extractVideoId(videoUrl) {
      const urlParams = new URLSearchParams(new URL(videoUrl).search);
      return urlParams.get("v");
    },
  },
  computed: {
    selectedContentImageUrl() {
      return this.selectedContent ? this.selectedContent.imageUrl : "";
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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.modal-open {
  opacity: 1;
  pointer-events: auto;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  min-width: 700px;
  max-width: 80%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  color: #aaa;
  border: none;
  background-color: transparent;
  padding: 0;
  cursor: pointer;
}

.modal-close:hover {
  color: #555;
}

.video-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
