<template>
  <div class="v-focus-container" v-loading="loading">
    <div class="focus-container">
      <el-image
        v-if="tableData[currentIndex]"
        class="viewer-img"
        :src="
          UrlGenerator.getBlobUrl(
            tableData[currentIndex],
            store.state.useLocal ? 'original' : 'medium'
          )
        "
        :preview-src-list="[
          UrlGenerator.getBlobUrl(tableData[currentIndex], 'original'),
        ]"
        fit="contain"
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
          :class="obj.checked ? 'with-border' : ''"
          :src="UrlGenerator.getBlobUrl(obj, 'square_medium')"
          fit="cover"
          @click="handleSelect(obj, index)"
          @contextmenu.prevent="handleRightClick($event, obj)"
          lazy
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
import { UrlGenerator } from "@/js/util/path";
import { onActivated, onDeactivated, ref, watch } from "vue";
import { useStore } from "vuex";

const store = useStore();
const currentIndex = ref(0);
// eslint-disable-next-line no-undef
const emit = defineEmits([
  "select-change",
  "selects-change",
  "popup-context",
  "star-change",
]);
const table = ref();
// eslint-disable-next-line no-undef
const props = defineProps({
  tableData: Array,
  loading: Boolean,
  currentSelected: Object,
});
watch(
  () => props.tableData,
  (val) => {
    table.value.setScrollTop(0);
    handleSelect(val[0], 0);
  },
  {
    deep: false,
  }
);
watch(
  () => props.currentSelected,
  (val) => {
    if (props.currentSelected)
      currentIndex.value = props.tableData.findIndex((v) => v.id == val.id);
  },
  {
    deep: false,
    immediate: true,
  }
);
const handleRightClick = (event, obj) => {
  event.preventDefault();
  emit("popup-context", obj);
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
onActivated(() => {
  addKeyboardListener();
});
onDeactivated(() => {
  removeKeyboardListener();
});
const keyboardHandler = (event) => {
  event.preventDefault();
  switch (event.key) {
    case "ArrowRight":
      handleIndexChange("up");
      break;
    case "ArrowLeft":
      handleIndexChange("down");
      break;
    case "1":
      emit("star-change", 1);
      break;
    case "2":
      emit("star-change", 2);
      break;
    case "3":
      emit("star-change", 3);
      break;
    case "4":
      emit("star-change", 4);
      break;
    case "5":
      emit("star-change", 5);
      break;
    default:
      break;
  }
};
const addKeyboardListener = () => {
  document.addEventListener("keyup", keyboardHandler);
};
const removeKeyboardListener = () => {
  document.removeEventListener("keyup", keyboardHandler);
};
// eslint-disable-next-line no-undef
defineExpose({ handleIndexChange });
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
