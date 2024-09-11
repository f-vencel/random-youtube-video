<script setup>
import YoutubeFrame from './components/YoutubeFrame.vue';
</script>

<template>
  <div id="bg"></div>
  <main>
    <YoutubeFrame v-show="hasVideo" ref="video"/>
    <button @click="generateVideo" class="next">{{ caption[captionIndex] }}</button>
  </main>
</template>

<script>
export default {
  data: () => ({
    caption: ['Click here for random Youtube video', 'Next'],
    captionIndex: 0,
    hasVideo: false,
  }),
  mounted() {
    document.addEventListener('keydown', e => {

      switch(e.key) {
        case 'ArrowRight': if (!e.altKey) break;
        case 'n': {
          this.generateVideo();
          break;
        }
      }
    })
  },
  methods: {
    generateVideo() {
      if (!this.hasVideo) {
        this.hasVideo = true;
        this.captionIndex = 1;
      }
      this.$refs.video.generateVideo();
    }
  }
}
</script>


<style scoped>
main {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
}

#bg {
  position: fixed;
  z-index: -1;
  width: calc(100vw + 90px);
  height: 100vh;
  background-color: #08001f;
  background-image: repeating-linear-gradient(-30deg, #04000f 0px, #10103c 15px, #04000f 30px);
  animation: move-bg 2s linear infinite;
}

@keyframes move-bg {
  from { transform: translateX(-60px); }
  to { transform: translateX(0px); }
}

button {
  cursor: pointer;
  font: inherit;
}

.next {
  background-color: #eee;

  padding: 1rem 2rem;
  border: 5px solid #000;
  border-radius: 10px;
  letter-spacing: -0.5px;
  font-size: 2rem;
  font-weight: 600;
  transition: all 100ms;
}
.next:active {
  scale: 0.8;
}
</style>