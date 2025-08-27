# AgoraMarket 測試環境管理腳本 (Windows)

param(
    [Parameter(Mandatory=$false)]
    [string]$Action = "info",

    [Parameter(Mandatory=$false)]
    [string]$Environment = "",

    [Parameter(Mandatory=$false)]
    [string]$ConfigFile = ""
)

Write-Host "🌍 AgoraMarket 測試環境管理器" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# 導入環境管理模塊
# 注意：這是一個簡化的PowerShell版本，實際使用時需要配合Dart代碼

function Show-Help {
    Write-Host "使用方法:" -ForegroundColor Yellow
    Write-Host "  .\manage-environments.ps1 -Action <action> [-Environment <env>] [-ConfigFile <file>]"
    Write-Host ""
    Write-Host "可用動作:" -ForegroundColor Yellow
    Write-Host "  info         顯示當前環境信息 (默認)"
    Write-Host "  list         列出所有可用環境"
    Write-Host "  switch       切換到指定環境"
    Write-Host "  validate     驗證當前環境"
    Write-Host "  test         測試環境連通性"
    Write-Host "  export       導出環境配置"
    Write-Host "  import       導入環境配置"
    Write-Host "  reset        重置為默認環境"
    Write-Host ""
    Write-Host "可用環境:" -ForegroundColor Yellow
    Write-Host "  development  開發環境"
    Write-Host "  staging      預發環境"
    Write-Host "  production   生產環境"
    Write-Host "  local        本地環境"
    Write-Host ""
    Write-Host "示例:" -ForegroundColor Yellow
    Write-Host "  .\manage-environments.ps1 -Action switch -Environment staging"
    Write-Host "  .\manage-environments.ps1 -Action export -ConfigFile 'env-config.json'"
    Write-Host "  .\manage-environments.ps1 -Action import -ConfigFile 'env-config.json'"
}

function Show-EnvironmentInfo {
    Write-Host "當前環境信息:" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

    # 模擬環境信息顯示
    $currentEnv = if ($Environment) { $Environment } else { "development" }
    $environments = @{
        "development" = @{
            "name" = "Development"
            "baseUrl" = "https://redandan.github.io"
            "apiBaseUrl" = "https://api-dev.agoramarket.com"
            "debugMode" = $true
            "screenshots" = $true
            "timeout" = 30
            "retries" = 2
        }
        "staging" = @{
            "name" = "Staging"
            "baseUrl" = "https://staging-redandan.github.io"
            "apiBaseUrl" = "https://api-staging.agoramarket.com"
            "debugMode" = $true
            "screenshots" = $true
            "timeout" = 45
            "retries" = 3
        }
        "production" = @{
            "name" = "Production"
            "baseUrl" = "https://redandan.github.io"
            "apiBaseUrl" = "https://api.agoramarket.com"
            "debugMode" = $false
            "screenshots" = $false
            "timeout" = 60
            "retries" = 1
        }
        "local" = @{
            "name" = "Local"
            "baseUrl" = "http://localhost:3000"
            "apiBaseUrl" = "http://localhost:3001/api"
            "debugMode" = $true
            "screenshots" = $true
            "timeout" = 15
            "retries" = 1
        }
    }

    if ($environments.ContainsKey($currentEnv)) {
        $env = $environments[$currentEnv]
        Write-Host "環境名稱: $($env.name)" -ForegroundColor White
        Write-Host "環境類型: $currentEnv" -ForegroundColor White
        Write-Host "網站URL: $($env.baseUrl)" -ForegroundColor White
        Write-Host "API URL: $($env.apiBaseUrl)" -ForegroundColor White
        Write-Host "調試模式: $(if ($env.debugMode) { "開啟" } else { "關閉" })" -ForegroundColor White
        Write-Host "截圖功能: $(if ($env.screenshots) { "開啟" } else { "關閉" })" -ForegroundColor White
        Write-Host "默認超時: $($env.timeout)秒" -ForegroundColor White
        Write-Host "重試次數: $($env.retries)次" -ForegroundColor White
    } else {
        Write-Host "❌ 未知環境: $currentEnv" -ForegroundColor Red
    }
}

