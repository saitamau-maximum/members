import { PullRequestOpenedEvent } from '@octokit/webhooks-types';

import message01 from './01';
import message02 from './02';
import message03 from './03';

const generateMessages = (webhook: PullRequestOpenedEvent) => [message01, message02, message03].map((f) => f(webhook));

export default generateMessages;
