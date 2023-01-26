<template>
  <div class="viewer-container">
    <div class="title">聚合</div>
    <el-tabs class="tabs" v-model="currentTab">
      <el-tab-pane label="时间线" name="timeline" lazy>
        <timeline-polyer></timeline-polyer>
      </el-tab-pane>
      <el-tab-pane label="PICOLT聚合" name="picolt" lazy>
        <picolt-polyer></picolt-polyer>
      </el-tab-pane>
      <el-tab-pane label="LNR聚合" name="lnr" lazy>
        <lnr-polyer></lnr-polyer>
      </el-tab-pane>
      <el-tab-pane label="作者专题聚合" name="author" lazy>
        <author-polyer></author-polyer>
      </el-tab-pane>
      <el-tab-pane label="图源聚合" name="source" lazy>
        <source-polyer></source-polyer>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { ref } from "vue";
import TimelinePolyer from "@/components/icxorPolyer/timelinePolyer.vue";
import PicoltPolyer from "@/components/icxorPolyer/picoltPolyer.vue";
import LnrPolyer from "@/components/icxorPolyer/lnrPolyer.vue";
import AuthorPolyer from "@/components/icxorPolyer/authorPolyer.vue";
import SourcePolyer from "@/components/icxorPolyer/sourcePolyer.vue";

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
