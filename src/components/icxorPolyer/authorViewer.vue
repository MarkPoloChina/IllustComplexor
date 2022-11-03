<template>
  <el-tabs tab-position="left" class="viewer-imgs" v-if="author.length != 0">
    <el-tab-pane
      :label="item.author"
      v-for="(item, index) in author"
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
              :src="PathComparator.getMPSIC(obj.url)"
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
        <div class="viewer-bar">
          <div class="viewer-info">共{{ item.list.length }}张插画</div>
          <!-- <div class="viewer-sorter">
            <el-select
              v-model="item.sortType"
              placeholder="排序"
              @change="handleSortChange(item, $event)"
            >
              <template #prefix>
                <el-icon><Sort /></el-icon>
              </template>
              <el-option
                v-for="item in [
                  { value: 'default', label: '默认-升序' },
                  { value: 'defaultDown', label: '默认-降序' },
                  { value: 'bookCnt', label: '收藏数量-升序' },
                  { value: 'bookCntDown', label: '收藏数量-降序' },
                ]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div> -->
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
  <el-empty description="无插图" v-else />
  <info-viewer v-model="dialogVisible" :info="currentInfo.value"></info-viewer>
</template>
<script setup>
import InfoViewer from "./reusable/InfoViewer.vue";
// import { Sort } from "@element-plus/icons-vue";
import { MoreFilled } from "@element-plus/icons-vue";
import { FilesEnum } from "@/js/viewer/FilesEnum";
import { PathComparator } from "@/js/viewer/PathComparator";
import { onMounted, reactive, ref } from "vue";
import { Updater } from "@/js/viewer/Updater";

const author = reactive([]);
const dialogVisible = ref(false);
const currentInfo = reactive({ value: null });
onMounted(() => {
  FilesEnum.getAuthorEnum().forEach((item) => {
    author.push({
      ...item,
      sortType: "default",
    });
  });
});
// const handleSortChange = (item, value) => {
//   if (value.startsWith("bookCnt"))
//     item.list.sort((a, b) => {
//       return value.indexOf("Down") == -1
//         ? a.bookCnt - b.bookCnt
//         : b.bookCnt - a.bookCnt;
//     });
//   else if (value.startsWith("default"))
//     item.list.sort((a, b) => {
//       return value.indexOf("Down") == -1 ? a.pid - b.pid : b.pid - a.pid;
//     });
// };
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
    .viewer-bar {
      height: 60px;
      width: 100%;
      @include Flex-R-SB;
      .viewer-info {
        color: $color-greengray-2;
        margin-left: 10px;
      }
      .viewer-sorter {
        margin-right: 10px;
      }
    }
  }
}
</style>
