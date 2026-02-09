@echo off
title Idle Kingdom Server
color 0A
echo ========================================
echo   IDLE KINGDOM - Game Server
echo   http://localhost:4444
echo   Kapanirsa otomatik yeniden baslar!
echo ========================================
echo.

:loop
echo [%date% %time%] Server baslatiliyor...
cd /d "C:\3dlabx\idle-kingdom"
npx serve -l 4444 -s .
echo.
echo [%date% %time%] Server kapandi! 3 saniye sonra yeniden baslatiliyor...
ping -n 4 127.0.0.1 >nul
goto loop
