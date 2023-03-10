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
      <GridViewer @showInfo="getInfo" :list="item.list"></GridViewer>
    </el-tab-pane>
  </el-tabs>
  <el-empty description="无插图" v-else />
  <info-viewer v-model="dialogVisible" :info="currentInfo.value"></info-viewer>
</template>
<script setup>
import InfoViewer from "./reusable/InfoViewer.vue";
import { onMounted, reactive, ref, watch } from "vue";
import { API } from "@/api/api";
import { UtilDate } from "@/js/util/date";
import GridViewer from "./reusable/gridViewer.vue";

const timeline = reactive([]);
const dialogVisible = ref(false);
const currentInfo = reactive({ value: null });
const curTab = ref("0");
// const loadedSet = reactive({ value: new Set() });
onMounted(() => {
  getEnum();
});
watch(curTab, async () => {
  if (timeline[curTab.value].list.length == 0) {
    timeline[curTab.value].list = await getIllusts(timeline[curTab.value].time);
  }
});
const getEnum = async () => {
  const data = await API.getEnumTimeline();
  data.forEach((ele) => {
    timeline.push({
      time: UtilDate.getDateCST(new Date(ele.date), ""),
      list: [],
    });
  });
  if (timeline[0]) timeline[0].list = await getIllusts(timeline[0].time);
};
const getIllusts = async (timeline) => {
  let list = await API.getIllusts({ date: [timeline] }, -1, null, null);
  return list;
};
const getInfo = (obj) => {
  currentInfo.value = obj;
  if (currentInfo.value) dialogVisible.value = true;
};
</script>
<style lang="scss" scoped>
.viewer-imgs {
  height: 100%;
  > :deep(.el-tabs__content) {
    height: 100%;
  }
}
</style>
