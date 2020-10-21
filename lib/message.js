'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Type = {
    MsgSend: 'MsgSend',
    MsgCreateVault: 'MsgCreateVault',
    MsgRevocableSend: 'MsgRevocableSend',
    MsgRevoke: 'MsgRevoke',
    MsgUpdateClearingHeight: 'MsgUpdateClearingHeight',
    MsgClearVaultAccount: 'MsgClearVaultAccount',
    MsgPublishMultiSigAccount: 'MsgPublishMultiSigAccount',
    MsgDelegate: 'MsgDelegate',
    MsgUndelegate: 'MsgUndelegate',
    MsgWithdrawDelegationReward: 'MsgWithdrawDelegationReward',
    MsgBeginRedelegate: 'MsgBeginRedelegate',

    MsgTrade: 'MsgDexTrade',
    MsgDexDeposit: 'MsgDexDeposit'
};

var Message = function () {
    function Message() {
        _classCallCheck(this, Message);
    }

    _createClass(Message, null, [{
        key: 'buildMsgSend',
        value: function buildMsgSend(from, to, amount, denom) {
            return {
                type: Type.MsgSend,
                value: {
                    amount: [{
                        amount: amount + '',
                        denom: denom
                    }],
                    from_address: from,
                    to_address: to
                }
            };
        }
    }, {
        key: 'buildMsgCreateVault',
        value: function buildMsgCreateVault(from, to, securityAddress, amount, denom, clearHeight, delayHeight, pubKey) {
            return {
                type: Type.MsgCreateVault,
                value: {
                    amount: [{
                        amount: amount + '',
                        denom: denom
                    }],
                    clearing_height: clearHeight + '',
                    delay_height: delayHeight + '',
                    from_address: from,
                    pubkey: pubKey || '',
                    security_address: securityAddress,
                    to_address: to
                }
            };
        }
    }, {
        key: 'buildMsgRevocableSend',
        value: function buildMsgRevocableSend(from, to, amount, denom) {
            return {
                type: Type.MsgRevocableSend,
                value: {
                    amount: [{
                        amount: amount + '',
                        denom: denom
                    }],
                    from_address: from,
                    to_address: to
                }
            };
        }
    }, {
        key: 'buildMsgRevoke',
        value: function buildMsgRevoke(vaultAddress, securityAddress, revokeAddress, height, txHash, msgIndex, amount, denom) {
            return {
                type: Type.MsgRevoke,
                value: {
                    amount: [{
                        amount: amount + '',
                        denom: denom
                    }],
                    vault_address: vaultAddress,
                    security_address: securityAddress,
                    revoke_address: revokeAddress,
                    height: height,
                    tx_hash: txHash,
                    msg_index: msgIndex
                }
            };
        }
    }, {
        key: 'buildMsgUpdateClearingHeight',
        value: function buildMsgUpdateClearingHeight(vaultAddress, clearHeight) {
            return {
                type: Type.MsgUpdateClearingHeight,
                value: {
                    clearing_height: clearHeight + '',
                    vault_address: vaultAddress
                }
            };
        }
    }, {
        key: 'buildMsgClearVaultAccount',
        value: function buildMsgClearVaultAccount(from, vaultAddress) {
            return {
                type: Type.MsgClearVaultAccount,
                value: {
                    from_address: from,
                    vault_address: vaultAddress
                }
            };
        }
    }, {
        key: 'buildMsgTrade',
        value: function buildMsgTrade(trade) {
            return {
                type: Type.MsgTrade,
                value: {
                    Trade: {
                        tradeId: trade.tradeId,
                        market: trade.market,
                        makerOrderId: trade.makerOrderId,
                        makerPubKey: trade.makerPubKey,
                        makerSide: trade.makerSide,
                        makerCoin: {
                            denom: trade.makerCoin.denom,
                            amount: trade.makerCoin.amount
                        },
                        makerPrice: {
                            denom: trade.makerPrice.denom,
                            amount: trade.makerPrice.amount
                        },
                        makerSign: trade.makerSign,
                        makerTime: trade.makerTime,
                        takerOrderId: trade.takerOrderId,
                        takerPubKey: trade.takerPubKey,
                        takerSide: trade.takerSide,
                        takerAmount: {
                            denom: trade.takerAmount.denom,
                            amount: trade.takerAmount.amount
                        },
                        takerPrice: {
                            denom: trade.takerPrice.denom,
                            amount: trade.takerPrice.amount
                        },
                        takerSign: trade.takerSign,
                        takerTime: trade.takerTime,
                        price: {
                            denom: trade.price.denom,
                            amount: trade.price.amount
                        },
                        amount: {
                            denom: trade.amount.denom,
                            amount: trade.amount.amount
                        },
                        makerAddAmount: {
                            denom: trade.makerAddAmount.denom,
                            amount: trade.makerAddAmount.amount
                        },
                        makerDelAmount: {
                            denom: trade.makerDelAmount.denom,
                            amount: trade.makerDelAmount.amount
                        },
                        makerFee: {
                            denom: trade.makerFee.denom,
                            amount: trade.makerFee.amount
                        },
                        takerFee: {
                            denom: trade.takerFee.denom,
                            amount: trade.takerFee.amount
                        },
                        time: trade.time,
                        sender: trade.sender
                    }
                }
            };
        }
    }, {
        key: 'buildMsgDexDeposit',
        value: function buildMsgDexDeposit(from, to, amount, denom) {
            return {
                type: Type.MsgDexDeposit,
                value: {
                    Deposit: {
                        amount: [{
                            amount: amount + '',
                            denom: denom
                        }],
                        from: from,
                        to: to
                    }
                }
            };
        }
    }, {
        key: 'buildMsgPublishMultiSigAccount',
        value: function buildMsgPublishMultiSigAccount(from, to, pubKey) {
            return {
                type: Type.MsgPublishMultiSigAccount,
                value: {
                    from_address: from,
                    to_address: to,
                    pubkey: pubKey
                }
            };
        }
    }, {
        key: 'buildMsgDelegate',
        value: function buildMsgDelegate(delegator, conAddress, amount, denom) {
            return {
                type: Type.MsgDelegate,
                value: {
                    amount: {
                        amount: amount + '',
                        denom: denom
                    },
                    delegator_address: delegator,
                    'con-account_address': conAddress
                }
            };
        }
    }, {
        key: 'buildMsgUndelegate',
        value: function buildMsgUndelegate(delegator, conAddress, amount, denom) {
            return {
                type: Type.MsgUndelegate,
                value: {
                    amount: {
                        amount: amount + '',
                        denom: denom
                    },
                    delegator_address: delegator,
                    'con-account_address': conAddress
                }
            };
        }
    }, {
        key: 'buildMsgWithdrawDelegationReward',
        value: function buildMsgWithdrawDelegationReward(delegator, conAddress) {
            return {
                type: Type.MsgWithdrawDelegationReward,
                value: {
                    delegator_address: delegator,
                    'con-account_address': conAddress
                }
            };
        }
    }, {
        key: 'buildMsgBeginRedelegate',
        value: function buildMsgBeginRedelegate(delegator, conAddressSrc, conAddressDst, amount, denom) {
            return {
                type: Type.MsgBeginRedelegate,
                value: {
                    amount: {
                        amount: amount + '',
                        denom: denom
                    },
                    delegator_address: delegator,
                    'con-account_src_address': conAddressSrc,
                    'con-account_dst_address': conAddressDst
                }
            };
        }
    }]);

    return Message;
}();

Message.Type = Type;

exports.default = Message;