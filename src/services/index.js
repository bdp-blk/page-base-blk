/**
 * @author samy
 * @email samyzhg#qq.com
 * @create date 2020-08-06 21:00:24
 * @modify date 2020-08-06 21:00:24
 * @desc 接口地址示范
 */
import request from '@/bdpcloud/utils/request';
import { delayPms } from '@<%=proName%>/utils/utils';

import { getListM, getTreeM } from './mock';
const isMock = true;

// 首页api列表
export async function getList(params) {
  if (isMock) {
    return delayPms(getListM);
  }
  return request('daweb/getList', {
    method: 'POST',
    body: params,
  });
}

// 首页目录菜单
export async function getTree(params) {
  if (isMock) {
    return delayPms(getTreeM);
  }
  return request('daweb/getTree', {
    method: 'POST',
    body: params,
  });
}
