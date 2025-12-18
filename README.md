# 云冈石窟 AR 体验项目

基于 Web AR 技术的云冈石窟数字文化体验项目，结合 MindAR 图像识别、A-Frame 3D 渲染和云冈美学滤镜，为用户提供沉浸式的文化遗产互动体验。

## ✨ 功能特性

- 🎯 **AR 图像识别** - 对准标记图像触发 3D 佛像显示
- 🗿 **3D 模型展示** - 高质量佛像模型，支持交互动画
- 🎨 **云冈美学滤镜** - AI 训练的云冈风格色彩滤镜，可调节强度
- 📱 **移动端优化** - 完全响应式设计，支持手机和平板
- 🌐 **纯静态网页** - 无需后端服务器，可直接部署到 GitHub Pages

## 🚀 快速开始

### 方式一：本地运行

```bash
# 1. 进入项目目录
cd ARYunGang

# 2. 启动 HTTP 服务器
python -m http.server 8000

# 3. 访问浏览器
# 打开 http://localhost:8000
```

### 方式二：部署到 GitHub Pages

1. **创建 GitHub 仓库并推送代码**
```bash
git init
git add .
git commit -m "云冈石窟 AR 体验项目"
git remote add origin https://github.com/你的用户名/yungang-ar.git
git branch -M main
git push -u origin main
```

2. **启用 GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source 选择：Branch: `main`, Folder: `/ (root)`
   - 保存后等待 1-2 分钟
   - 访问：`https://你的用户名.github.io/yungang-ar/`

## 📖 使用说明

### 1. 启动 AR 体验

1. 打开主页，点击"启动 AR 相机"按钮
2. 允许浏览器访问摄像头权限
3. 将摄像头对准云冈石窟标记图像

### 2. 使用云冈滤镜

- 点击"🎨 云冈滤镜"按钮开启/关闭滤镜
- 滤镜开启后，拖动强度滑块调节效果（0-100%）
- 滤镜采用 AI 训练的 3D LUT 技术，呈现云冈石窟独特的色彩美学

### 3. 互动体验

- 点击 3D 佛像模型触发动画效果
- 移动摄像头，模型会跟随标记图像
- 遮挡标记图像，模型会自动隐藏

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
│   ├── target.mind           # AR 标记数据
│   └── target.png            # AR 标记图像
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

## ❓ 常见问题

### Q1: 摄像头无法打开？

**解决方案：**
- 检查浏览器摄像头权限设置
- 确保使用 HTTPS 或 localhost
- 尝试使用 Chrome 浏览器
- 关闭其他正在使用摄像头的应用

### Q2: 无法识别标记图像？

**解决方案：**
- 确保标记图像（`target.png`）清晰可见
- 标记图像需占据屏幕 25% 以上区域
- 保持充足光照，避免反光和阴影
- 标记图像需要打印或在另一设备上显示

### Q3: AR 初始化失败？

**解决方案：**
- 使用 Chrome 浏览器（推荐）
- 检查 `assets/target.mind` 文件是否存在
- 打开浏览器控制台查看详细错误信息
- 确保网络连接正常（首次加载需下载 AR 库）

### Q4: 3D 模型不显示？

**解决方案：**
- 检查 `models/buddha.glb` 或 `buddha_big.glb` 文件是否存在
- 确认标记图像已被成功识别
- 等待模型加载完成（大文件需要更长时间）
- 查看浏览器控制台是否有加载错误

### Q5: 云冈滤镜无法使用？

**解决方案：**
- 确认 `filters/yungang_filter.bin` 文件存在（6MB）
- 等待滤镜数据加载完成（按钮会从"加载中"变为"关闭"）
- 检查浏览器控制台是否有加载错误
- 刷新页面重试

## 📦 完整部署到 GitHub Pages

### 文件大小检查

GitHub Pages 限制：
- 单文件 < 100MB ✅
- 总仓库 < 1GB ✅

本项目文件大小：
- `buddha.glb`: 35MB ✅
- `buddha_big.glb`: 2.6MB ✅
- `yungang_filter.bin`: 6MB ✅
- 总计：~50MB ✅

**完全满足 GitHub Pages 要求！**

### 部署步骤

```bash
# 1. 初始化 Git 仓库
git init

# 2. 添加所有文件
git add .

# 3. 提交
git commit -m "云冈石窟 AR 体验项目"

# 4. 关联 GitHub 仓库
git remote add origin https://github.com/你的用户名/yungang-ar.git

# 5. 推送代码
git branch -M main
git push -u origin main
```

### 启用 GitHub Pages

1. 打开 GitHub 仓库页面
2. 点击 **Settings** → **Pages**
3. 在 **Source** 下选择：
   - Branch: `main`
   - Folder: `/ (root)`
4. 点击 **Save**
5. 等待 1-2 分钟，访问：`https://你的用户名.github.io/yungang-ar/`

## 👥 团队成员

| 成员 | 职责 |
|------|------|
| 王骏达 | AI 云冈滤镜训练与 Web 集成 |
| 凌萌 | AR 图像识别功能开发 |
| 侯超然 | 3D 模型与动画控制 |

## 📄 许可证

本项目代码采用 MIT License。

使用的第三方资源请遵守其各自的授权协议：
- 云冈石窟相关素材：请联系云冈石窟研究院获取授权
- 3D 模型：遵守 Sketchfab 平台的 CC 协议

---

## 🎉 开始体验

项目已准备就绪！

- 本地测试：`python -m http.server 8000`
- GitHub Pages：按照上述步骤部署

祝你体验愉快！如有问题，请查阅本文档或联系团队成员。
