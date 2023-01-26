<template>
  <el-tabs tab-position="left" class="viewer-imgs" v-if="author.length != 0">
    <el-tab-pane
      :label="item.author"
      v-for="(item, index) in author"
      :key="index"
      lazy
    >
      <GridViewer @showInfo="getInfo" :list="item.list"></GridViewer>
    </el-tab-pane>
  </el-tabs>
  <el-empty description="无插图" v-else />
  <info-viewer v-model="dialogVisible" :info="currentInfo.value"></info-viewer>
</template>
<script setup>
import InfoViewer from "./reusable/InfoViewer.vue";
import { onMounted, reactive, ref } from "vue";
import { API } from "@/api/api";
import GridViewer from "./reusable/gridViewer.vue";

const author = reactive([]);
const dialogVisible = ref(false);
const currentInfo = reactive({ value: null });
onMounted(() => {
  getData();
});
const getData = async () => {
  const data = await API.getPolyWithIllust("author");
  data.forEach((item) => {
    author.push({
      name: `${item.parent}-${item.name}`,
      list: item.illusts,
    });
  });
};
const getInfo = (obj) => {
  currentInfo.value = obj;
  if (currentInfo.value) dialogVisible.value = true;
};
</script>
<style lang="scss" scoped>
.viewer-imgs {
  height: 100%;
  :deep(.el-tabs__header.is-left) {
    max-width: 100px;
    text-overflow: ellipsis;
  }

  .viewer-main {
    height: 100%;
    @include Flex-C-CT;
    .viewer-img-container {
      display: inline-block;
      position: relative;
      padding: 10px;
      .viewer-img {
        border-radius: 5px;
        height: calc((100vw - 300px) / 4);
        width: calc((100vw - 300px) / 4);
      }
      .viewer-img-star {
        @include Flex-RCT;
        position: absolute;
        bottom: 13px;
        height: 32px;
        width: calc(100% - 20px);
        background-color: rgba(255, 255, 255, 0.8);
        // backdrop-filter: blur(10px);
        border-radius: 5px;
      }
      .viewer-img-info {
        position: absolute;
        top: 15px;
        right: 15px;
        // backdrop-filter: blur(10px);
      }
    }
    .viewer-bar {
      height: 60px;
      width: 100%;
      @include Flex-R-SB;
      .viewer-info {
        color: $color-greengray-2;
        margin-left: 10px;
      }
      .viewer-sorter {
        margin-right: 10px;
      }
    }
  }
}
</style>
