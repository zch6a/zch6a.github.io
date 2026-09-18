# Chuanhao Zhao — 个人学术主页

纯静态页面，零依赖、零构建。双击 `index.html` 就能在浏览器里看效果。

```
index.html          # 全部内容都在这里改
assets/style.css    # 排版配色（颜色集中在文件顶部 :root 和 [data-theme="dark"] 两块）
assets/script.js    # 深色模式、复制邮箱、BibTeX 展开、导航高亮、News 折叠
assets/avatar.svg   # 占位头像（CZ 字母图）
```

## 当前状态

已填好并**可以直接发布**：姓名（中英）、职位、院系、学校、邮箱、About、研究兴趣、联系方式。

暂时停用（在 `index.html` 里被整节注释掉了，有内容再打开）：
News、Publications、Education & Experience、Awards & Service，
以及 hero 里的 GitHub / Google Scholar / ORCID / CV 链接列表。

打开某一节的方法：删掉该节前后的注释标记，再把顶部 `<nav>` 里对应那一行的注释也去掉。

## 关于注册表单的"至少一个网址"

OpenReview / ACL ARR 要求那个网址上**同时能看到你的姓名和邮箱**，人工核验。
本页首屏已经把 `Chuanhao Zhao` 和 `zhaoch5524@mails.jlu.edu.cn` 紧挨着放在一起。

三个坑别踩：

- 邮箱必须和你 OpenReview 注册用的**完全一致**，差一个字母就不算。
- 不要把邮箱写成 `name [at] domain` 或做成图片防爬虫 —— 核验会不通过。
- 填进表单的网址必须以 `https://` 开头，且是**公开可访问**的（别填 localhost，别填需要登录的链接）。

## 部署到 GitHub Pages

git 仓库和首次 commit 已经建好了（分支 `main`），只剩关联远端和推送。

1. 注册 / 登录 [github.com](https://github.com)。
2. 新建仓库，名字填 `<你的用户名>.github.io`，Public，**不要**勾选任何初始化文件
   （不要 README、不要 .gitignore、不要 license）。
3. 在本目录执行（把两处 `<你的用户名>` 换成实际用户名）：

```bash
git remote add origin https://github.com/<你的用户名>/<你的用户名>.github.io.git; git push -u origin main
```

4. 仓库页 → **Settings** → **Pages** → Source 选 `Deploy from a branch`，
   Branch 选 `main` + `/ (root)` → Save。
5. 等 1–2 分钟，打开 `https://<你的用户名>.github.io/` 确认能看到姓名和邮箱。
6. 把这个网址填进注册表单的 **Homepage URL** 字段。
7. 回到 `index.html`，把 `og:url` 那一行改成这个真实网址。

以后每次改完内容：

```bash
git add -A && git commit -m "Update homepage" && git push
```

## 后续补充

- **换头像**：照片放成 `assets/avatar.jpg`（方图，≥400×400），
  把 `index.html` 里 `<img class="avatar" src="assets/avatar.svg">` 改成 `avatar.jpg`。
- **放 CV**：PDF 存成 `assets/cv.pdf`，然后打开 hero 里被注释的 links 列表。
- **导出 PDF 简历**：浏览器 `Ctrl+P` —— 已做过打印样式，导航栏和按钮会自动隐藏。
- **改主色**：只动 `assets/style.css` 顶部两个变量块里的 `--accent`，别处不用碰。
- **加一篇论文**：打开 Publications 整节，复制 `<article class="pub">…</article>` 块。
  自己的名字用 `<strong>` 包起来。
- **加一条 News**：在 `.news-list` 最上面插一条 `<li>`，超过 4 条会自动折叠。

## 其他托管方式

- **Cloudflare Pages / Vercel / Netlify**：连 GitHub 仓库，框架选 `None / Static`，
  构建命令留空，输出目录填 `/`。国内访问通常比 GitHub Pages 稳。
- **学校主页空间**：整个目录 FTP/SFTP 上传即可，不需要任何服务端环境。
