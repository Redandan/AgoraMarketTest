const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// 中間件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'web')));

// 測試狀態管理
const testStates = new Map();
const runningTests = new Set();

// 測試配置
const testConfigs = {
    'business-exploratory-shopping': {
        name: '產品行為探索測試',
        file: 'tests/playwright/business-exploratory-shopping.spec.ts',
        description: '探索用戶產品瀏覽行為模式'
    },
    'business-process-exploration': {
        name: '業務流程探索測試',
        file: 'tests/playwright/business-process-exploration.spec.ts',
        description: '探索完整業務流程'
    },
    'verification-test': {
        name: '技術驗證測試',
        file: 'tests/playwright/verification-test.spec.ts',
        description: 'Flutter Web 應用驗證'
    },
    'mobile-verification-test': {
        name: '移動端驗證測試',
        file: 'tests/playwright/mobile-verification-test.spec.ts',
        description: '手機版佈局驗證'
    },
    'enhanced-business-exploration': {
        name: '綜合業務探索測試',
        file: 'tests/playwright/enhanced-business-exploration.spec.ts',
        description: '全面業務場景探索'
    }
};

// API路由

// 運行測試
app.post('/api/run-test', async (req, res) => {
    const { testId } = req.body;

    if (!testConfigs[testId]) {
        return res.status(400).json({ error: '無效的測試ID' });
    }

    if (runningTests.has(testId)) {
        return res.status(409).json({ error: '測試正在運行中' });
    }

    const testConfig = testConfigs[testId];
    runningTests.add(testId);
    testStates.set(testId, 'running');

    try {
        console.log(`🚀 開始運行測試: ${testConfig.name}`);

        // 執行 Playwright 測試
        const testCommand = `npx playwright test ${testConfig.file} --project=chromium --headed`;

        const child = exec(testCommand, {
            cwd: path.join(__dirname, '..'),
            maxBuffer: 1024 * 1024 * 10 // 10MB 緩衝區
        });

        let output = '';
        let errorOutput = '';

        child.stdout.on('data', (data) => {
            output += data;
            console.log(`[${testId}] ${data}`);
        });

        child.stderr.on('data', (data) => {
            errorOutput += data;
            console.error(`[${testId}] 錯誤: ${data}`);
        });

        child.on('close', (code) => {
            runningTests.delete(testId);

            if (code === 0) {
                testStates.set(testId, 'success');
                console.log(`✅ 測試 ${testConfig.name} 執行成功`);

                res.json({
                    success: true,
                    message: `${testConfig.name} 執行成功`,
                    testId: testId,
                    output: output,
                    exitCode: code
                });
            } else {
                testStates.set(testId, 'error');
                console.log(`❌ 測試 ${testConfig.name} 執行失敗 (退出碼: ${code})`);

                res.status(500).json({
                    success: false,
                    message: `${testConfig.name} 執行失敗`,
                    testId: testId,
                    output: output,
                    error: errorOutput,
                    exitCode: code
                });
            }
        });

        child.on('error', (error) => {
            runningTests.delete(testId);
            testStates.set(testId, 'error');
            console.error(`❌ 測試 ${testConfig.name} 啟動失敗:`, error);

            res.status(500).json({
                success: false,
                message: `${testConfig.name} 啟動失敗`,
                testId: testId,
                error: error.message
            });
        });

    } catch (error) {
        runningTests.delete(testId);
        testStates.set(testId, 'error');
        console.error('測試執行異常:', error);

        res.status(500).json({
            success: false,
            message: '測試執行異常',
            error: error.message
        });
    }
});

// 獲取測試狀態
app.get('/api/test-status/:testId', (req, res) => {
    const { testId } = req.params;
    const status = testStates.get(testId) || 'ready';
    const isRunning = runningTests.has(testId);

    res.json({
        testId,
        status,
        isRunning
    });
});

// 獲取所有測試狀態
app.get('/api/test-status', (req, res) => {
    const allStatuses = {};
    for (const [testId, config] of Object.entries(testConfigs)) {
        allStatuses[testId] = {
            name: config.name,
            status: testStates.get(testId) || 'ready',
            isRunning: runningTests.has(testId)
        };
    }

    res.json(allStatuses);
});

