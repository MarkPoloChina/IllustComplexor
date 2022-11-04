<template>
  <div class="viewer-main">
    <el-scrollbar style="border-radius: 5px">
      <div
        v-for="(obj, index) in list"
        :key="index"
        class="viewer-img-container"
      >
        <el-image
          class="viewer-img"
          :src="API.getPixivBlobSquareUrl(obj.meta.pid, obj.meta.page)"
          :preview-src-list="[
            API.getPixivBlobOriginUrl(obj.meta.pid, obj.meta.page),
          ]"
          fit="cover"
          @click="openLoading()"
          @contextmenu.prevent="handleRightClick($event, obj)"
          lazy
        />
        <!-- <div class="viewer-img-info">
              <el-button
                text
                bg
                :icon="MoreFilled"
                circle
                @click="getInfo(obj)"
              />
            </div> -->
        <!-- <div class="viewer-img-star">
              <el-rate
                v-model="obj.star"
                @change="handleStar(obj.url, $event)"
              />
            </div> -->
      </div>
    </el-scrollbar>
    <!-- <div class="viewer-bat">
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
        </div> -->
    <div class="viewer-info">共{{ list.length }}张插画</div>
  </div>
</template>
<script setup>
import { nextTick, reactive } from "vue";
import { API } from "@/api/api";
import { ElLoading } from "element-plus";
const remote = require("@electron/remote");
const { Menu, MenuItem } = remote;
// eslint-disable-next-line no-undef
defineProps({
  list: Array,
});
// eslint-disable-next-line no-undef
const emit = defineEmits(["showInfo"]);
const loadObj = reactive({ value: null });
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
const handleRightClick = (event, obj) => {
  event.preventDefault();
  const menu = new Menu();
  menu.append(
    new MenuItem({
      label: "🔎详情",
      click: () => {
        emit("showInfo", obj);
      },
    })
  );
  menu.append(new MenuItem({ type: "separator" })); //分割线
  menu.append(
    new MenuItem({ label: "testCheckBox", type: "checkbox", checked: true })
  );
  menu.popup({ window: remote.getCurrentWindow() });
};
</script>
<style lang="scss" scoped>
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
</style>
