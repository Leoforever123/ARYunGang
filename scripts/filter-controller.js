/**
 * Yungang Filter Controller
 * 云冈滤镜控制器 - 管理滤镜的开关和应用
 */

class FilterController {
    constructor() {
        this.filter = null;
        this.enabled = false;
        this.strength = 1.0;
        this.isLoading = false;
        this.videoElement = null;
        this.canvas = null;
        this.ctx = null;
        this.displayCanvas = null;
        this.displayCtx = null;
        this.animationId = null;
    }
    
    /**
     * Initialize filter controller
     * 初始化滤镜控制器
     */
    async init(videoElement) {
        console.log('🎨 初始化云冈滤镜...');
        this.videoElement = videoElement;
        
        // 创建离屏 canvas 用于处理
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        
        // 获取显示 canvas
        this.displayCanvas = document.getElementById('filter-canvas');
        if (this.displayCanvas) {
            this.displayCtx = this.displayCanvas.getContext('2d');
        }
        
        // 加载滤镜
        try {
            this.isLoading = true;
            this.filter = new YungangFilter();
            await this.filter.loadBinary('filters/yungang_filter.bin');
            console.log('✓ 云冈滤镜加载完成');
            this.isLoading = false;
            
            // 开始渲染循环
            this.startRenderLoop();
            
            return true;
        } catch (error) {
            console.error('❌ 滤镜加载失败:', error);
            this.isLoading = false;
            return false;
        }
    }
    
    /**
     * Start render loop
     * 开始渲染循环
     */
    startRenderLoop() {
        const render = () => {
            if (this.enabled && this.videoElement && this.videoElement.readyState >= 2) {
                this.renderFilter();
            }
            this.animationId = requestAnimationFrame(render);
        };
        render();
    }
    
    /**
     * Render filter to display canvas
     * 渲染滤镜到显示 canvas
     */
    renderFilter() {
        if (!this.displayCanvas || !this.displayCtx) return;
        
        try {
            // 调整 canvas 尺寸
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            if (this.displayCanvas.width !== width || this.displayCanvas.height !== height) {
                this.displayCanvas.width = width;
                this.displayCanvas.height = height;
            }
            
            // 计算视频显示尺寸（保持比例）
            const videoAspect = this.videoElement.videoWidth / this.videoElement.videoHeight;
            const screenAspect = width / height;
            
            let drawWidth, drawHeight, offsetX, offsetY;
            
            if (videoAspect > screenAspect) {
                drawHeight = height;
                drawWidth = height * videoAspect;
                offsetX = (width - drawWidth) / 2;
                offsetY = 0;
            } else {
                drawWidth = width;
                drawHeight = width / videoAspect;
                offsetX = 0;
                offsetY = (height - drawHeight) / 2;
            }
            
            // 设置处理 canvas 尺寸（使用较小的尺寸以提高性能）
            const processWidth = Math.min(640, this.videoElement.videoWidth);
            const processHeight = (processWidth / this.videoElement.videoWidth) * this.videoElement.videoHeight;
            
            if (this.canvas.width !== processWidth || this.canvas.height !== processHeight) {
                this.canvas.width = processWidth;
                this.canvas.height = processHeight;
            }
            
            // 绘制并处理
            this.ctx.drawImage(this.videoElement, 0, 0, processWidth, processHeight);
            const imageData = this.ctx.getImageData(0, 0, processWidth, processHeight);
            const filtered = this.filter.applyFilter(imageData);
            
            // 应用强度
            if (this.strength < 1.0) {
                const original = imageData.data;
                const result = filtered.data;
                for (let i = 0; i < original.length; i += 4) {
                    result[i] = original[i] * (1 - this.strength) + result[i] * this.strength;
                    result[i + 1] = original[i + 1] * (1 - this.strength) + result[i + 1] * this.strength;
                    result[i + 2] = original[i + 2] * (1 - this.strength) + result[i + 2] * this.strength;
                }
            }
            
            this.ctx.putImageData(filtered, 0, 0);
            
            // 绘制到显示 canvas
            this.displayCtx.clearRect(0, 0, width, height);
            this.displayCtx.drawImage(this.canvas, 0, 0, processWidth, processHeight, 
                                     offsetX, offsetY, drawWidth, drawHeight);
            
        } catch (error) {
            console.error('渲染错误:', error);
        }
    }
    
