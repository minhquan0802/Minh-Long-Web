@echo off
chcp 65001 >nul
title Website Minh Long
cd /d "%~dp0"

echo ==================================================
echo   BAT WEBSITE MINH LONG (ban chay that)
echo   Dong cua so nay = tat website
echo ==================================================
echo.

REM 1. Docker Desktop (database chay trong Docker)
docker info >nul 2>&1
if errorlevel 1 (
  echo [1/4] Đang bật Docker Desktop, chờ khoảng 30 giây...
  start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
)
:waitdocker
docker info >nul 2>&1
if errorlevel 1 (
  timeout /t 3 /nobreak >nul
  goto waitdocker
)
echo [1/4] Docker đã sẵn sàng.

REM 2. Database
echo [2/4] Bật database...
docker compose up -d
if errorlevel 1 (
  echo Không bật được database. Kiểm tra Docker Desktop rồi chạy lại.
  pause
  exit /b 1
)

REM 3. Build (chỉ lần đầu, hoặc khi chạy: start-website.bat build)
if /i "%~1"=="build" goto dobuild
if not exist ".next\BUILD_ID" goto dobuild
echo [3/4] Đã có bản build, bỏ qua bước build.
goto start
:dobuild
echo [3/4] Đang build website (mất 1-2 phút)...
call npm run build
if errorlevel 1 (
  echo Build lỗi. Chụp màn hình gửi lại để kiểm tra.
  pause
  exit /b 1
)

:start
echo [4/4] Website đang chạy:
echo        - Trên máy này: http://localhost:3000
echo        - Qua tên miền: https://minhquan0802.id.vn  (cần Cloudflare Tunnel)
echo.
call npm start
pause
