<template>
  <el-tabs
    tab-position="left"
    class="viewer-imgs"
    v-if="timeline.length != 0"
    v-model="curTab"
  >
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
              :src="API.getPixivBlobSquareUrl(obj.meta.pid, obj.meta.page)"
              :preview-src-list="[API.getPixivBlobOriginUrl(obj.meta.pid, obj.meta.page)]"
              fit="cover"
              @click="openLoading()"
              lazy
            />
            <!-- <div class="viewer-img-info">
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
            </div> -->
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
import { nextTick, onMounted, reactive, ref, watch } from "vue";
import { API } from "@/api/api";
import { UtilDate } from "@/js/util/date";
import { ElLoading } from "element-plus";

const timeline = reactive([]);
const dialogVisible = ref(false);
const currentInfo = reactive({ value: null });
const loadObj = reactive({ value: null });
const curTab = ref("0");
// const loadedSet = reactive({ value: new Set() });
onMounted(() => {
  API.getEnumTimeline().then(async (data) => {
    data.forEach((ele) => {
      timeline.push({
        time: UtilDate.getDateCST(new Date(ele.date), ""),
        list: [],
      });
    });
    if (timeline[0]) timeline[0].list = await getIllusts(timeline[0].time);
  });
});
watch(curTab, async () => {
  if (timeline[curTab.value].list.length == 0) {
    timeline[curTab.value].list = await getIllusts(timeline[curTab.value].time);
  }
});
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
const getIllusts = async (timeline) => {
  let list = await API.getIllusts(
    { date: [timeline] },
    null,
    null,
    "meta.pid",
    true
  );
  return list;
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
        height: calc((100vw - 320px) / 4);
        width: calc((100vw - 320px) / 4);
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
