# 资源占位符说明

## assets/target.mind
**说明**: 这是编译后的标记图像文件  
**获取方式**: 
1. 准备一张云冈石窟相关图像
2. 访问 https://hiukim.github.io/mind-ar-js-doc/tools/compile
3. 上传图像并编译
4. 下载生成的 `.mind` 文件
5. 重命名为 `target.mind` 并放入此文件夹

**要求**:
- 图像分辨率 ≥ 1024px
- 质量评分 ≥ 75
- 特征丰富，对比度高

---

## models/buddha.glb
**说明**: 3D佛像模型文件  
**获取方式**:

### 推荐方案1: Sketchfab下载
1. 访问: https://sketchfab.com/3d-models/low-poly-buddha-game-ready-d12a3ad9dfc24a46afbfc0624b0ba57d
2. 点击 "Download 3D Model"
3. 选择 GLB 格式
4. 下载并重命名为 `buddha.glb`
5. 放入此文件夹

### 推荐方案2: 使用临时测试模型
项目提供了一个简单的测试模型链接（在HTML中）：
```html
<!-- 使用在线临时模型测试 -->
<a-asset-item 
    id="buddha-model" 
    src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.1.4/examples/image-tracking/assets/card-example/softmind/scene.gltf"
></a-asset-item>
```

等正式模型准备好后再替换。

**要求**:
- 文件格式: GLB
- 文件大小: < 10MB
- 面数: < 100,000
- 纹理分辨率: ≤ 2048x2048

---

## 临时测试方案

如果你想立即测试项目，可以：

1. **使用示例标记图像**
   - 下载MindAR官方示例: https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.1.4/examples/image-tracking/assets/card-example/card.png
   - 编译此图像生成 `target.mind`
   - 打印或在另一设备显示此图像用于测试

2. **使用在线模型**
   - 修改 `ar-viewer.html` 中的模型源
   - 使用CDN托管的测试模型
   - 等后续替换为正式模型

3. **完整测试工作流**
   ```bash
   # 1. 启动服务器
   python3 -m http.server 8000
   
   # 2. 访问项目
   http://localhost:8000
   
   # 3. 打开AR页面
   http://localhost:8000/ar-viewer.html
   
   # 4. 对准测试标记图像
   ```

---

## 文件结构检查

确保以下文件存在：
```
yungang-ar-project/
├── index.html ✅
├── ar-viewer.html ✅
├── styles/
│   └── main.css ✅
├── scripts/
│   └── ar-controller.js ✅
├── assets/
│   ├── target.mind ⚠️ 需要生成
│   └── target.png (可选，原始标记图像)
├── models/
│   └── buddha.glb ⚠️ 需要下载
└── docs/ ✅
```

---

## 快速开始清单

- [ ] 准备标记图像
- [ ] 编译生成 target.mind 文件
- [ ] 下载3D佛像模型
- [ ] 放置文件到正确目录
- [ ] 启动本地服务器测试
- [ ] 确认AR识别正常
- [ ] 调整模型参数（大小、位置）
- [ ] 准备部署

---

需要帮助？查看 `docs/` 目录下的详细指南文档。
