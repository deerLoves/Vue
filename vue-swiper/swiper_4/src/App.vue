<template>
  <div class="swiper-box">
    <div class="swiper-container">
    <div class="swiper-wrapper">
      <div class="swiper-slide">Slide 1</div>
      <div class="swiper-slide">Slide 2</div>
      <div class="swiper-slide">Slide 3</div>
    </div>
</div>
  </div>
</template>
  
<script>
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.css'

export default {
  name: 'App',
  components: {
  },
  mounted () {
    new Swiper ('.swiper-container', {
      loop: true,
      autoplay: {
        delay: 2000,
        stopOnLastSlide: false,
        disableOnInteraction: true,
      }
    })        
  }
}
</script>

<style>
.swiper-box {
  position: relative;
  z-index: 9;
  border-radius: 2rem 2rem 0 0;
}
.swiper-container {
  width: 200px;
  height: 300px;
  margin: 20px auto;
  background: yellow;
  border-radius: 2rem 2rem 0 0;
}
.swiper-slide {
  width: 200px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2rem 2rem 0 0;
}
</style>
