import type { PullRequestOpenedEvent } from '@octokit/webhooks-types';

const message = (webhook: PullRequestOpenedEvent) => `
@saitamau-maximum/leaders
新しいメンバーが入会申請を行いました。
以下のことを完了したら Approve をし、このプルリクエストをマージしてください。
上から順に行うことを想定しています。

- [ ] JSON ファイルの確認
  CI が通っているかで簡易的なチェックができる
  ID: \`${webhook.sender.id}\`
- [ ] 入会フォームの確認
  確認用文字列も含めて、入力内容が正しいかを確認する
- [ ] サークル費の振り込みの確認 (saitamau-maximum/accountants が行う)
- [ ] GitHub への招待
  Org -> Teams -> 年度のチーム -> Add a member
- [ ] Discord への招待
  コメントで行う、有効期限は 1 day, 1 use とすべき
`;

export default message;