    /**
     * Toggle filter on/off
     * 切换滤镜开关
     */
    toggle() {
        this.enabled = !this.enabled;
        console.log(`🎨 滤镜${this.enabled ? '已开启' : '已关闭'}`);
        
        // 显示/隐藏 filter canvas
        if (this.displayCanvas) {
            this.displayCanvas.style.display = this.enabled ? 'block' : 'none';
        }
        
        return this.enabled;
    }
    
    /**
     * Set filter strength
     * 设置滤镜强度
     */
    setStrength(value) {
        this.strength = Math.max(0, Math.min(1, value));
        console.log(`🎨 滤镜强度: ${(this.strength * 100).toFixed(0)}%`);
    }
    
    /**
     * Apply filter to video element
     * 对视频元素应用滤镜
     */
    applyToVideo() {
        if (!this.enabled || !this.filter || !this.filter.isLoaded || !this.videoElement) {
            return null;
        }
        
        try {
            // 设置 canvas 尺寸匹配视频
            if (this.canvas.width !== this.videoElement.videoWidth || 
                this.canvas.height !== this.videoElement.videoHeight) {
                this.canvas.width = this.videoElement.videoWidth;
                this.canvas.height = this.videoElement.videoHeight;
            }
            
            // 绘制当前视频帧到 canvas
            this.ctx.drawImage(this.videoElement, 0, 0);
            
            // 获取图像数据
            const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            
            // 应用滤镜
            const filtered = this.filter.applyFilter(imageData);
            
            // 如果强度<1,混合原图和滤镜效果
            if (this.strength < 1.0) {
                const original = imageData.data;
                const result = filtered.data;
                for (let i = 0; i < original.length; i += 4) {
                    result[i] = original[i] * (1 - this.strength) + result[i] * this.strength;
                    result[i + 1] = original[i + 1] * (1 - this.strength) + result[i + 1] * this.strength;
                    result[i + 2] = original[i + 2] * (1 - this.strength) + result[i + 2] * this.strength;
                }
            }
            
            // 绘制回 canvas
            this.ctx.putImageData(filtered, 0, 0);
            
            return this.canvas;
        } catch (error) {
            console.error('❌ 滤镜应用失败:', error);
            return null;
        }
    }
}

// 全局滤镜控制器实例
window.filterController = null;

/**
 * Initialize filter UI
 * 初始化滤镜UI控制
 */
function initFilterUI() {
    const toggleBtn = document.getElementById('toggle-filter');
    const strengthSlider = document.getElementById('filter-strength');
    const strengthValue = document.getElementById('strength-value');
    const strengthContainer = document.querySelector('.filter-strength');
    
    if (!toggleBtn) {
        console.warn('滤镜控制按钮未找到');
        return;
    }
    
    // 切换滤镜
    toggleBtn.addEventListener('click', function() {
        if (!window.filterController) {
            alert('滤镜尚未初始化');
            return;
        }
        
        if (window.filterController.isLoading) {
            alert('滤镜正在加载中，请稍候...');
            return;
        }
        
        const enabled = window.filterController.toggle();
        toggleBtn.textContent = `🎨 云冈滤镜: ${enabled ? '开启' : '关闭'}`;
        toggleBtn.style.background = enabled ? 'rgba(76, 175, 80, 0.9)' : 'rgba(0, 0, 0, 0.7)';
        
        // 显示/隐藏强度控制
        if (strengthContainer) {
            strengthContainer.style.display = enabled ? 'flex' : 'none';
        }
    });
    
    // 调整强度
    if (strengthSlider && strengthValue) {
        strengthSlider.addEventListener('input', function() {
            const value = parseInt(this.value) / 100;
            if (window.filterController) {
                window.filterController.setStrength(value);
            }
            strengthValue.textContent = this.value + '%';
        });
    }
    
    console.log('✓ 滤镜UI初始化完成');
}

/**
 * Initialize filter with video element
 * 使用视频元素初始化滤镜
 */
async function initFilterWithVideo(videoElement) {
    console.log('初始化滤镜控制器...');
    
    window.filterController = new FilterController();
    const success = await window.filterController.init(videoElement);
    
    if (success) {
        console.log('✓ 滤镜系统就绪');
        // 启用UI
        const toggleBtn = document.getElementById('toggle-filter');
        if (toggleBtn) {
            toggleBtn.disabled = false;
            toggleBtn.style.opacity = '1';
        }
    } else {
        console.error('❌ 滤镜初始化失败');
        const toggleBtn = document.getElementById('toggle-filter');
        if (toggleBtn) {
            toggleBtn.textContent = '❌ 滤镜加载失败';
            toggleBtn.disabled = true;
        }
    }
    
    return success;
}

