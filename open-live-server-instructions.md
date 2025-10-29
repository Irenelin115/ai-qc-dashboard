# 使用 Live Server 開啟當前 HTML 檔案（快速指引）

步驟：
1. 確認已安裝 VS Code 的「Live Server」擴充套件（Ritwick Dey）。
2. 在 VS Code 中打開你的 ai-qc-dashboard.html 檔案。
3. 方法一（最快）：
   - 在編輯器右下角點選「Go Live」按鈕。
4. 方法二（檔案上右鍵）：
   - 在檔案總管或編輯器分頁上右鍵 → 選擇「Open with Live Server」。
5. 方法三（命令面板）：
   - 按 Ctrl+Shift+P（或 Cmd+Shift+P），輸入並選擇「Live Server: Open with Live Server」。
6. 停止服務：
   - 點選右下角的「Port: xxxx」或「Stop Live Server」按鈕停止。

常見設定（如需修改）：
- 在 settings.json 中可設定 port、root、是否自動開啟瀏覽器等：
  - "liveServer.settings.port": 5500
  - "liveServer.settings.root": "/"
  - "liveServer.settings.NoBrowser": false

如果 Live Server 未顯示「Go Live」，請確認工作區是否已開啟資料夾（非單一檔案）或重新載入視窗（Ctrl+Shift+P → Reload Window）。