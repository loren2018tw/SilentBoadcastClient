@echo off
setlocal enabledelayedexpansion

REM �]�w���|�W�٩M�ؼи��|
set "ShortcutName=CKES�L�n�s�� �Ȥ��"
set "TargetPath=C:\SilentBoadcastClient\CKES �L�n�s���t��.exe"

REM �T�O�Ұʸ�Ƨ��s�b
if not exist "%USERPROFILE%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup" (
    mkdir "%USERPROFILE%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup"
)

REM �إ߱��|
set "ShortcutPath=%USERPROFILE%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\%ShortcutName%.lnk"
set "VBScript=%TEMP%\CreateShortcut.vbs"

REM �ϥ� VBScript �إ߱��|
echo Set WshShell = WScript.CreateObject("WScript.Shell") > "%VBScript%"
echo Set Shortcut = WshShell.CreateShortcut("%ShortcutPath%") >> "%VBScript%"
echo Shortcut.TargetPath = "%TargetPath%" >> "%VBScript%"
echo Shortcut.Save >> "%VBScript%"

REM ���� VBScript �H�إ߱��|
cscript //nologo "%VBScript%"

REM �R���{�� VBScript
del "%VBScript%"

echo ���|�w�إ�: %ShortcutPath%

endlocal
