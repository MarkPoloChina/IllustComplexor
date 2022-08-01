<template>
  <el-tabs tab-position="left" class="viewer-imgs" v-if="picolt.length != 0">
    <el-tab-pane
      :label="`${item.name == '1' || item.name == '2' ? '1' : '2'}-${
        item.name
      }`"
      v-for="(item, index) in picolt"
      :key="index"
      lazy
    >
      <div class="viewer-main">
        <el-scrollbar style="border-radius: 5px">
          <div
            v-for="(obj, index) in item.list"
            :key="index"
            class="viewer-img-container"
          >
            <el-image
              class="viewer-img"
              :src="obj.url"
              :preview-src-list="[obj.url]"
              fit="cover"
              lazy
            />
            <div class="viewer-img-info">
              <el-button
                text
                bg
                :icon="MoreFilled"
                circle
                @click="getInfo(obj.url)"
              />
            </div>
            <div class="viewer-img-star">
              <el-rate
                v-model="item.star"
                @change="handleStar(obj.url, $event)"
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
import { FilesEnum } from "@/js/viewer/FilesEnum";
import { onMounted, reactive, ref } from "vue";
import InfoViewer from "./InfoViewer.vue";
import { MoreFilled } from "@element-plus/icons-vue";
import { Updater } from "@/js/viewer/Updater";

const picolt = reactive([]);
const dialogVisible = ref(false);
const currentInfo = reactive({ value: null });
onMounted(() => {
  FilesEnum.getPicoltEnum("picolt-1")
    .sort((a, b) => {
      return a.name - b.name;
    })
    .forEach((item) => {
      picolt.push({ ...item });
    });
  FilesEnum.getPicoltEnum("picolt-2")
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    })
    .forEach((item) => {
      picolt.push({ ...item });
    });
});
const getInfo = (url) => {
  currentInfo.value = FilesEnum.getMetaByCopyUrl(url);
  if (currentInfo.value) dialogVisible.value = true;
};
const handleStar = (url, val) => {
  Updater.saveStar(url, val);
};
</script>
<style lang="scss" scoped>
.viewer-imgs {
  height: 100%;

  :deep(.el-tabs__header.is-left) {
    max-width: 100px;
    text-overflow: ellipsis;
  }
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
    }
  }
}
</style>
