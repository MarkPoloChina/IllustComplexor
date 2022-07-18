<template>
  <div class="index-container">
    <div class="index-menu-container">
      <el-menu :default-active="$route.path" class="index-menu" collapse router>
        <el-menu-item index="/home">
          <el-icon><House /></el-icon>
          <template #title>主页</template>
        </el-menu-item>
        <el-menu-item index="/view">
          <el-icon><PictureRounded /></el-icon>
          <template #title>视图</template>
        </el-menu-item>
        <el-menu-item index="/importer">
          <el-icon><Upload /></el-icon>
          <template #title>导入</template>
        </el-menu-item>
      </el-menu>
      <el-menu default-active="" class="index-menu" collapse router>
        <el-menu-item index="/setting">
          <el-icon><Setting /></el-icon>
          <template #title>设置</template>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="index-main">
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup>
import {
  House,
  PictureRounded,
  Upload,
  Setting,
} from "@element-plus/icons-vue";
import { ConfigDB, MetaDB } from "@/js/manager/DBService";
import { onMounted } from "vue";
onMounted(() => {
  ConfigDB.initDB();
  MetaDB.initMeta();
});
</script>
<style lang="scss" scoped>
.index-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  .index-menu-container {
    @include Flex-C-SB;
    height: 100%;
    background-color: $color-stdblue-1;
    .index-menu {
      border-right: none;
      --el-menu-bg-color: transparent;
      --el-menu-active-color: white;
      --el-menu-text-color: white;
      --el-menu-hover-bg-color: #5dabdc;
      .el-menu-item.is-active {
        background-color: var(--el-menu-hover-bg-color);
      }
      .el-menu-item [class^="el-icon"] {
        font-size: 30px;
      }
    }
  }
  .index-main {
    width: 100%;
  }
}
</style>
