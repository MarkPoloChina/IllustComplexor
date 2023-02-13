<template>
  <transition name="el-zoom-in-center">
    <el-scrollbar class="info-container" v-if="writableInfo">
      <el-descriptions
        v-if="writableInfo"
        class="info"
        style="margin-bottom: 10px"
        title="基准"
        :column="1"
        border
        direction="vertical"
      >
        <template #extra>
          <el-switch v-model="editable" :active-icon="Edit" />
          <el-button
            :icon="ArrowRightBold"
            circle
            @click="writableInfo = null"
            type="danger"
            size="small"
            style="margin-left: 10px"
          />
        </template>
        <el-descriptions-item label="ID">{{
          writableInfo.id
        }}</el-descriptions-item>
        <el-descriptions-item label="类型">{{
          writableInfo.remote_base.name
        }}</el-descriptions-item>
        <el-descriptions-item label="评分"
          ><el-rate
            v-model="writableInfo.star"
            :disabled="!editable"
            @change="emit('update:info', writableInfo)"
            clearable
        /></el-descriptions-item>
        <el-descriptions-item label="入库时间">
          <el-date-picker
            style="width: 180px"
            v-model="writableInfo.date"
            value-format="YYYY-MM-DD"
            type="date"
            placeholder="Pick a day"
            :disabled="!editable"
        /></el-descriptions-item>
        <el-descriptions-item label="标签">
          <el-tag v-for="tag in writableInfo.tag" :key="tag.id">{{
            tag.name
          }}</el-tag>
          {{ !writableInfo.tag || writableInfo.tag.length == 0 ? "-" : "" }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions
        v-if="writableInfo && writableInfo.meta"
        class="info"
        style="margin-bottom: 10px"
        title="元数据"
        :column="1"
        border
        direction="vertical"
      >
        <template #extra>
          <el-button type="primary" size="small">在Pixiv打开</el-button>
        </template>
        <el-descriptions-item label="PId">{{
          writableInfo.meta.pid
        }}</el-descriptions-item>
        <el-descriptions-item label="页号">{{
          writableInfo.meta.page
        }}</el-descriptions-item>
        <el-descriptions-item label="限制级">{{
          writableInfo.meta.limit ?? "-"
        }}</el-descriptions-item>
        <el-descriptions-item label="作者">{{
          writableInfo.meta.author ?? "-"
        }}</el-descriptions-item>
        <el-descriptions-item label="收藏数">{{
          writableInfo.meta.book_cnt ?? "-"
        }}</el-descriptions-item>
        <el-descriptions-item label="标题">
          {{ writableInfo.meta.title ?? "-" }}</el-descriptions-item
        >
      </el-descriptions>
      <el-descriptions
        v-if="
          writableInfo && writableInfo.poly && writableInfo.poly.length != 0
        "
        class="info"
        title="聚合数据"
        :column="1"
        border
        direction="vertical"
      >
        <template #extra> </template>
        <template v-for="poly in writableInfo.poly" :key="poly.id">
          <el-descriptions-item label="聚合类型">{{
            poly.type ?? "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="聚合簇">{{
            poly.parent ?? "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="聚合名">{{
            poly.name ?? "-"
          }}</el-descriptions-item>
        </template>
      </el-descriptions>
      <!-- <el-empty description="尚未选定" v-if="!info" /> -->
    </el-scrollbar>
  </transition>
</template>
<script setup>
import { Edit, ArrowRightBold } from "@element-plus/icons-vue";
import { computed, ref } from "vue";

// eslint-disable-next-line no-undef
const props = defineProps({
  info: Object,
});
// eslint-disable-next-line no-undef
const emit = defineEmits(["update:info", "upload"]);
const writableInfo = computed({
  get: () => {
    return props.info;
  },
  set: (value) => {
    emit("update:info", value);
    if (value) {
      emit("upload", value);
    }
  },
});
const editable = ref(false);
</script>
<style lang="scss" scoped>
.info-container {
  position: relative;
  max-height: calc(100% - 20px);
  padding: 10px 10px 10px 10px;
  .info {
    :deep(.el-descriptions__body table) {
      border-radius: 5px;
    }
  }
}
</style>
