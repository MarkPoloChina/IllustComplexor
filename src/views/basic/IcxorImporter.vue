<template>
  <div class="importer-container">
    <div class="title">导入</div>
    <el-tabs class="tabs" v-model="currentTab">
      <el-tab-pane label="本地导入" name="base">
        <base-importer></base-importer>
      </el-tab-pane>
      <el-tab-pane label="本地赋元" name="meta">
        <meta-importer></meta-importer>
      </el-tab-pane>
      <el-tab-pane label="聚合" name="poly">
        <picolt-importer></picolt-importer>
      </el-tab-pane>
      <el-tab-pane label="Pixiv收藏" name="pixiv">
        <PixivRemoteImporter></PixivRemoteImporter>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { ref } from "vue";
import PicoltImporter from "@/components/icxorImporter/picoltImporter.vue";
import BaseImporter from "@/components/icxorImporter/baseImporter.vue";
import MetaImporter from "@/components/icxorImporter/metaImporter.vue";
import PixivRemoteImporter from "@/components/icxorImporter/pixivRemoteImporter.vue";

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