// 獲取報告列表
app.get('/api/reports', (req, res) => {
    const reportsDir = path.join(__dirname, '..', 'integration_test', 'business_exploratory_testing', 'business_logic_findings');

    try {
        if (!fs.existsSync(reportsDir)) {
            return res.json([]);
        }

        const files = fs.readdirSync(reportsDir)
            .filter(file => file.endsWith('.md'))
            .map(file => {
                const filePath = path.join(reportsDir, file);
                const stats = fs.statSync(filePath);
                const content = fs.readFileSync(filePath, 'utf8');

                // 解析報告內容
                const titleMatch = content.match(/^# (.+)$/m);
                const findingsMatch = content.match(/業務邏輯發現: (\d+)/);
                const timestampMatch = content.match(/生成時間\n(.+)/);

                return {
                    id: file.replace('.md', ''),
                    title: titleMatch ? titleMatch[1] : file,
                    timestamp: timestampMatch ? timestampMatch[1] : stats.mtime.toISOString(),
                    findings: findingsMatch ? parseInt(findingsMatch[1]) : 0,
                    filePath: filePath,
                    size: stats.size
                };
            })
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        res.json(files);
    } catch (error) {
        console.error('獲取報告列表失敗:', error);
        res.status(500).json({ error: '獲取報告列表失敗' });
    }
});

// 查看報告內容
app.get('/api/reports/:reportId', (req, res) => {
    const { reportId } = req.params;
    const reportPath = path.join(__dirname, '..', 'integration_test', 'business_exploratory_testing', 'business_logic_findings', `${reportId}.md`);

    try {
        if (!fs.existsSync(reportPath)) {
            return res.status(404).json({ error: '報告不存在' });
        }

        const content = fs.readFileSync(reportPath, 'utf8');
        res.send(content);
    } catch (error) {
        console.error('讀取報告失敗:', error);
        res.status(500).json({ error: '讀取報告失敗' });
    }
});

// 下載報告
app.get('/api/reports/:reportId/download', (req, res) => {
    const { reportId } = req.params;
    const reportPath = path.join(__dirname, '..', 'integration_test', 'business_exploratory_testing', 'business_logic_findings', `${reportId}.md`);

    try {
        if (!fs.existsSync(reportPath)) {
            return res.status(404).json({ error: '報告不存在' });
        }

        res.download(reportPath, `business-report-${reportId}.md`);
    } catch (error) {
        console.error('下載報告失敗:', error);
        res.status(500).json({ error: '下載報告失敗' });
    }
});

// 獲取測試統計
app.get('/api/stats', (req, res) => {
    const reportsDir = path.join(__dirname, '..', 'integration_test', 'business_exploratory_testing', 'business_logic_findings');

    try {
        const stats = {
            totalTests: Object.keys(testConfigs).length,
            totalReports: 0,
            lastRun: null,
            successRate: '100%'
        };

        if (fs.existsSync(reportsDir)) {
            const files = fs.readdirSync(reportsDir).filter(file => file.endsWith('.md'));
            stats.totalReports = files.length;

            if (files.length > 0) {
                // 找到最新的文件
                const latestFile = files
                    .map(file => ({
                        name: file,
                        path: path.join(reportsDir, file),
                        stats: fs.statSync(path.join(reportsDir, file))
                    }))
                    .sort((a, b) => b.stats.mtime - a.stats.mtime)[0];

                stats.lastRun = latestFile.stats.mtime.toLocaleDateString('zh-TW');
            }
        }

        res.json(stats);
    } catch (error) {
        console.error('獲取統計失敗:', error);
        res.status(500).json({ error: '獲取統計失敗' });
    }
});

// 獲取測試配置
app.get('/api/tests', (req, res) => {
    res.json(testConfigs);
});

// 健康檢查
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        runningTests: Array.from(runningTests),
        testStates: Object.fromEntries(testStates)
    });
});

// 啟動服務器
app.listen(PORT, () => {
    console.log(`🚀 業務探索測試儀表板服務器運行在 http://localhost:${PORT}`);
    console.log(`📊 儀表板地址: http://localhost:${PORT}/test-dashboard.html`);
    console.log(`💡 API 端點: http://localhost:${PORT}/api/`);
    console.log(`🔍 健康檢查: http://localhost:${PORT}/api/health`);
});

// 優雅關閉
process.on('SIGINT', () => {
    console.log('\n🛑 正在關閉服務器...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 正在關閉服務器...');
    process.exit(0);
});