<template>
  <div class="viewer-container">
    <div class="title">视图</div>
    <div class="main">
      <div class="col selector-col">
        <ViewerFilter @update:filter="filter = $event"></ViewerFilter>
      </div>
      <div class="col main-and-func-col">
        <div class="main-row">
          <ViewerMain
            :filter="filter"
            :viewerType="viewerType"
            v-model:curPage="curPage"
            @update:currentSelected="currentSelected = $event"
            @update:illustCount="illustCount = $event"
            ref="viewerMain"
          ></ViewerMain>
        </div>
        <div class="func-row">
          <ViewerFunctions
            :illust-count="illustCount"
            v-model:curPage="curPage"
            @update:viewerType="viewerType = $event"
            @focus-up="viewerMain.handleFocusIndexChange('up')"
            @focus-down="viewerMain.handleFocusIndexChange('down')"
          ></ViewerFunctions>
        </div>
      </div>
      <div class="col info-col">
        <ViewerInfo
          v-model:info="currentSelected"
          @upload="viewerMain.handleSingleIllustChange($event)"
        ></ViewerInfo>
      </div>
    </div>
  </div>
</template>
<script setup>
import ViewerMain from "@/components/icxorViewer/viewerMain.vue";
import ViewerFilter from "@/components/icxorViewer/viewerFilter.vue";
import ViewerFunctions from "@/components/icxorViewer/viewerFunctions.vue";
import ViewerInfo from "@/components/icxorViewer/viewerInfo.vue";
import { ref } from "vue";

const viewerMain = ref();
const viewerType = ref("table");
const filter = ref({});
const currentSelected = ref(null);
const illustCount = ref(0);
const curPage = ref(1);
</script>
<style lang="scss" scoped>
.viewer-container {
  @include Uni-Main-Container;
  overflow: auto;
  .title {
    @include Uni-Main-Title;
    flex: none;
  }
  .main {
    padding: 0;
    flex: auto;
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
        flex: none;
      }
      &.main-and-func-col {
        flex: auto;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: stretch;
        overflow: hidden;
        .main-row {
          flex: auto;
          overflow: hidden;
        }
        .func-row {
          align-self: center;
          flex: none;
          width: 100%;
        }
      }
      &.info-col {
        max-width: min-content;
        margin-right: 0;
        flex: none;
        padding: 0;
        height: 100%;
      }
    }
  }
}
</style>
