<template>
  <el-dialog
    :model-value="modelValue"
    title="详细信息"
    width="70%"
    :before-close="() => emit('update:modelValue', false)"
  >
    <el-descriptions :column="2" border>
      <template #extra>
        <!-- <el-button type="primary">Operation</el-button> -->
      </template>
      <el-descriptions-item>
        <template #label> 来源 </template>
        {{ info.source }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label> PID </template>
        {{ info.sid }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label> 标题 </template>
        {{ info.title }}
      </el-descriptions-item>
    </el-descriptions>
    <!-- <template #footer>
      <span class="dialog-footer">
        <el-button @click="emit('update:modelValue', false)">Cancel</el-button>
        <el-button type="primary" @click="emit('update:modelValue', false)"
          >Confirm</el-button
        >
      </span>
    </template> -->
  </el-dialog>
</template>
<script setup>
// eslint-disable-next-line no-undef
defineProps({
  modelValue: Boolean,
  info: Object,
});
// eslint-disable-next-line no-undef
const emit = defineEmits(["update:modelValue"]);
</script>
<style lang="scss" scoped></style>
