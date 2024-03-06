import { PullRequestOpenedEvent } from '@octokit/webhooks-types';

// JST 対応にするためちょっとめんどくさいことをしてる
const now_jst = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
const month = parseInt(now_jst.split('/')[1], 10);
const remaining_month = 12 - ((month - 4 + 12) % 12);
// ↑
// 4 月: 12 - (4 - 4 + 12) % 12 = 12 - 0 = 12
// 5 月: 12 - (5 - 4 + 12) % 12 = 12 - 1 = 11
// ...
// 12 月: 12 - (12 - 4 + 12) % 12 = 12 - 8 = 4
// 1 月: 12 - (1 - 4 + 12) % 12 = 12 - 9 = 3
// 2 月: 12 - (2 - 4 + 12) % 12 = 12 - 10 = 2
// 3 月: 12 - (3 - 4 + 12) % 12 = 12 - 11 = 1

// サークル費は 250 円/月
const cost = 250 * remaining_month;

const message = (webhook: PullRequestOpenedEvent) => `
こんにちは、 @${webhook.sender.login} さん！
入会申請ありがとうございます！

以下のリンクが入会フォームとなります。
このフォームに必要事項を記入して、送信をお願いします！
なお、確認用の文字列として、以下の文字列を入力してください。

\`\`\`plaintext
${webhook.pull_request.head.sha}
\`\`\`

<https://forms.office.com/r/Pnq5kU29xL>

また、入会フォームの送信後に、下記口座にサークル費 ${cost} 円を振り込んでください。
振込名義は、入会フォームで入力した名前としてください。
(月 250 円 × ${remaining_month} ヶ月分、手数料は自己負担となります)

- 青木信用金庫
- 支店名: 埼大通支店
- 預金種目: 普通
- 口座番号: 3456237

担当者が確認後、諸手続きを行った後に Discord サーバーへの招待を行います。
それまでお待ちください。

以上、よろしくお願いします！

> [!IMPORTANT]
> 担当者からコメントが付くので、通知を見逃さないようにお願いします！
> 必要であれば、 [GitHub の設定](https://github.com/settings/notifications) からメールを受け取るようにしておくことをおすすめします。
`;

export default message;
