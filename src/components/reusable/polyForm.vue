<template>
  <div>
    <el-dialog v-model="dialogVisible" title="聚合表单" width="60%">
      <el-form :model="polyInfo" label-width="100px" style="width: 100%">
        <el-form-item label="聚合类型">
          <el-select
            v-model="polyInfo.type"
            placeholder="选择聚合类型"
            @change="getPolyParentEnum"
          >
            <el-option
              v-for="item in [
                {
                  value: 'picolt',
                  label: 'PICOLT',
                },
                {
                  value: 'lnr',
                  label: 'LNR',
                },
                {
                  value: 'author',
                  label: '作者专题',
                },
              ]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="聚合簇">
          <el-select
            style="width: 100%"
            v-model="polyInfo.parent"
            filterable
            allow-create
            placeholder="选择或填写聚合簇,可以留空"
          >
            <el-option
              v-for="item in polyParentEnum"
              :key="item.parent"
              :label="item.parent"
              :value="item.parent"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="聚合名">
          <el-input v-model="polyInfo.name" placeholder="输入聚合名" />
        </el-form-item>
        <!-- <el-form-item label="Waifu2x">
  <el-select
    v-model="importOption.copy.waifu2x"
    placeholder="选择Waifu2x"
  >
    <el-option
      v-for="item in [
        {
          value: 'null',
          label: '原始版本',
        },
        {
          value: 'ncnn',
          label: 'NCNN',
        },
        {
          value: 'real',
          label: 'RealGUN',
        },
      ]"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</el-form-item> -->
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
import { API } from "@/api/api";
import { reactive, computed, ref, onMounted } from "vue";

const polyInfo = reactive({
  type: "picolt",
  parent: "",
  name: "",
  waifu2x: "",
});
const polyParentEnum = ref([]);
// eslint-disable-next-line no-undef
const props = defineProps({
  modelValue: Boolean,
  type: String,
  chooseAll: Boolean,
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
onMounted(() => {
  getPolyParentEnum(polyInfo.type);
});
const getPolyParentEnum = (type) => {
  if (type) {
    API.getEnumPolyParent(type).then((data) => {
      polyParentEnum.value = data;
    });
  }
};
const initForm = () => {
  polyInfo.type = "picolt";
  polyInfo.parent = "";
  polyInfo.name = "";
  polyInfo.waifu2x = "";
  getPolyParentEnum(polyInfo.type);
};
const handleConfirm = () => {
  dialogVisible.value = false;
  let controller = null;
  let data = null;
  if (props.type == "pixiv") {
    data = { ...polyInfo };
  } else if (props.type == "viewer") {
    data = { ...polyInfo };
    controller = props.chooseAll;
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
