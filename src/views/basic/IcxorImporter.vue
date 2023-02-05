<template>
  <div class="importer-container">
    <div class="title">导入</div>
    <el-tabs class="tabs" v-model="currentTab">
      <el-tab-pane label="Pixiv导入" name="pixiv">
        <PixivImporter></PixivImporter>
      </el-tab-pane>
      <el-tab-pane label="其他导入" name="oth">
        <OtherImporter></OtherImporter>
      </el-tab-pane>
      <el-tab-pane label="聚合" name="poly">
        <PolyImporter></PolyImporter>
      </el-tab-pane>
      <el-tab-pane label="Pixiv收藏" name="bookmark">
        <PixivRemoteImporter></PixivRemoteImporter>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { ref } from "vue";
import PolyImporter from "@/components/icxorImporter/polyImporter.vue";
import PixivImporter from "@/components/icxorImporter/pixivImporter.vue";
import PixivRemoteImporter from "@/components/icxorImporter/pixivRemoteImporter.vue";
import OtherImporter from "@/components/icxorImporter/otherImporter.vue";

const currentTab = ref("pixiv");
</script>
<style lang="scss" scoped>
.importer-container {
  @include Uni-Main-Container;
  .title {
    @include Uni-Main-Title;
  }
  .tabs {
    padding: 0 10px 0 10px;
    height: 100%;
    :deep(.el-tabs__content) {
      height: calc(100% - 55px);
    }
    :deep(.el-tab-pane) {
      height: 100%;
    }
  }
}
</style>
