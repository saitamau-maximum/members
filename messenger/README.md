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

## 関係する人へ

定期的に Cloudflare から members-welcome-messenger の環境変数 `GH_TOKEN` を更新してください。
ここから Token が見れます: <https://github.com/organizations/saitamau-maximum/settings/personal-access-tokens/active>
