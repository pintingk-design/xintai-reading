@echo off
chcp 65001 >nul
title 國語文朗讀自主練習系統 - 本地伺服器啟動器
echo ======================================================================
echo   五年甲班 國語文朗讀自主練習系統 - 本地伺服器啟動器 (localhost)
echo ======================================================================
echo.
echo 說明：
echo 因 Google Chrome 安全性協定規定，以檔案方式 (file://) 直接開啟時，
echo 瀏覽器會強制封鎖「麥克風語音轉文字（Web Speech API）」功能。
echo.
echo 本腳本將自動建立本機專屬伺服器 (http://localhost:8000)，
echo 讓 Chrome 完全具備「說話自動即時打字」、「逐字自動比對」與「即時錯字診斷」！
echo.
echo 正在開啟瀏覽器並啟動本地伺服器...
start "" "http://localhost:8000/index.html"
python -m http.server 8000 || py -m http.server 8000 || python3 -m http.server 8000
if %errorlevel% neq 0 (
    echo.
    echo [提醒] 本機尚未安裝 Python。
    echo 您依然可以直接以 Chrome 開啟 index.html，
    echo 系統內建「錄音文字確認框」，可手動確認或輸入您唸的字，依然能精準進行逐字診斷與扣分！
    pause
)
