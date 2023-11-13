<template>
  <el-card>
    <el-form :inline="true" class="searchUser">
      <el-form-item label="菜单名">
        <el-input placeholder="请输入菜单名" v-model="menuName" @change="getHasPermisstion" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" :disabled="!menuName.length > 0" @click="getHasPermisstion">搜索
        </el-button>
        <el-button size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="searchButton">
      <el-button v-auth="'sys_menu-add'" type="primary" size="default" @click="addPermisstion">新增菜单</el-button>
      <el-button type="primary" size="default" @click="expandAllRow">展开/折叠</el-button>
    </div>

    <el-table :data="PermisstionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border
              :default-expand-all="expandAll" :expand-row-keys="defaultExpandedKeys">
      <el-table-column label="名称" prop="menuName" min-width="130" fixed align="center"
                       show-overflow-tooltip></el-table-column>
      <el-table-column label="排序" prop="sort" width="60" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="图标" prop="icon" width="100" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="权限标识" prop="permission" width="130" align="center"
                       show-overflow-tooltip></el-table-column>
      <el-table-column label="路由/接口" prop="path" width="130" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="菜单栏展示" prop="hidden" width="80" align="center" show-overflow-tooltip>
        <template #default="scope">
          <el-switch
              v-model="scope.row.isHidden"
              inline-prompt
              active-text="是"
              inactive-text="否"
              v-show="scope.row.type === 1"
              @change="changeHidden(scope.row.isHidden,scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="标签栏展示" prop="tab" width="80" align="center" show-overflow-tooltip>
        <template #default="scope">
          <el-switch
              v-model="scope.row.isTab"
              inline-prompt
              active-text="是"
              inactive-text="否"
              v-show="scope.row.type === 1"
              @change="changeTab(scope.row.isTab,scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type" align="center" show-overflow-tooltip>
        <template #default="scope">
          <el-tag effect="plain" :type="scope.row.type == 1 ? '':'success'">
            {{ scope.row.type == 1 ? '菜单' : '按钮' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" prop="updateTime" width="180" align="center" show-overflow-tooltip>
        <template #default="scope">
          {{ dateFormat(scope.row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="240">
        <!-- row:即为已有的菜单对象|按钮的对象的数据 -->
        <template #="{ row, $index }">
          <el-tooltip icon="delete" content="按钮下不可新增菜单"
                      :disabled="row.type == '1'" placement="top">
            <el-button v-auth="'sys_menu-add'" type="primary" @click="addPermisstion(row)" size="small" icon="FolderAdd"
                       text
                       :disabled="row.type == '2'">
              新增
            </el-button>
          </el-tooltip>
          <el-button v-auth="'sys_menu-update'" type="primary" @click="updatePermisstion(row)" size="small"
                     icon="EditPen" text>
            编辑
          </el-button>
          <el-tooltip icon="delete" content="不可删除有子节点的菜单"
                      :disabled="!row.children" placement="top">
							<span style="margin-left: 12px">
                <el-popconfirm :title="`你确定要删除${row.menuName}?`" width="260px" @confirm="removeMenu(row.id)">
                  <template #reference>
                  <el-button v-auth="'sys_menu-delete'" type="primary" size="small"
                             :disabled="row.children && row.children.length > 0"
                             icon="Delete"
                             text>
                    删除
                  </el-button>
                  </template>
                </el-popconfirm>
              </span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框组件:添加或者更新已有的菜单的数据结构 -->
    <el-dialog v-model="dialogVisible" :title="menuData.id ? '更新菜单' : '添加菜单'" @close="menuCancel">
      <!-- 表单组件:收集新增与已有的菜单的数据 -->
      <el-form :model="menuData" label-width="90" :rules="menuRules" ref="menuFormRef">
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="menuData.type">
            <el-radio border
                      v-show="(!menuData.id && (!addMenuType || addMenuType===1)) || (menuData.id>0 && menuData.type ===1)"
                      :label="1">菜单
            </el-radio>
            <el-radio border
                      v-show="(!menuData.id && (!addMenuType || addMenuType===2)) || (menuData.id>0 && menuData.type ===2)"
                      :label="2">按钮
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input :placeholder="menuData.type === 1 ? '请输入菜单名称':'请输入按钮名称'" v-model="menuData.menuName"></el-input>
        </el-form-item>
        <el-form-item v-show="menuData.type === 1" label="菜单路由" prop="path">
          <el-input v-model="menuData.path" placeholder="请输入菜单路由"/>
        </el-form-item>
        <el-form-item v-show="menuData.type === 2" label="后端接口" prop="path">
          <el-select
              v-model="menuData.path"
              filterable
              remote
              placeholder="请输入接口地址"
              remote-show-suffix
              :remote-method="remoteMethod"
              :loading="loading"
          >
            <el-option
                v-for="item in apiList"
                :key="item.id"
                :label="item.url"
                :value="item.url"
            >
              <span class="api-selector-url">{{ item.url }}</span>
              <span class="api-selector-desc">{{ item.apiDesc }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限标识" prop="permission" v-if="menuData.type === 2">
          <el-input v-model="menuData.permission" maxlength="50" placeholder="请输入权限标识"/>
        </el-form-item>
        <el-form-item label="父级菜单" prop="parentId">
          <el-tree-select
              v-model="menuData.parentId"
              :data="menuTree"
              :render-after-expand="false"
              :props="{ value: 'id', label: 'menuName', children: 'children' }"
              class="w100"
              clearable
              check-strictly
              placeholder="请选择父级菜单"
          >
          </el-tree-select>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="menuData.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="图标" prop="icon" v-if="menuData.type === 1">
          <IconSelector placeholder="请选择图标" v-model="menuData.icon"/>
        </el-form-item>
        <el-form-item label="菜单栏可见" prop="hidden" v-if="menuData.type === 1">
          <el-radio-group v-model="menuData.hidden">
            <el-radio border :label="2">否</el-radio>
            <el-radio border :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标签栏可见" prop="tab" v-if="menuData.type === 1">
          <el-radio-group v-model="menuData.tab">
            <el-radio border :label="2">否</el-radio>
            <el-radio border :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
            <span class="dialog-footer">
                <el-button @click="menuCancel">取消</el-button>
                <el-button type="primary" @click="save">确定</el-button>
            </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import {nextTick, onMounted, reactive, ref} from "vue";
//引入获取菜单请求API
import {reqAddOrUpdateMenu, reqGetMenuAll, reqGetMenuInfo, reqGetMenuTree, reqRemoveMenu} from '@/api/acl/menu';
//引入ts类型
import type {MenuParams, Permisstion, PermisstionResponseData} from '@/api/acl/menu/type';
import {ElMessage} from "element-plus";
import {dateFormat} from '@/utils/time'
import IconSelector from './iconSelector/index.vue'
import layoutSettingStore from "@/store/modules/setting";
import {Menu} from "@/api/acl/menu/type";
import {SUCCESS_CODE} from "@/api/base/type";
import {REMOVE_TAGS_VIEW_ITEM, SET_TAGS_VIEW_LIST} from "@/utils/tabs";
import {useRoute} from "vue-router";
import {reqGetApiList} from "@/api/acl/api";
import {ApiListResponseData} from "@/api/acl/api/type";
//存储菜单的数据
let PermisstionArr = ref([]);
//控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false);
let expandAll = ref<boolean>(false);
let loading = ref<boolean>(false);
let menuName = ref<string>("");
let addMenuType = ref<number>();
const menuTree = ref([]);
const apiList = ref([]);
const menuFormRef = ref();
//携带的参数
let menuData = reactive<MenuParams>({
  id: 0,
  hidden: 1,
  menuName: "",
  parentId: -1,
  path: "",
  permission: "",
  sort: 1,
  tab: 1,
  type: 1,
})

let menuRules = {
  menuName: [
    {required: true, message: '请输入菜单名称', trigger: 'blur'},
    {min: 2, max: 12, message: '长度在 2 到 12', trigger: 'blur'},
  ],
  path: [
    {required: true, message: '请输入路由地址', trigger: 'blur'},
    {min: 1, max: 128, message: '长度在 1 到 128', trigger: 'blur'},
  ],
  permission: [
    {required: true, message: '请输入权限标识', trigger: 'blur'},
    {min: 1, max: 128, message: '长度在 1 到 128', trigger: 'blur'},
  ],
}

//携带的参数
let defaultExpandedKeys = ref([])

const route = useRoute()

const remoteMethod = async (query: string) => {
  loading.value = true
  const listResponseData: ApiListResponseData = await reqGetApiList(query);
  if (listResponseData.code == SUCCESS_CODE) {
    apiList.value = listResponseData.data
  }
  loading.value = false
}

const changeHidden = async (val: boolean, row: MenuParams) => {
  row.hidden = val ? 1 : 2
  let result: any = await reqAddOrUpdateMenu(row);
  if (result.code == SUCCESS_CODE) {
    //提示信息
    ElMessage({type: 'success', message: '更新成功'})
    //再次获取全部最新的菜单的数据
    window.location.reload()
  } else {
    ElMessage.error(result.msg)
  }
}

const changeTab = async (val: boolean, row: MenuParams) => {
  row.tab = val ? 1 : 2
  let result: any = await reqAddOrUpdateMenu(row);
  if (result.code == SUCCESS_CODE) {
    //提示信息
    ElMessage({type: 'success', message: '更新成功'})
    //再次获取全部最新的菜单的数据
    if (val && row.path == '/acl/menu') {
      SET_TAGS_VIEW_LIST(route)
    }
    if (!val) {
      REMOVE_TAGS_VIEW_ITEM(row.path)
    }
    window.location.reload()
  } else {
    ElMessage.error(result.msg)
  }
}

//组件挂载完毕
onMounted(() => {
  getHasPermisstion();
});

const menuCancel = () => {
  clearMenuParams()
  menuData.type = 1
  addMenuType.value = 0
  dialogVisible.value = false
  //清除上一次的错误的提示信息
  nextTick(() => {
    menuFormRef.value.clearValidate()
  });

}

//获取菜单数据的方法
const getHasPermisstion = async () => {
  let result: PermisstionResponseData = await reqGetMenuTree(menuName.value);
  if (result.code == SUCCESS_CODE) {
    PermisstionArr.value = result.data;
    changeDate(PermisstionArr.value)
  }
}

const changeDate = (data: Menu[]) => {
  data.forEach(t => {
    if (t.children) {
      changeDate(t.children)
    }
    t.isTab = t.tab == 1
    t.isHidden = t.hidden == 1
  })
}

const getExpandedKeys = (date: Menu[]) => {
  date.forEach(t => {
    if (t.children) {
      getExpandedKeys(t.children)
      defaultExpandedKeys.value.push(t.id)
    }
  })
}

const expandAllRow = () => {
  expandAll.value = !expandAll.value
  if (expandAll.value) {
    getExpandedKeys(PermisstionArr.value);
  } else {
    getHasPermisstion();
    defaultExpandedKeys.value = []
  }
}

const clearMenuParams = () => {
  Object.assign(menuData, {
    id: 0,
    hidden: 1,
    menuName: "",
    parentId: -1,
    path: "",
    permission: "",
    sort: 1,
    tab: 1,
    type: 1,
  })
}

//添加菜单按钮的回调
const addPermisstion = async (row: Permisstion) => {
  //清空数据
  clearMenuParams();
  if (row.id) {
    menuData.parentId = row.id as number
  }
  const result = await reqGetMenuAll()
  if (result.code == SUCCESS_CODE) {
    menuTree.value = result.data;
  }
  getMenuType(menuData.parentId, PermisstionArr.value)
  //对话框显示出来
  dialogVisible.value = true;

}

const getMenuType = (id, arr) => {
  arr.forEach(t => {
    if (t.id == id) {
      if (t.children && t.children.length > 0) {
        addMenuType.value = t.children[0].type
        menuData.type = addMenuType.value
      } else {
        addMenuType.value = 0
      }
      return
    }
    if (t.children) {
      getMenuType(id, t.children)
    }
  })
}
//编辑已有的菜单
const updatePermisstion = async (row: Permisstion) => {
  const result = await reqGetMenuAll()
  if (result.code == SUCCESS_CODE) {
    menuTree.value = result.data;
  }
  //点击修改按钮:收集已有的菜单的数据进行更新
  const responseData = await reqGetMenuInfo(row.id as number);
  if (responseData.code == SUCCESS_CODE) {
    Object.assign(menuData, responseData.data);
  }
  dialogVisible.value = true;
}

//确定按钮的回调
const save = async () => {
  // 发起请求
  await menuFormRef.value.validate()
  //发请求:新增子菜单|更新某一个已有的菜单的数据
  let result: any = await reqAddOrUpdateMenu(menuData);
  if (result.code == SUCCESS_CODE) {
    //对话框隐藏
    dialogVisible.value = false;
    //提示信息
    ElMessage({type: 'success', message: menuData.id ? '更新成功' : '添加成功'})
    //再次获取全部最新的菜单的数据
    window.location.reload()
  }
}

//删除按钮回调
const removeMenu = async (id: number) => {
  let result = await reqRemoveMenu(id);
  if (result.code == SUCCESS_CODE) {
    ElMessage({type: 'success', message: '删除成功'});
    window.location.reload()
  }
}

const reset = () => {
  const settingStore = layoutSettingStore();
  settingStore.refreshWeb = !settingStore.refreshWeb
}


</script>

<style scoped>

.searchButton {
  margin-bottom: 15px;
}

.el-select {
  width: 100%;
}

.api-selector-url {
  float: left
}

.api-selector-desc {
  float: right;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}
</style>
