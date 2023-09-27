/*
下载联通加速app，并开通会员
抓包game.wostore.cn域名里面的authorization
变量设置
export woGameAuth="复制authorization值到这里"
多账号换行隔开
定时：0 2 0,12 * * *
*/

const axios = require('axios');

async function processAccounts() {
  const woGameAuthArray = process.env.woGameAuth.split('\n');
  
  for (let i = 0; i < woGameAuthArray.length; i++) {
    const authorization = woGameAuthArray[i];
    
    try {
      // Reset QoS Speed
      const resetResponse = await axios.post("https://game.wostore.cn/api/app/user/qosSpeedUp/add", {
        firstTime: '00:00-12:00',
        secondTime: '12:00-23:59',
      }, {
        headers: {
          'Host': 'game.wostore.cn',
          'channelid': 'GAMELTJS_10002',
          'Accept': 'application/json',
          'Authorization': authorization,
          'Content-Type': 'application/json;charset=utf-8',
          'versioncode': '4014',
          'User-Agent': 'GloudGame/68 CFNetwork/1390 Darwin/22.0.0',
          'Connection': 'keep-alive',
          'device': '2',
        }
      });
      
      if (resetResponse.data.code === 200) {
        console.log(`账号 ${i + 1} 重置时间成功`);
      } else {
        console.log(`账号 ${i + 1} 重置时间失败: ${resetResponse.data.msg}`);
      }
      
      // Start QoS
      const startResponse = await axios.post('https://game.wostore.cn/api/app/user/v3/qos/start', {
        channelId: 'GAMELTJS_10002',
        privateIp: '10.0.217.189'
      }, {
        headers: {
          'Host': 'game.wostore.cn',
          'channelid': 'GAMELTJS_10002',
          'Accept': 'application/json',
          'Authorization': authorization,
          'Content-Type': 'application/json;charset=utf-8',
          'versioncode': '4014',
          'User-Agent': 'GloudGame/68 CFNetwork/1390 Darwin/22.0.0',
          'Connection': 'keep-alive',
          'device': '2',
        }
      });
      
      if (startResponse.data.code === 200) {
        console.log(`账号 ${i + 1} 开启加速成功`);
      } else {
        console.log(`账号 ${i + 1} 开启加速失败: ${startResponse.data.msg}`);
      }
    } catch (error) {
      console.error(`账号 ${i + 1} 请求出错:`, error);
    }
  }
}

(async () => {
  await processAccounts();
})();
