# Messenger

新規メンバーの PR に対して、自動でメッセージを送信するやつ。
Cloudflare Workers で動作します。

## 仕組み

Webhook で GitHub からの通知を受け取り、 PR に対してコメントを送信する

## なぜ必要？ Actions でやればいいじゃん

Actions では、 Fork に対して Token がちゃんと渡らないので、 `GITHUB_TOKEN` が使えない。
(例えば、悪意のある人が Actions 書き換えて Token を外部サイトに送信するとかが考えられますね)

しかし、このリポジトリでは Fork からの PR でもコメントを追加できるようにしたい！
ということで、 Webhook を介してコメントを追加するようにした。

## 要件メモ

- `POST /` のみに反応する
- ちゃんと Webhook の署名を確認する (<https://docs.github.com/ja/webhooks/using-webhooks/validating-webhook-deliveries>)
- PR が Open したときにコメントを送信する
- 新規入会者向けにメッセージを送信する
  - 現在の判定ロジック: main ブランチに `{sender}.json` が存在しないこと
- 継続者向けにメッセージを送信する
  - 現在の判定ロジック: main ブランチに `{sender}.json` が存在していて、main ブランチ内で isActive が false になっていること

## 関係する人へ

<https://github.com/organizations/saitamau-maximum/settings/apps/maximum-welcome-bot>

Private Key の SHA256: `GrNGFiMen10Wj1/qyuHR6xaMIz4TioYPWbXnuVFjHko=`

1. `.dev.vars` に環境変数を書く

   ```plaintext
   GH_APP_PRIVKEY="..."
   WEBHOOK_SECRET="..."
   ```

   Private Key は `openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in INPUT_FILE | openssl base64 -A` でデコードしたもの

2. `gh webhook forward --repo=members --org=saitamau-maximum --events=pull_request --url="http://localhost:8787" --secret="WEBHOOK_SECRET"` で Webhook を Local Forward
   (GitHub docs: <https://docs.github.com/ja/webhooks/testing-and-troubleshooting-webhooks/using-the-github-cli-to-forward-webhooks-for-testing>)
3. `pnpm start`
