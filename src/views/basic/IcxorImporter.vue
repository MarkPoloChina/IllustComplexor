<template>
  <div class="home-container">
    <div class="title">导入</div>
    <el-alert type="info" show-icon :closable="false">
      <template #title>
        用于添加母本，或者批量将引用的指定值作用于已有图片的元数据。
      </template>
    </el-alert>
    <el-tabs class="tabs" v-model="currentTab">
      <el-tab-pane label="母本/初始化" name="base">
        User
        <el-button @click="test">test</el-button>
      </el-tab-pane>
      <el-tab-pane label="副本" name="copy">Config</el-tab-pane>
      <el-tab-pane label="元数据" name="meta">Role</el-tab-pane>
      <el-tab-pane label="PICOLT卷" name="picolt">Task</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { LoadBase } from "@/js/importer/LoadBase";
import { ref } from "vue";
const test = () => {
  LoadBase.test();
};
const currentTab = ref("base");
</script>
<style lang="scss" scoped>
.home-container {
  width: calc(100% - 20px);
  height: calc(100% - 10px);
  padding: 10px 10px 0 10px;
  @include Flex-C-CT;
  .title {
    padding: 10px;
    font-size: 24px;
    font-weight: bold;
    color: $color-greengray-1;
  }
  .tabs {
    padding: 0 10px 0 10px;
    .el-tabs__item.is-active {
      color: $color-stdblue-1;
    }
  }
}
</style>
