<template>
  <div style="height: 100%">
    <KeepAlive>
      <component
        :is="
          viewerType == 'table'
            ? ViewerTable
            : viewerType == 'grid'
            ? ViewerGrid
            : ViewerFocus
        "
        :tableData="illustList"
        ref="viewer"
        :loading="isLoading"
        @select-change="currentSelected = $event"
        @popup-context="handlePopupContext"
        @star-change="emit('update:star', $event)"
      />
    </KeepAlive>
    <MetaForm
      v-model="show.update"
      :choose-all="chooseAll.update"
      @confirm="handleUpdate"
      ref="metaForm"
      type="viewer"
    ></MetaForm>
    <PolyForm
      v-model="show.poly"
      @confirm="handlePoly"
      :choose-all="chooseAll.poly"
      ref="polyForm"
      type="viewer"
    ></PolyForm>
    <IllustTodayForm v-model="show.it" @confirm="handleIT"></IllustTodayForm>
    <DownloadForm
      v-model="show.download"
      :download-list="waitingDownloadDto"
      ref="downloadForm"
    ></DownloadForm>
  </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import ViewerTable from "./main/viewerTable.vue";
import ViewerGrid from "./main/viewerGrid.vue";
import ViewerFocus from "./main/viewerFocus.vue";
import MetaForm from "@/components/reusable/metaForm.vue";
import PolyForm from "@/components/reusable/polyForm.vue";
import DownloadForm from "@/components/reusable/downloadForm.vue";
import { ipcRenderer } from "electron";
import { ElMessage, ElMessageBox } from "element-plus";
import { API } from "@/api/api";
import { BatchDto } from "@/js/dto/batch";
import IllustTodayForm from "../reusable/illustTodayForm.vue";

