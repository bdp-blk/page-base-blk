/**
 * @author samy
 * @email samyzhg#qq.com
 * @create date 2020-07-17 10:04:59
 * @modify date 2020-07-17 10:04:59
 * @desc service示例
 */
import request from '@/bdpcloud/utils/request';

export async function <%=method%>(params) {
  return request('smartweb/smartservice/<%=method%>', {
    method: 'POST',
    body: params,
  });
}
