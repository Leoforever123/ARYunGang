# 云冈石窟 AR 体验项目

基于 Web AR 技术的云冈石窟数字文化体验项目，结合 MindAR 图像识别、A-Frame 3D 渲染和云冈美学滤镜，为用户提供沉浸式的文化遗产互动体验。

## ✨ 功能特性

- 🎯 **AR 图像识别** - 对准标记图像触发 3D 佛像显示
- 🗿 **3D 模型展示** - 高质量佛像模型，自动旋转展示
- 🎨 **云冈美学滤镜** - AI 训练的云冈风格色彩滤镜，可调节强度
- 📱 **移动端优化** - 完全响应式设计，支持手机和平板


## 📖 使用说明

### 1. 配置选择（可选）

1. 在主页点击"⚙️ 选择配置"按钮
2. 选择标记图像（3个预制选项）
3. 选择3D模型（标准模型 35MB 或 轻量模型 2.6MB）
4. 点击"启动 AR 体验"

### 2. 启动 AR 体验

1. 打开主页，点击"启动 AR 相机"按钮（或先配置再启动）
2. 允许浏览器访问摄像头权限
3. 将摄像头对准云冈石窟标记图像

### 3. 使用云冈滤镜

- 点击"🎨 云冈滤镜"按钮开启/关闭滤镜
- 滤镜开启后，拖动强度滑块调节效果（0-100%）
- 滤镜采用 AI 训练的 3D LUT 技术，呈现云冈石窟独特的色彩美学

### 4. 互动体验

- 移动摄像头，模型会跟随标记图像
- 遮挡标记图像，模型会自动隐藏
- 3D 模型自动旋转展示，呈现完整细节

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| MindAR | 1.2.0 | Web AR 图像识别引擎 |
| A-Frame | 1.4.0 | WebXR 3D 渲染框架 |
| Canvas API | - | 实时滤镜处理 |
| 3D LUT | 128³ | AI 训练的颜色映射表 |

## 📁 项目结构

```
ARYunGang/
├── index.html                 # 欢迎页面（海报风格）
├── main.html                  # 主页面（项目介绍）
├── config.html                # 配置选择页面 ⭐ 新增
├── ar-viewer.html             # AR 体验页面
├── page.html                  # 备用页面
│
├── filters/                   # 滤镜模块
│   ├── yungang_filter.bin     # LUT 数据（6MB）
│   └── yungang-filter.js      # 滤镜处理器
│
├── scripts/                   # JavaScript 脚本
│   ├── ar-controller.js       # AR 控制逻辑
│   └── filter-controller.js   # 滤镜控制器
│
├── models/                    # 3D 模型
│   ├── buddha.glb            # 主佛像模型（35MB）
│   └── buddha_big.glb        # 备用模型（2.6MB）
│
├── assets/                    # 资源文件
│   ├── target.mind           # AR 标记数据（默认）
│   ├── target.png            # AR 标记图像（默认）
│   └── targets/              # 预制标记图像 ⭐ 新增
│       ├── target1.mind      # 云冈第20窟
│       ├── target1.png
│       ├── target2.mind      # 云冈全景
│       ├── target2.png
│       ├── target3.mind      # 云冈明信片
│       ├── target3.png
│       └── README.md         # 标记图像准备指南
│
└── styles/                    # 样式文件
    └── main.css              # 主样式表
```

## 🎯 浏览器支持

- ✅ Chrome 90+ （推荐，WebGL 支持最佳）
- ✅ Edge 90+
- ✅ Safari 14+ （iOS 需要 14.5+）
- ⚠️ Firefox 88+ （部分 WebAR 功能受限）

**注意**：由于 WebAR 需要摄像头权限，必须在 HTTPS 或 localhost 环境下运行。GitHub Pages 自动提供 HTTPS，无需担心。

## ⚙️ 性能优化建议

### 如果遇到加载缓慢：

1. **优化模型文件**：使用 `buddha_big.glb`（2.6MB）替代 `buddha.glb`（35MB）
   ```html
   <!-- 在 ar-viewer.html 中修改模型路径 -->
   <a-asset-item id="buddha-model" src="./models/buddha_big.glb"></a-asset-item>
   ```

2. **使用 Chrome 浏览器**：Edge 浏览器的 WebGL 支持可能导致初始化较慢

3. **首次加载需要时间**：
   - MindAR 库：~2MB
   - A-Frame 库：~1MB
   - LUT 滤镜数据：6MB
   - 3D 模型：2.6-35MB
   - 总计首次加载：10-45MB

### 如果遇到性能卡顿：

- 关闭云冈滤镜（滤镜处理会增加 10-20ms 延迟）
- 降低滤镜强度
- 使用高性能设备
- 关闭其他占用 GPU 的程序


## 👥 团队成员

| 成员 | 职责 |
|------|------|
| 王骏达 | AI 云冈滤镜训练 |
| 凌萌 | AR 图像识别功能开发 |
| 侯超然 | 3D 模型与动画控制 |

## 📄 许可证

本项目代码采用 MIT License。

使用的第三方资源请遵守其各自的授权协议：
- 云冈石窟相关素材：请联系云冈石窟研究院获取授权
- 3D 模型：遵守 Sketchfab 平台的 CC 协议

---
