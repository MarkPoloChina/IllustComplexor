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
            v-for="(url, index) in item.listShow"
            :key="index"
            class="viewer-img-container"
          >
            <el-image
              class="viewer-img"
              :src="url"
              :preview-src-list="[url]"
              fit="cover"
              lazy
            />
            <div class="viewer-img-info">
              <el-button
                type="info"
                :icon="Document"
                circle
                style="margin-right: 10px"
              />
            </div>
          </div>
        </el-scrollbar>
        <div class="viewer-img-page">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="item.list.length"
            :page-size="200"
            small
            @current-change="
              item.listShow = item.list.slice(($event - 1) * 200, $event * 200)
            "
          />
        </div>
        <div class="viewer-info">共{{ item.list.length }}张插画</div>
      </div>
    </el-tab-pane>
  </el-tabs>
  <el-empty description="无插图" v-else />
</template>
<script setup>
import { Document } from "@element-plus/icons-vue";
import { FilesEnum } from "@/js/viewer/FilesEnum";
import { onMounted, reactive } from "vue";

const timeline = reactive([]);
onMounted(() => {
  FilesEnum.getTimelineEnum().forEach((item) => {
    timeline.push({ ...item, listShow: item.list.slice(0, 200) });
  });
});
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
      .viewer-img-info {
        @include Flex-R-CTR;
        position: absolute;
        bottom: 13px;
        height: 20%;
        width: calc(100% - 20px);
        background-color: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(10px);
        border-radius: 5px;
      }
    }
    .viewer-info {
      height: 50px;
      @include Flex-R-CT;
      color: $color-greengray-2;
      margin-left: 10px;
    }
    .viewer-img-page {
      width: 100%;
      @include Flex-CT;
      margin: 10px 0 0 0;
    }
  }
}
</style>
