<template>
  <div>
    <NavigationBar />
    <h1>Welcome to the HomePage!</h1>
    <!-- Add your content for the HomePage -->
  </div>
</template>

<script>
import NavigationBar from "./NavigationBar.vue";

export default {
  name: "HomePage",
  components: {
    NavigationBar,
  },
};
</script>

<style scoped>
/* Add your styles for the HomePage */
</style>
