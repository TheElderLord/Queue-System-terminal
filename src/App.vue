<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import BottomNavigation from './components/BottomNavigation.vue'


</script>

<template>
  <main>
  <div class="main-container">
    <RouterView />
  </div>
 <div class="footer">
  <BottomNavigation/>
 </div>
</main>
 
</template>

<style lang="scss" scoped>
main{
  .main-container{
    width: 100%;
    height: 90vh;
  }
  .footer{
    width: 100%;
  
  }
}

</style>
