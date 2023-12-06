<template>
  <el-card>
    <el-form :inline="true" class="searchRole">
      <el-form-item label="角色名">
        <el-input
          placeholder="请输入角色名"
          v-model="keyword"
          @change="getHasRole"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="default"
          :disabled="!keyword.length > 0"
          @click="getHasRole"
        >
          搜索
        </el-button>
        <el-button size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="search-button">
      <el-button
        v-auth="'sys_role_add'"
        type="primary"
        size="default"
        @click="showAddRole"
      >
        添加角色
      </el-button>
    </div>

    <!--    表格展示-->
    <el-table border :data="roleArr">
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column
        label="角色名称"
        prop="roleName"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="角色标识"
        prop="code"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="角色描述"
        prop="roleDesc"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime"
        align="center"
        show-overflow-tooltip
      >
        <template #default="scope">
          {{ dateFormat(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        prop="updateTime"
        align="center"
        show-overflow-tooltip
      >
        <template #default="scope">
          {{ dateFormat(scope.row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240px" align="center">
        <template #="{ row, $index }">
          <el-tooltip
            class="item"
            effect="dark"
            content="编辑角色"
            placement="top"
            :enterable="false"
          >
            <el-button
              v-auth="'sys_role_update'"
              text
              type="primary"
              icon="Edit"
              size="small"
              @click="showUpdateRole(row)"
            >
              编辑
            </el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="删除角色"
            placement="top"
            :enterable="false"
          >
            <el-button
              v-auth="'sys_role_delete'"
              text
              type="primary"
              icon="Delete"
              size="small"
              @click="delRole(row)"
            >
              删除
            </el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="分配权限"
            placement="top"
            :enterable="false"
          >
            <el-button
              v-auth="'sys_role_update-menu'"
              text
              type="primary"
              icon="User"
              size="small"
              @click="showUpdatePermissions(row)"
            >
              权限
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[1, 5, 10, 20]"
      layout="sizes, prev, pager, next, jumper, ->, total"
      :total="total"
      @current-change="getHasRole"
      @size-change="getHasRole"
    />

    <el-dialog
      v-model="addRoleDialogVisible"
      :title="roleParams.id ? '编辑角色' : '添加角色'"
      width="30%"
      align-center
      @close="roleCancel"
    >
      <el-form
        :model="roleParams"
        :rules="roleRules"
        ref="roleFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="roleParams.roleName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色标识" prop="code">
          <el-input
            v-model="roleParams.code"
            placeholder="请输入角色标识"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input
            v-model="roleParams.roleDesc"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6 }"
            placeholder="请输入角色描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="roleCancel">取消</el-button>
          <el-button type="primary" @click="addRole">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-drawer v-model="permissionsDrawer" :before-close="permissionsCancel">
      <template #header>
        <h4>分配权限</h4>
      </template>
      <template #default>
        <div class="menu-tree">
          <div>
            <el-button
              class="change-menu-button"
              round
              type="primary"
              size="default"
              @click="getMenuTreeByRole(1)"
            >
              菜单权限
            </el-button>
            <el-button
              class="change-menu-button"
              round
              type="primary"
              size="default"
              @click="getMenuTreeByRole(2)"
            >
              按钮权限
            </el-button>
          </div>
          <el-input
            class="filter-menu-input"
            v-model="filterText"
            clearable
            @change="changeTreeInput"
            @clear="changeTreeInput"
            :placeholder="
              selectedMenuType === 1 ? '请输入菜单名称' : '请输入按钮名称'
            "
          />
          <el-tree
            :data="permissionsData"
            show-checkbox
            node-key="id"
            default-expand-all
            :default-checked-keys="defaultCheckedKeys"
            :props="defaultProps"
            :filter-node-method="filterNode"
            ref="treeRef"
          />
        </div>
      </template>
      <template #footer>
        <el-button @click="permissionsCancel">取消</el-button>
        <el-button type="primary" @click="updatePermissions">确定</el-button>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import {
  reqAddOrUpdateRole,
  reqGetRoleInfo,
  reqRemoveRole,
  reqRoleListByPage,
} from '@/api/acl/role'
import { RoleData, RoleResponseData } from '@/api/acl/role/type'
import layoutSettingStore from '@/store/modules/setting'
import { ElMessage, ElMessageBox } from 'element-plus'
import { SUCCESS_CODE } from '@/api/base/type'
import { dateFormat } from '@/utils/time'
import {
  reqGetMenuListByRole,
  reqGetMenuTree,
  reqSetPermisstion,
} from '@/api/acl/menu'
import { MenuList, SetRoleMenuDto } from '@/api/acl/menu/type'
import { REMOVE_TAGS_VIEW_LIST } from '@/utils/tabs'

let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
// 用户总个数
let total = ref<number>(0)
let roleArr = ref([])
let addRoleDialogVisible = ref(false)
let permissionsDrawer = ref(false)
let keyword = ref('')
let roleFormRef = ref()
let treeRef = ref()
let permissionsData = ref([])
let defaultCheckedKeys = ref([])
let selectedMenuType = ref(1)
let filterText = ref('')
const roleParams = reactive({
  roleName: '',
  roleDesc: '',
  code: '',
  id: 0,
})

let roleRules = {
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 12, message: '长度在 2 到 12', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入角色标识', trigger: 'blur' },
    { min: 2, max: 12, message: '长度在 2 到 12', trigger: 'blur' },
  ],
  roleDesc: [
    { required: true, message: '请输入角色描述', trigger: 'blur' },
    { min: 2, max: 12, message: '长度在 2 到 12', trigger: 'blur' },
  ],
}

const delRole = (row: RoleData) => {
  ElMessageBox.confirm(
    `此操作将永久删除该角色: ${row.roleName}，是否继续`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
    },
  )
    .then(async () => {
      const result = await reqRemoveRole(row.id as number)
      if (result.code == SUCCESS_CODE) {
        ElMessage.success('删除成功')
        pageNo.value =
          roleArr.value.length > 1 ? pageNo.value : pageNo.value - 1
        await getHasRole()
      } else {
        ElMessage.error(result.msg)
      }
    })
    .catch(() => {
      ElMessage.info('已取消')
    })
}

const updatePermissions = async () => {
  //选中节点的ID
  let menuIds
  if (selectedMenuType.value == 1) {
    let arr = treeRef.value.getCheckedKeys()
    //半选的ID
    let arr1 = treeRef.value.getHalfCheckedKeys()
    menuIds = arr.concat(arr1)
  } else {
    menuIds = treeRef.value.getCheckedKeys(true)
  }
  let setRoleMenuDto: SetRoleMenuDto = {
    roleId: roleParams.id,
    menuIds: menuIds,
    menuType: selectedMenuType.value,
  }
  const response = await reqSetPermisstion(setRoleMenuDto)
  if (response.code == SUCCESS_CODE) {
    // 权限更新成功，删除所有的tabs
    REMOVE_TAGS_VIEW_LIST()
    ElMessage.success('分配权限成功')
    permissionsDrawer.value = false
  } else {
    ElMessage.error(response.msg)
  }
  window.location.reload()
}

const permissionsCancel = () => {
  defaultCheckedKeys.value = []
  permissionsData.value = []
  permissionsDrawer.value = false
}

const roleCancel = () => {
  clearRoleParams()
  addRoleDialogVisible.value = false
  //清除上一次的错误的提示信息
  nextTick(() => {
    roleFormRef.value.clearValidate()
  })
}

const showUpdatePermissions = async (row: RoleData) => {
  //收集当前要分类权限的职位的数据
  Object.assign(roleParams, row)
  const allMenuResponseData = await reqGetMenuTree('', 1)
  if (allMenuResponseData.code != SUCCESS_CODE) {
    ElMessage.error(allMenuResponseData.msg)
    return
  }
  permissionsData.value = allMenuResponseData.data
  const responseData = await reqGetMenuListByRole(row.id as number, 1)
  if (responseData.code != SUCCESS_CODE) {
    ElMessage.error(responseData.msg)
    return
  }
  if (responseData.data) {
    const hasMenuIds = responseData.data.map((t) => t.id)
    defaultCheckedKeys.value = filterSelectArr(
      permissionsData.value,
      hasMenuIds,
      [],
    )
  }
  permissionsDrawer.value = true
}

function filterSelectArr(allData: any, hasDataIds: any, initArr: any) {
  allData.forEach((item) => {
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, hasDataIds, initArr)
    } else if (hasDataIds.includes(item.id)) {
      initArr.push(item.id)
    }
  })
  return initArr
}

function filterTreeByType(tree, targetType) {
  var filteredTree = []
  tree.forEach(function (node) {
    if (node.type === targetType) {
      filteredTree.push(node)
    }

    if (node.children && node.children.length > 0) {
      var filteredChildren = filterTreeByType(node.children, targetType)
      if (filteredChildren.length > 0) {
        node.children = filteredChildren
        filteredTree.push(node)
      }
    }
  })

  return filteredTree
}

const getMenuTreeByRole = async (menuType: number) => {
  filterText.value = ''
  selectedMenuType.value = menuType
  const allMenuResponseData = await reqGetMenuTree(
    '',
    menuType == 2 ? 0 : menuType,
  )
  if (allMenuResponseData.code != SUCCESS_CODE) {
    ElMessage.error(allMenuResponseData.msg)
    return
  }
  if (menuType == 2) {
    permissionsData.value = filterTreeByType(allMenuResponseData.data, 2)
  } else {
    permissionsData.value = allMenuResponseData.data
  }

  const responseData = await reqGetMenuListByRole(
    roleParams.id as number,
    menuType,
  )
  if (responseData.code != SUCCESS_CODE) {
    ElMessage.error(responseData.msg)
    return
  }
  if (responseData.data) {
    const hasMenuIds = responseData.data.map((t) => t.id)
    defaultCheckedKeys.value = filterSelectArr(
      permissionsData.value,
      hasMenuIds,
      [],
    )
    treeRef.value.setCheckedNodes(defaultCheckedKeys.value)
  }
}

const showUpdateRole = async (row: RoleData) => {
  const responseData = await reqGetRoleInfo(row.id as number)
  if (responseData.code != SUCCESS_CODE) {
    ElMessage.error(responseData.msg)
    return
  }
  Object.assign(roleParams, {
    id: responseData.data.id,
    roleName: responseData.data.roleName,
    roleDesc: responseData.data.roleDesc,
    code: responseData.data.code,
  })
  addRoleDialogVisible.value = true
}

const addRole = async () => {
  // 发起请求
  await roleFormRef.value.validate()

  const result = await reqAddOrUpdateRole(roleParams)
  if (result.code == SUCCESS_CODE) {
    ElMessage.success(roleParams.id ? '更新成功' : '添加成功')
    if (!roleParams.id) {
      pageNo.value = 1
      await getHasRole()
    }
  } else {
    ElMessage.error(result.msg)
  }
  getHasRole()
  addRoleDialogVisible.value = false
  //清除上一次的错误的提示信息
  nextTick(() => {
    clearRoleParams()
  })
}

const showAddRole = () => {
  addRoleDialogVisible.value = true
}

const reset = () => {
  const settingStore = layoutSettingStore()
  settingStore.refreshWeb = !settingStore.refreshWeb
}

const clearRoleParams = () => {
  Object.assign(roleParams, {
    roleName: '',
    roleDesc: '',
    code: '',
    id: 0,
  })
}

async function getHasRole() {
  const roleResponseData: RoleResponseData = await reqRoleListByPage(
    pageNo.value,
    pageSize.value,
    keyword.value,
  )
  if (roleResponseData.code == SUCCESS_CODE) {
    total.value = roleResponseData.data.total
    roleArr.value = roleResponseData.data.records
  }
}

// 树形结构
const defaultProps = {
  children: 'children',
  label: 'name',
}

const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.menuName.includes(value)
}

const changeTreeInput = () => {
  treeRef.value!.filter(filterText.value)
}

onMounted(() => {
  getHasRole()
})
</script>

<style scoped lang="scss">
.el-table {
  margin: 15px 0;
}

.change-menu-button {
  margin: 20px 5px;
}

.filter-menu-input {
  margin-bottom: 20px;
  width: 70%;
}

// 修改el-tree内容格式
.el-tree ::v-deep .el-tree-node__content {
  height: 27px;
  font-size: 15px;
}
</style>
