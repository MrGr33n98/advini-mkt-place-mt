@echo off
setlocal enabledelayedexpansion

echo ========================================
echo 🔍 CRAWLER - ESTRUTURA DO PROJETO SRC
echo ========================================
echo Data: %date% %time%
echo.

set OUTPUT_FILE=project-structure.md

echo # Estrutura Completa do Projeto > %OUTPUT_FILE%
echo. >> %OUTPUT_FILE%
echo Gerado em: %date% %time% >> %OUTPUT_FILE%
echo. >> %OUTPUT_FILE%

echo 📁 Mapeando estrutura de diretórios...
echo ## Árvore de Diretórios >> %OUTPUT_FILE%
echo. >> %OUTPUT_FILE%
echo ```bash >> %OUTPUT_FILE%
tree src /f /a >> %OUTPUT_FILE%
echo ``` >> %OUTPUT_FILE%
echo. >> %OUTPUT_FILE%

echo 📊 Contando arquivos por tipo...
echo ## Estatísticas de Arquivos >> %OUTPUT_FILE%
echo. >> %OUTPUT_FILE%

for %%e in (tsx ts js jsx css scss json md) do (
    set count=0
    for /r src %%f in (*.%%e) do (
        set /a count+=1
    )
    echo - Arquivos .%%e: !count! >> %OUTPUT_FILE%
)

echo. >> %OUTPUT_FILE%

echo 📋 Listando todos os arquivos...
echo ## Lista Completa de Arquivos >> %OUTPUT_FILE%
echo. >> %OUTPUT_FILE%

for /r src %%f in (*.*) do (
    set "filepath=%%f"
    set "filepath=!filepath:%cd%\=!"
    echo - !filepath! >> %OUTPUT_FILE%
)

echo. >> %OUTPUT_FILE%

echo 🔍 Analisando componentes React...
echo ## Componentes React (.tsx/.jsx) >> %OUTPUT_FILE%
echo. >> %OUTPUT_FILE%

for /r src %%f in (*.tsx *.jsx) do (
    set "filepath=%%f"
    set "filepath=!filepath:%cd%\=!"
    echo ### !filepath! >> %OUTPUT_FILE%
    echo ```typescript >> %OUTPUT_FILE%
    
    REM Pegar as primeiras 10 linhas do arquivo
    set linecount=0
    for /f "usebackq delims=" %%l in ("%%f") do (
        if !linecount! lss 10 (
            echo %%l >> %OUTPUT_FILE%
            set /a linecount+=1
        )
    )
    echo ``` >> %OUTPUT_FILE%
    echo. >> %OUTPUT_FILE%
)

echo 📚 Analisando hooks personalizados...
echo ## Hooks Personalizados >> %OUTPUT_FILE%
echo. >> %OUTPUT_FILE%

for /r src\hooks %%f in (*.ts *.tsx) do (
    set "filepath=%%f"
    set "filepath=!filepath:%cd%\=!"
    echo ### !filepath! >> %OUTPUT_FILE%
    echo ```typescript >> %OUTPUT_FILE%
    
    REM Pegar as primeiras 15 linhas do arquivo
    set linecount=0
    for /f "usebackq delims=" %%l in ("%%f") do (
        if !linecount! lss 15 (
            echo %%l >> %OUTPUT_FILE%
            set /a linecount+=1
        )
    )
    echo ``` >> %OUTPUT_FILE%
    echo. >> %OUTPUT_FILE%
)

echo 🛠️ Analisando utilitários e libs...
echo ## Bibliotecas e Utilitários >> %OUTPUT_FILE%
echo. >> %OUTPUT_FILE%

for /r src\lib %%f in (*.ts *.tsx) do (
    set "filepath=%%f"
    set "filepath=!filepath:%cd%\=!"
    echo ### !filepath! >> %OUTPUT_FILE%
    echo ```typescript >> %OUTPUT_FILE%
    
    REM Pegar as primeiras 20 linhas do arquivo
    set linecount=0
    for /f "usebackq delims=" %%l in ("%%f") do (
        if !linecount! lss 20 (
            echo %%l >> %OUTPUT_FILE%
            set /a linecount+=1
        )
    )
    echo ``` >> %OUTPUT_FILE%
    echo. >> %OUTPUT_FILE%
)

echo 📄 Analisando páginas...
echo ## Páginas da Aplicação >> %OUTPUT_FILE%
echo. >> %OUTPUT_FILE%

for /r src\app %%f in (page.tsx layout.tsx) do (
    set "filepath=%%f"
    set "filepath=!filepath:%cd%\=!"
    echo ### !filepath! >> %OUTPUT_FILE%
    echo ```typescript >> %OUTPUT_FILE%
    
    REM Pegar as primeiras 25 linhas do arquivo
    set linecount=0
    for /f "usebackq delims=" %%l in ("%%f") do (
        if !linecount! lss 25 (
            echo %%l >> %OUTPUT_FILE%
            set /a linecount+=1
        )
    )
    echo ``` >> %OUTPUT_FILE%
    echo. >> %OUTPUT_FILE%
)

echo 🎨 Analisando estilos...
echo ## Arquivos de Estilo >> %OUTPUT_FILE%
echo. >> %OUTPUT_FILE%

for /r src %%f in (*.css *.scss) do (
    set "filepath=%%f"
    set "filepath=!filepath:%cd%\=!"
    echo ### !filepath! >> %OUTPUT_FILE%
    echo ```css >> %OUTPUT_FILE%
    
    REM Pegar as primeiras 30 linhas do arquivo
    set linecount=0
    for /f "usebackq delims=" %%l in ("%%f") do (
        if !linecount! lss 30 (
            echo %%l >> %OUTPUT_FILE%
            set /a linecount+=1
        )
    )
    echo ``` >> %OUTPUT_FILE%
    echo. >> %OUTPUT_FILE%
)

echo 📊 Gerando resumo final...
echo ## Resumo do Projeto >> %OUTPUT_FILE%
echo. >> %OUTPUT_FILE%

set total_files=0
for /r src %%f in (*.*) do (
    set /a total_files+=1
)

echo - **Total de arquivos**: !total_files! >> %OUTPUT_FILE%

set total_dirs=0
for /d /r src %%d in (*) do (
    set /a total_dirs+=1
)

echo - **Total de diretórios**: !total_dirs! >> %OUTPUT_FILE%

REM Calcular tamanho total
set total_size=0
for /r src %%f in (*.*) do (
    set /a total_size+=%%~zf
)

echo - **Tamanho total**: !total_size! bytes >> %OUTPUT_FILE%

echo. >> %OUTPUT_FILE%
echo --- >> %OUTPUT_FILE%
echo *Relatório gerado automaticamente pelo crawler.bat* >> %OUTPUT_FILE%

echo.
echo ✅ Crawler concluído!
echo 📄 Relatório salvo em: %OUTPUT_FILE%
echo 📊 Total de arquivos analisados: !total_files!
echo 📁 Total de diretórios: !total_dirs!
echo.
echo 🔍 Para visualizar o relatório:
echo    type %OUTPUT_FILE%
echo.
echo 📋 Para abrir no editor:
echo    notepad %OUTPUT_FILE%

pause