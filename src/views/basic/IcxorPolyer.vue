<template>
  <div class="viewer-container">
    <div class="title">聚合</div>
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
import TimelineViewer from "@/components/icxorPolyer/timelineViewer.vue";
import PicoltViewer from "@/components/icxorPolyer/picoltViewer.vue";
import LnrViewer from "@/components/icxorPolyer/lnrViewer.vue";
import AuthorViewer from "@/components/icxorPolyer/authorViewer.vue";

const currentTab = ref("timeline");
</script>
<style lang="scss" scoped>
.viewer-container {
  @include Uni-Main-Container;
  .title {
    @include Uni-Main-Title;
  }
  .tabs {
    padding: 0 10px 0 10px;
    height: calc(100% - 52px);
    position: relative;
    :deep(.el-tab-pane) {
      height: 100%;
    }
    > :deep(.el-tabs__content) {
      height: calc(100% - 55px);
    }
  }
}
</style>
