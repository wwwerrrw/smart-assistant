# Git 工作流

## 仓库约定

- 仓库根目录：`E:\Zmkk\New project`
- 本机 Git：`C:\Program Files\Git\cmd\git.exe`
- 主分支：`main`
- 远程：当前未配置。确认 GitHub/Gitee/GitLab 平台和现有/新建私有仓库后，再配置 `origin`。
- 凭据：使用 Git Credential Manager 或平台 CLI 的安全凭据存储，不将令牌写入仓库、命令、日志或文档。

## 日常修改

始终在仓库根目录执行：

```powershell
git status --short --branch
git diff --check
git diff
git add -- <path...>
git diff --cached --stat
git diff --cached
git commit -m "<type>: <summary>"
```

提交前确认 `.env`、令牌、密码、私钥、`node_modules`、构建产物和 IDE 私有缓存未被暂存。

## 远程同步

配置 `origin` 后，先只读获取并比较：

```powershell
git fetch --prune origin
git status --short --branch
git rev-list --left-right --count main...origin/main
git diff --stat main..origin/main
```

只有当历史相关、本地工作树安全、远程只需快进时，才执行：

```powershell
git pull --ff-only origin main
```

发现无关历史、分叉或文件冲突时停止，不自动 rebase 或 merge。首次 push 必须再次确认远程、分支和仓库可见性。

## VS Code

从仓库根目录打开：

```powershell
code "E:\Zmkk\New project"
```

Source Control 应显示 `main`。在 VS Code 终端用 `git --version`、`git rev-parse --show-toplevel` 和 `git status --short --branch` 与 Codex 结果交叉检查。

## 禁止事项

- 不执行 `git clean`、`git reset --hard`、`git checkout -- <path>`、强制推送或未经确认的分支删除。
- 不在未先 `fetch` 和评估的情况下 `pull`。
- 不把秘密、依赖、生成产物或本机缓存纳入版本库。
