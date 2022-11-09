<template>
  <div class="viewer-container">
    <div class="title">视图</div>
    <div class="main">
      <div class="col selector-col">
        <ViewerFilter @filter-change="handleFilterChange"></ViewerFilter>
      </div>
      <div class="col main-and-func-col">
        <div class="main-row">
          <ViewerMain
            :list="illustList"
            ref="viewerMain"
            @select-change="currentSelected.value = $event"
          ></ViewerMain>
        </div>
        <div class="func-row">
          <ViewerFunctions
            :illust-count="illustCount"
            @page-change="
              viewerMain.handleResetScroll();
              getIllusts($event);
            "
            @viewer-type-change="viewerMain && viewerMain.handleSetType($event)"
          ></ViewerFunctions>
        </div>
      </div>
      <div class="col info-col">
        <ViewerInfo :info="currentSelected.value"></ViewerInfo>
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
import { onMounted, ref, reactive } from "vue";
const illustList = ref([]);
const illustCount = ref(1000);
const currentSelected = reactive({ value: null });
const viewerMain = ref(null);
onMounted(() => {
  getIllusts();
  getIllustsCount();
});
const getIllusts = async (page = 1, condition = {}) => {
  let list = await API.getIllusts(
    condition,
    100,
    (page - 1) * 100,
    "meta.pid",
    true
  );
  if (list) {
    illustList.value = list;
  }
  return list;
};
const getIllustsCount = async (condition = {}) => {
  let { count } = await API.getIllustsCount(condition);
  illustCount.value = parseInt(count);
  return count;
};
const handleFilterChange = (filter) => {
  getIllusts(1, filter);
  getIllustsCount(filter);
};
</script>
<style lang="scss" scoped>
.viewer-container {
  @include Uni-Main-Container;
  overflow: auto;
  .title {
    @include Uni-Main-Title;
  }
  .main {
    padding: 0;
    flex-basis: calc(100% - 52px);
    position: relative;
    display: flex;
    flex-direction: row;
    overflow: auto;
    .col {
      position: relative;
      padding: 10px 10px 10px 10px;
      margin: 0 3px 0 3px;
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
          flex-grow: 1;
        }
        .func-row {
          align-self: center;
          flex-shrink: 0;
          width: 100%;
        }
      }
      &.info-col {
        margin-right: 0;
        flex-grow: 1;
        flex-shrink: 1;
        max-width: 240px;
        flex-basis: 150px;
      }
    }
  }
}
</style>
