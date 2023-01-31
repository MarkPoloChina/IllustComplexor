<template>
  <div class="viewer-main">
    <el-scrollbar style="border-radius: 5px">
      <el-row>
        <el-col
          :span="6"
          v-for="(obj, index) in list"
          :key="index"
          class="viewer-img-container"
        >
          <div class="expo"></div>
          <el-image
            class="viewer-img"
            :src="UrlGenerator.getBlobUrl(obj, 'square_medium')"
            :preview-src-list="[UrlGenerator.getBlobUrl(obj, 'original')]"
            fit="cover"
            @click="openLoading()"
            @contextmenu.prevent="handleRightClick($event, obj)"
            lazy
            @error="obj.err = true"
          />
          <template #error>
            <div class="image-slot">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-col>
      </el-row>
    </el-scrollbar>
    <div class="viewer-info">共{{ list.length }}张插画</div>
  </div>
</template>
<script setup>
import { Picture } from "@element-plus/icons-vue";
import { nextTick, reactive } from "vue";
import { UrlGenerator } from "@/js/util/path";
import { ElLoading } from "element-plus";
const remote = require("@electron/remote");
const { Menu, MenuItem } = remote;
// eslint-disable-next-line no-undef
defineProps({
  list: Array,
});
// eslint-disable-next-line no-undef
const emit = defineEmits(["showInfo", "remove"]);
const loadObj = reactive({ value: null });
const openLoading = () => {
  const tryOpen = () =>
    nextTick(() => {
      if (!document.querySelector(".el-image-viewer__mask")) return tryOpen();
      else
        loadObj.value = ElLoading.service({
          target: ".el-image-viewer__mask",
        });
    });
  // if (!loadedSet.value.has(id))
  tryOpen();
};
const handleRightClick = (event, obj) => {
  event.preventDefault();
  const menu = new Menu();
  menu.append(
    new MenuItem({
      label: "详情",
      click: () => {
        emit("showInfo", obj);
      },
    })
  );
  menu.append(
    new MenuItem({
      label: "移除",
      click: () => {
        emit("remove", obj);
      },
    })
  );
  // menu.append(new MenuItem({ type: "separator" })); //分割线
  // menu.append(
  //   new MenuItem({ label: "testCheckBox", type: "checkbox", checked: true })
  // );
  menu.popup({ window: remote.getCurrentWindow() });
};
</script>
<style lang="scss" scoped>
.viewer-main {
  height: 100%;
  @include Flex-C;
  .viewer-img-container {
    position: relative;
    .expo {
      position: relative;
      width: 100%;
      height: 0;
      padding: 0;
      padding-bottom: 100%;
    }
    .viewer-img {
      border-radius: 5px;
      position: absolute;
      top: 10px;
      right: 10px;
      bottom: 10px;
      left: 10px;
      .image-slot {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background: var(--el-fill-color-light);
        color: var(--el-text-color-secondary);
        font-size: 30px;
      }
    }
  }
  .viewer-info {
    height: 50px;
    @include Flex-R-AC;
    color: $color-greengray-2;
    margin-left: 10px;
  }
}
</style>