function List-Environments {
    Write-Host "可用測試環境:" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

    $environments = @("development", "staging", "production", "local")
    $currentEnv = if ($Environment) { $Environment } else { "development" }

    foreach ($env in $environments) {
        $marker = if ($env -eq $currentEnv) { "▶️" } else { "  " }
        Write-Host "$marker $env" -ForegroundColor $(if ($env -eq $currentEnv) { "Green" } else { "White" })

        switch ($env) {
            "development" {
                Write-Host "    開發環境 - 快速迭代，完整調試功能" -ForegroundColor Gray
            }
            "staging" {
                Write-Host "    預發環境 - 模擬生產環境，完整測試" -ForegroundColor Gray
            }
            "production" {
                Write-Host "    生產環境 - 線上環境，最小化干擾" -ForegroundColor Gray
            }
            "local" {
                Write-Host "    本地環境 - 開發機本地測試" -ForegroundColor Gray
            }
        }
        Write-Host ""
    }
}

function Switch-Environment {
    if (!$Environment) {
        Write-Host "❌ 請指定要切換的環境" -ForegroundColor Red
        Write-Host "可用環境: development, staging, production, local" -ForegroundColor Yellow
        return
    }

    $validEnvs = @("development", "staging", "production", "local")
    if ($Environment -in $validEnvs) {
        Write-Host "🔄 切換到環境: $Environment" -ForegroundColor Green

        # 保存環境配置
        $config = @{
            "currentEnvironment" = $Environment
            "timestamp" = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        }
        $config | ConvertTo-Json | Out-File -FilePath "test_environment_config.json" -Encoding UTF8

        Write-Host "✅ 環境已切換到: $Environment" -ForegroundColor Green
        Show-EnvironmentInfo
    } else {
        Write-Host "❌ 無效的環境: $Environment" -ForegroundColor Red
        Write-Host "可用環境: $($validEnvs -join ', ')" -ForegroundColor Yellow
    }
}

function Test-Connectivity {
    Write-Host "🔍 測試環境連通性" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

    $currentEnv = if ($Environment) { $Environment } else { "development" }
    $baseUrls = @{
        "development" = "https://redandan.github.io"
        "staging" = "https://staging-redandan.github.io"
        "production" = "https://redandan.github.io"
        "local" = "http://localhost:3000"
    }

    if ($baseUrls.ContainsKey($currentEnv)) {
        $url = $baseUrls[$currentEnv]
        Write-Host "測試URL: $url" -ForegroundColor White

        try {
            $response = Invoke-WebRequest -Uri $url -Method Head -TimeoutSec 10
            Write-Host "✅ 連通性正常 (狀態碼: $($response.StatusCode))" -ForegroundColor Green
        } catch {
            Write-Host "❌ 連通性異常: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ 未知環境: $currentEnv" -ForegroundColor Red
    }
}

function Export-Config {
    if (!$ConfigFile) {
        $ConfigFile = "environment-config-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
    }

    Write-Host "📄 導出環境配置到: $ConfigFile" -ForegroundColor Green

    $config = @{
        "currentEnvironment" = if ($Environment) { $Environment } else { "development" }
        "exportedAt" = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        "environments" = @{
            "development" = @{
                "name" = "Development"
                "baseUrl" = "https://redandan.github.io"
                "apiBaseUrl" = "https://api-dev.agoramarket.com"
            }
            "staging" = @{
                "name" = "Staging"
                "baseUrl" = "https://staging-redandan.github.io"
                "apiBaseUrl" = "https://api-staging.agoramarket.com"
            }
            "production" = @{
                "name" = "Production"
                "baseUrl" = "https://redandan.github.io"
                "apiBaseUrl" = "https://api.agoramarket.com"
            }
            "local" = @{
                "name" = "Local"
                "baseUrl" = "http://localhost:3000"
                "apiBaseUrl" = "http://localhost:3001/api"
            }
        }
    }

    $config | ConvertTo-Json -Depth 10 | Out-File -FilePath $ConfigFile -Encoding UTF8
    Write-Host "✅ 環境配置已導出" -ForegroundColor Green
}

# 主邏輯
switch ($Action.ToLower()) {
    "info" { Show-EnvironmentInfo }
    "list" { List-Environments }
    "switch" { Switch-Environment }
    "validate" { Show-EnvironmentInfo }
    "test" { Test-Connectivity }
    "export" { Export-Config }
    "import" {
        Write-Host "❌ 導入功能需要在Dart代碼中實現" -ForegroundColor Red
    }
    "reset" {
        $Environment = "development"
        Switch-Environment
    }
    "help" { Show-Help }
    default {
        Write-Host "❌ 未知動作: $Action" -ForegroundColor Red
        Show-Help
    }
}