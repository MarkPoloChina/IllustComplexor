<template>
  <el-tabs tab-position="left" class="viewer-imgs" v-if="timeline.length != 0">
    <el-tab-pane
      :label="item.time"
      v-for="(item, index) in timeline"
      :key="index"
      lazy
    >
      <div class="viewer-main">
        <el-scrollbar style="border-radius: 5px">
          <div
            v-for="(item, index) in item.list"
            :key="index"
            class="viewer-img-container"
          >
            <el-image
              class="viewer-img"
              :src="item.url"
              :preview-src-list="[item.url]"
              fit="cover"
              lazy
            />
            <div class="viewer-img-info">
              <el-button
                text
                bg
                :icon="MoreFilled"
                circle
                @click="getInfo(item.url)"
              />
            </div>
            <div class="viewer-img-star">
              <el-rate
                v-model="item.star"
                @change="handleStar(item.url, $event)"
              />
            </div>
          </div>
        </el-scrollbar>
        <div class="viewer-info">共{{ item.list.length }}张插画</div>
      </div>
    </el-tab-pane>
  </el-tabs>
  <el-empty description="无插图" v-else />
  <info-viewer v-model="dialogVisible" :info="currentInfo.value"></info-viewer>
</template>
<script setup>
import InfoViewer from "./InfoViewer.vue";
import { MoreFilled } from "@element-plus/icons-vue";
import { FilesEnum } from "@/js/viewer/FilesEnum";
import { Updater } from "@/js/viewer/Updater";
import { onMounted, reactive, ref } from "vue";

const timeline = reactive([]);
const dialogVisible = ref(false);
const currentInfo = reactive({ value: null });
onMounted(() => {
  let list = FilesEnum.getTimelineEnum();
  list
    .sort((a, b) => {
      return b.time - a.time;
    })
    .forEach((item) => {
      timeline.push({ ...item });
    });
});
const getInfo = (url) => {
  currentInfo.value = FilesEnum.getMetaByUrl(url);
  if (currentInfo.value) dialogVisible.value = true;
};
const handleStar = (url, val) => {
  Updater.saveStar(url, val);
};
</script>
<style lang="scss" scoped>
.viewer-imgs {
  height: 100%;

  .viewer-main {
    height: 100%;
    @include Flex-C-CT;
    .viewer-img-container {
      display: inline-block;
      position: relative;
      padding: 10px;
      .viewer-img {
        border-radius: 5px;
        height: calc((100vw - 300px) / 4);
        width: calc((100vw - 300px) / 4);
      }
      .viewer-img-star {
        @include Flex-RCT;
        position: absolute;
        bottom: 13px;
        height: 32px;
        width: calc(100% - 20px);
        background-color: rgba(255, 255, 255, 0.8);
        // backdrop-filter: blur(10px);
        border-radius: 5px;
      }
      .viewer-img-info {
        position: absolute;
        top: 15px;
        right: 15px;
        // backdrop-filter: blur(10px);
      }
    }
    .viewer-info {
      height: 50px;
      @include Flex-R-CT;
      color: $color-greengray-2;
      margin-left: 10px;
    }
  }
}
</style>
