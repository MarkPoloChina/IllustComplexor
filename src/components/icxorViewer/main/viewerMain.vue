<template>
  <div style="height: 100%">
    <component
      :is="viewerType == 'table' ? ViewerTable : ViewerGrid"
      :tableData="list"
      ref="viewer"
      @select-change="handleSelectedChanged"
    />
  </div>
</template>
<script setup>
import { ref } from "vue";
import ViewerTable from "./viewerTable.vue";
import ViewerGrid from "./viewerGrid.vue";
const viewer = ref(null);
const viewerType = ref("table");
// eslint-disable-next-line no-undef
const emit = defineEmits(["select-change"]);
// eslint-disable-next-line no-undef
defineProps({
  list: Array,
});
const handleSelectedChanged = (val) => {
  emit("select-change", val);
};
const handleResetScroll = () => {
  viewer.value.resetScroll();
};
const handleSetType = (type) => {
  viewerType.value = type;
};
// eslint-disable-next-line no-undef
defineExpose({ handleResetScroll, handleSetType });
</script>
<style lang="scss" scoped></style>
