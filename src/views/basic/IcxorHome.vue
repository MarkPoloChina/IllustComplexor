<template>
  <div class="home-container">
    <div class="title">主页</div>
    <div class="home-main">
      <el-image :src="url" class="home-img"></el-image>
      <div class="home-title">Illust Complexor</div>
      <div class="home-title-2">Powered by MPSTO</div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";

const url = ref(
  "D:\\CodeWorkplace\\VSCW\\IllustComplexor\\icxor\\src\\assets\\猫猫vue_PoweredbyRock.png"
);
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
