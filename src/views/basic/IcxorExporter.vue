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
  @include Uni-Main-Container;
  .title {
    @include Uni-Main-Title;
  }
  .tabs {
    padding: 0 10px 0 10px;
  }
}
</style>
