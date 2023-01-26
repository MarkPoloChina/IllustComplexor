<template>
  <el-tabs tab-position="left" class="viewer-imgs" v-if="picolt.length != 0">
    <el-tab-pane
      :label="item.name.replace('picolt-', '')"
      v-for="(item, index) in picolt"
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
import { onMounted, reactive, ref } from "vue";
import InfoViewer from "./reusable/InfoViewer.vue";
import { API } from "@/api/api";
import GridViewer from "./reusable/gridViewer.vue";

const picolt = reactive([]);
const dialogVisible = ref(false);
const currentInfo = reactive({ value: null });
onMounted(() => {
  getData();
});
const getData = async () => {
  const data = await API.getPolyWithIllust("picolt");
  data.forEach((item) => {
    picolt.push({
      name: `${item.parent}-${item.name}`,
      list: item.illusts,
    });
  });
};
const getInfo = (obj) => {
  currentInfo.value = obj;
  if (currentInfo.value) dialogVisible.value = true;
};
</script>
<style lang="scss" scoped>
.viewer-imgs {
  height: 100%;

  // > :deep(.el-tabs__header.is-left) {
  //   max-width: 100px;
  //   text-overflow: ellipsis;
  // }
  > :deep(.el-tabs__content) {
    height: 100%;
  }
}
</style>
