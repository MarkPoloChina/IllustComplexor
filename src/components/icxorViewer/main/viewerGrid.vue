<template>
  <el-scrollbar style="border-radius: 5px" class="grid-container" ref="table">
    <el-row v-loading="loading">
      <el-col
        :span="8"
        v-for="(obj, index) in tableData"
        :key="index"
        class="viewer-grid-container"
      >
        <div class="expo"></div>
        <el-image
          class="viewer-img"
          :class="`${obj.checked ? 'with-border' : ''} ${
            props.currentSelected && props.currentSelected.id == obj.id
              ? 'bigger'
              : ''
          }`"
          :src="UrlGenerator.getBlobUrl(obj, 'square_medium')"
          :preview-src-list="[UrlGenerator.getBlobUrl(obj, 'original')]"
          fit="cover"
          @contextmenu="handleRightClick($event, obj)"
          lazy
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
import { ref, watch } from "vue";

// eslint-disable-next-line no-undef
const emit = defineEmits(["update:selections", "popup-context"]);
const table = ref();
// eslint-disable-next-line no-undef
const props = defineProps({
  tableData: Array,
  selections: Array,
  loading: Boolean,
  currentSelected: Object,
});
watch(
  () => props.tableData,
  () => {
    table.value.setScrollTop(0);
  },
  {
    deep: false,
  }
);
const handleRightClick = (event, obj) => {
  event.preventDefault();
  emit("popup-context", obj);
};
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
      &.bigger {
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
      }
    }
  }
}
</style>
