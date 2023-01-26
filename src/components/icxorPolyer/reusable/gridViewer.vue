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
          <el-image
            class="viewer-img"
            :src="
              UrlGenerator.getPixivBlobSquareUrl(obj.meta.pid, obj.meta.page)
            "
            :preview-src-list="[
              UrlGenerator.getPixivBlobOriginUrl(obj.meta.pid, obj.meta.page),
            ]"
            fit="cover"
            @click="openLoading()"
            @contextmenu.prevent="handleRightClick($event, obj)"
            lazy
          />
        </el-col>
      </el-row>
    </el-scrollbar>
    <div class="viewer-info">共{{ list.length }}张插画</div>
  </div>
</template>
<script setup>
import { nextTick, reactive } from "vue";
import { UrlGenerator } from "@/api/api";
import { ElLoading } from "element-plus";
const remote = require("@electron/remote");
const { Menu, MenuItem } = remote;
// eslint-disable-next-line no-undef
defineProps({
  list: Array,
});
// eslint-disable-next-line no-undef
const emit = defineEmits(["showInfo"]);
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
  menu.append(new MenuItem({ type: "separator" })); //分割线
  menu.append(
    new MenuItem({ label: "testCheckBox", type: "checkbox", checked: true })
  );
  menu.popup({ window: remote.getCurrentWindow() });
};
</script>
<style lang="scss" scoped>
.viewer-main {
  height: 100%;
  @include Flex-C-CT;
  .viewer-img-container {
    @include Flex-CT;
    padding: 10px 0 10px 0;
    .viewer-img {
      border-radius: 5px;
      height: calc((100vw - 320px) / 4);
      width: calc((100vw - 320px) / 4);
    }
  }
  .viewer-info {
    height: 50px;
    @include Flex-R-CT;
    color: $color-greengray-2;
    margin-left: 10px;
  }
}
</style>