const viewer = ref(null);
// eslint-disable-next-line no-undef
const emit = defineEmits([
  "update:curPage",
  "update:currentSelected",
  "update:illustCount",
  "update:star",
]);
// eslint-disable-next-line no-undef
const props = defineProps({
  filter: Object,
  viewerType: String,
  curPage: Number,
  currentSelected: Object,
});
const writableCurPage = computed({
  get: () => {
    return props.curPage;
  },
  set: (val) => {
    emit("update:curPage", val);
  },
});
const isLoading = ref(false);
const illustList = ref([]);
const illustCount = ref(0);
watch(illustCount, (val) => {
  emit("update:illustCount", val);
});
const currentSelected = computed({
  get: () => {
    return props.currentSelected;
  },
  set: (val) => {
    emit("update:currentSelected", val);
  },
});
const currentOperating = ref(null);
const waitingDownloadList = ref([]);
const waitingDownloadDto = computed(() => {
  if (chooseAll.download) return waitingDownloadList.value;
  else return waitingOperateDto.value;
});
const waitingOperateDto = computed(() => {
  const list = [];
  illustList.value.forEach((item) => {
    if (item.checked) list.push(item);
  });
  if (list.length) {
    return list;
  } else if (currentOperating.value) return [currentOperating.value];
  else return null;
});
const show = reactive({
  poly: false,
  update: false,
  download: false,
  it: false,
});
const chooseAll = reactive({
  poly: false,
  update: false,
  download: false,
});
const handleFocusIndexChange = (action) => {
  viewer.value.handleIndexChange(action);
};
onMounted(() => {
  getIllustsAndCount();
});
const getIllusts = async () => {
  isLoading.value = true;
  const list = await API.getIllusts(
    props.filter,
    100,
    (writableCurPage.value - 1) * 100,
    null
  );
  isLoading.value = false;
  if (list) {
    illustList.value = list;
  }
};
const getIllustsAndCount = async () => {
  isLoading.value = true;
  writableCurPage.value = 1;
  currentSelected.value = null;
  const { count } = await API.getIllustsCount(props.filter);
  illustCount.value = parseInt(count);
  isLoading.value = false;
  getIllusts();
};
watch(
  () => props.filter,
  () => {
    getIllustsAndCount();
  },
  {
    deep: true,
  }
);
watch(
  () => props.curPage,
  () => {
    getIllusts();
  }
);
const handleSingleIllustChange = (obj) => {
  API.updateIllust(obj)
    .then(() => {
      ElMessage.success("修改成功");
    })
    .catch((err) => {
      ElMessage.error(`错误: ${err}`);
    });
};
const handleUpdate = ({ data, controller }) => {
  if (!controller) {
    if (!waitingOperateDto.value) {
      ElMessage.error("项目为空");
      return;
    }
    ElMessageBox.confirm(
      `将为${waitingOperateDto.value.length}个项目进行更新，确认？`,
      "Warning",
      {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }
    )
      .then(() => {
        const dto = new BatchDto();
        waitingOperateDto.value.forEach((ele) => {
          dto.dtos.push({
            dto: {
              id: ele.id,
            },
          });
        });
        dto.addition = { ...data };
        API.updateIllusts(dto)
          .then(() => {
            ElMessage.success("操作成功");
            getIllustsAndCount();
          })
          .catch((err) => {
            ElMessage.error(`错误: ${err}`);
          });
      })
      .catch(() => {});
  } else {
    if (illustCount.value == 0) ElMessage.error("项目为空");
    else {
      ElMessageBox.confirm(
        `将为符合条件的${illustCount.value}个项目更新元，确认？`,
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          const dto = new BatchDto();
          dto.conditionObject = props.filter;
          dto.addition = { ...data };
          API.updateIllusts(dto)
            .then(() => {
              ElMessage.success("操作成功");
              getIllustsAndCount();
            })
            .catch((err) => {
              ElMessage.error(`错误: ${err}`);
            });
        })
        .catch(() => {});
    }
  }
};
const handlePoly = ({ data, controller }) => {
  if (!controller) {
    if (!waitingOperateDto.value) {
      ElMessage.error("项目为空");
      return;
    }
    ElMessageBox.confirm(
      `将为${waitingOperateDto.value.length}个项目创建或添加聚合，确认？`,
      "Warning",
      {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }
    )
      .then(() => {
        const dto = new BatchDto();
        waitingOperateDto.value.forEach((ele) => {
          dto.dtos.push({
            dto: ele,
          });
        });
        dto.polyBase = { ...data };
        API.addPoly(dto)
          .then(() => {
            ElMessage.success("操作成功");
            getIllustsAndCount();
          })
          .catch((err) => {
            ElMessage.error(`错误: ${err}`);
          });
      })
      .catch(() => {});
  } else {
    if (illustCount.value == 0) ElMessage.error("项目为空");
    else {
      ElMessageBox.confirm(
        `将为符合条件的${illustCount.value}个项目创建或添加聚合，确认？`,
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          const dto = new BatchDto();
          dto.conditionObject = props.filter;
          dto.polyBase = { ...data };
          API.addPoly(dto)
            .then(() => {
              ElMessage.success("操作成功");
              getIllustsAndCount();
            })
            .catch((err) => {
              ElMessage.error(`错误: ${err}`);
            });
        })
        .catch(() => {});
    }
  }
};
const handleOpenDownloadDialog = async () => {
  if (!waitingOperateDto.value && !chooseAll.download) {
    ElMessage.error("尚未选择");
    return;
  }
  if (chooseAll.download && illustCount.value >= 1000) {
    ElMessage.error("不允许一次性下载超过1000张图片");
    return;
  }
  if (chooseAll.download && illustCount.value == 0) {
    ElMessage.error("项目为空");
    return;
  }
  if (chooseAll.download) {
    ElMessage.info("正在收集信息");
    waitingDownloadList.value = await API.getIllusts(
      props.filter,
      1000,
      0,
      null
    );
    ElMessage.success("收集完成");
  }
  show.download = true;
};
const handleFetch = (chooseAll) => {
  if (!chooseAll)
    if (waitingOperateDto.value) {
      ElMessageBox.confirm(
        `将为${waitingOperateDto.value.length}个项目抓取元，确认？`,
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          const dto = new BatchDto();
          waitingOperateDto.value.forEach((ele) => {
            dto.dtos.push({
              dto: ele,
            });
          });
          API.updatePixivMeta(dto)
            .then(() => {
              ElMessage.success("请求成功");
              getIllustsAndCount();
            })
            .catch((err) => {
              ElMessage.error(`错误: ${err}`);
            });
        })
        .catch(() => {});
    } else {
      ElMessage.error("尚未选择");
    }
  else {
    if (illustCount.value == 0) ElMessage.error("项目为空");
    else {
      ElMessageBox.confirm(
        `将为符合条件的${illustCount.value}个项目创建或添加聚合，确认？`,
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          const dto = new BatchDto();
          dto.conditionObject = props.filter;
          API.updatePixivMeta(dto)
            .then(() => {
              ElMessage.success("请求成功");
              getIllustsAndCount();
            })
            .catch((err) => {
              ElMessage.error(`错误: ${err}`);
            });
        })
        .catch(() => {});
    }
  }
};
const handleIT = ({ data }) => {
  if (waitingOperateDto.value.length != 1) {
    ElMessage.error("必须为1个对象操作");
    return;
  }
  ElMessageBox.confirm(
    `将为${waitingOperateDto.value.length}个项目建立IT，确认？`,
    "Warning",
    {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    }
  )
    .then(() => {
      API.coverIllustToday(data.date, waitingOperateDto.value[0].id)
        .then(() => {
          ElMessage.success("请求成功");
        })
        .catch((err) => {
          ElMessage.error(`错误: ${err}`);
        });
    })
    .catch(() => {});
};
const handlePopupContext = (row) => {
  if (!row) return;
  currentOperating.value = row;
  ipcRenderer.removeAllListeners("context:click");
  ipcRenderer.once("context:click", (event, item) => {
    switch (item) {
      case "详情":
        currentSelected.value = row;
        break;
      case "选定":
        row.checked = !row.checked;
        break;
      case "生成聚合":
        chooseAll.poly = false;
        show.poly = true;
        break;
      case "全部生成聚合":
        chooseAll.poly = true;
        show.poly = true;
        break;
      case "置元":
        chooseAll.update = false;
        show.update = true;
        break;
      case "全部置元":
        chooseAll.update = true;
        show.update = true;
        break;
      case "抓取元":
        handleFetch();
        break;
      case "全部抓取元":
        handleFetch(true);
        break;
      case "注册为每日一图":
        show.it = true;
        break;
      case "下载":
        chooseAll.download = false;
        handleOpenDownloadDialog();
        break;
      case "全部下载":
        chooseAll.download = true;
        handleOpenDownloadDialog();
        break;
      default:
        break;
    }
  });
  ipcRenderer.send("context:popup", [
    { label: "详情" },
    { type: "separator" },
    {
      label: "选定",
      type: "checkbox",
      checked: !!row.checked,
    },
    { type: "separator" },
    {
      label: "生成聚合",
    },
    {
      label: "置元",
    },
    {
      label: "抓取元",
    },
    { type: "separator" },
    {
      label: "全部生成聚合",
    },
    {
      label: "全部置元",
    },
    {
      label: "全部抓取元",
    },
    { type: "separator" },
    {
      label: "注册为每日一图",
    },
    { type: "separator" },
    {
      label: "下载",
    },
    {
      label: "全部下载",
    },
  ]);
};
// eslint-disable-next-line no-undef
defineExpose({
  handleSingleIllustChange,
  handleFocusIndexChange,
});
</script>
<style lang="scss" scoped></style>
