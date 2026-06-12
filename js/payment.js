/**
 * Payment Module - Solana USDT (SPL Token) Verification
 * 支付模块 - Solana 链 USDT 验证
 * 
 * ★ 部署前必须：先部署 Cloudflare Worker（worker/relay.js），
 *   然后将 Worker URL 填入下方 RELAY_URL
 */
const PaymentModule = (function() {
    'use strict';

    // ★★★ 部署 Worker 后把下面这行改成你的 Worker URL ★★★
    var RELAY_URL = 'https://solana-relay.103161470.workers.dev/';

    var WALLET_ADDRESS = 'DQyTeD9vr3WCAgWBsggQSGc1UXEgTD49csTcFgzcTBGH';
    var USDT_MINT = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB';
    var REQUIRED_AMOUNT = 8;
    var FETCH_TIMEOUT = 30000;

    var STORAGE_KEY = 'xuanaobazi_unlocked';
    var TX_HASH_KEY = 'xuanaobazi_txhash';

    function isUnlocked() {
        return localStorage.getItem(STORAGE_KEY) === 'true';
    }

    function getStoredTxHash() {
        return localStorage.getItem(TX_HASH_KEY);
    }

    function unlock(txHash) {
        localStorage.setItem(STORAGE_KEY, 'true');
        localStorage.setItem(TX_HASH_KEY, txHash);
    }

    function fetchWithTimeout(url, options, timeout) {
        timeout = timeout || FETCH_TIMEOUT;
        var controller = new AbortController();
        var timer = setTimeout(function() { controller.abort(); }, timeout);
        return fetch(url, Object.assign({}, options, { signal: controller.signal }))
            .finally(function() { clearTimeout(timer); });
    }

    async function rpcCall(url, body) {
        var response = await fetchWithTimeout(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            throw new Error('HTTP ' + response.status);
        }
        return response.json();
    }

    async function verifyTransaction(txHash) {
        if (isUnlocked() && getStoredTxHash() === txHash) {
            return { success: true, message: 'Already verified' };
        }

        var rpcBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getTransaction',
            params: [txHash, {
                encoding: 'jsonParsed',
                maxSupportedTransactionVersion: 0,
                commitment: 'confirmed'
            }]
        };

        // If Worker relay is configured, use it exclusively (direct RPCs blocked by CORS)
        if (RELAY_URL) {
            try {
                var data = await rpcCall(RELAY_URL, rpcBody);

                if (data.error) {
                    return {
                        success: false,
                        message: 'Transaction not found on Solana. Please double-check your TxID and ensure the transaction is confirmed. (RPC: ' + (data.error.message || JSON.stringify(data.error)) + ')'
                    };
                }

                if (!data.result) {
                    return {
                        success: false,
                        message: 'Transaction not found on chain. It may take 30-60 seconds for Solana to confirm. Please wait and try again.'
                    };
                }

                var checkResult = checkTransaction(data.result, txHash);
                if (checkResult) return checkResult;

                return {
                    success: false,
                    message: 'Transaction found but no USDT payment to our wallet detected. Please verify you sent 8 USDT to the correct address on Solana network.'
                };
            } catch (e) {
                if (e.name === 'AbortError') {
                    return { success: false, message: 'Request timed out. Please check your network and try again.' };
                }
                return { success: false, message: 'Worker relay is unreachable. Please ensure the Cloudflare Worker is deployed correctly. Error: ' + (e.message || 'network') };
            }
        }

        // No relay configured - try direct RPCs (will fail from browser due to CORS)
        return {
            success: false,
            message: 'Payment verification requires the Cloudflare Worker relay. Please deploy the worker (see worker/relay.js) and update RELAY_URL in payment.js.'
        };
    }

    function checkTransaction(tx, txHash) {
        var meta = tx.meta;
        if (!meta) return null;

        // Check token balances
        if (meta.postTokenBalances && meta.postTokenBalances.length > 0) {
            for (var i = 0; i < meta.postTokenBalances.length; i++) {
                var postBal = meta.postTokenBalances[i];
                if (postBal.mint === USDT_MINT && postBal.owner === WALLET_ADDRESS) {
                    var preBal = null;
                    if (meta.preTokenBalances) {
                        for (var j = 0; j < meta.preTokenBalances.length; j++) {
                            if (meta.preTokenBalances[j].mint === USDT_MINT &&
                                meta.preTokenBalances[j].owner === WALLET_ADDRESS) {
                                preBal = meta.preTokenBalances[j];
                                break;
                            }
                        }
                    }
                    var postAmount = postBal.uiTokenAmount ? (postBal.uiTokenAmount.uiAmount || 0) : 0;
                    var preAmount = preBal && preBal.uiTokenAmount ? (preBal.uiTokenAmount.uiAmount || 0) : 0;
                    var diff = postAmount - preAmount;

                    if (diff >= REQUIRED_AMOUNT * 0.99) {
                        unlock(txHash);
                        return { success: true, amount: diff, message: 'Payment verified' };
                    } else if (diff > 0 && diff < REQUIRED_AMOUNT * 0.99) {
                        return { success: false, message: 'Insufficient amount. Received ' + diff.toFixed(2) + ' USDT, but ' + REQUIRED_AMOUNT + ' USDT is required.' };
                    }
                }
            }
        }

        // Check parsed instructions
        if (tx.transaction && tx.transaction.message && tx.transaction.message.instructions) {
            var instructions = tx.transaction.message.instructions;
            for (var k = 0; k < instructions.length; k++) {
                var inst = instructions[k];
                if (inst.parsed && inst.parsed.type === 'transferChecked') {
                    var info = inst.parsed.info;
                    if (info.mint === USDT_MINT && info.destination === WALLET_ADDRESS) {
                        var amount = info.tokenAmount ? (info.tokenAmount.uiAmount || 0) : 0;
                        if (amount >= REQUIRED_AMOUNT * 0.99) {
                            unlock(txHash);
                            return { success: true, amount: amount, message: 'Payment verified' };
                        }
                    }
                }
            }
        }

        return null;
    }

    return {
        WALLET_ADDRESS: WALLET_ADDRESS,
        USDT_MINT: USDT_MINT,
        REQUIRED_AMOUNT: REQUIRED_AMOUNT,
        isUnlocked: isUnlocked,
        verifyTransaction: verifyTransaction,
        unlock: unlock,
        getStoredTxHash: getStoredTxHash
    };
})();