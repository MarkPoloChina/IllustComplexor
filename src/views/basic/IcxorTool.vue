<template>
  <div class="importer-container">
    <div class="title">本地工具</div>
    <el-tabs class="tabs" v-model="currentTab">
      <el-tab-pane label="条件复制" name="copy"> </el-tab-pane>
      <el-tab-pane label="重命名" name="rename"> </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { ref } from "vue";
const currentTab = ref("copy");
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
