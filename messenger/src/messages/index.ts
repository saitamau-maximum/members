import { PullRequestOpenedEvent } from '@octokit/webhooks-types';

import message01forNew from './new-members/01';
import message02forNew from './new-members/02';
import message03forNew from './new-members/03';
import message01forContinuing from './continuing-members/01';
import message02forContinuing from './continuing-members/02';
import message03forContinuing from './continuing-members/03';

const generateMessagesForNew = (webhook: PullRequestOpenedEvent) =>
	[message01forNew, message02forNew, message03forNew].map((f) => f(webhook));

const generateMessagesForContinuing = (webhook: PullRequestOpenedEvent) =>
	[message01forContinuing, message02forContinuing, message03forContinuing].map((f) => f(webhook));

const generateMessagesForInvite = (sender: string, inviteTeam: string) => {
	return [
		`
@${sender} さんを Maximum の GitHub Organization (Team: ${inviteTeam}) に招待しました！
[通知一覧ページ](https://github.com/notifications) (右上のベルマーク) から通知を確認し、招待を受けてください。

通知が届いていない場合は GitHub に登録したメールアドレスに招待が届いているか確認し、それでも招待が届いていない場合はここのコメントに書いてください！

招待を受けると、会員専用サイト (https://members.maximum.vc/) にログインできるようになります。
ここに Discord の招待リンクがあるので、そちらから Discord に参加してください！
`.trim(),
	];
};

export { generateMessagesForNew, generateMessagesForContinuing, generateMessagesForInvite };
