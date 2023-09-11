<template>
  <div class="setting-container">
    <div class="title">设置</div>
    <el-tabs class="tabs" v-model="currentTab">
      <el-tab-pane label="配置信息" name="config" lazy>
        <icxor-config></icxor-config>
      </el-tab-pane>
      <el-tab-pane label="远程基" name="remote" lazy>
        <IcxorRemote></IcxorRemote>
      </el-tab-pane>
      <el-tab-pane label="关于" name="about" lazy>
        <icxor-about></icxor-about>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import IcxorConfig from "@/components/IcxorSettings/IcxorConfig.vue";
import IcxorAbout from "@/components/IcxorSettings/IcxorAbout.vue";
import IcxorRemote from "@/components/IcxorSettings/IcxorRemote.vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
const currentTab = ref("config");
const route = useRoute();
onMounted(() => {
  if (route.path == "/about") currentTab.value = "about";
});
</script>
<style lang="scss" scoped>
.setting-container {
  width: calc(100% - 20px);
  height: calc(100% - 10px);
  padding: 10px 10px 0 10px;
  overflow: hidden;
  @include Flex-C;
  .title {
    padding: 10px;
    font-size: 24px;
    font-weight: bold;
    color: $color-greengray-1;
    flex: none;
  }
  .tabs {
    padding: 0 10px 0 10px;
    flex: auto;
    overflow: hidden;
    position: relative;
    :deep(.el-tab-pane) {
      height: 100%;
    }
    :deep(.el-tabs__content) {
      height: calc(100% - 55px);
    }
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
