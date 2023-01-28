<template>
  <el-scrollbar style="border-radius: 5px" class="grid-container" ref="table">
    <div
      v-for="(obj, index) in tableData"
      :key="index"
      class="viewer-grid-container"
    >
      <div class="expo"></div>
      <el-image
        class="viewer-img"
        :class="checkIfInSelected(obj) ? 'with-border' : ''"
        :src="UrlGenerator.getBlobThumUrl(obj)"
        :preview-src-list="[UrlGenerator.getBlobOriginUrl(obj)]"
        fit="cover"
        @click="openLoading()"
        @contextmenu.prevent="handleRightClick($event, obj)"
        loading="lazy"
      >
        <template #error>
          <div class="image-slot">
            <el-icon><Picture /></el-icon>
          </div>
        </template>
      </el-image>
    </div>
  </el-scrollbar>
</template>
<script setup>
import { Picture } from "@element-plus/icons-vue";
import { ElLoading } from "element-plus";
import { nextTick } from "vue";
import { UrlGenerator } from "@/js/util/path";
import { onMounted, ref } from "vue";
const remote = require("@electron/remote");
const { Menu, MenuItem } = remote;

const currentSelected = ref([]);
const currentRow = ref();
// eslint-disable-next-line no-undef
const emit = defineEmits(["select-change", "selects-change"]);
const table = ref();
// eslint-disable-next-line no-undef
defineProps({
  tableData: Array,
});
// eslint-disable-next-line no-undef
// const emits = defineEmits(["select-change", "selects-change"]);
const resetScroll = () => {
  table.value.setScrollTop(0);
};
onMounted(() => {});
const openLoading = () => {
  const tryOpen = () =>
    nextTick(() => {
      if (!document.querySelector(".el-image-viewer__mask")) return tryOpen();
      else
        ElLoading.service({
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
        currentRow.value = obj;
        emit("select-change", obj);
      },
    })
  );
  menu.append(new MenuItem({ type: "separator" })); //分割线
  menu.append(
    new MenuItem({
      label: "选定",
      type: "checkbox",
      checked: checkIfInSelected(obj),
      click: () => {
        handleToggle(obj);
      },
    })
  );
  menu.popup({ window: remote.getCurrentWindow() });
};
const handleToggle = (obj) => {
  let index = currentSelected.value.findIndex((val) => {
    return obj.id == val.id;
  });
  if (index != -1) currentSelected.value.splice(index, 1);
  else currentSelected.value.push(obj);
};
const checkIfInSelected = (obj) => {
  return (
    currentSelected.value.find((val) => {
      return obj.id == val.id;
    }) !== undefined
  );
};
// const handleSelectionChange = (val) => {
//   currentSelected.value = val;
// };
// eslint-disable-next-line no-undef
defineExpose({ resetScroll });
</script>
<style lang="scss" scoped>
.grid-container {
  height: 100%;
  position: relative;
  .viewer-grid-container {
    display: inline-block;
    position: relative;
    margin: 10px;
    width: calc((100% - 60px) / 3);
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
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
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
      &.with-border {
        border: 3px solid $color-stdblue-1;
        width: calc(100% - 6px);
        height: calc(100% - 6px);
      }
    }
  }
}
</style>
