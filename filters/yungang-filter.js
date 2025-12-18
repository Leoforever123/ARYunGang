/**
 * Yungang Filter LUT Loader and Processor
 * 云冈滤镜 LUT 加载和处理器
 */

class YungangFilter {
    constructor() {
        this.lut = null;
        this.lutSize = 0;
        this.step = 0;
        this.isLoaded = false;
    }
    
    /**
     * Load LUT from binary file
     * 从二进制文件加载 LUT
     */
    async loadBinary(url) {
        console.log('Loading LUT from:', url);
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        
        const dataView = new DataView(buffer);
        this.lutSize = dataView.getUint32(0, true); // little-endian
        this.step = Math.floor(256 / this.lutSize);
        
        console.log(`LUT Size: ${this.lutSize}³`);
        
        // 读取 LUT 数据
        const lutData = new Uint8Array(buffer, 4); // 跳过前 4 字节的 size
        this.lut = new Uint8Array(lutData);
        
        this.isLoaded = true;
        console.log('✓ LUT loaded successfully');
    }
    
    /**
     * Load LUT from compressed JSON
     * 从压缩 JSON 加载 LUT
     */
    async loadJSON(url) {
        console.log('Loading LUT from:', url);
        const response = await fetch(url);
        const lutData = await response.json();
        
        this.lutSize = lutData.size;
        this.step = Math.floor(256 / this.lutSize);
        
        console.log(`LUT Size: ${this.lutSize}³`);
        
        if (lutData.compressed) {
            // 解压数据
            const compressedData = Uint8Array.from(atob(lutData.data), c => c.charCodeAt(0));
            const decompressed = pako.inflate(compressedData); // 需要 pako.js 库
            this.lut = new Uint8Array(decompressed);
        } else {
            this.lut = new Uint8Array(JSON.parse(lutData.data));
        }
        
        this.isLoaded = true;
        console.log('✓ LUT loaded successfully');
    }
    
    /**
     * Apply filter to video frame
     * 对视频帧应用滤镜
     */
    applyFilter(imageData) {
        if (!this.isLoaded) {
            console.warn('LUT not loaded yet');
            return imageData;
        }
        
        const data = imageData.data;
        const output = new Uint8ClampedArray(data.length);
        
        const size = this.lutSize;
        const step = this.step;
        
        // 处理每个像素
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];
            
            // 计算 LUT 索引
            const r_idx = Math.min(Math.floor(r / step), size - 1);
            const g_idx = Math.min(Math.floor(g / step), size - 1);
            const b_idx = Math.min(Math.floor(b / step), size - 1);
            
            // 查表 (B, G, R 顺序，每个像素 3 字节)
            const lutIndex = ((b_idx * size * size) + (g_idx * size) + r_idx) * 3;
            
            output[i] = this.lut[lutIndex + 2];     // R
            output[i + 1] = this.lut[lutIndex + 1]; // G
            output[i + 2] = this.lut[lutIndex];     // B
            output[i + 3] = a;                       // Alpha
        }
        
        return new ImageData(output, imageData.width, imageData.height);
    }
    
    /**
     * Apply filter to canvas
     * 对 Canvas 应用滤镜
     */
    applyToCanvas(sourceCanvas, targetCanvas) {
        if (!this.isLoaded) {
            console.warn('LUT not loaded yet');
            return;
        }
        
        const ctx = sourceCanvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
        
        const filtered = this.applyFilter(imageData);
        
        const targetCtx = targetCanvas.getContext('2d');
        targetCtx.putImageData(filtered, 0, 0);
    }
}
