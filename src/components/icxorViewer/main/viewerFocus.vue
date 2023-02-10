<template>
  <div class="v-focus-container">
    <div class="focus-container">
      <el-image
        class="viewer-img"
        :class="checkIfInSelected(tableData[currentIndex]) ? 'with-border' : ''"
        :src="UrlGenerator.getBlobUrl(tableData[currentIndex], 'medium')"
        :preview-src-list="[
          UrlGenerator.getBlobUrl(tableData[currentIndex], 'original'),
        ]"
        fit="contain"
        @click="openLoading()"
      >
        <template #error>
          <div class="image-slot">
            <el-icon><Picture /></el-icon>
          </div>
        </template>
      </el-image>
    </div>
    <el-scrollbar ref="table" class="flow-container">
      <div
        v-for="(obj, index) in tableData"
        :key="index"
        class="viewer-flow-container"
      >
        <div class="expo"></div>
        <el-image
          class="viewer-img"
          :class="checkIfInSelected(obj) ? 'with-border' : ''"
          :src="UrlGenerator.getBlobUrl(obj, 'square_medium')"
          fit="cover"
          @click="handleSelect(obj, index)"
          @contextmenu.prevent="handleRightClick($event, obj, index)"
          loading="lazy"
          @error="obj.err = true"
        >
          <template #error>
            <div class="image-slot">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-image>
      </div>
    </el-scrollbar>
  </div>
</template>
<script setup>
import { Picture } from "@element-plus/icons-vue";
import { ElLoading } from "element-plus";
import { nextTick } from "vue";
import { UrlGenerator } from "@/js/util/path";
import { onMounted, ref } from "vue";
import { ipcRenderer } from "electron";

const currentSelected = ref([]);
const currentIndex = ref(0);
// eslint-disable-next-line no-undef
const emit = defineEmits(["select-change", "selects-change"]);
const table = ref();
// eslint-disable-next-line no-undef
const props = defineProps({
  tableData: Array,
});
// eslint-disable-next-line no-undef
// const emits = defineEmits(["select-change", "selects-change"]);
const resetScroll = () => {
  table.value.setScrollTop(0);
  currentIndex.value = 0;
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
const handleRightClick = (event, obj, index) => {
  event.preventDefault();
  ipcRenderer.removeAllListeners("context:click");
  ipcRenderer.once("context:click", (event, item) => {
    switch (item) {
      case "详情":
        handleSelect(obj, index);
        break;
      case "选定":
        handleToggle(obj);
        break;
      default:
        break;
    }
  });
  ipcRenderer.send("context:popup", [
    { label: "详情" },
    { type: "separator" },
    {
      label: "选定",
      type: "checkbox",
      checked: checkIfInSelected(obj),
    },
  ]);
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
const handleSelect = (obj, index) => {
  currentIndex.value = index;
  emit("select-change", obj);
};
const handleIndexChange = (action) => {
  if (action == "up") {
    if (currentIndex.value < props.tableData.length - 1) currentIndex.value++;
  } else if (action == "down") if (currentIndex.value > 0) currentIndex.value--;
  emit("select-change", props.tableData[currentIndex.value]);
};
// const handleSelectionChange = (val) => {
//   currentSelected.value = val;
// };
// eslint-disable-next-line no-undef
defineExpose({ resetScroll, handleIndexChange });
</script>
<style lang="scss" scoped>
.v-focus-container {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
  .focus-container {
    height: 100%;
    width: 85%;
    .viewer-img {
      border-radius: 5px;
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 50px;
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
  .flow-container {
    height: 100%;
    position: relative;
    width: calc(15% - 10px);
    margin-left: 10px;
    .viewer-flow-container {
      display: inline-block;
      position: relative;
      width: calc((100% - 10px));
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
        top: 5px;
        right: 5px;
        bottom: 5px;
        left: 5px;
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
        }
      }
    }
  }
}
</style>
