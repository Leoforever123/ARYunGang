/**
 * 云冈石窟AR项目 - AR控制脚本
 * 负责AR场景初始化、交互控制和状态管理
 */

// 全局变量
let isTargetFound = false;
let isModelLoaded = false;

// DOM元素
const loadingOverlay = document.getElementById('loading-overlay');
const hint = document.getElementById('hint');
const scene = document.querySelector('a-scene');

/**
 * 页面加载完成后初始化
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 云冈石窟AR系统初始化...');
    
    // 显示初始加载状态
    updateLoadingText('正在加载 AR 库...', '下载必要组件 (1/3)');
    
    // 检查浏览器兼容性
    if (!checkBrowserCompatibility()) {
        return; // 如果不兼容，停止初始化
    }
    
    // 设置加载超时（30秒）
    const loadingTimeout = setTimeout(() => {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay && loadingOverlay.style.display !== 'none') {
            showError(`
                <div style="text-align: center;">
                    <h2>⏱️ 加载超时</h2>
                    <p>AR 引擎加载时间过长，可能存在问题。</p>
                    
                    <h3>可能的原因：</h3>
                    <ul style="text-align: left; display: inline-block;">
                        <li>网络连接不稳定</li>
                        <li>资源文件损坏</li>
                        <li>浏览器兼容性问题</li>
                    </ul>
                    
                    <div style="margin-top: 20px;">
                        <button onclick="location.reload()" 
                            style="background: #4CAF50; color: white; border: none; 
                            padding: 12px 30px; border-radius: 5px; cursor: pointer; 
                            font-size: 16px; margin-right: 10px;">
                            重新加载
                        </button>
                        <button onclick="window.location.href='webgl-test.html'" 
                            style="background: #2196F3; color: white; border: none; 
                            padding: 12px 30px; border-radius: 5px; cursor: pointer; 
                            font-size: 16px;">
                            检测 WebGL
                        </button>
                    </div>
                </div>
            `);
        }
    }, 30000); // 30 秒超时
    
    // AR 就绪时清除超时
    scene.addEventListener('arReady', () => {
        clearTimeout(loadingTimeout);
    });
    
    // 监听AR场景事件
    setupARListeners();
    
    // 初始化性能监控
    initPerformanceMonitor();
});

/**
 * 检查浏览器兼容性
 */
function checkBrowserCompatibility() {
    // 详细检查 WebGL 支持
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl || !(gl instanceof WebGLRenderingContext)) {
        const errorMsg = `
            <div style="text-align: left; max-width: 500px;">
                <h2>❌ WebGL 不支持</h2>
                <p>您的浏览器或设备不支持 WebGL，无法运行 AR 功能。</p>
                
                <h3>可能的原因：</h3>
                <ul style="text-align: left;">
                    <li>浏览器禁用了 WebGL</li>
                    <li>显卡驱动过时</li>
                    <li>硬件加速被禁用</li>
                </ul>
                
                <h3>解决方案：</h3>
                <ol style="text-align: left;">
                    <li><strong>启用 WebGL：</strong><br>
                        访问 <code>edge://flags</code> 或 <code>chrome://flags</code><br>
                        搜索 "WebGL" 并启用
                    </li>
                    <li><strong>启用硬件加速：</strong><br>
                        设置 → 系统 → 使用硬件加速
                    </li>
                    <li><strong>更新显卡驱动</strong></li>
                    <li><strong>尝试 Chrome 浏览器</strong></li>
                </ol>
                
                <div style="margin-top: 20px;">
                    <a href="webgl-test.html" target="_blank" 
                       style="color: #4CAF50; text-decoration: underline;">
                        点击这里进行 WebGL 检测
                    </a>
                </div>
            </div>
        `;
        showError(errorMsg);
        return false;
    }
    
    // 检查摄像头支持
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showError('您的浏览器不支持摄像头访问');
        return false;
    }
    
    console.log('✅ 浏览器兼容性检查通过');
    console.log('  WebGL 版本:', gl.getParameter(gl.VERSION));
    console.log('  渲染器:', gl.getParameter(gl.RENDERER));
    return true;
}

/**
 * 设置AR事件监听器
 */
function setupARListeners() {
    // 监听场景加载完成
    scene.addEventListener('loaded', function() {
        console.log('✅ AR场景加载完成');
        updateLoadingText('正在初始化AR引擎...', '加载识别数据中 (2/3)');
    });
    
    // 监听AR引擎就绪
    scene.addEventListener('arReady', async function() {
        console.log('✅ AR引擎就绪');
        updateLoadingText('启动摄像头...', '准备就绪 (3/3)');
        
        // 初始化滤镜
        setTimeout(async () => {
            hideLoading();
            updateHint('📱 请将摄像头对准标记图像');
            
            // 获取视频元素并初始化滤镜
            const video = document.querySelector('video');
            if (video && typeof initFilterWithVideo === 'function') {
                console.log('正在初始化滤镜...');
                await initFilterWithVideo(video);
                
                // 初始化滤镜UI
                if (typeof initFilterUI === 'function') {
                    initFilterUI();
                }
            }
        }, 500);
    });
    
    // 监听AR错误
    scene.addEventListener('arError', function(event) {
        console.error('❌ AR错误:', event);
        showError('AR初始化失败，请刷新页面重试');
    });
    
    // 监听目标找到
    const targetEntity = document.querySelector('[mindar-image-target]');
    if (targetEntity) {
        targetEntity.addEventListener('targetFound', handleTargetFound);
        targetEntity.addEventListener('targetLost', handleTargetLost);
    }
    
    // 监听模型加载
    const model = document.getElementById('buddha-entity');
    if (model) {
        model.addEventListener('model-loaded', handleModelLoaded);
        model.addEventListener('model-error', handleModelError);
    }
}

