![工作坊完成徽章](https://img.shields.io/badge/GitHub_Copilot_實戰工作坊-已完成-1F883D?style=for-the-badge&logo=githubcopilot&logoColor=white)

# 待辦清單 Web App

## 簡介

這是在 GitHub Copilot 實戰工作坊完成的純前端待辦清單應用程式，支援新增、完成、刪除、篩選與深色模式，並以瀏覽器 localStorage 保存資料。

## 線上展示

[開啟待辦清單 App](https://d11516115-tech.github.io/schoolwork/)

## 功能

- 新增、完成與刪除待辦事項
- 顯示整體未完成事項數量
- 以 localStorage 保存待辦資料與目前篩選條件
- 手動切換深色/淺色模式並保存偏好；尚未手動選擇時跟隨系統設定
- 依全部、未完成、已完成篩選，並在篩選結果為空時顯示提示

## 技術

- HTML、CSS 與原生 JavaScript
- 不使用框架、套件或外部 CDN
- 以 CSS 變數管理淺色與深色主題
- 使用 localStorage 保存使用者資料與偏好

## 開發方式

- 使用 GitHub Copilot Agent Mode 協助建立與擴充多檔案功能
- 以 `.github/copilot-instructions.md` 記錄專案規範，並以 `.github/prompts/fix-issue.prompt.md` 保存 issue 處理流程
- Issue #3 的篩選偏好修正經過分支、瀏覽器驗證、Pull Request 與合併
- `.vscode/mcp.json` 已設定 Microsoft Learn 與 GitHub MCP endpoint；VS Code 中的 server 啟動與 GitHub 授權仍需在本機完成，因此此作品不宣稱已驗證 MCP 工具呼叫

## 我學到什麼

- 用 CSS 變數維護淺色與深色主題
- 將篩選狀態保存到 localStorage，並處理無效的儲存值
- 先重現 issue，再提出計畫、修正並驗證結果
- 以分支和 Pull Request 管理程式碼變更
