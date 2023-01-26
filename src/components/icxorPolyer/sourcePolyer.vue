<template>
  <el-tabs
    tab-position="left"
    class="viewer-imgs"
    v-if="source.length != 0"
    v-model="curTab"
  >
    <el-tab-pane
      :label="item.type"
      v-for="(item, index) in source"
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
import GridViewer from "./reusable/gridViewer.vue";

const source = reactive([]);
const dialogVisible = ref(false);
const currentInfo = reactive({ value: null });
const curTab = ref("0");
// const loadedSet = reactive({ value: new Set() });
onMounted(() => {
  getEnum();
});
watch(curTab, async () => {
  if (source[curTab.value].list.length == 0) {
    source[curTab.value].list = await getIllusts(source[curTab.value].type);
  }
});
const getEnum = async () => {
  const data = await API.getEnumSource();
  data.forEach((ele) => {
    source.push({
      type: ele.type,
      list: [],
    });
  });
  if (source[0]) source[0].list = await getIllusts(source[0].type);
};
const getIllusts = async (type) => {
  let list = await API.getIllusts(
    { 'illust.type': [type] },
    100,
    null,
    "meta.pid",
    true
  );
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
