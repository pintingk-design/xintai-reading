#!/bin/bash
cd "$(dirname "$0")"
echo "======================================================================"
echo "  五年甲班 國語文朗讀自主練習系統 - 本地伺服器啟動器 (localhost)"
echo "======================================================================"
echo ""
echo "正在為您開啟 http://localhost:8000/index.html ..."
open "http://localhost:8000/index.html"
python3 -m http.server 8000
