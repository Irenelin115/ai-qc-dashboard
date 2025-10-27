class VoiceQualitySystem {
    constructor() {
        this.intentCategories = [
            // 保險相關意圖
            { name: '詢問保單', description: '客戶詢問保險相關資訊、保單內容、理賠流程等' },
            { name: '購買意願', description: '客戶表達購買意願、詢問價格、比較產品等' },
            { name: '理賠申請', description: '客戶申請理賠、提交理賠資料、詢問理賠進度等' },
            { name: '保單變更', description: '客戶要求變更保單內容、受益人、聯絡資訊等' },
            { name: '續保詢問', description: '客戶詢問續保事宜、保費調整、續保優惠等' },
            // 帳務相關意圖
            { name: '帳單查詢', description: '客戶查詢帳單、繳費記錄、費用明細等' },
            { name: '帳單申請', description: '客戶申請帳單、更改計費方式、設定自動扣款等' },
            { name: '繳費問題', description: '客戶詢問繳費方式、繳費期限、逾期處理等' },
            { name: '費用爭議', description: '客戶對費用計算有疑問、申請費用減免、退費等' },
            // 服務相關意圖
            { name: '技術支援', description: '客戶遇到技術問題、系統故障、操作困難等' },
            { name: '服務諮詢', description: '客戶詢問服務內容、使用方法、功能說明等' },
            { name: '預約服務', description: '客戶預約面談、電話回訪、到府服務等' },
            // 客訴相關意圖
            { name: '服務投訴', description: '客戶對服務品質不滿、投訴服務態度、處理效率等' },
            { name: '產品投訴', description: '客戶對產品功能不滿、產品缺陷、效果不佳等' },
            { name: '申請退保', description: '客戶要求退保、解約、終止服務等' },
            // 資訊查詢意圖
            { name: '營業資訊', description: '客戶詢問營業時間、據點位置、聯絡方式等' },
            { name: '促銷活動', description: '客戶詢問優惠活動、促銷方案、折扣資訊等' },
            { name: '流程說明', description: '客戶詢問申請流程、辦理手續、所需文件等' },
            // 其他意圖
            { name: '感謝回饋', description: '客戶表達感謝、給予正面回饋、推薦他人等' },
            { name: '閒聊交談', description: '客戶進行閒聊、寒暄、非業務相關對話等' },
            { name: '轉接請求', description: '客戶要求轉接專員、轉接部門、人工服務等' }
        ];
        
        this.fewShotSamples = [
            // 保險相關樣本
            { intent: '詢問保單', text: '請問我的保單什麼時候到期？理賠的流程是怎樣的？' },
            { intent: '購買意願', text: '我想了解一下你們的車險方案，價格大概多少？' },
            { intent: '理賠申請', text: '我要申請車禍理賠，需要準備什麼資料？' },
            { intent: '保單變更', text: '我想要更改保單的受益人，可以怎麼辦理？' },
            { intent: '續保詢問', text: '我的保險快到期了，續保會有優惠嗎？' },
            // 帳務相關樣本
            { intent: '帳單查詢', text: '我想查詢上個月的保費帳單明細' },
            { intent: '繳費問題', text: '請問保費可以用信用卡繳嗎？分期付款有手續費嗎？' },
            { intent: '費用爭議', text: '為什麼這個月的保費比上個月多了一千塊？' },
            // 服務相關樣本
            { intent: '技術支援', text: '我的保險APP登不進去，一直顯示密碼錯誤' },
            { intent: '服務諮詢', text: '請問你們有提供線上客服嗎？服務時間是幾點到幾點？' },
            { intent: '預約服務', text: '我想預約業務員到公司來說明團保方案' },
            // 客訴相關樣本
            { intent: '服務投訴', text: '你們的客服態度很差，講話很沒耐心，我要投訴' },
            { intent: '產品投訴', text: '這個保險根本沒有當初說的那麼好，很多都不賠' },
            { intent: '申請退保', text: '我不想要這個保險了，可以退保嗎？會扣多少錢？' },
            // 資訊查詢樣本
            { intent: '營業資訊', text: '請問你們台北的服務中心在哪裡？營業時間是？' },
            { intent: '促銷活動', text: '聽說你們最近有新保戶優惠活動，可以介紹一下嗎？' },
            { intent: '流程說明', text: '請問投保需要準備什麼文件？整個流程要多久？' },
            // 其他樣本
            { intent: '感謝回饋', text: '謝謝你們的服務這麼好，我會推薦朋友來投保' },
            { intent: '閒聊交談', text: '最近天氣真的很熱呢，你們那邊也很熱嗎？' },
            { intent: '轉接請求', text: '可以幫我轉接到理賠部門嗎？我要找專員處理' }
        ];
        
        this.reviewQueue = [
            {
                text: '客戶：我想查一下上個月的電話費帳單',
                aiResult: { intent: '帳單查詢', confidence: 0.85 },
                status: 'pending'
            }
        ];
        
        this.promptTemplate = `你是一個語音質檢系統的意圖分析助手。請分析以下STT文本中客戶的主要意圖，並從預定義的意圖類別中選擇最符合的一個。

意圖類別：
{INTENT_CATEGORIES}

Few-shot樣本：
{FEW_SHOT_EXAMPLES}

請分析以下文本：
{STT_TEXT}

請回覆JSON格式：
{
  "intent": "意圖類別名稱",
  "confidence": 0.85,
  "reasoning": "分析理由"
}`;
        
        this.init();
    }
    
    init() {
        this.setupTabSwitching();
        this.setupIntentDetection();
        this.setupPromptManagement();
        this.setupSampleManagement();
        this.setupReviewSystem();
        this.loadInitialData();
        
        console.log('語音質檢系統已初始化完成');
    }
    
    setupTabSwitching() {
        const navItems = document.querySelectorAll('.nav-item');
        const contentSections = document.querySelectorAll('.content-section');
        
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetSection = item.dataset.section;
                
                navItems.forEach(nav => nav.classList.remove('active'));
                contentSections.forEach(section => section.classList.remove('active'));
                
                item.classList.add('active');
                document.getElementById(`${targetSection}-section`).classList.add('active');
            });
        });
    }
    
    setupIntentDetection() {
        const detectBtn = document.getElementById('detect-intent');
        const sttText = document.getElementById('stt-text');
        const intentResult = document.getElementById('intent-result');
        const confirmBtn = document.getElementById('confirm-result');
        const reviewBtn = document.getElementById('manual-review');
        
        detectBtn.addEventListener('click', async () => {
            const text = sttText.value.trim();
            if (!text) {
                this.showMessage('請輸入STT文本', 'error');
                return;
            }
            
            detectBtn.textContent = '分析中...';
            detectBtn.disabled = true;
            
            try {
                const result = await this.detectIntent(text);
                this.displayResult(result, intentResult);
                confirmBtn.disabled = false;
                reviewBtn.disabled = false;
            } catch (error) {
                this.showMessage('意圖檢測失敗：' + error.message, 'error');
            } finally {
                detectBtn.textContent = 'LLM意圖檢測';
                detectBtn.disabled = false;
            }
        });
        
        confirmBtn.addEventListener('click', () => {
            this.showMessage('結果已確認並保存', 'success');
            confirmBtn.disabled = true;
            reviewBtn.disabled = true;
            sttText.value = '';
            intentResult.innerHTML = '<div class="result-item"><span class="intent-label">等待檢測...</span><span class="confidence">置信度: -</span></div>';
        });
        
        reviewBtn.addEventListener('click', () => {
            const text = sttText.value.trim();
            const resultElement = intentResult.querySelector('.intent-label');
            const confidenceElement = intentResult.querySelector('.confidence');
            
            if (resultElement && text) {
                const intent = resultElement.textContent;
                const confidence = parseFloat(confidenceElement.textContent.match(/\d+\.?\d*/)?.[0] || '0') / 100;
                
                this.addToReviewQueue({
                    text: `客戶：${text}`,
                    aiResult: { intent, confidence },
                    status: 'pending'
                });
                
                this.showMessage('已加入人工覆核佇列', 'info');
                this.refreshReviewList();
            }
        });
    }
    
    async detectIntent(text) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const textLower = text.toLowerCase();
        
        // 定義關鍵詞對應的意圖和置信度規則
        const intentRules = [
            // 保險相關意圖
            {
                intent: '詢問保單',
                keywords: ['保單', '保險', '到期', '內容', '條款', '查看保單'],
                confidence: 0.88,
                reasoning: '文本中包含保單相關查詢關鍵詞'
            },
            {
                intent: '購買意願',
                keywords: ['想買', '購買', '價格', '多少錢', '方案', '比較', '推薦', '了解'],
                confidence: 0.85,
                reasoning: '客戶表達了對產品的購買興趣和價格詢問'
            },
            {
                intent: '理賠申請',
                keywords: ['理賠', '申請理賠', '出險', '事故', '理賠資料', '理賠進度'],
                confidence: 0.92,
                reasoning: '客戶明確提到理賠相關需求'
            },
            {
                intent: '保單變更',
                keywords: ['變更', '修改', '更改', '受益人', '地址', '電話', '保險金額'],
                confidence: 0.87,
                reasoning: '客戶要求變更保單相關資訊'
            },
            {
                intent: '續保詢問',
                keywords: ['續保', '到期', '優惠', '保費調整', '延續', '重新'],
                confidence: 0.86,
                reasoning: '客戶詢問續保相關事宜'
            },
            
            // 帳務相關意圖
            {
                intent: '帳單查詢',
                keywords: ['帳單', '查詢', '明細', '繳費記錄', '費用', '查看帳單'],
                confidence: 0.91,
                reasoning: '客戶要求查詢帳單或繳費相關資訊'
            },
            {
                intent: '帳單申請',
                keywords: ['申請帳單', '電子帳單', '計費方式', '自動扣款', '繳費設定'],
                confidence: 0.84,
                reasoning: '客戶申請帳單或設定繳費方式'
            },
            {
                intent: '繳費問題',
                keywords: ['繳費', '付款', '期限', '信用卡', '分期', '手續費', '逾期'],
                confidence: 0.89,
                reasoning: '客戶詢問繳費相關問題'
            },
            {
                intent: '費用爭議',
                keywords: ['費用', '多收', '錯誤', '減免', '退費', '爭議', '為什麼'],
                confidence: 0.90,
                reasoning: '客戶對費用計算提出疑問或爭議'
            },
            
            // 服務相關意圖
            {
                intent: '技術支援',
                keywords: ['登不進去', '系統', '故障', '密碼', 'app', '網站', '打不開'],
                confidence: 0.93,
                reasoning: '客戶遇到技術問題需要支援'
            },
            {
                intent: '服務諮詢',
                keywords: ['服務', '怎麼用', '功能', '操作', '說明', '線上客服', '服務時間'],
                confidence: 0.82,
                reasoning: '客戶詢問服務內容或使用方法'
            },
            {
                intent: '預約服務',
                keywords: ['預約', '面談', '回訪', '到府', '約時間', '業務員'],
                confidence: 0.88,
                reasoning: '客戶要求預約相關服務'
            },
            
            // 客訴相關意圖
            {
                intent: '服務投訴',
                keywords: ['投訴', '態度', '不滿', '服務差', '沒耐心', '很差'],
                confidence: 0.94,
                reasoning: '客戶對服務品質表達不滿並要求投訴'
            },
            {
                intent: '產品投訴',
                keywords: ['產品', '不好', '缺陷', '不賠', '問題', '根本沒有'],
                confidence: 0.91,
                reasoning: '客戶對產品功能或效果表達不滿'
            },
            {
                intent: '申請退保',
                keywords: ['退保', '解約', '終止', '不要了', '取消', '不想要'],
                confidence: 0.95,
                reasoning: '客戶明確表達退保或解約意願'
            },
            
            // 資訊查詢意圖
            {
                intent: '營業資訊',
                keywords: ['營業時間', '地址', '位置', '電話', '據點', '服務中心'],
                confidence: 0.87,
                reasoning: '客戶詢問營業相關資訊'
            },
            {
                intent: '促銷活動',
                keywords: ['優惠', '活動', '促銷', '折扣', '特價', '新保戶'],
                confidence: 0.83,
                reasoning: '客戶詢問優惠或促銷活動'
            },
            {
                intent: '流程說明',
                keywords: ['流程', '手續', '文件', '怎麼辦', '步驟', '需要準備'],
                confidence: 0.85,
                reasoning: '客戶詢問辦理流程或所需文件'
            },
            
            // 其他意圖
            {
                intent: '感謝回饋',
                keywords: ['謝謝', '感謝', '很好', '推薦', '滿意', '辛苦了'],
                confidence: 0.92,
                reasoning: '客戶表達感謝或正面回饋'
            },
            {
                intent: '閒聊交談',
                keywords: ['天氣', '聊天', '最近', '身體', '過得怎樣', '真的很'],
                confidence: 0.75,
                reasoning: '客戶進行非業務相關的閒聊對話'
            },
            {
                intent: '轉接請求',
                keywords: ['轉接', '專員', '部門', '人工', '主管', '找'],
                confidence: 0.96,
                reasoning: '客戶明確要求轉接到其他部門或專員'
            }
        ];
        
        // 計算每個意圖的匹配分數
        let bestMatch = null;
        let highestScore = 0;
        
        for (const rule of intentRules) {
            let matchCount = 0;
            let totalKeywords = rule.keywords.length;
            
            for (const keyword of rule.keywords) {
                if (textLower.includes(keyword)) {
                    matchCount++;
                }
            }
            
            if (matchCount > 0) {
                const matchRatio = matchCount / totalKeywords;
                const score = matchRatio * rule.confidence;
                
                if (score > highestScore) {
                    highestScore = score;
                    bestMatch = {
                        intent: rule.intent,
                        confidence: Math.min(rule.confidence + (matchRatio - 0.5) * 0.1, 0.98),
                        reasoning: rule.reasoning + `（匹配${matchCount}/${totalKeywords}個關鍵詞）`
                    };
                }
            }
        }
        
        // 如果沒有找到匹配的意圖，返回最可能的意圖
        if (!bestMatch) {
            const fallbackIntents = ['服務諮詢', '閒聊交談', '其他'];
            const randomIntent = fallbackIntents[Math.floor(Math.random() * fallbackIntents.length)];
            bestMatch = {
                intent: randomIntent,
                confidence: 0.45 + Math.random() * 0.15,
                reasoning: '無明確關鍵詞匹配，基於語義分析推測意圖'
            };
        }
        
        return {
            intent: bestMatch.intent,
            confidence: Math.round(bestMatch.confidence * 100) / 100,
            reasoning: bestMatch.reasoning
        };
    }
    
    displayResult(result, container) {
        container.innerHTML = `
            <div class="result-item">
                <span class="intent-label">${result.intent}</span>
                <span class="confidence">置信度: ${Math.round(result.confidence * 100)}%</span>
            </div>
            <div style="margin-top: 1rem; font-size: 0.9rem; color: #4a5568;">
                <strong>分析理由：</strong>${result.reasoning}
            </div>
        `;
    }
    
    setupPromptManagement() {
        const addIntentBtn = document.getElementById('add-intent');
        const savePromptBtn = document.getElementById('save-prompt');
        const intentList = document.querySelector('.intent-list');
        
        addIntentBtn.addEventListener('click', () => {
            this.addNewIntentCategory();
        });
        
        savePromptBtn.addEventListener('click', () => {
            const promptText = document.getElementById('prompt-text').value;
            this.promptTemplate = promptText;
            this.showMessage('Prompt模板已保存', 'success');
        });
        
        this.setupIntentRemoval();
    }
    
    addNewIntentCategory() {
        const intentList = document.querySelector('.intent-list');
        const intentItem = document.createElement('div');
        intentItem.className = 'intent-item';
        intentItem.innerHTML = `
            <input type="text" value="新意圖類別" class="intent-name">
            <textarea class="intent-desc">請描述此意圖類別的特徵...</textarea>
            <button class="remove-intent">刪除</button>
        `;
        
        intentList.appendChild(intentItem);
        
        const removeBtn = intentItem.querySelector('.remove-intent');
        removeBtn.addEventListener('click', () => {
            intentItem.remove();
            this.showMessage('意圖類別已刪除', 'info');
        });
        
        const nameInput = intentItem.querySelector('.intent-name');
        nameInput.focus();
        nameInput.select();
    }
    
    setupIntentRemoval() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-intent')) {
                e.target.closest('.intent-item').remove();
                this.showMessage('意圖類別已刪除', 'info');
            }
        });
    }
    
    setupSampleManagement() {
        const addSampleBtn = document.getElementById('add-sample');
        const sampleIntent = document.getElementById('sample-intent');
        const sampleText = document.getElementById('sample-text');
        const samplesList = document.getElementById('samples-list');
        
        addSampleBtn.addEventListener('click', () => {
            const intent = sampleIntent.value;
            const text = sampleText.value.trim();
            
            if (!intent || !text) {
                this.showMessage('請選擇意圖類別並輸入樣本文本', 'error');
                return;
            }
            
            this.addSample(intent, text);
            sampleIntent.value = '';
            sampleText.value = '';
            this.showMessage('Few-shot樣本已新增', 'success');
        });
        
        this.setupSampleRemoval();
    }
    
    addSample(intent, text) {
        const samplesList = document.getElementById('samples-list');
        const sampleItem = document.createElement('div');
        sampleItem.className = 'sample-item';
        sampleItem.innerHTML = `
            <div class="sample-intent">${intent}</div>
            <div class="sample-text">${text}</div>
            <button class="remove-sample">刪除</button>
        `;
        
        samplesList.appendChild(sampleItem);
        
        this.fewShotSamples.push({ intent, text });
    }
    
    setupSampleRemoval() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-sample')) {
                const sampleItem = e.target.closest('.sample-item');
                const intent = sampleItem.querySelector('.sample-intent').textContent;
                const text = sampleItem.querySelector('.sample-text').textContent;
                
                this.fewShotSamples = this.fewShotSamples.filter(
                    sample => !(sample.intent === intent && sample.text === text)
                );
                
                sampleItem.remove();
                this.showMessage('樣本已刪除', 'info');
            }
        });
    }
    
    setupReviewSystem() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('approve')) {
                const reviewItem = e.target.closest('.review-item');
                const manualIntent = reviewItem.querySelector('.manual-intent').value;
                
                this.approveReview(reviewItem, manualIntent);
            } else if (e.target.classList.contains('reject')) {
                const reviewItem = e.target.closest('.review-item');
                const manualIntent = reviewItem.querySelector('.manual-intent').value;
                
                this.rejectReview(reviewItem, manualIntent);
            }
        });
    }
    
    addToReviewQueue(item) {
        this.reviewQueue.push(item);
    }
    
    approveReview(reviewItem, finalIntent) {
        reviewItem.style.background = '#e6fffa';
        reviewItem.style.borderLeftColor = '#48bb78';
        
        const actionsDiv = reviewItem.querySelector('.manual-actions');
        actionsDiv.innerHTML = `<span style="color: #48bb78; font-weight: 600;">✓ 已確認：${finalIntent}</span>`;
        
        this.showMessage('審核已確認', 'success');
    }
    
    rejectReview(reviewItem, correctedIntent) {
        reviewItem.style.background = '#fef5e7';
        reviewItem.style.borderLeftColor = '#ed8936';
        
        const actionsDiv = reviewItem.querySelector('.manual-actions');
        actionsDiv.innerHTML = `<span style="color: #ed8936; font-weight: 600;">✓ 已修正為：${correctedIntent}</span>`;
        
        this.showMessage('審核已修正', 'success');
    }
    
    refreshReviewList() {
        const reviewList = document.getElementById('review-list');
        const pendingItems = this.reviewQueue.filter(item => item.status === 'pending');
        
        if (pendingItems.length === 0) return;
        
        const lastItem = pendingItems[pendingItems.length - 1];
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        reviewItem.innerHTML = `
            <div class="review-text">${lastItem.text}</div>
            <div class="ai-result">
                <span class="label">AI判斷:</span>
                <span class="intent">${lastItem.aiResult.intent}</span>
                <span class="confidence">(${Math.round(lastItem.aiResult.confidence * 100)}%)</span>
            </div>
            <div class="manual-actions">
                <select class="manual-intent">
                    ${this.intentCategories.map(cat => 
                        `<option value="${cat.name}" ${cat.name === lastItem.aiResult.intent ? 'selected' : ''}>${cat.name}</option>`
                    ).join('')}
                </select>
                <button class="approve">確認</button>
                <button class="reject">修正</button>
            </div>
        `;
        
        reviewList.appendChild(reviewItem);
    }
    
    loadInitialData() {
        this.refreshIntentCategories();
        this.refreshSamplesList();
    }
    
    refreshIntentCategories() {
        const sampleIntentSelect = document.getElementById('sample-intent');
        const currentValue = sampleIntentSelect.value;
        
        sampleIntentSelect.innerHTML = '<option value="">選擇意圖類別</option>';
        
        this.intentCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            if (category.name === currentValue) {
                option.selected = true;
            }
            sampleIntentSelect.appendChild(option);
        });
    }
    
    refreshSamplesList() {
        const samplesList = document.getElementById('samples-list');
        samplesList.innerHTML = '';
        
        this.fewShotSamples.forEach(sample => {
            this.addSample(sample.intent, sample.text);
        });
    }
    
    showMessage(text, type = 'info') {
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const colors = {
            success: '#48bb78',
            error: '#f56565',
            info: '#4299e1',
            warning: '#ed8936'
        };
        
        const message = document.createElement('div');
        message.className = 'message';
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            font-weight: 500;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (message.parentNode) {
                    message.remove();
                }
            }, 300);
        }, 3000);
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    new VoiceQualitySystem();
});