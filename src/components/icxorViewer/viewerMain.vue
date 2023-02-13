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
      :tableData="illustList"
      ref="viewer"
      @select-change="currentSelected = $event"
      @popup-context="handlePopupContext"
    />
    <MetaForm
      v-model="show.update"
      @confirm="handleUpdate"
      ref="metaForm"
      type="viewer"
    ></MetaForm>
    <PolyForm
      v-model="show.poly"
      @confirm="handlePoly"
      ref="polyForm"
      type="viewer"
    ></PolyForm>
    <DownloadForm
      v-model="show.download"
      :download-list="waitingOperateDto"
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

const viewer = ref(null);
// eslint-disable-next-line no-undef
const emit = defineEmits([
  "update:curPage",
  "update:currentSelected",
  "update:illustCount",
]);
// eslint-disable-next-line no-undef
const props = defineProps({
  filter: Object,
  viewerType: String,
  curPage: Number,
});
const writableCurPage = computed({
  get: () => {
    return props.curPage;
  },
  set: (val) => {
    emit("update:curPage", val);
  },
});
const illustList = ref([]);
const illustCount = ref(0);
watch(illustCount, (val) => {
  emit("update:illustCount", val);
});
const currentSelected = ref(null);
watch(currentSelected, (val) => {
  emit("update:currentSelected", val);
});
const currentOperating = ref(null);
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
});
const handleFocusIndexChange = (action) => {
  viewer.value.handleIndexChange(action);
};
onMounted(() => {
  getIllustsAndCount();
});
const getIllusts = async () => {
  viewer.value.resetScroll();
  const list = await API.getIllusts(
    props.filter,
    100,
    (writableCurPage.value - 1) * 100,
    "meta.pid",
    1
  );
  if (list) {
    illustList.value = list;
  }
};
const getIllustsAndCount = async () => {
  writableCurPage.value = 1;
  const { count } = await API.getIllustsCount(props.filter);
  illustCount.value = parseInt(count);
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
  API.updateIllustsByMatch([obj])
    .then((data) => {
      if (data.code === 200000) {
        if (data.data[0].status == "success") {
          ElMessage.success("修改成功");
        } else {
          ElMessage.error(`修改失败：${data.data[0].message}`);
        }
      } else {
        ElMessage.error("服务器错误");
      }
    })
    .catch((err) => {
      ElMessage.error(`网络错误：${err}`);
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
        const dto = [];
        waitingOperateDto.value.forEach((ele) => {
          dto.push({
            id: ele.id,
            ...data,
          });
        });
        API.updateIllustsByMatch(dto)
          .then((data) => {
            if (data.code == 200000) {
              ElMessage.success("操作成功");
              getIllustsAndCount();
            } else {
              ElMessage.error(data.msg);
            }
          })
          .catch(() => {
            ElMessage.error("网络错误");
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
          API.updateIllustsByCondition(props.filter, { ...data })
            .then((data) => {
              if (data.code == 200000) {
                ElMessage.success("操作成功");
                getIllustsAndCount();
              } else {
                ElMessage.error(data.msg);
              }
            })
            .catch(() => {
              ElMessage.error("网络错误");
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
        API.addPolyByMatch(
          data.type,
          data.parent,
          data.name,
          waitingOperateDto.value
        )
          .then((data) => {
            if (data.code == 200000) {
              ElMessage.success("操作成功");
              getIllustsAndCount();
            } else {
              ElMessage.error(data.msg);
            }
          })
          .catch(() => {
            ElMessage.error("网络错误");
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
          API.addPolyByCondition(
            data.type,
            data.parent,
            data.name,
            props.filter
          )
            .then((data) => {
              if (data.code == 200000) {
                ElMessage.success("操作成功");
                getIllustsAndCount();
              } else {
                ElMessage.error(data.msg);
              }
            })
            .catch(() => {
              ElMessage.error("网络错误");
            });
        })
        .catch(() => {});
    }
  }
};
const handleOpenDownloadDialog = () => {
  if (!waitingOperateDto.value) {
    ElMessage.error("尚未选择");
    return;
  }
  show.download = true;
};
const handleFetch = () => {
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
        API.updatePixivMeta(waitingOperateDto.value)
          .then((data) => {
            if (data.code === 200000) {
              ElMessage.success("请求成功");
            } else {
              ElMessage.error(data.msg);
            }
          })
          .catch(() => {
            ElMessage.error("网络错误");
          });
      })
      .catch(() => {});
  } else {
    ElMessage.error("尚未选择");
  }
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
        show.poly = true;
        break;
      case "修改元":
        show.update = true;
        break;
      case "抓取元":
        handleFetch();
        break;
      case "下载":
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
      label: "修改元",
    },
    {
      label: "抓取元",
    },
    {
      label: "下载",
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
