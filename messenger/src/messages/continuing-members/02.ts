import type { PullRequestOpenedEvent } from '@octokit/webhooks-types';

const message = (webhook: PullRequestOpenedEvent) => `
@saitamau-maximum/leaders
メンバーが継続申請を行いました。
以下のことを完了したら Approve をし、このプルリクエストをマージしてください。
上から順に行うことを想定しています。

- [ ] JSON ファイルの確認
  CI が通っているかで簡易的なチェックができる
  ID: \`${webhook.sender.id}\`
- [ ] 継続フォームの確認
  確認用文字列も含めて、入力内容が正しいかを確認する
- [ ] サークル費の振り込みの確認 (saitamau-maximum/accountants が行う)
`;

export default message;
