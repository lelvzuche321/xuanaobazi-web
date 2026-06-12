=== Cloudflare Worker 部署步骤（30秒完成） ===

1. 打开 https://dash.cloudflare.com/ 登录你的 Cloudflare 账号
   （没有账号的话，免费注册一个：https://dash.cloudflare.com/sign-up）

2. 左侧菜单 → Workers & Pages → 点击 "Create application"

3. 选择 "Create Worker" → 给 Worker 起个名字（如 solana-relay）

4. 点击 "Deploy" 按钮（先用默认代码部署）

5. 部署成功后，点击 "Edit code" 按钮

6. 把 relay.js 文件里的全部代码粘贴进去，替换掉默认代码

7. 点击右上角 "Deploy" 按钮

8. 复制你的 Worker URL（类似 https://solana-relay.你的用户名.workers.dev）

9. 打开 js/payment.js，找到第 14 行：
   var RELAY_URL = '';
   改成：
   var RELAY_URL = 'https://solana-relay.你的用户名.workers.dev';

10. 保存，重新打包上传你的网站即可。

=== 免费额度 ===
Cloudflare Workers 免费版：每天 10 万次请求，完全够用。