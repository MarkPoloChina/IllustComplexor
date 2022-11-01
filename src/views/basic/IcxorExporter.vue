<template>
  <div class="importer-container">
    <div class="title">导出</div>
    <el-tabs class="tabs" v-model="currentTab">
      <el-tab-pane label="PICOLT导出" name="picolt">
        <picolt-exporter></picolt-exporter>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { ref } from "vue";
import PicoltExporter from "@/components/IcxorExporter/picoltExporter.vue";
const currentTab = ref("picolt");
</script>
<style lang="scss" scoped>
.importer-container {
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
  }
}
</style>
