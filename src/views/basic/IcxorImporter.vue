<template>
  <div class="importer-container">
    <div class="title">导入</div>
    <el-tabs class="tabs" v-model="currentTab">
      <el-tab-pane label="母本/初始化" name="base">
        <base-importer></base-importer>
      </el-tab-pane>
      <el-tab-pane label="副本" name="picolt">
        <picolt-importer></picolt-importer>
      </el-tab-pane>
      <el-tab-pane label="元数据" name="meta">
        <meta-importer></meta-importer>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { ref } from "vue";
import PicoltImporter from "@/components/icxorImporter/picoltImporter.vue";
import BaseImporter from "@/components/icxorImporter/baseImporter.vue";
import MetaImporter from "@/components/icxorImporter/metaImporter.vue";

const currentTab = ref("base");
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
    :deep(.el-tabs__item.is-active) {
      color: $color-stdblue-1;
    }
    :deep(.el-tabs__item:hover) {
      color: $color-stdblue-1;
    }
    :deep(.el-tabs__active-bar) {
      background-color: $color-stdblue-1;
    }
  }
}
</style>
