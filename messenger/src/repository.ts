import { App } from 'octokit';

export class GithubPullRequestRepository {
	readonly owner = 'saitamau-maximum';
	readonly repo = 'members';
	readonly octokit: App['octokit'];
	readonly issue_number: number;

	constructor(octokit: App['octokit'], issue_number: number) {
		this.octokit = octokit;
		this.issue_number = issue_number;
	}

	// main ブランチに /members/{sender}.json が存在していて、isActive が false なら継続者である。
	// そうでない場合は新規入会者である。
	async isNewbie(sender: string) {
		try {
			const res = await this.octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
				owner: this.owner,
				repo: this.repo,
				path: `members/${sender}.json`,
			});

			if (!Array.isArray(res.data) && res.data.type === 'file') {
				const jsonContent = JSON.parse(atob(res.data.content));
				return !jsonContent.isActive;
			}
		} catch (e) {
			return true;
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
}
