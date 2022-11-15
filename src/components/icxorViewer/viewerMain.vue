<template>
  <div style="height: 100%">
    <component
      :is="
        viewerType == 'table'
          ? ViewerTable
          : viewerType == 'grid'
          ? ViewerGrid
          : ViewerFocus
      "
      :tableData="list"
      ref="viewer"
      @select-change="handleSelectedChanged"
    />
  </div>
</template>
<script setup>
import { ref } from "vue";
import ViewerTable from "./main/viewerTable.vue";
import ViewerGrid from "./main/viewerGrid.vue";
import ViewerFocus from "./main/viewerFocus.vue";
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
const handleFocusIndexChange = (action) => {
  viewer.value.handleIndexChange(action);
};
// eslint-disable-next-line no-undef
defineExpose({ handleResetScroll, handleSetType, handleFocusIndexChange });
</script>
<style lang="scss" scoped></style>
