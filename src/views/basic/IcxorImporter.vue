<template>
  <div class="importer-container">
    <div class="title">导入</div>
    <el-tabs class="tabs" v-model="currentTab">
      <el-tab-pane label="本地基准" name="base">
        <base-importer></base-importer>
      </el-tab-pane>
      <el-tab-pane label="聚合" name="poly">
        <picolt-importer></picolt-importer>
      </el-tab-pane>
      <el-tab-pane label="本地元数据" name="meta">
        <meta-importer></meta-importer>
      </el-tab-pane>
      <el-tab-pane label="Pixiv托管机" name="pixiv">
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
  @include Uni-Main-Container;
  .title {
    @include Uni-Main-Title;
  }
  .tabs {
    padding: 0 10px 0 10px;
  }
}
</style>
