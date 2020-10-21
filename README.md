# 防伪溯源使用文档

### 背景介绍
区块链具有不可篡改的特性，可以借助此特性，把一些信息写到区块链上，以达到防伪溯源的目的。


### 准备工作
**1. 使用钱包 获取账户地址**

客户端钱包下载地址: https://www.gatechain.io/wallets

钱包使用文档: https://www.gatechain.io/docs/cn/gatechain-wallet.html

下载好钱包后， 需要创建一个单签账户 > 普通账户，并复制记录 账户地址。

**2. 申请Secret_Key**

此密钥用于调用API， 获取区块链防伪溯源信息时使用。

申请方式: 
- 需要把`账户地址`、` 合作方信息`、`防伪溯源信息前缀` 提供给 GateChain 工作人员， 添加到后台程序中， 生成Secret Key。

**3. SDK准备**

提供了JS版 的 示例程序 js-sdk.zip。JS 程序 使用 NodeJS 语言编写.

示例程序执行准备：
```
# 安装Npm 或 Yarn 

# 示例程序目录下 
cd js-sdk

npm install 
# 等待命令执行完毕即可
```

修改index.js中的配置：
```
# 需要修改的参数为:
const from = '发送方地址';
const to = '接收方地址';
const privateKey = '发送方私钥';
memo: '防伪溯源信息前缀'   # 信息需要以 防伪溯源信息前缀 字符串为开头。
```

`发送方地址`为第一步创建好的“普通账户”的地址，“发送方私钥”可在客户端钱包里查找。

查找方式如下：
- 在客户端钱包中，点击“单签账户”找到右上角的按钮。

![Account Setting](./html/images/443671a9-14ec-40f0-8e8b-1663fb9b80dd.png?raw=true)

- 在账户详情中，可以查看该账户的私钥，复制并妥善保管它。
![Find Private Key](./html/images/c1435ecc-0bc8-4d82-9bb5-ef5e27f91fa1.png?raw=true)

**4. 网页如何使用SDK**

SDK 使用的是 NodeJS 语言开发的。 是基于 ES6 协议的。
网页不支持 require, import 等语法。 所以，需要转换成网页可识别的语言。

安装 Node 指令
```
#全局安装
npm i browserify -g
```

转换NodeJS SDK 为网页可识别语言
```
#转换NodeJS SDK 并 统一调用入口。
browserify lib/index.js --standalone Dist -o dist/dist.js
```

网页使用
```javascript
<script type="text/javascript" src="dist/dist.js"></script>
<script>
// 与 index.js 用法一致
let tx = new Dist.Transaction({ ... });
</script>
```

### 发送交易

将 账户地址， 账户私钥， 接收地址 (可新建一个账户用作接收地址)  防伪溯源信息 修改之后,  执行 index.js 即可上链。
`node index.js`

**注意事项：**
- 每笔交易大约消耗0.01GT，所以发送方账户中需要保持足够的余额，避免交易发送失败。
- 由于区块链的分布式存储的特性，防伪溯源信息 不会立马被记录在 区块链上， 需要等待 最长30秒 的时间。


### 查询信息

**调用API查询交易详情**

接口地址：https://explorer.gatechain.io/partner/api/info

请求方式： `POST`

传参格式： `x-www-form-urlencode`

请求参数：

| 参数名称 | 参数类型 | 参数描述 |
| :---: | :---:  | :---: |
| secret_key | string | 请求私钥 |
| hash | string | 交易HASH |

请求结果 (成功)：
```javascript
{
    "code": "0",
    "status": "success",
    "msg": "",
    "data": {
        "partner_name": "合作方名称",
        "partner_desc": "合作方描述",
        "partner_address": "合作方地址",
        "valid_start_time": "合作方起始有效期",
        "valid_end_time": "合作方截止有效期",
        "hash": "交易hash",
        "height": "交易所处的区块链高度",
        "timestamp": 1602734509, // 区块链交易时间戳
        "date_time": "2020-10-15 12:01:49", // 区块链交易时间
        "tx_result": 1, // 区块链结果  1 成功 0 失败
        "memo": "--" // 防伪溯源信息
    }
}
```

错误码：

|错误码|错误说明|
|:---:|:---:|
|-1|缺少参数 - 未传递必要的参数|
|-2|参数错误 - 传递了不正确的参数|
|0|成功|

### 查看防伪溯源信息 (网页)

页面链接地址格式为：https://explorer.gatechain.io/partner/tx/ `[HASH地址]`

例如：https://explorer.gatechain.io/partner/tx/IRREVOCABLEPAY-9DC7B3C5FF8BBAA270F90A0B02596850EFB5822F9C004AAE9FA958DE143676F2601066CEAC1E56003747DC41B6EE1A21
