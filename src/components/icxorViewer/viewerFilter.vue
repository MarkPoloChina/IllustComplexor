<template>
  <div class="container">
    <div>
      <div class="item-bottom">
        <el-button
          :icon="show ? ArrowLeftBold : ArrowRightBold"
          circle
          @click="show ^= true"
        />
      </div>
      <transition name="el-zoom-in-center">
        <div class="filter" v-if="show">
          <div>
            <el-select
              v-model="values.value['remote_base.id']"
              placeholder="选择类型"
              multiple
            >
              <el-option
                v-for="item in options['remote_base.id']"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
          <div>
            <el-select
              v-model="values.value['poly.type']"
              placeholder="选择聚合类型"
              multiple
              @change="getPolyOptions"
            >
              <el-option
                v-for="item in options['poly.type']"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div v-if="values.value['poly.type'][0]">
            <el-cascader
              v-model="polyValue"
              :options="polyOptions"
              :props="{ multiple: true }"
              :show-all-levels="false"
              placeholder="选择聚合"
              @change="handlePolyChange"
            />
          </div>
          <div>
            <el-select
              v-model="values.value['illust.date']"
              placeholder="选择入库时间"
              multiple
            >
              <el-option
                v-for="item in options['illust.date']"
                :key="item.date"
                :label="item.date"
                :value="item.date"
              />
            </el-select>
          </div>
          <div>
            <el-select
              v-model="values.value['tag.name']"
              multiple
              filterable
              allow-create
              placeholder="填写筛选标签"
            />
          </div>
          <div>
            <el-select
              v-model="values.value['illust.star']"
              placeholder="选择评级"
              multiple
            >
              <el-option
                v-for="item in 6"
                :key="item - 1"
                :label="`${item - 1}星`"
                :value="item - 1"
              >
                <el-rate :model-value="item - 1" disabled />
              </el-option>
            </el-select>
          </div>
          <div>
            <el-select
              v-model="values.value['meta.pid']"
              multiple
              filterable
              allow-create
              placeholder="填写PID"
            />
          </div>
        </div>
      </transition>
    </div>
    <div>
      <div class="item-bottom">
        <el-button :icon="MessageBox" circle @click="emit('openPolyDialog')" />
      </div>
      <div class="item-bottom">
        <el-button :icon="EditPen" circle @click="emit('openUpdateDialog')" />
      </div>
      <div>
        <el-button
          :icon="Download"
          circle
          @click="emit('openDownloadDialog')"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { API } from "@/api/api";
import { UtilDate } from "@/js/util/date";
import {
  ArrowLeftBold,
  ArrowRightBold,
  Download,
  EditPen,
  MessageBox,
} from "@element-plus/icons-vue";

import { onMounted, reactive, ref, watch } from "vue";

const show = ref(false);
const values = reactive({
  value: {
    "remote_base.id": [],
    "illust.date": [],
    "illust.star": [],
    "poly.type": [],
    "poly.parent": [],
    "poly.name": [],
    "tag.name": [],
    "meta.pid": [],
  },
});
const options = {
  "remote_base.id": [],
  "illust.date": [],
  "poly.type": [
    {
      value: "picolt",
      label: "Picolt",
    },
    {
      value: "lnr",
      label: "LNR",
    },
    {
      value: "author",
      label: "作者专题",
    },
  ],
};
const polyOptions = ref([]);
const polyValue = ref();
watch(values, (val) => {
  emit("filter-change", val.value);
});
onMounted(() => {
  getTypeOptions();
  getDateOptions();
});
const getTypeOptions = async () => {
  const data = await API.getRemoteBase()
  options["remote_base.id"] = data;
};
const getDateOptions = async () => {
  const data = await API.getEnumTimeline();
  data.forEach((ele) => {
    options["illust.date"].push({
      date: UtilDate.getDateCST(new Date(ele.date), "-"),
    });
  });
};
const getPolyOptions = async (val) => {
  polyOptions.value.length = 0;
  values.value["poly.parent"] = [];
  values.value["poly.name"] = [];
  if (!val) return;
  for (const p of val) {
    const polies = await API.getPoly(p);
    polies.forEach((poly) => {
      let index = polyOptions.value.findIndex((val) => {
        return val.value == poly.parent;
      });
      if (index == -1) {
        polyOptions.value.push({
          value: poly.parent,
          label: poly.parent,
          children: [],
        });
        index = polyOptions.value.length - 1;
      }
      polyOptions.value[index].children.push({
        value: poly.name,
        label: poly.name,
      });
    });
  }
};
const handlePolyChange = (val) => {
  values.value["poly.parent"] = [];
  values.value["poly.name"] = [];
  val.forEach((item) => {
    if (!values.value["poly.parent"].find((val) => val == item[0]))
      values.value["poly.parent"].push(item[0]);
    if (item[1] && !values.value["poly.name"].find((val) => val == item[1]))
      values.value["poly.name"].push(item[1]);
  });
};
// eslint-disable-next-line no-undef
const emit = defineEmits([
  "filter-change",
  "openPolyDialog",
  "openUpdateDialog",
  "openDownloadDialog",
]);
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  @include Flex-C-JSB;
}
.item-bottom {
  margin-bottom: 10px;
}
.filter {
  > div {
    margin-bottom: 10px;
  }
}
</style>
