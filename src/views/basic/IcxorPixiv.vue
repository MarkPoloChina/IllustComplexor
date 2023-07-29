<template>
  <div class="importer-container">
    <div class="title">Pixiv</div>
    <el-tabs class="tabs" v-model="currentTab">
      <el-tab-pane label="插画" name="illust">
        <PixivIllust ref="illust"></PixivIllust>
      </el-tab-pane>
      <el-tab-pane label="画师" name="user"> </el-tab-pane>
      <el-tab-pane label="收藏" name="bookmark"> </el-tab-pane
    ></el-tabs>
  </div>
</template>
<script setup>
import PixivIllust from "@/components/icxorPixiv/pixivIllust.vue";
import { onActivated, ref } from "vue";
import { useRoute } from "vue-router";
const currentTab = ref("illust");
const route = useRoute();
const illust = ref(null);
onActivated(() => {
  if (route.fullPath.startsWith("/pixiv/illust")) {
    currentTab.value = "illust";
    illust.value.handleSearchByLink(route.params.pid, route.params.page);
  }
});
</script>
<style lang="scss" scoped>
.importer-container {
  @include Uni-Main-Container;
  .title {
    @include Uni-Main-Title;
  }
  .tabs {
    padding: 0 10px 0 10px;
    height: calc(100% - 52px);
    :deep(.el-tabs__content) {
      height: calc(100% - 55px);
    }
    :deep(.el-tab-pane) {
      height: 100%;
    }
  }
}
</style>
