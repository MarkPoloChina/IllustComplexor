<template>
  <div>
    <div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="1000"
        :page-size="100"
        :pager-count="5"
        small
        hide-on-single-page
        @current-change="handlePageChange"
      />
    </div>
    <div></div>
  </div>
</template>
<script setup>
// eslint-disable-next-line no-undef
const emit = defineEmits(["pageChange"]);
const handlePageChange = (val) => {
  emit("pageChange", val);
};
</script>
<style lang="scss" scoped></style>
