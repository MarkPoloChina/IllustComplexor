<template>
  <div class="home-container">
    <div class="title">主页</div>
    <div class="home-main">
      <div class="home-welcome">
        Hi, <span>{{ username }}</span>
      </div>
      <el-image :src="url" class="home-img"></el-image>
      <div class="home-title">Illust Complexor</div>
      <div class="home-title-2">Powered by MPSTO</div>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import url from "@/assets/avatar.jpg";
const username = computed(() => {
  return useStore().state.username;
});
</script>
<style lang="scss" scoped>
.home-container {
  width: calc(100% - 20px);
  height: calc(100% - 10px);
  padding: 10px 10px 0 10px;
  overflow: hidden;
  @include Flex-C-CT;
  .title {
    padding: 10px;
    font-size: 24px;
    font-weight: bold;
    color: $color-greengray-1;
  }
  .home-main {
    @include Flex-CT;
    height: 100%;
    .home-welcome {
      font-size: 40px;
      margin: 0 0 50px 0;
      font-family: Cascadia Mono;
      color: $color-stdblue-1;
      span {
        color: $color-greengray-2;
      }
    }
    .home-img {
      width: 40%;
      margin-bottom: 20px;
    }
    .home-title {
      font-size: 40px;
      font-weight: bolder;
    }
    .home-title-2 {
      font-size: 25px;
    }
  }
}
</style>
