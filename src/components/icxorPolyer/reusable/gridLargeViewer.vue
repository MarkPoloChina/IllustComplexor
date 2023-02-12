<template>
  <div class="viewer-main">
    <div class="scrollbar-container">
      <el-scrollbar style="height: 100%; border-radius: 5px">
        <el-row
          v-infinite-scroll="
            () => {
              emit('loadMore');
            }
          "
          infinite-scroll-delay="100"
        >
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
    </div>
    <div class="viewer-info">共{{ totalCnt }}张插画</div>
  </div>
</template>
<script setup>
import { Picture } from "@element-plus/icons-vue";
import { UrlGenerator } from "@/js/util/path";
import { ipcRenderer } from "electron";
// eslint-disable-next-line no-undef
defineProps({
  list: Array,
  totalCnt: String,
});
// eslint-disable-next-line no-undef
const emit = defineEmits(["showInfo", "remove", "loadMore"]);
const handleRightClick = (event, obj) => {
  event.preventDefault();
  ipcRenderer.removeAllListeners("context:click");
  ipcRenderer.once("context:click", (event, item) => {
    switch (item) {
      case "详情":
        emit("showInfo", obj);
        break;
      case "移除":
        emit("remove", obj);
        break;
      default:
        break;
    }
  });
  ipcRenderer.send("context:popup", [{ label: "详情" }, { label: "移除" }]);
};
</script>
<style lang="scss" scoped>
.viewer-main {
  height: 100%;
  @include Flex-C;
  .scrollbar-container {
    flex: auto;
    overflow: hidden;
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
  }
  .viewer-info {
    height: 50px;
    @include Flex-R-AC;
    color: $color-greengray-2;
    margin-left: 10px;
    flex: none;
  }
}
</style>
