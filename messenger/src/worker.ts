import { App } from 'octokit';
import type { EventPayloadMap } from '@octokit/webhooks-types';

import type Env from './env';
import { generateMessagesForContinuing, generateMessagesForInvite, generateMessagesForNew } from './messages';
import { GithubRepository } from './repository';

// 2024 は GitHub Organization のチームの Slug です。毎年変更する必要があります。
const INVITE_TEAM = '2024';

export default {
  async fetch(request, env) {
    const req_url = new URL(request.url);

    // Do not respond other than /
    if (req_url.pathname !== '/') {
      return new Response('Not Found', { status: 404 });
    }

    // POST only
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    // Check if the required headers are set
    const headers = ['X-GitHub-Delivery', 'X-GitHub-Event', 'X-Hub-Signature-256'];
    for (const header of headers) {
      if (!request.headers.has(header)) {
        return new Response('Bad Request', { status: 400 });
      }
    }

    // Create App instance
    const APP_ID = '796157';
    const APP_PRIVKEY = atob(env.GH_APP_PRIVKEY);
    const app = new App({ appId: APP_ID, privateKey: APP_PRIVKEY, webhooks: { secret: env.WEBHOOK_SECRET } });

    app.webhooks.on('pull_request.opened', async ({ octokit, payload }) => {
      const sender = payload.sender.login;
      const repo = new GithubRepository(octokit, payload.number);

      const status = await repo.checkMemberStatus(sender);

      if (status === 'newbie') {
        // 新規入会者向けのタイトルに変更する
        await repo.updatePullRequestTitle(`入部届: ${sender}`);
        // 新規入会者向けメッセージを生成してコメントする
        const messages = generateMessagesForNew(payload);
        await repo.sendMessages(messages);
      }

      if (status === 'continuing') {
        // 継続者向けのタイトルに変更する
        await repo.updatePullRequestTitle(`継続届: ${sender}`);
        // 継続者向けメッセージを生成してコメントする
        const messages = generateMessagesForContinuing(payload);
        await repo.sendMessages(messages);
      }
    });

    app.webhooks.on('pull_request.closed', async ({ octokit, payload }) => {
      if (!payload.pull_request.merged) return;
      const sender = payload.pull_request.user.login;
      const repo = new GithubRepository(octokit, payload.number);
      const isTeamMember = await repo.checkMembershipInGithubOrganizationTeam(sender, INVITE_TEAM);

      if (isTeamMember) return;

      try {
        await repo.inviteToGithubOrganizationWithTeam(sender, INVITE_TEAM);
        const messages = generateMessagesForInvite(sender, INVITE_TEAM);
        await repo.sendMessages(messages);
      } catch (e) {
        console.error(e);
      }
    });

    const payload = await request.text();

    await app.webhooks.verifyAndReceive({
      id: request.headers.get('X-GitHub-Delivery') ?? "",
      name: (request.headers.get('X-GitHub-Event') ?? "") as keyof EventPayloadMap,
      signature: request.headers.get('X-Hub-Signature-256') ?? "",
      payload,
    });

    return new Response('Created', { status: 201 });
  },
} as ExportedHandler<Env>;