/**
 * 目标图像被识别
 */
function handleTargetFound() {
    isTargetFound = true;
    console.log('🎯 目标图像识别成功！');
    updateHint('✨ 佛像正在显现...');
    
    // 触发特殊音效（如果有）
    playSound('found');
    
    // 记录分析数据
    logAnalytics('target_found');
    
    // 3秒后隐藏提示
    setTimeout(() => {
        if (isTargetFound) {
            updateHint('✨ 欣赏佛像旋转展示');
        }
    }, 3000);
}

/**
 * 目标图像丢失
 */
function handleTargetLost() {
    isTargetFound = false;
    console.log('👁️ 目标图像丢失');
    updateHint('📱 请重新对准标记图像');
    
    // 记录分析数据
    logAnalytics('target_lost');
}

/**
 * 模型加载完成
 */
function handleModelLoaded() {
    isModelLoaded = true;
    console.log('✅ 3D模型加载完成');
    
    // 可以在这里添加模型后处理
    optimizeModel();
}

/**
 * 模型加载错误
 */
function handleModelError(event) {
    console.error('❌ 模型加载失败:', event);
    showError('3D模型加载失败，请检查文件路径');
}

/**
 * 优化模型性能
 */
function optimizeModel() {
    const model = document.getElementById('buddha-entity');
    if (!model) return;
    
    // 等待模型完全加载后进行优化
    setTimeout(() => {
        // 这里可以添加LOD（细节层次）优化
        console.log('🔧 模型优化完成');
    }, 100);
}

/**
 * 播放音效
 */
function playSound(type) {
    // 预留音效功能
    // 可以在这里添加音效播放逻辑
    console.log(`🔊 播放音效: ${type}`);
}

/**
 * 更新加载界面文字
 */
function updateLoadingText(mainText, detailText) {
    const loadingText = document.getElementById('loading-text');
    const loadingDetail = document.getElementById('loading-detail');
    
    if (loadingText) {
        loadingText.textContent = mainText;
    }
    if (loadingDetail && detailText) {
        loadingDetail.textContent = detailText;
    }
}

/**
 * 更新提示信息
 */
function updateHint(message) {
    if (hint) {
        hint.textContent = message;
        hint.style.display = 'block';
        
        // 添加淡入效果
        hint.style.opacity = '0';
        setTimeout(() => {
            hint.style.transition = 'opacity 0.5s';
            hint.style.opacity = '1';
        }, 10);
    }
}

/**
 * 隐藏加载界面
 */
function hideLoading() {
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500);
    }
}

/**
 * 显示错误信息
 */
function showError(message) {
    if (loadingOverlay) {
        // 检查 message 是否已经包含 HTML
        const isHTML = message.includes('<');
        
        if (isHTML) {
            loadingOverlay.innerHTML = message;
        } else {
            loadingOverlay.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 60px; margin-bottom: 20px;">⚠️</div>
                    <div style="font-size: 20px; margin-bottom: 20px;">${message}</div>
                    <button class="btn" onclick="location.reload()" 
                        style="background: white; color: #333; padding: 12px 30px; 
                        border: none; border-radius: 25px; cursor: pointer; font-size: 16px;">
                        刷新页面
                    </button>
                </div>
            `;
        }
        loadingOverlay.style.display = 'flex';
        loadingOverlay.style.opacity = '1';
    }
    console.error('❌ 错误:', message.replace(/<[^>]*>/g, '')); // 去除 HTML 标签记录到控制台
}

/**
 * 初始化性能监控
 */
function initPerformanceMonitor() {
    // 监控帧率
    let lastTime = performance.now();
    let frames = 0;
    
    function measureFPS() {
        frames++;
        const currentTime = performance.now();
        
        if (currentTime >= lastTime + 1000) {
            const fps = Math.round((frames * 1000) / (currentTime - lastTime));
            console.log(`📊 FPS: ${fps}`);
            
            // 如果帧率过低，发出警告
            if (fps < 20) {
                console.warn('⚠️ 帧率较低，建议降低模型质量或关闭其他应用');
            }
            
            frames = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(measureFPS);
    }
    
    requestAnimationFrame(measureFPS);
}

/**
 * 记录分析数据
 */
function logAnalytics(event, data = {}) {
    // 预留分析功能
    const analyticsData = {
        event: event,
        timestamp: new Date().toISOString(),
        ...data
    };
    
    console.log('📈 分析数据:', analyticsData);
    
    // 可以在这里发送到分析服务器
    // sendToAnalytics(analyticsData);
}

/**
 * 处理窗口大小变化
 */
window.addEventListener('resize', function() {
    console.log('📐 窗口大小变化');
    // 必要时重新调整AR场景
});

/**
 * 处理页面可见性变化
 */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('👁️ 页面隐藏');
        // 暂停不必要的处理
    } else {
        console.log('👁️ 页面显示');
        // 恢复处理
    }
});

/**
 * 导出调试工具
 */
window.ARDebug = {
    getStatus: function() {
        return {
            targetFound: isTargetFound,
            modelLoaded: isModelLoaded
        };
    }
};

console.log('💡 调试提示: 在控制台输入 ARDebug.getStatus() 查看状态');
