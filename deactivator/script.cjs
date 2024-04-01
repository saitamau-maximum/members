const { resolve } = require("path")
const { readdirSync, readFileSync, writeFileSync } = require("fs")

// members のディレクトリパス
const membersDir = resolve(__dirname, "..", "members")
console.log(`Members directory: ${membersDir}`)

// members のディレクトリ内のファイル名を取得
const memberFiles = readdirSync(membersDir)

// それぞれのファイルについて処理する
for (const file of memberFiles) {
  // ファイルのパスを取得
  const filePath = resolve(membersDir, file)
  if (!filePath.endsWith(".json")) continue;
  
  console.log(`\nProcessing ${filePath}...`)

  // ファイルを読み込む
  const memberJsonContent = readFileSync(filePath, "utf-8")
  const memberJson = JSON.parse(memberJsonContent)
  console.log(`  Loaded JSON file: ${memberJson.name} (id: ${memberJson.id})`)

  // もしすでに active が false ならスキップ
  if (!memberJson.isActive) {
    console.log(`  ${memberJson.name} is already non-active, skipping...`)
    continue
  }

  // active を false にする
  memberJson.isActive = false

  // ファイルに書き込む
  const newMemberJsonContent = JSON.stringify(memberJson, null, 2)
  console.log(`  Writing to file...`)
  writeFileSync(filePath, newMemberJsonContent, "utf-8")

  console.log(`  Done!`)
}

console.log("\nAll done!")
