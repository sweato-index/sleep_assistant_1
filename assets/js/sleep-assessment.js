// assets/js/sleep-assessment.js

const SleepAssessment = (() => {
    // 私有变量
    let sleepRadarChart;
    const MAX_SCORE = 21;
    const DIMENSION_MAP = {
        q1: '入睡潜伏期',
        q2: '睡眠时长',
        q4: '睡眠效率',
        q6: '日间功能',
        q7: '呼吸症状',
        q8: '肢体症状'
    };

    // 初始化雷达图
    const initCharts = () => {
        const ctx = document.getElementById('sleepRadarChart')?.getContext('2d');
        if (!ctx) return;

        sleepRadarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: Object.values(DIMENSION_MAP),
                datasets: [{
                    label: '睡眠维度分析',
                    data: new Array(6).fill(0),
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)'
                }]
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 3,
                        ticks: {
                            stepSize: 1,
                            showLabelBackdrop: false
                        }
                    }
                }
            }
        });
    };

    // 验证表单
    const validateForm = (formData) => {
        const requiredQuestions = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'];
        return requiredQuestions.filter(q => !formData.has(q));
    };

    // 计算各维度得分
    const calculateScores = (formData) => ({
        q1: parseInt(formData.get('q1')) || 0,
        q2: parseInt(formData.get('q2')) || 0,
        q3: parseInt(formData.get('q3')) || 0,
        q4: parseInt(formData.get('q4')) || 0,
        q5: parseInt(formData.get('q5')) || 0,
        q6: parseInt(formData.get('q6')) || 0,
        q7: Array.from(formData.getAll('q7')).reduce((a, v) => a + parseInt(v), 0),
        q8: Array.from(formData.getAll('q8')).reduce((a, v) => a + parseInt(v), 0)
    });

    // 更新进度条
    const updateProgress = (score) => {
        const progress = document.getElementById('sleep-progress');
        if (!progress) return;

        const percentage = (score / MAX_SCORE) * 100;
        progress.style.width = `${percentage}%`;
        progress.textContent = `${score}/${MAX_SCORE}`;
        progress.className = `progress-bar progress-bar-striped ${
            score <= 5 ? 'bg-success' :
            score <= 10 ? 'bg-warning' : 'bg-danger'
        }`;
        
        document.getElementById('sleep-score').textContent = score;
    };

    // 更新维度分数显示
    const updateDimensions = (scores) => {
        Object.entries(scores).forEach(([q, score]) => {
            const element = document.getElementById(`dimension-${q}`);
            if (element) {
                element.textContent = score;
                element.className = `badge rounded-pill ${
                    score <= 1 ? 'bg-success' :
                    score <= 2 ? 'bg-warning' : 'bg-danger'
                }`;
            }
        });
    };

    // 更新雷达图数据
    const updateRadarChart = (scores) => {
        if (!sleepRadarChart) return;
        
        sleepRadarChart.data.datasets[0].data = [
            scores.q1, scores.q2, scores.q4,
            scores.q6, scores.q7, scores.q8
        ];
        sleepRadarChart.update();
    };

    // 显示专业建议
    const showRecommendations = (score) => {
        const recommendations = [
            { threshold: 5, 
              text: "您的睡眠质量优秀，继续保持规律作息",
              detail: "建议：\n• 保持7-9小时睡眠\n• 每周至少5天户外运动\n• 睡前1小时避免蓝光照射" },
            { threshold: 10,
              text: "存在轻度睡眠障碍",
              detail: "建议：\n• 建立固定作息时间\n• 避免午睡超过30分钟\n• 尝试冥想放松训练" },
            { threshold: 15,
              text: "中度睡眠问题需重视",
              detail: "建议：\n• 记录睡眠日记\n• 进行多导睡眠监测\n• 咨询睡眠专科医师" },
            { threshold: 21,
              text: "严重睡眠障碍警告",
              detail: "立即行动：\n• 尽快就医检查\n• 排除睡眠呼吸暂停\n• 评估焦虑抑郁状态" }
        ];

        const result = recommendations.find(r => score <= r.threshold) || recommendations[3];
        const alertBox = document.getElementById('resultAlert') || createResultAlert();
        
        alertBox.querySelector('#resultText').innerHTML = `
            <strong>${result.text}</strong><br>
            <small class="text-muted">${result.detail.replace(/\n/g, '<br>')}</small>
        `;
        alertBox.scrollIntoView({ behavior: 'smooth' });
    };

    // 创建结果提示框
    const createResultAlert = () => {
        const alertHTML = `
            <div class="alert alert-info mt-4" id="resultAlert">
                <h5 class="alert-heading" id="resultText"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        return document.querySelector('.assessment-form').insertAdjacentHTML('beforeend', alertHTML);
    };

    // 表单提交处理
    const handleFormSubmit = (e) => {
        
        
        e.preventDefault();
        
    
        const formData = new FormData(e.target);
        
        
        // 验证必填项
        const missingQuestions = validateForm(formData);
        if (missingQuestions.length > 0) {
            alert(`请完成以下问题：${missingQuestions.map(q => `第${q.slice(1)}题`).join(', ')}`);
            return;
        }

        // 计算得分
        const scores = calculateScores(formData);
        const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

        // 更新界面
        updateProgress(totalScore);
        updateDimensions(scores);
        updateRadarChart(scores);
        showRecommendations(totalScore);
    };

    // 暴露的公共方法
    return {
        init: () => {
            initCharts();
            document.getElementById('sleepAssessmentForm')?.addEventListener('submit', handleFormSubmit);
        }
    };
})();

// 初始化模块
document.addEventListener('DOMContentLoaded', () => {
    SleepAssessment.init();
});