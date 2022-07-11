<template>
  <div class="home-container">
    <div class="title">导入<el-button @click="test">test</el-button></div>
    <el-alert type="info" show-icon :closable="false">
      <template #title>
        用于添加母本，或者批量将引用的指定值作用于已有图片的元数据。
      </template>
    </el-alert>
    <el-tabs class="tabs">
      <el-tab-pane label="User" name="first">User</el-tab-pane>
      <el-tab-pane label="Config" name="second">Config</el-tab-pane>
      <el-tab-pane label="Role" name="third">Role</el-tab-pane>
      <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { LoadBase } from "@/js/importer/LoadBase";
const test = () => {
  LoadBase.test()
};
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
