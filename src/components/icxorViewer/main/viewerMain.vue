<template>
  <div style="height: 100%">
    <ViewerTable :tableData="list" ref="viewerTable"></ViewerTable>
  </div>
</template>
<script setup>
import { ref } from "vue";
import ViewerTable from "./viewerTable.vue";
const viewerTable = ref(null)
// eslint-disable-next-line no-undef
defineProps({
  list: Array,
});
</script>
<style lang="scss" scoped></style>
