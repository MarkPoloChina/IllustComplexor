<template>
  <div>
    <el-dialog v-model="dialogVisible" title="元数据表单" width="60%">
      <el-form :model="baseInfo" label-width="100px" style="width: 100%">
        <el-form-item label="对于全部" v-if="type == 'viewer'">
          <el-switch v-model="updateAll" />
        </el-form-item>
        <el-form-item label="自动注入" v-if="type == 'pixiv'">
          <el-checkbox
            v-model="autoKeys['meta.title']"
            label="标题"
            :disabled="disableChangeAuto"
          />
        </el-form-item>
        <el-form-item label="入库时间">
          <el-date-picker
            v-model="baseInfo.date"
            value-format="YYYY-MM-DD"
            type="date"
            placeholder="Pick a day"
          />
        </el-form-item>
        <el-form-item label="评级">
          <el-rate v-model="baseInfo.star" />
        </el-form-item>
        <el-form-item label="分级" v-if="type != 'other'">
          <el-select v-model="baseInfo.meta.limit" placeholder="Select">
            <el-option
              v-for="item in limitOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleConfirm"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { reactive, computed, ref } from "vue";

const baseInfo = reactive({
  date: null,
  star: 0,
  meta: {
    limit: null,
  },
});
const autoKeys = reactive({
  "meta.title": false,
});
const updateAll = ref(false);
const limitOptions = [
  {
    value: "R-18",
    label: "R-18",
  },
  {
    value: "R-15",
    label: "R-15",
  },
  {
    value: "normal",
    label: "normal",
  },
];
// eslint-disable-next-line no-undef
const props = defineProps({
  modelValue: Boolean,
  disableChangeAuto: Boolean,
  type: String,
});
// eslint-disable-next-line no-undef
const emit = defineEmits(["update:modelValue", "confirm"]);
const dialogVisible = computed({
  get: () => {
    return props.modelValue;
  },
  set: (value) => {
    emit("update:modelValue", value);
  },
});
const initForm = () => {
  baseInfo.date = null;
  baseInfo.star = 0;
  baseInfo.meta.limit = null;
  updateAll.value = false;
  autoKeys["meta.title"] = false;
};
const handleConfirm = () => {
  dialogVisible.value = false;
  let controller = null;
  let data = null;
  if (props.type == "pixiv") {
    controller = [];
    Object.keys(autoKeys).forEach((key) => {
      if (autoKeys[key]) controller.push(key);
    });
    data = { ...baseInfo, star: baseInfo.star || null };
  } else if (props.type == "other") {
    data = { ...baseInfo, star: baseInfo.star || null, meta: null };
  } else if (props.type == "viewer") {
    data = { ...baseInfo, star: baseInfo.star || null };
    controller = updateAll.value;
  }
  emit("confirm", {
    data: data,
    controller: controller,
  });
};
// eslint-disable-next-line no-undef
defineExpose({ initForm });
</script>
<style lang="scss" scoped></style>
