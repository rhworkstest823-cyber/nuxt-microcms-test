---
name: git-workflow
description: nuxt-microcms（Nuxt 4 + microCMS SSG）プロジェクトのGitワークフロー、コミット規約、Lint/ビルド確認、デプロイ連携のルール。ブランチ作成・コミット・push・PR作成・マージ・Lint実行を行う際は必ず参照すること。
---

# Git Workflow

## 1. ブランチ運用

| ブランチ | 役割 |
|---|---|
| `master` | 本番相当。直接コミット禁止。`develop` からのマージのみ |
| `develop` | 開発統合ブランチ。作業ブランチの取り込み先 |
| `build-stg` | **ステージング自動デプロイ用**。pushすると GitHub Actions が AWS CodePipeline を起動する |

- 作業ブランチは `develop` から作成する: `feat/{slug}` / `fix/{slug}` / `chore/{slug}`
- **`build-stg` へのpush・マージは、ユーザーが明示的に指示した場合のみ行う。** CI/CD（ステージング環境の更新）が走るため。`workflow_dispatch` の手動実行も同様。
- 「マージ・プッシュして」とだけ言われた場合の対象は `develop` とする。

## 2. コミット規約

Conventional Commits（`{type}: {summary}`、既存履歴は日本語summary）。

`feat` / `fix` / `refactor` / `style` / `chore` / `docs` / `ci` / `perf` / `a11y`

- bodyには「なぜ必要だったか」を書く。作業内容の言い換えにしない。
- 1コミット1目的。生成物（`.nuxt` `.output` `dist` `node_modules` `.env`）は含めない。
- `--no-verify` でフックをスキップしない。失敗したら原因を直す。

## 3. 実装後の確認手順

テストランナーは未導入。以下で確認する。

```bash
npm run lint        # oxlint --type-aware + eslint
npm run lint:fix    # 自動修正
npm run generate    # SSG生成（CodeBuildと同じ処理）
```

- `nuxt.config.ts` がビルド時に microCMS API を叩くため、`.env` の `MICROCMS_SERVICE_DOMAIN` / `MICROCMS_API_KEY` が必要。
- 見た目の変更は `npm run dev` で確認する。確認できない場合は「未確認」と報告する。

## 4. 標準手順

1. `develop` を最新化し、作業ブランチを作成
2. 実装
3. `npm run lint` を通す（必要に応じ `npm run generate`）
4. コミット
5. `develop` へPR、またはユーザー指示があればローカルでマージしてpush
6. ステージング反映は、ユーザー指示で `develop` → `build-stg` を反映した時のみ

## 5. 禁止事項

- 指示なしの `build-stg` / `master` へのpush
- force push、履歴書き換え
- `.env` などシークレットのコミット
