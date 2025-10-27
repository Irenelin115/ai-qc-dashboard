# 語音質檢系統 - 意圖分析API整合文檔

## 概述

本文檔說明如何將意圖分析功能整合到現有的語音質檢系統中，實現音檔上傳 → STT轉錄 → AI意圖分析的完整流程。

## API接口設計

### 1. 意圖分析接口

**接口地址：** `POST /api/intent-analysis`

**請求參數：**
```json
{
  "stt_text": "客戶語音轉錄文本",
  "session_id": "會話唯一標識符",
  "timestamp": "2025-08-01T16:34:21.000Z",
  "metadata": {
    "call_duration": 180,
    "customer_id": "CUST001",
    "agent_id": "AGENT001"
  }
}
```

**響應格式：**
```json
{
  "status": "success",
  "data": {
    "intent": "意圖類別名稱",
    "confidence": 0.85,
    "reasoning": "基於文本內容的具體分析理由，說明為什麼判斷為此意圖",
    "analysis_time": "2025-08-01T16:34:23.500Z",
    "session_id": "會話唯一標識符"
  },
  "error": null
}
```

## 意圖類別清單

系統支援以下22個意圖類別：

### 保險相關意圖 (5個)
1. **詢問保單** - 客戶詢問保險相關資訊、保單內容、理賠流程等
2. **購買意願** - 客戶表達購買意願、詢問價格、比較產品等
3. **理賠申請** - 客戶申請理賠、提交理賠資料、詢問理賠進度等
4. **保單變更** - 客戶要求變更保單內容、受益人、聯絡資訊等
5. **續保詢問** - 客戶詢問續保事宜、保費調整、續保優惠等

### 帳務相關意圖 (4個)
6. **帳單查詢** - 客戶查詢帳單、繳費記錄、費用明細等
7. **帳單申請** - 客戶申請帳單、更改計費方式、設定自動扣款等
8. **繳費問題** - 客戶詢問繳費方式、繳費期限、逾期處理等
9. **費用爭議** - 客戶對費用計算有疑問、申請費用減免、退費等

### 服務相關意圖 (3個)
10. **技術支援** - 客戶遇到技術問題、系統故障、操作困難等
11. **服務諮詢** - 客戶詢問服務內容、使用方法、功能說明等
12. **預約服務** - 客戶預約面談、電話回訪、到府服務等

### 客訴相關意圖 (3個)
13. **服務投訴** - 客戶對服務品質不滿、投訴服務態度、處理效率等
14. **產品投訴** - 客戶對產品功能不滿、產品缺陷、效果不佳等
15. **申請退保** - 客戶要求退保、解約、終止服務等

### 資訊查詢意圖 (3個)
16. **營業資訊** - 客戶詢問營業時間、據點位置、聯絡方式等
17. **促銷活動** - 客戶詢問優惠活動、促銷方案、折扣資訊等
18. **流程說明** - 客戶詢問申請流程、辦理手續、所需文件等

### 其他意圖 (4個)
19. **感謝回饋** - 客戶表達感謝、給予正面回饋、推薦他人等
20. **閒聊交談** - 客戶進行閒聊、寒暄、非業務相關對話等
21. **轉接請求** - 客戶要求轉接專員、轉接部門、人工服務等

## 置信度評分規則

- **0.8-1.0 (高置信度)** - 關鍵詞完全匹配，意圖明確清晰
- **0.6-0.79 (中等置信度)** - 部分關鍵詞匹配，意圖較明確
- **0.4-0.59 (低置信度)** - 少量關鍵詞匹配，意圖模糊
- **0.0-0.39 (極低置信度)** - 無明確關鍵詞，難以判斷意圖

## 整合流程

### 1. 音檔處理流程
```
音檔上傳 → STT轉錄 → 意圖分析 → 結果展示 → 人工覆核（可選）
```

### 2. 系統架構建議
```
前端界面 ← → API Gateway ← → 意圖分析服務
    ↓                              ↓
音檔存儲                        意圖數據庫
    ↓                              ↓
STT服務                        機器學習模型
```

### 3. 實作範例

**JavaScript前端調用：**
```javascript
async function analyzeIntent(sttText, sessionId) {
  try {
    const response = await fetch('/api/intent-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        stt_text: sttText,
        session_id: sessionId,
        timestamp: new Date().toISOString()
      })
    });
    
    const result = await response.json();
    
    if (result.status === 'success') {
      displayIntentResult(result.data);
    } else {
      console.error('意圖分析失敗:', result.error);
    }
  } catch (error) {
    console.error('API調用錯誤:', error);
  }
}

function displayIntentResult(data) {
  const resultContainer = document.getElementById('intent-result');
  resultContainer.innerHTML = `
    <div class="result-item">
      <span class="intent-label">${data.intent}</span>
      <span class="confidence">置信度: ${Math.round(data.confidence * 100)}%</span>
    </div>
    <div class="reasoning">
      <strong>分析理由：</strong>${data.reasoning}
    </div>
  `;
}
```

**Python後端實作：**
```python
from flask import Flask, request, jsonify
import datetime
import uuid

app = Flask(__name__)

@app.route('/api/intent-analysis', methods=['POST'])
def analyze_intent():
    try:
        data = request.get_json()
        stt_text = data.get('stt_text', '')
        session_id = data.get('session_id', str(uuid.uuid4()))
        
        # 調用意圖分析模型
        result = intent_analyzer.analyze(stt_text)
        
        response = {
            "status": "success",
            "data": {
                "intent": result['intent'],
                "confidence": result['confidence'],
                "reasoning": result['reasoning'],
                "analysis_time": datetime.datetime.now().isoformat(),
                "session_id": session_id
            },
            "error": None
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "data": None,
            "error": str(e)
        }), 500
```

## 效能考量

### 1. 響應時間
- 目標響應時間：< 2秒
- 建議使用快取機制對常見文本進行快速響應

### 2. 併發處理
- 支援多線程/異步處理
- 建議設置請求佇列和負載平衡

### 3. 準確性提升
- 定期更新關鍵詞庫
- 收集人工覆核數據用於模型訓練
- 實施A/B測試優化算法

## 監控與維護

### 1. 監控指標
- API響應時間
- 意圖識別準確率
- 每日分析量統計
- 錯誤率監控

### 2. 維護建議
- 定期備份意圖配置
- 監控模型效能變化
- 收集用戶反饋進行優化

## 安全考量

### 1. 數據安全
- 加密傳輸STT文本
- 設置適當的API訪問權限
- 記錄操作日誌

### 2. 隱私保護
- 不存儲敏感客戶資訊
- 匿名化處理分析數據
- 遵循相關數據保護法規

---

**版本：** v1.0  
**更新日期：** 2025-08-01  
**維護人員：** AI產品開發團隊