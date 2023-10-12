import axios from 'axios';
export function getLocalFile(localUrl:string) {
  // todo 写一个读取本地文件的接口
  return axios.get(localUrl);
}
