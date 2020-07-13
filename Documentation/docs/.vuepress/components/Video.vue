<template>
    <div class="video-block" :style="{'padding-bottom': size + '%'}">
        <iframe width="960" height="540"
        :src="url" frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
        </iframe>
    </div>
</template>

<script>
export default {
    props: {
        url: {
            type: String,
            default: 'https://www.youtube.com/embed/EwTZ2xpQwpA?start=10'
        },
        aspect: {
            type: String,
            default: '16x9'
        },
    },
    computed: {
        size () {
            let size = this.aspect.split('x')
            let width = parseInt(size[0])
            let height = parseInt(size[1])
            
            console.log(size);
            return (height / width) * 100
        }
    },
}
</script>

<style scoped>
.video-block {
  position: relative; 
  /* padding-bottom: 56.25%; 16:9 */
  height: 0;
  overflow: hidden;
  width: 100%; 
  height: auto;
  margin-bottom: 16px;
}

.video-block iframe {
  position: absolute;
  top: 0; left: 0;
  width: 100%; 
  height: 100%;
}
</style>