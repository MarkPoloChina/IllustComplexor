<template>
  <el-scrollbar class="info-container">
    <el-descriptions
      v-if="info"
      class="info"
      style="margin-bottom: 10px"
      title="基准"
      :column="1"
      border
    >
      <template #extra>
        <el-button type="primary" size="small">操作</el-button>
      </template>
      <el-descriptions-item label="Id">{{ info.id }}</el-descriptions-item>
      <el-descriptions-item label="类型">{{ info.type }}</el-descriptions-item>
      <el-descriptions-item label="入库时间">
        {{ info.date }}</el-descriptions-item
      >
      <el-descriptions-item label="标签"></el-descriptions-item>
    </el-descriptions>
    <el-descriptions
      v-if="info && info.meta"
      class="info"
      style="margin-bottom: 10px"
      title="元数据"
      :column="1"
      border
    >
      <template #extra>
        <el-button type="primary" size="small">在Pixiv打开</el-button>
      </template>
      <el-descriptions-item label="PId">{{
        info.meta.pid
      }}</el-descriptions-item>
      <el-descriptions-item label="页号">{{
        info.meta.page
      }}</el-descriptions-item>
      <el-descriptions-item label="限制级">{{
        info.meta.limit ?? "-"
      }}</el-descriptions-item>
      <el-descriptions-item label="作者">{{
        info.meta.author ?? "-"
      }}</el-descriptions-item>
      <el-descriptions-item label="收藏数">{{
        info.meta.bookCnt ?? "-"
      }}</el-descriptions-item>
      <el-descriptions-item label="标题">
        {{ info.meta.title ?? "-" }}</el-descriptions-item
      >
      <el-descriptions-item label="标签"></el-descriptions-item>
    </el-descriptions>
    <el-descriptions
      v-if="info && info.poly"
      class="info"
      title="聚合数据"
      :column="1"
      border
    >
      <template #extra> </template>
      <el-descriptions-item label="聚合类型">{{
        info.poly.type ?? "-"
      }}</el-descriptions-item>
      <el-descriptions-item label="聚合簇">{{
        info.poly.parent ?? "-"
      }}</el-descriptions-item>
      <el-descriptions-item label="聚合名">{{
        info.poly.name ?? "-"
      }}</el-descriptions-item>
    </el-descriptions>
  </el-scrollbar>
</template>
<script setup>
// eslint-disable-next-line no-undef
defineProps({
  info: Object,
});
</script>
<style lang="scss" scoped>
.info-container {
  position: relative;
  max-height: 100%;
  .info {
    :deep(.el-descriptions__body table) {
      border-radius: 5px;
    }
  }
}
</style>
