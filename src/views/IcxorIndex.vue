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
        <el-menu-item index="/poly">
          <el-icon><MessageBox /></el-icon>
          <template #title>聚合</template>
        </el-menu-item>
        <el-menu-item index="/importer">
          <el-icon><Upload /></el-icon>
          <template #title>导入</template>
        </el-menu-item>
        <el-menu-item index="/pixiv">
          <el-icon
            ><img
              src="../assets/img/pixiv_icon.svg"
              style="user-select: none; width: 30px"
          /></el-icon>
          <template #title>Pixiv</template>
        </el-menu-item>
        <div style="flex-grow: 1"></div>
        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <template #title>设置</template>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="index-main">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>
<script setup>
import { useDark } from "@vueuse/core";
import { ipcRenderer } from "electron";
import {
  House,
  PictureRounded,
  MessageBox,
  Upload,
  Setting,
} from "@element-plus/icons-vue";
import { useStore } from "vuex";
import { ConfigDB } from "@/js/local/DBService";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const isDark = useDark();
const router = useRouter();
onMounted(() => {
  ipcRenderer.invoke("dark-mode:get").then((value) => (isDark.value = value));
  ipcRenderer.on("dark-mode:updated", (event, message) => {
    isDark.value = message;
  });
  ipcRenderer.on("router:go", (event, message) => {
    router.push(message);
  });
  ConfigDB.initDB();
  useStore().commit("initStore");
});
</script>
<style lang="scss" scoped>
.index-container {
  @include Flex-R;
  width: 100%;
  height: 100%;
  // background-image: url("@/assets/img/avatar.jpg");
  // background-size: cover;
  background-color: var(--color-bg);

  .index-menu-container {
    height: 100%;
    background-color: $color-stdblue-1;
    flex: none;
    .index-menu {
      @include Flex-C;
      height: 100%;
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
    flex: auto;
    overflow: hidden;
    // background-color: var(--color-bg-alpha);
  }
}
</style>
