@echo off
setlocal enabledelayedexpansion

echo 🔍 Gerando estrutura JSON...

set OUTPUT_FILE=project-structure.json

echo { > %OUTPUT_FILE%
echo   "project": "patient-shiba-nudge", >> %OUTPUT_FILE%
echo   "scanned_at": "%date% %time%", >> %OUTPUT_FILE%
echo   "structure": { >> %OUTPUT_FILE%

echo     "components": [ >> %OUTPUT_FILE%
set first=true
for /r src\components %%f in (*.tsx *.jsx) do (
    set "filepath=%%f"
    set "filepath=!filepath:%cd%\src\components\=!"
    if !first!==true (
        set first=false
        echo       "!filepath!" >> %OUTPUT_FILE%
    ) else (
        echo       ,"!filepath!" >> %OUTPUT_FILE%
    )
)
echo     ], >> %OUTPUT_FILE%

echo     "hooks": [ >> %OUTPUT_FILE%
set first=true
for /r src\hooks %%f in (*.ts *.tsx) do (
    set "filepath=%%f"
    set "filepath=!filepath:%cd%\src\hooks\=!"
    if !first!==true (
        set first=false
        echo       "!filepath!" >> %OUTPUT_FILE%
    ) else (
        echo       ,"!filepath!" >> %OUTPUT_FILE%
    )
)
echo     ], >> %OUTPUT_FILE%

echo     "pages": [ >> %OUTPUT_FILE%
set first=true
for /r src\app %%f in (page.tsx layout.tsx) do (
    set "filepath=%%f"
    set "filepath=!filepath:%cd%\src\app\=!"
    if !first!==true (
        set first=false
        echo       "!filepath!" >> %OUTPUT_FILE%
    ) else (
        echo       ,"!filepath!" >> %OUTPUT_FILE%
    )
)
echo     ] >> %OUTPUT_FILE%

echo   } >> %OUTPUT_FILE%
echo } >> %OUTPUT_FILE%

echo ✅ JSON gerado: %OUTPUT_FILE%