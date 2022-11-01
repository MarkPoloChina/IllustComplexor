<template>
  <div class="viewer-container">
    <div class="title">视图</div>
    <el-tabs class="tabs" v-model="currentTab">
      <el-tab-pane label="时间线" name="timeline" lazy>
        <timeline-viewer></timeline-viewer>
      </el-tab-pane>
      <el-tab-pane label="PICOLT聚合" name="picolt" lazy>
        <picolt-viewer></picolt-viewer>
      </el-tab-pane>
      <el-tab-pane label="LNR聚合" name="lnr" lazy>
        <lnr-viewer></lnr-viewer>
      </el-tab-pane>
      <el-tab-pane label="作者专题聚合" name="author" lazy>
        <author-viewer></author-viewer>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { ref } from "vue";
import TimelineViewer from "@/components/icxorViewer/timelineViewer.vue";
import PicoltViewer from "@/components/icxorViewer/picoltViewer.vue";
import LnrViewer from "@/components/icxorViewer/lnrViewer.vue";
import AuthorViewer from "@/components/icxorViewer/authorViewer.vue";

const currentTab = ref("timeline");
</script>
<style lang="scss" scoped>
.viewer-container {
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
  .tabs {
    padding: 0 10px 0 10px;
    height: 100%;
    position: relative;
    :deep(.el-tab-pane) {
      height: 100%;
    }
    :deep(.el-tabs__content) {
      height: calc(100% - 50px);
    }
  }
}
</style>
