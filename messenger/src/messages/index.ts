import { PullRequestOpenedEvent } from '@octokit/webhooks-types';

import message01forNew from './new-members/01';
import message02forNew from './new-members/02';
import message03forNew from './new-members/03';

const generateMessagesForNew = (webhook: PullRequestOpenedEvent) =>
	[message01forNew, message02forNew, message03forNew].map((f) => f(webhook));

export { generateMessagesForNew };
