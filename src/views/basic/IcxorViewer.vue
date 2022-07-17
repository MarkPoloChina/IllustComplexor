<template>
  <div class="viewer-container">
    <div class="title">视图</div>
    <el-scrollbar class="viewer-imgs">
      <el-image
        :src="item"
        v-for="(item, index) in url.value"
        :key="index"
        lazy
      />
    </el-scrollbar>
  </div>
</template>
<script setup>
import { FilesFilter } from "@/js/viewer/FileFilter";
import { onMounted, reactive } from "vue";

const url = reactive({ value: [] });
onMounted(() => {
  FilesFilter.test().forEach((item) => {
    url.value.push(item);
  });
});
</script>
<style lang="scss" scoped>
.viewer-container {
  width: calc(100% - 20px);
  height: calc(100% - 10px);
  padding: 10px 10px 0 10px;
  @include Flex-C-CT;
  .title {
    padding: 10px;
    font-size: 24px;
    font-weight: bold;
    color: $color-greengray-1;
  }
  .viewer-imgs {
    height: 100%;
    .el-image {
      display: block;
      min-height: 200px;
      margin-bottom: 10px;
    }
  }
}
</style>
