<script setup>
import NavMenu from './components/NavMenu.vue';
import CornerLogo from './components/CornerLogo.vue';
import PageHeader from './components/PageHeader.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="MainPage">
    <div class="NavArea">
      <CornerLogo></CornerLogo>
      <NavMenu></NavMenu>
    </div>
    <div class="PageArea">
      <div class="PageTop">
        <PageHeader></PageHeader>
      </div>
      <div class="PageContent">
        <RouterView></RouterView>
      </div>
    </div>
  </div>
</template>

<style scoped>
.MainPage{
  display: flex;
  width: 100%;
  height: 100vh;
}

.NavArea{
  display: flex;
  flex-direction: column;
  border-right: 1px solid lightgray;
  padding: 10px;
  width: 250px;
  height: 100vh;
}

.PageArea{
  display: flex;
  flex-direction: column;
  width: calc(100% - 250px);
}

.PageTop{
  display: flex;
  height: 50px;
  width: 100%;
  border-bottom: 1px solid lightgray;
}

.PageContent{
  height: calc(100vh - 50px);
}

</style>