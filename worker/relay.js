/**
 * Cloudflare Worker - Solana RPC Relay
 * 部署到 Cloudflare Workers 后，将 worker URL 填入 payment.js 的 RELAY_URL
 * 
 * 部署步骤：
 * 1. 打开 https://dash.cloudflare.com/ 登录
 * 2. 左侧菜单 → Workers & Pages → Create application → Create Worker
 * 3. 给 Worker 起个名字（如 solana-relay），点击 Deploy
 * 4. 点击 Edit code，把本文件内容全部粘贴进去，点击 Deploy
 * 5. 复制 Worker URL（如 https://solana-relay.你的用户名.workers.dev）
 * 6. 将 URL 填入 payment.js 顶部的 RELAY_URL 变量
 */

export default {
    async fetch(request) {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Max-Age': '86400'
                }
            });
        }

        if (request.method !== 'POST') {
            return new Response('Method not allowed', { status: 405 });
        }

        const RPC_URLS = [
            'https://solana-rpc.publicnode.com',
            'https://api.mainnet-beta.solana.com'
        ];

        const body = await request.text();

        for (const rpcUrl of RPC_URLS) {
            try {
                const response = await fetch(rpcUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: body
                });
                if (response.ok) {
                    const data = await response.json();
                    return new Response(JSON.stringify(data), {
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                }
            } catch (e) {
                // Try next RPC
            }
        }

        return new Response(JSON.stringify({ error: 'All RPCs failed' }), {
            status: 502,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
};