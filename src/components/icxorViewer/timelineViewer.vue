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
                v-model="obj.star"
                @change="handleStar(obj.url, $event)"
              />
            </div>
          </div>
        </el-scrollbar>
        <div class="viewer-bat">
          将所有
          <el-select v-model="item.batFindAs" placeholder="原评级">
            <el-option
              v-for="item in [
                { value: 'empty', label: '未指定' },
                { value: '1', label: '1星' },
                { value: '2', label: '2星' },
                { value: '3', label: '3星' },
                { value: '4', label: '4星' },
                { value: '5', label: '5星' },
                { value: 'all', label: '全部' },
              ]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          修改为
          <el-select v-model="item.batTo" placeholder="修改后评级">
            <el-option
              v-for="item in [
                { value: 'empty', label: '未指定' },
                { value: '1', label: '1星' },
                { value: '2', label: '2星' },
                { value: '3', label: '3星' },
                { value: '4', label: '4星' },
                { value: '5', label: '5星' },
              ]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button @click="handleBat(item)">执行</el-button>
        </div>
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
const handleBat = (item) => {
  if (!item.batFindAs || !item.batTo) return;
  item.list.forEach((obj) => {
    if (
      (!obj.star && item.batFindAs == "empty") ||
      item.batFindAs == "all" ||
      Number.parseInt(item.batFindAs) == obj.star
    ) {
      obj.star = item.batTo == "empty" ? 0 : Number.parseInt(item.batTo);
      handleStar(obj.url,item.batTo == "empty" ? null : Number.parseInt(item.batTo))
    }
  });
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
    .viewer-bat {
      height: 50px;
      @include Flex-R-SB;
      color: $color-greengray-2;
      margin-left: 10px;
      font-size: 15px;
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
