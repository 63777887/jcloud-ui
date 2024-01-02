//账号信息的ts类型
import { RoleData } from '@/api/acl/role/type'
import { ResponseData } from '@/api/base/type'

//代表一个账号信息的ts类型
export interface RedisInfo {
  // Redis 服务器的版本号
  "redis_version": string,
  // Redis服务器已运行的天数
  "uptime_in_days": string,
  // 当前连接的客户端数量
  "connected_clients": string,
  //  Redis服务器占用的内存大小
  "used_memory_rss": string,
  // 上次RDB快照的状态（成功为"ok"，失败为"err"）
  "rdb_last_bgsave_status": string,
  // 是否开启aof
  "aof_enabled": string,
  // 处理的总命令数
  "total_commands_processed": string
  // 当前保存的键总数
  "current_save_keys_total": string
  // Redis服务器所在系统的总内存大小（字节）
  "total_system_memory": string
  // 数据集的内存占用百分比
  "used_memory_dataset_perc": string
  // 是否集群
  "isCluster": string
}
export interface RedisInfoData {
  "info": RedisInfo,
  "command": Map,
  "keys": Map,
}

//代表一

//获取全部用户信息接口返回的数据ts类型
export interface GetRedisInfoResponseData extends ResponseData {
  data: RedisInfoData
}
