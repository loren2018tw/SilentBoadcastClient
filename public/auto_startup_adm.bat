@echo off
setlocal enabledelayedexpansion

REM 設定捷徑名稱和目標路徑
set "ShortcutName=CKES無聲廣播 客戶端"
set "TargetPath=C:\SilentBoadcastClient\CKES 無聲廣播系統.exe"
set "StartInPath=C:\SilentBoadcastClient"  REM 將此路徑更改為您的工作目錄

REM 建立捷徑在開始資料夾
if not exist "%USERPROFILE%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup" (
    mkdir "%USERPROFILE%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup"
)

REM 建立捷徑在開始資料夾
REM set "ShortcutPath=%USERPROFILE%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\%ShortcutName%.lnk"
set "ShortcutPath=C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup\%ShortcutName%.lnk"

set "VBScript=%TEMP%\CreateShortcut.vbs"

REM 使用 VBScript 建立捷徑
echo Set WshShell = WScript.CreateObject("WScript.Shell") > "%VBScript%"
echo Set Shortcut = WshShell.CreateShortcut("%ShortcutPath%") >> "%VBScript%"
echo Shortcut.TargetPath = "%TargetPath%" >> "%VBScript%"
echo Shortcut.WorkingDirectory = "%StartInPath%" >> "%VBScript%"
echo Shortcut.Save >> "%VBScript%"

REM 執行 VBScript 以建立捷徑
cscript //nologo "%VBScript%"

REM 刪除臨時 VBScript
del "%VBScript%"

echo 捷徑已建立: %ShortcutPath%

endlocal
