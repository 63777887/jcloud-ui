<template>
  <el-card>
    <el-form :inline="true" class="searchUser">
      <el-form-item label="用户名">
        <el-input
          placeholder="请输入用户名"
          v-model="usernameParam"
          @change="getHasUser"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="default"
          :disabled="!usernameParam.length > 0"
          @click="getHasUser"
        >
          搜索
        </el-button>
        <el-button size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="search-button">
      <div>
        <el-button
          type="primary"
          size="default"
          @click="showAddUser"
          v-auth="'sys_user_add'"
        >
          添加用户
        </el-button>
        <el-button
          type="primary"
          size="default"
          :disabled="!selectedUser.length > 0"
          v-auth="'sys_delete_user_batch'"
          @click="delUserBatch"
        >
          批量删除
        </el-button>
      </div>
      <div>
        <el-button
          size="default"
          icon="Upload"
          plain
          v-auth="'sys_delete_user_batch'"
          @click="showUpload = true"
        >
          导入
        </el-button>
        <el-button
          icon="Download"
          size="default"
          plain
          v-auth="'sys_delete_user_batch'"
          @click="showExport = true"
        >
          导出
        </el-button>
      </div>
    </div>
    <!--    表格展示-->
    <el-table border :data="userArr" @selection-change="userSelectedChange">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column
        label="用户名"
        prop="username"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用户名称"
        prop="nickname"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="手机号"
        prop="phone"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="用户角色" prop="roleName" align="center">
        <template #default="scope">
          <el-tag
            v-for="(item, index) in scope.row.sysRoles"
            :key="item.id"
            type="success"
          >
            {{ item.roleName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="启用"
        prop="status"
        align="center"
        show-overflow-tooltip
      >
        <template #default="scope">
          <el-switch
            v-model="scope.row.enable"
            inline-prompt
            active-text="是"
            :disabled="scope.row.id == store.user.id"
            inactive-text="否"
            @change="changeUserStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        prop="updateTime"
        width="180px"
        align="center"
        show-overflow-tooltip
      >
        <template #default="scope">
          {{ dateFormat(scope.row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240" align="center" class="operate">
        <template #="{ row, $index }">
          <el-tooltip
            effect="dark"
            content="编辑用户"
            placement="top"
            :enterable="false"
          >
            <el-button
              v-auth="'sys_user_update'"
              text
              type="primary"
              icon="Edit"
              size="small"
              @click="showUpdateUser(row)"
            >
              编辑
            </el-button>
          </el-tooltip>
          <el-tooltip
            effect="dark"
            content="删除用户"
            placement="top"
            :enterable="false"
          >
            <el-button
              v-auth="'sys_user_delete'"
              :disabled="row.id == store.user.id"
              text
              type="primary"
              icon="Delete"
              size="small"
              @click="delUser(row)"
            >
              删除
            </el-button>
          </el-tooltip>
          <jwk-popover :data="row" @getHasUser="getHasUser"></jwk-popover>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[1, 5, 10, 20]"
      layout="sizes, prev, pager, next, jumper, ->, total"
      :total="total"
      @current-change="getHasUser"
      @size-change="getHasUser"
    />
    <el-drawer v-model="userDrawer" :before-close="userCancel">
      <template #header>
        <h4>{{ userParams.id ? '编辑用户' : '添加用户' }}</h4>
      </template>
      <template #default>
        <el-form
          :model="userParams"
          :rules="userRules"
          ref="userFormRef"
          label-width="100px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="userParams.username"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickname">
            <el-input
              v-model="userParams.nickname"
              placeholder="请输入用户昵称"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="userParams.phone"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="userParams.email"
              placeholder="请输入邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
            <el-input
              v-model="userParams.password"
              placeholder="请输入用户密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <template #default="scope">
              <el-switch
                v-model="userParams.enable"
                inline-prompt
                active-text="启用"
                inactive-text="停用"
                :disabled="userParams.id == store.user.id"
                size="large"
                width="70px"
              />
            </template>
          </el-form-item>
          <el-form-item label="用户角色" prop="name">
            <el-select
              v-model="checkedRoles"
              multiple
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="3"
              filterable
              placeholder="请选择角色"
              style="width: 240px"
            >
              <el-option
                v-for="item in allRoles"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="userCancel">取消</el-button>
        <el-button type="primary" @click="saveUser">确定</el-button>
      </template>
    </el-drawer>
    <jwk-upload
      @close="closeUpload"
      :show="showUpload"
      :multiple="false"
      :size="500"
      size-type="MB"
      :before-upload="beforeUpload"
      title="用户导入"
      :http-request="httpRequest"
      accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ></jwk-upload>
    <jwk-export
      @confirm="onConfirmHandler"
      @close="closeExport"
      :default-export="defaultExportField"
      :data="exportField"
      title="用户导出"
      :show="showExport"
    ></jwk-export>
  </el-card>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'
import {
  reqAddOrUpdateUser,
  reqDelUserBatch,
  reqExportUser,
  reqGetUserInfo,
  reqImportUser,
  reqRemoveUser,
  reqUserListByPage,
} from '@/api/acl/user'
import { User, UserReq, UserResponseData } from '@/api/acl/user/type'
import {
  ElMessage,
  ElMessageBox,
  UploadRawFile,
  UploadRequestOptions,
} from 'element-plus'
import userStore from '@/store/modules/user'
import layoutSettingStore from '@/store/modules/setting'
import { dateFormat } from '@/utils/time'
import JwkPopover from './jwkPopover/index.vue'
import JwkUpload from '@/components/JwkUpload/index.vue'
import JwkExport from '@/components/JwkExport/index.vue'
import { reqAllRole } from '@/api/acl/role'
import { ExportReq, ResponseData, SUCCESS_CODE } from '@/api/base/type'
import { AllRoleResponseData } from '@/api/acl/role/type'

const store = userStore()

// todo 后续应该从数据字典中获取
const exportField = [
  {
    field: 'userId',
    fieldName: '用户ID',
  },
  {
    field: 'username',
    fieldName: '用户名',
  },
  {
    field: 'phone',
    fieldName: '手机号',
  },
  {
    field: 'email',
    fieldName: '邮箱',
  },
  {
    field: 'nickname',
    fieldName: '昵称',
  },
  {
    field: 'orgName',
    fieldName: '组织机构',
  },
]

const defaultExportField = ['phone', 'username']

let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
let usernameParam = ref<string>('')
// 用户总个数
let total = ref<number>(0)
// 存储全部用户的数组
let userArr = ref([])
let userDrawer = ref<boolean>(false)
let showUpload = ref<boolean>(false)
let showExport = ref<boolean>(false)

let allRoles = []
let checkedRoles = ref([])
let selectedUser = ref([])

let userFormRef = ref()

let userParams = reactive<UserReq>({
  id: 0,
  updateTime: '',
  username: '',
  nickname: '',
  phone: '',
  email: '',
  orgId: 0,
  status: 0,
  enable: true,
  password: '',
  roles: [],
})

let userRules = {
  username: [
    { required: true, message: '请输入用户姓名', trigger: 'blur' },
    { min: 3, max: 12, message: '长度在 3 到 12', trigger: 'blur' },
  ],
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    { min: 2, max: 12, message: '长度在 2 到 12', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, max: 12, message: '长度在 3 到 12', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { min: 3, max: 12, message: '长度在 3 到 12', trigger: 'blur' },
  ],
}

const beforeUpload = (rawFile: UploadRawFile) => {}

const closeUpload = () => {
  showUpload.value = false
}

const closeExport = () => {
  showExport.value = false
}

const onConfirmHandler = (exportFields: []) => {
  const exportReq: ExportReq = {
    businessType: 'user',
    password: '',
    isAll: true,
    conditions: null,
    exportFields: exportFields,
  }
  reqExportUser(exportReq)

  showExport.value = false
}

const httpRequest = async (options: UploadRequestOptions) => {
  let response: ResponseData = await reqImportUser(options.file)
  if (response.code === SUCCESS_CODE) {
    ElMessage.success('导入成功')
  } else {
    ElMessage.error(response.msg)
  }
  getHasUser()
}

const getHasUser = async () => {
  let result: UserResponseData = await reqUserListByPage(
    pageNo.value,
    pageSize.value,
    usernameParam.value,
  )
  if (result.code == SUCCESS_CODE) {
    total.value = result.data.total
    userArr.value = result.data.records
    userArr.value.forEach((item) => {
      switch (item.status) {
        case 1:
          item.enable = true
          break
        case 2:
          item.enable = false
          break
        default:
          item.enable = false
          break
      }
    })
  }
}

const showAddUser = async () => {
  const allRoleResponseData: AllRoleResponseData = await reqAllRole()
  if (allRoleResponseData.code == SUCCESS_CODE) {
    allRoles = allRoleResponseData.data
  }
  userDrawer.value = true
}

const showUpdateUser = async (row: User) => {
  const userInfoResponseData = await reqGetUserInfo(row.id as number)
  if (userInfoResponseData.code != SUCCESS_CODE) {
    ElMessage.error(userInfoResponseData.msg)
    return
  }
  Object.assign(userParams, {
    id: userInfoResponseData.data.id,
    username: userInfoResponseData.data.username,
    nickname: userInfoResponseData.data.nickname,
    phone: userInfoResponseData.data.phone,
    email: userInfoResponseData.data.email,
    orgId: userInfoResponseData.data.orgId,
    enable: userInfoResponseData.data.status == 1,
    status: userInfoResponseData.data.status,
  })
  const allRoleResponseData: AllRoleResponseData = await reqAllRole()
  if (allRoleResponseData.code == SUCCESS_CODE) {
    allRoles = allRoleResponseData.data
    if (userInfoResponseData.data.sysRoles) {
      checkedRoles.value = row.sysRoles.map((t) => t.id)
    }
  }
  userDrawer.value = true
}

const saveUser = async () => {
  await userFormRef.value.validate()
  userParams.roles = checkedRoles.value
  const result = await reqAddOrUpdateUser(userParams)
  if (result.code == SUCCESS_CODE) {
    ElMessage.success(userParams.id ? '更新成功' : '添加成功')
    if (!userParams.id) {
      pageNo.value = 1
      await getHasUser()
    } else if (userParams.id == store.userId) {
      window.location.reload()
    } else {
      await getHasUser()
    }
  } else {
    ElMessage.error(result.msg)
  }
  userDrawer.value = false
  //清除上一次的错误的提示信息
  nextTick(() => {
    clearUserParams()
  })
}

const changeUserStatus = async (row: User) => {
  let updateUser = {} as UserReq
  updateUser.id = row.id
  updateUser.status = row.enable ? 1 : 2
  const result = await reqAddOrUpdateUser(updateUser)
  if (result.code == SUCCESS_CODE) {
    ElMessage.success(row.enable ? '启用成功' : '停用成功')
    if (!userParams.id) {
      pageNo.value = 1
      await getHasUser()
    } else if (userParams.id == store.userId) {
      window.location.reload()
    } else {
      await getHasUser()
    }
  } else {
    ElMessage.error(result.msg)
  }
}

const userCancel = () => {
  userDrawer.value = false
  checkedRoles.value = []
  //清空数据
  userParamsCancel()
}

const userParamsCancel = () => {
  //清空数据
  nextTick(() => {
    clearUserParams()
    userFormRef.value.clearValidate()
  })
}

const delUser = async (row) => {
  ElMessageBox.confirm(
    `此操作将永久删除该用户: ${row.username}，是否继续`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
    },
  )
    .then(async () => {
      const result = await reqRemoveUser(row.id)
      if (result.code == SUCCESS_CODE) {
        ElMessage.success('删除成功')
        pageNo.value =
          userArr.value.length > 1 ? pageNo.value : pageNo.value - 1
        await getHasUser()
      } else {
        ElMessage({
          type: 'info',
          message: '删除失败',
        })
      }
    })
    .catch(() => {
      ElMessage.info('已取消')
    })
}

const delUserBatch = () => {
  ElMessageBox.confirm(`此操作将永久删除已选中的所有用户，是否继续`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  })
    .then(async () => {
      const userIds = selectedUser.value.map((item) => item.id)
      const result: any = await reqDelUserBatch(userIds)
      if (result.code == SUCCESS_CODE) {
        ElMessage.success('删除成功')
        pageNo.value =
          userArr.value.length > 1 ? pageNo.value : pageNo.value - 1
        await getHasUser()
      } else {
        ElMessage({
          type: 'info',
          message: '删除失败',
        })
      }
    })
    .catch(() => {
      ElMessage.info('已取消')
    })
}

const userSelectedChange = (arr) => {
  selectedUser.value = arr
}

const clearUserParams = () => {
  Object.assign(userParams, {
    id: 0,
    updateTime: '',
    username: '',
    nickname: '',
    phone: '',
    email: '',
    enable: true,
    orgId: 0,
    status: 0,
    password: '',
    roles: [],
  })
}

const reset = () => {
  const settingStore = layoutSettingStore()
  settingStore.refreshWeb = !settingStore.refreshWeb
}

onMounted(() => {
  getHasUser()
})
</script>

<style scoped lang="scss">
.el-form {
  width: 100%;
}

// 找到操作栏
:deep .el-table .cell:has(> button) {
  display: flex;
  align-items: center;
  justify-content: space-around;
  // 去除按钮默认样式
  button {
    margin: 0;
  }

  padding: 0 40px;
}

.searchUser {
  display: flex;
  align-items: center;
}

.show-user-card {
  margin-top: 10px;
}

.el-table {
  margin: 15px 0;
}

.search-button {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
}
</style>
