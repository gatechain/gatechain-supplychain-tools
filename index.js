const { Transaction, Message, Fee } = require('./lib/index');

const { requestGet, requestPost } = require('./request');

// Get GateChain block info
const uri = "https://api.gatenode.cc/v1/";

const blockInfoRoute = 'block/latest';
const broadcastRoute = 'tx';

// Initialize params
let params = {
    // Chain
    chainId: 'mainnet',
    // Network
    network: 'mainnet',
    // Anti-fake information
    memo: '防伪溯源信息:\n\n商品名称: 茅台飞天酒 42°\n\n商品生产日期: 2010-10-10 10:10:10\n\n商品价格: ￥1010\n\n商品生产厂商:贵州茅台酒厂'
};

// from address
const from = 'gt11l56tlsx9klnaqpscvsvder38jm7z472az0mly7petj29t5r3xcluuxukw68ry5jyk2slxc';

// to address
const to = 'gt11t0vp0j4qxny3lec26qrdn28sdzz90usfpu344krd77r8vq6gtgwazh59ks7dtyj99tfsug';

// default transaction symbol
const symbol = 'NANOGT';

/**
 * From address private Key  (It's very important. Please keep it safe.)
 *
 * @desc Used when signing transactions.
 *
 * @type {string}
 */
const privateKey = '30527a5faf004ddfc24ece160c82d91dde7dc2e6d1dbd40726ec397178ba3b47';

// Request API (get)
requestGet(uri + blockInfoRoute).then(function (res) {
    // parsing block json string
    let json = JSON.parse(res);

    // get latest block height
    const height = parseInt(json.height);

    // set valid height range
    params.validHeight = [
        height,
        height + 200,
    ];

    // new Transaction object
    let tx = new Transaction(params);

    // build message
    let msg = Message.buildMsgSend(from, to, 1, symbol);
    tx.addMsg(msg);

    // set tx fee
    let fee = Fee.build(300000, 10000000, symbol);
    tx.setFee(fee);

    // sign transaction
    tx.sign(privateKey);

    // final data
    const txData = {
        type: "StdTx",
        value: tx.toObject()
    };

    console.log(JSON.stringify(txData))

    // // broadcast transaction
    // requestPost(uri + broadcastRoute, txData).then(function (res) {
    //     // console.log('broadcast transaction success');
    //     console.log('transaction hash: ', res.txhash);
    //     console.log('result', res);
    // }).catch(function (err) {
    //     console.log('error: ', err);
    // });

}).catch(function (err) {
    console.log('error: ', err);
});
