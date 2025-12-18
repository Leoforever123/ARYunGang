# 3D模型文件夹

## 说明

此文件夹用于存放AR项目中使用的3D模型文件。

---

## 需要的文件

### buddha.glb
- **类型**: 3D佛像模型
- **格式**: GLB (GL Transmission Format Binary)
- **用途**: AR场景中显示的主要3D对象

---

## 如何获取模型？

### 方案1：Sketchfab免费下载（推荐）

**推荐模型**：
1. **Low Poly Buddha game Ready** ⭐⭐⭐⭐⭐
   - 链接：https://sketchfab.com/3d-models/low-poly-buddha-game-ready-d12a3ad9dfc24a46afbfc0624b0ba57d
   - 授权：CC Attribution
   - 优点：游戏级优化，性能极佳

**下载步骤**：
```
1. 点击"Download 3D Model"按钮（需注册免费账号）
2. 选择"Autoconverted format (glTF)"
3. 选择"GLB"格式
4. 下载文件
5. 重命名为 buddha.glb
6. 放入此文件夹
```

### 方案2：使用临时在线模型（快速测试）

在项目运行前，可以先使用在线托管的测试模型：

修改 `ar-viewer.html` 中的代码：
```html
<a-asset-item 
    id="buddha-model" 
    src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.1.4/examples/image-tracking/assets/card-example/softmind/scene.gltf"
></a-asset-item>
```

这样可以先测试AR功能，之后再替换为正式的佛像模型。

### 方案3：使用Meshroom自建模型

参考 `docs/模型获取指南.md` 中的详细教程，使用摄影测量技术从照片生成3D模型。

---

## 模型要求

为确保AR效果流畅，模型应满足：

| 参数 | 要求 | 说明 |
|------|------|------|
| 文件格式 | GLB | 推荐格式，包含模型和纹理 |
| 文件大小 | < 10MB | 移动端性能考虑 |
| 面数 | < 100,000 | 保证流畅度 |
| 纹理分辨率 | ≤ 2048x2048 | 平衡质量和性能 |
| 动画 | 可选 | 如有内置动画会自动播放 |

---

## 模型优化

如果下载的模型过大或过于复杂，可以使用Blender进行优化：

### 使用Blender优化步骤

1. **安装Blender**
   ```
   下载地址：https://www.blender.org/download/
   ```

2. **导入模型**
   ```
   File → Import → glTF 2.0 (.glb/.gltf)
   ```

3. **减少面数**
   ```
   选中模型 → Modifier Properties → Add Modifier → Decimate
   设置 Ratio: 0.3-0.5 (减少到原来的30-50%)
   Apply Modifier
   ```

4. **压缩纹理**
   ```
   切换到 Shading 工作空间
   选择 Image Texture 节点
   在 UV/Image Editor 中打开纹理
   Image → Resize → 选择 2048x2048 或 1024x1024
   保存纹理
   ```

5. **导出GLB**
   ```
   File → Export → glTF 2.0 (.glb)
   
   设置：
   - Format: GLB (binary)
   - Include: Selected Objects (如果只选中了模型)
   - Compression: Draco mesh compression (勾选)
   - Transform: +Y Up
   
   导出为 buddha.glb
   ```

---

## 模型测试

### 在线预览GLB模型

可以使用以下在线工具预览模型：

1. **Sketchfab Viewer**
   - https://sketchfab.com/

2. **glTF Viewer**
   - https://gltf-viewer.donmccurdy.com/

3. **Three.js Editor**
   - https://threejs.org/editor/

### 在项目中测试

1. 将模型放入此文件夹
2. 启动项目：`python3 -m http.server 8000`
3. 访问：`http://localhost:8000/ar-viewer.html`
4. 扫描标记图像，观察模型显示效果

---

## 调整模型在AR中的显示

在 `ar-viewer.html` 中调整这些参数：

### 调整大小
```html
<a-gltf-model
    scale="0.5 0.5 0.5"
    <!-- 增大：改为 1.0 1.0 1.0 -->
    <!-- 缩小：改为 0.2 0.2 0.2 -->
>
```

### 调整位置
```html
<a-entity 
    id="buddha-container"
    position="0 0 0"
    <!-- 向上移动：改为 "0 0.5 0" -->
    <!-- 向下移动：改为 "0 -0.5 0" -->
>
```

### 调整旋转
```html
<a-gltf-model
    rotation="0 0 0"
    <!-- 旋转180度：改为 "0 180 0" -->
    <!-- 倾斜：改为 "30 0 0" -->
>
```

---

## 多模型支持

如果需要在不同标记上显示不同模型：

1. **准备多个模型文件**
   ```
   models/
   ├── buddha-sitting.glb
   ├── buddha-standing.glb
   └── buddha-head.glb
   ```

2. **在HTML中加载**
   ```html
   <a-assets>
     <a-asset-item id="model1" src="models/buddha-sitting.glb"></a-asset-item>
     <a-asset-item id="model2" src="models/buddha-standing.glb"></a-asset-item>
     <a-asset-item id="model3" src="models/buddha-head.glb"></a-asset-item>
   </a-assets>
   ```

3. **绑定到不同标记**
   ```html
   <a-entity mindar-image-target="targetIndex: 0">
     <a-gltf-model src="#model1"></a-gltf-model>
   </a-entity>
   
   <a-entity mindar-image-target="targetIndex: 1">
     <a-gltf-model src="#model2"></a-gltf-model>
   </a-entity>
   ```

---

## 常见问题

### Q: 模型显示为黑色？
**A**: 
- 检查光照设置
- 在Blender中调整材质的Base Color
- 增加场景中的光照强度

### Q: 模型加载很慢？
**A**: 
- 压缩模型文件大小
- 使用Draco压缩
- 减少面数和纹理分辨率

### Q: 模型方向不对？
**A**: 
- 调整rotation参数
- 或在Blender中调整方向后重新导出

### Q: 模型太亮或太暗？
**A**: 
- 调整场景光照
- 修改材质的Emission属性
- 使用更好的HDR环境贴图

---

## 云冈石窟特定模型资源

### 官方授权途径

**云冈石窟研究院数字化部门**
- 官网：http://www.yungang.org/
- 联系方式：可通过官网查询
- 申请说明：说明教育/研究用途

### 推荐参考

可参考以下云冈石窟3D数字化项目：
- 云冈石窟数字化博物馆
- 国家文物局数字文物库
- 考古文博领域的开放数据

---

## 版权声明

使用任何3D模型前请：
1. ✅ 检查授权协议（CC、公共领域等）
2. ✅ 保留原作者署名
3. ✅ 遵守使用条款
4. ✅ 商业用途需获得额外授权

---

**提示**：如果暂时没有合适的佛像模型，可以先使用测试模型完成功能开发，后续再替换为正式模型。

详细的模型获取和制作教程请参考：`docs/模型获取指南.md`
