<template>
  <el-tabs tab-position="left" class="viewer-imgs">
    <el-tab-pane
      :label="`Picolt-1-${item.name}`"
      v-for="(item, index) in picolt_1"
      :key="index"
      lazy
    >
      <div class="viewer-main">
        <el-scrollbar style="border-radius: 5px">
          <div
            v-for="(url, index) in item.list.slice(0, 9)"
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
        <div class="viewer-info">共{{ item.list.length }}张插画</div>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup>
import { Document } from "@element-plus/icons-vue";
import { FilesEnum } from "@/js/viewer/FilesEnum";
import { onMounted, reactive } from "vue";

const picolt_1 = reactive([]);
onMounted(() => {
  FilesEnum.getPicoltEnum("picolt-1").forEach((item) => {
    picolt_1.push(item);
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
    }
  }
}
</style>
