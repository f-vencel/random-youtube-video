<template>
  <div class="container" v-if="error || loading">
    <div v-if="error" class="error">
      <h2>Something went wrong :(</h2>
    </div>
    <div v-else-if="loading" class="loading">
      <h2>loading... :)</h2>
    </div>
  </div>
  <div v-else class="video">
    <iframe class="youtube-video" :src="url" allow="autoplay; encrypted-media" allowfullscreen frameborder="0"></iframe>
  </div>

</template>

<script>
export default {
  data: () => ({
    url: 'https://youtube.com/embed/Jfoxsfhi-kk?autoplay=1&mute=1',
    videoId: 'Jfoxsfhi-kk',
    error: false,
    loading: true,
  }),
  methods: {
    async generateVideo() {
      this.loading = true;
      this.error = false;

      try {
        const id = await this.randomID();

        if (!id.success) {
          throw id.msg ? new Error(id.msg) : new Error('failed to generate random video');
        }

        if (!this.loading) return

        console.log(id.id)
        
        this.videoId = id.id
        this.url = `https://youtube.com/embed/${this.videoId}?autoplay=1&mute=0`;
        this.loading = false;
      }
      catch (error) {
        console.log(error)
        this.error = true
      }
    },
    async randomID() {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      }
    
      const response = await fetch('http://localhost:8000/new', options)
      if (!response.ok) throw new Error('Could not fetch \'http://localhost:8000/new\'')
    
      const data = await response.json()
    
      return data;
    }
  }
}
</script>


<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px;
  
  height: 540px;
  aspect-ratio: 16 / 9;
}
.video {
  background-color: #000;
  outline: 5px solid #000;
  border-radius: 5px;

  display: grid;
  place-items: center;

  height: 540px;
  margin: 30px;

  resize: both;
  overflow: auto;
}
.youtube-video {
  aspect-ratio: 16 / 9;
  height: 100%;
  width: auto;
  max-width: 100%;
}
.error, .loading {
  font-size: 2rem;
  padding: 1rem;
  color: #eee;
}
</style>



<!-- 

// *script:

// ids: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-',
// let id = '';
// for (let i = 0; i < 11; i++) {
//   const rnd = this.ids[Math.floor(Math.random() * 64)];
//   id += rnd;
// }
// return id;

// *script

-->