# Members

[埼玉大学プログラミングサークル Maximum](https://www.maximum.vc/) のメンバー情報を管理するためのリポジトリです。

## 目次

- [入会希望者のやること](#入会希望者のやること)
- [情報に変更が生じたときに行うこと](#情報に変更が生じたときに行うこと)
- [スキーマの変更時](#スキーマの変更時)
- [LICENSE](#license)

---

## 入会希望者のやること

Git / GitHub の操作に慣れてもらうため、入会希望者の方には以下の手順を行っていただきます。
わからない点があればどんどん調べ、適宜部員に質問してください！

> [!IMPORTANT]
> 以下の手順は、 GitHub をパソコンから操作することを前提としています。
> スマートフォンから操作する場合は少し異なる可能性があります。

### 1. GitHub アカウントを作成する

<https://github.com/signup> から、アカウントを作成することができます。
大学や Maximum 以外でも利用することがあるため、普段利用しているメールアドレスを設定し、ユーザー名を学籍番号等以外とすることを強く推奨します。

> [!WARNING]
> すでに GitHub アカウントを作成している場合はスキップしてください。
> 1 ユーザーが複数のアカウントを作成することは利用規約違反となる可能性があります。

### 2. Git の初期設定をする

> [!NOTE]
> すでに設定されている方はスキップしてください。

これ以降の操作を行うためには、 Git というソフトウェアが必要です。
Git は GitHub とは別物です (詳しくは省略します)。

インストールされているかどうかは、ターミナル (コマンドプロンプトなど) で以下のコマンドを実行して確認できます。

```bash
git --version
```

インストールされていない場合は、調べてインストールしてください。
いろいろな記事が出てきますが、ほとんどの内容が同じです。
インストールまで進めれば OK です。

インストールが終わったら、もう一度 `git --version` を実行して、バージョンが表示されることを確認してください。

次に、 Git の設定を行います。
以下のコマンドを適宜変えて実行してください。

```bash
git config --global user.name "Your Name"
git config --global user.email "Your Email"
```

なお、 **ここに設定した内容はすべて公開されます**。
もし公開したくない場合、名前を GitHub のユーザー名としておきましょう。
メールアドレスについては、 [GitHub の Email 設定](https://github.com/settings/emails) から確認できる `123456789+username@users.noreply.github.com` といった形式のメールアドレスを設定するとよいです。

### 3. このリポジトリをフォークする

この画面上部に「Fork」というボタンがあるので、それを押してください。
なお、ボタンを押すと別の画面に移動するので、このページを別のタブで開いておくことをおすすめします。

Owner はご自身のアカウント、 Repository name は任意の名前を入力してください。
Create fork というボタンを押すと、リポジトリが作成されます。<br>
「Create the `main` branch only」はチェックを入れても入れなくても構いません。
よくわからない場合はチェックを入れておいてください。

> [!TIP]
> このリポジトリに直接変更を加えることもできますが、「saitamau-maximum」メンバーではない場合、書き込み権限がありません。
> そのため、フォークして自分のアカウントにコピーを作成し、書き込み権限のある自分のコピーに書き込んでから、「プルリクエスト」という形で変更を加えることになります。

### 4. ローカルにリポジトリをクローンする

Fork したリポジトリを、自分のパソコンにダウンロードします。
この操作をクローン (Clone) と呼びます。<br>
(直接 GitHub 上で編集することも可能ですが、練習のためローカルにダウンロードしてみましょう)

ターミナルで保存したいディレクトリに移動した後、以下のコマンドを実行してください。

```bash
git clone <repository>
```

ここで、 `<repository>` は、フォーク後に表示される画面で「`<> Code`」ボタンを押し、 Local → HTTPS というタブを選択すると表示される URL です。
これをコピーして、 `<repository>` の部分に貼り付けてください。<br>
例えば、以下のようになります。

```bash
git clone https://github.com/saitamau-maximum/members.git
```

すると、 `members` というディレクトリが作成され、その中にリポジトリがダウンロードされます (もし Fork 段階で Repository name を変更した場合にはその名前になります)。

これで、手元でコードを編集する準備が整いました。

### 5. メンバー情報を追加する

新しくできた `members` ディレクトリの中に、 `members` というディレクトリがあります (ややこしいですが、すみません...)。

その中に、新しくファイルを作成してください。
ファイル名は、 `username.json` (`username` は GitHub のユーザー名) としてください。
内容は、以下のようにしてください。

```json
{
  "$schema": "../members.schema.json",
  "id": "123456789",
  "name": "username",
  "grade": ["21B"],
  "isActive": true
}
```

内容については以下のように書き換えてください。

- `$schema`: このまま
- `id`: [GitHub の Email 設定](https://github.com/settings/emails) から確認できる `123456789+username@users.noreply.github.com` といった形式のメールアドレスの、 `+` より前の部分
- `name`: GitHub のユーザー名
- `grade`: 入学した年度を記入。例えば 20 **21** 年度に学部 1 年生として入学した場合は `21B` となる。 `B` は Bachelor (学部生) の略。 `M` は Master (修士)、 `D` は Doctor (博士)。 21B かつ 25M の場合は、 `["21B", "25M"]` とする。
- `isActive`: `true` または `false` を記入。

よくわからなくなった場合は、ほかのメンバーのファイルも参考にするとよいでしょう。
間違えてしまっていても、後から修正することができるので、とりあえず書いてみましょう。

### 6. コミットする

コミットとは、ファイルの変更を記録することです。
コミットすることで、変更の履歴を確認したり、変更前に戻したりすることができます。

> [!TIP]
> Visual Studio Code などのエディタを使っている場合、コミットの操作はエディタ上で行うことができます。
> この場合コマンドを使う必要はありませんが、エディタを使えない場合に備えてぜひ覚えておきましょう！

まずは、コミットするファイルを選択します。
この操作をステージング (Staging) と呼びます。

```bash
git add <file>
```

ここで、 `<file>` は、先ほど作成した `username.json` です。
ファイルのパスを指定してあげる必要があるので、 `README.md` があるディレクトリで操作した場合は `members/username.json` としてください。

選択するファイルを間違えてしまった場合は、以下のコマンドでステージングを解除できます。

```bash
git reset <file>
```

次に、コミットを行います。
コミットする際には、変更内容を簡潔に記述する必要があります。
ここでは、 `feat: add json file of [username]` ( `[username]` は GitHub のユーザー名) としましょう。
(別にこれ以外でもよいですが)

```bash
git commit -m "feat: add json file of [username]"
```

これで、コミットが完了しました。

### 7. プッシュする

コミットした内容を、 GitHub にアップロードします。
この操作をプッシュ (Push) と呼びます。<br>
(より正確には、リモートの内容をローカルの内容で更新する操作を指し、アップロード先は GitHub に限られません)

```bash
git push
```

これで、 GitHub 上のリポジトリにファイルがアップロードされました。
実際にブラウザで確認することができます。

### 8. プルリクエストを作成する

プルリクエスト (Pull Request; PR) とは、リポジトリの管理者に対して、「ファイルを変更したから、変更を承認して取り込んでほしい！」というリクエストを送ることです。
今回の場合、自分のファイルを追加した変更を、このリポジトリに取り込んでもらうために、プルリクエストを作成します。

[GitHub 公式の Docs](https://docs.github.com/ja/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) があるので、ここでは概要だけ。

1. [saitamau-maximum/members](https://github.com/saitamau-maximum/members) にアクセスする
2. 画面上部にある「Pull Requests」タブを選択する
3. 「New pull request」ボタンを押す
4. 「compare across forks」をクリックする
5. 「base repository」に `saitamau-maximum/members`、 「base」に `main` が選択されていることを確認する
6. 「head repository」に `username/members`、 「compare」に `main` を選択する
7. 「Create pull request」ボタンを押す
8. タイトルと本文を入力する<br>
   タイトルは何でもよいですが、簡潔に変更内容を表すようにしましょう。<br>
   本文は、変更の理由や、変更内容の詳細を書くとよいです。今回は本文なしでも構いません。
9. 「Create pull request」ボタンを押す

これで、プルリクエストが作成されました。

### 9. 入会フォームを記入する

しばらくすると、自動でコメントがつきます。
このコメントには、入会フォームの URL が記載されています。
入会フォームには、学籍番号や氏名など、大学へ提出する書類に記載する必要のある情報を記入していただきます。

> [!TIP]
> 入会フォームに記入するには、埼玉大学の Microsoft アカウントが必要です。
> ログインしていない場合は、ログインを求められるので、ログインしてください。
> なお、埼玉大学生ではない場合など、 Microsoft アカウントを持っていない場合には、コメントでその旨を伝えてください。

### 10. 入金する

入会フォームに記入した後、サークル費をお振り込みください。
サークル費は月 250 円です。
詳しくは、プルリクエストについたコメントを確認してください。

### 11. プルリクエストをマージする

担当者が確認します。
確認が終了すると、変更依頼 (Change Request) もしくは 承認 (Approve) がされます。

もし変更依頼が届いたら、ファイルの内容がどこか間違っている可能性があります。
その場合は、指摘された内容を修正してください。
5 から 7 までの手順を再度繰り返してください。
プルリクエストは再度作成する必要はなく、自動的に更新されます。

承認されたらプルリクエストがマージ (変更内容が反映) されます！

### 12. リポジトリを削除する

プルリクエストがマージされたら、フォークしたリポジトリは不要になります。
残しておいてもよいですが、特に更新予定もないのであれば削除しておきましょう。

リポジトリを削除するには、以下の手順を行います。

1. 画面上部の「Settings」を選択する
2. 下にスクロールして、「Delete this repository」を選択する
3. リポジトリ名を入力して、削除を確認する

> [!WARNING]
> 削除したリポジトリは復元できません。
> マージされているかどうかをしっかり確認してから削除してください。

同様に、ローカルのリポジトリも削除して問題ありません。

---

## 情報に変更が生じたときに行うこと

メンバー情報に変更が生じた場合、上と同様の手順で変更を加えることができます。
あるいは、このリポジトリに直接ブランチを作成し、プルリクエストを作成することもできます。
どちらでも構いませんが、後者の場合は、以下の点に注意してください。

- 他者のブランチに変更を加えないようにする
- マージ後はブランチが削除されることに留意する

---

## スキーマの変更時

[checker/README.md](checker/README.md) を見てください。

## LICENSE

[MIT License](LICENSE)
