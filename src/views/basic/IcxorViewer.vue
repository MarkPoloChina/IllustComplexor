<template>
  <div class="viewer-container">
    <div class="title">视图</div>
    <div class="main">
      <div class="col selector-col">
        <ViewerFilter></ViewerFilter>
      </div>
      <div class="col main-and-func-col">
        <div class="main-row">
          <ViewerMain :list="illustList" ref="viewerMain"></ViewerMain>
        </div>
        <div class="func-row">
          <ViewerFunctions @page-change="getIllusts"></ViewerFunctions>
        </div>
      </div>
      <div class="col info-col">
        <ViewerInfo></ViewerInfo>
      </div>
    </div>
  </div>
</template>
<script setup>
import { API } from "@/api/api";
import ViewerMain from "@/components/icxorViewer/main/viewerMain.vue";
import ViewerFilter from "@/components/icxorViewer/viewerFilter.vue";
import ViewerFunctions from "@/components/icxorViewer/viewerFunctions.vue";
import ViewerInfo from "@/components/icxorViewer/viewerInfo.vue";
import { onMounted, ref } from "vue";
const illustList = ref([]);
const viewerMain = ref(null);
onMounted(() => {
  getIllusts();
});
const getIllusts = async (page=1) => {
  let list = await API.getIllusts(
    { "illust.type": ["pixiv"] },
    100,
    (page-1)*100,
    "meta.pid",
    true
  );
  if (list) {
    illustList.value = list;
  }
  return list;
};
</script>
<style lang="scss" scoped>
.viewer-container {
  @include Uni-Main-Container;
  .title {
    @include Uni-Main-Title;
  }
  .main {
    padding: 0;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: row;
    .col {
      position: relative;
      padding: 10px 10px 10px 10px;
      margin: 0 5px 0 5px;
      border-radius: 8px;
      background-color: rgba(128, 128, 128, 0.15);
      height: calc(100% - 20px);
      &.selector-col {
        margin-left: 0;
        flex-grow: 0;
        flex-shrink: 0;
      }
      &.main-and-func-col {
        flex-grow: 2;
        flex-shrink: 2;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: stretch;
        flex-basis: 400px;
        overflow: auto;
        .main-row {
          max-height: calc(100% - 100px);
          overflow-x: scroll;
          flex-grow: 1;
        }
        .func-row {
          align-self: center;
          flex-shrink: 0;
        }
      }
      &.info-col {
        margin-right: 0;
        padding-right: 0px;
        flex-grow: 1;
        flex-shrink: 1;
        max-width: 240px;
        flex-basis: 150px;
      }
    }
  }
}
</style>
