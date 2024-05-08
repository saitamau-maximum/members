import { App } from 'octokit';

export class GithubRepository {
	readonly owner = 'saitamau-maximum';
	readonly repo = 'members';
	readonly octokit: App['octokit'];
	readonly issue_number: number;

	constructor(octokit: App['octokit'], issue_number: number) {
		this.octokit = octokit;
		this.issue_number = issue_number;
	}

	// main ブランチに /data/{sender}.json が存在していて、isActive が false なら継続者(continuing)である。
	// main ブランチに /data/{sender}.json が存在していて、isActive が true なら更新なし(no-updates)である。
	// main ブランチに /data/{sender}.json が存在していない場合は新規入会者(newbie)である。
	async checkMemberStatus(sender: string) {
		try {
			const res = await this.octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
				owner: this.owner,
				repo: this.repo,
				path: `data/${sender}.json`,
			});

			if (!Array.isArray(res.data) && res.data.type === 'file') {
				const jsonContent = JSON.parse(atob(res.data.content));
				if (!jsonContent.isActive) {
					return 'continuing' as const;
				}
			}
			return 'no-updates' as const;
		} catch (e) {
			return 'newbie' as const;
		}
	}

	// Pull Request にメッセージを送信する
	async sendMessages(messages: string[]) {
		for (const message of messages) {
			await this.octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', {
				owner: this.owner,
				repo: this.repo,
				issue_number: this.issue_number,
				body: message,
			});
		}
	}

	// Pull Request のタイトルを更新する
	async updatePullRequestTitle(title: string) {
		await this.octokit.request('PATCH /repos/{owner}/{repo}/issues/{issue_number}', {
			owner: this.owner,
			repo: this.repo,
			issue_number: this.issue_number,
			title,
		});
	}

	// Github Organization Teamにメンバーを招待する
	async inviteToGithubOrganizationWithTeam(username: string, teamSlug: string) {
		await this.octokit.request('PUT /orgs/{org}/teams/{team_slug}/memberships/{username}', {
			org: 'saitamau-maximum',
			team_slug: teamSlug,
			username,
		});
	}

	// Github Organization Teamにメンバーが所属しているか確認する
	async checkMembershipInGithubOrganizationTeam(username: string, teamSlug: string) {
		try {
			await this.octokit.request('GET /orgs/{org}/teams/{team_slug}/memberships/{username}', {
				org: 'saitamau-maximum',
				team_slug: teamSlug,
				username,
			});
			return true;
		} catch (e) {
			return false;
		}
	}
}
