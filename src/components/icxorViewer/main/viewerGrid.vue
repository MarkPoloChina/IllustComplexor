<template>
  <el-scrollbar style="border-radius: 5px" class="grid-container" ref="table">
    <el-row>
      <el-col
        :span="8"
        v-for="(obj, index) in tableData"
        :key="index"
        class="viewer-grid-container"
      >
        <div class="expo"></div>
        <el-image
          class="viewer-img"
          :class="checkIfInSelected(obj) ? 'with-border' : ''"
          :src="UrlGenerator.getBlobUrl(obj, 'square_medium')"
          :preview-src-list="[UrlGenerator.getBlobUrl(obj, 'original')]"
          fit="cover"
          @contextmenu="handleRightClick($event, obj)"
          loading="lazy"
          @error="obj.err = true"
        >
          <template #error>
            <div class="image-slot">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-image>
      </el-col>
    </el-row>
  </el-scrollbar>
</template>
<script setup>
import { Picture } from "@element-plus/icons-vue";
import { UrlGenerator } from "@/js/util/path";
import { onMounted, ref } from "vue";
import { ipcRenderer } from "electron";

const currentSelected = ref([]);
// eslint-disable-next-line no-undef
const emit = defineEmits(["select-change", "update:selections"]);
const table = ref();
// eslint-disable-next-line no-undef
const props = defineProps({
  tableData: Array,
  selections: Array,
});
const resetScroll = () => {
  table.value.setScrollTop(0);
};
onMounted(() => {
  props.selections.forEach((ele) => {
    currentSelected.value.push(ele);
  });
});
const handleRightClick = (event, obj) => {
  event.preventDefault();
  ipcRenderer.removeAllListeners("context:click");
  ipcRenderer.once("context:click", (event, item) => {
    switch (item) {
      case "详情":
        emit("select-change", obj);
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
  emit("update:selections", currentSelected.value);
};
const checkIfInSelected = (obj) => {
  return (
    currentSelected.value.findIndex((val) => {
      return obj.id == val.id;
    }) != -1
  );
};
// eslint-disable-next-line no-undef
defineExpose({ resetScroll });
</script>
<style lang="scss" scoped>
.grid-container {
  height: 100%;
  position: relative;
  .viewer-grid-container {
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
      &.with-border {
        border: 3px solid $color-stdblue-1;
      }
    }
  }
}
</style>
