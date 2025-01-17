import type { PullRequestOpenedEvent } from '@octokit/webhooks-types';

const message = (_webhook: PullRequestOpenedEvent) => `
@saitamau-maximum/accountants
サークル費の振り込みが完了したことを確認したら、このプルリクエストに Approve をしてください。
`;

export default message;
