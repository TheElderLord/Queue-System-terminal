<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView,useRoute } from 'vue-router'
import BottomNavigation from './components/BottomNavigation.vue'


const route = useRoute();

const isAdminPage = ()=>{
    if(route.path === "/admin"){
      return true;
    }
    return false;
}

</script>

<template>
  <main>
  <div class="main-container">
    <RouterView />
  </div>
 <div v-if="!isAdminPage()" class="footer">
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
