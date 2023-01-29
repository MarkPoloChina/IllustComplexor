<template>
  <div class="importer-container">
    <div class="title">Pixiv</div>
    <el-tabs class="tabs" v-model="currentTab"> </el-tabs>
  </div>
</template>
<script setup>
import { ref } from "vue";
const currentTab = ref("pixiv");
</script>
<style lang="scss" scoped>
.importer-container {
  @include Uni-Main-Container;
  .title {
    @include Uni-Main-Title;
  }
  .tabs {
    padding: 0 10px 0 10px;
  }
}
</style>
