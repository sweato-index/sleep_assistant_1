$(document).ready(function() {
    // 初始化tab切换
    $('.nav-tabs a').click(function(e) {
        e.preventDefault();
        $(this).tab('show');
    });

    // 处理表单提交
    $('form').submit(function(e) {
        e.preventDefault();
        const form = $(this);
        const formType = form.attr('id') || form.find('button[type="submit"]').text();
        
        // 显示加载状态
        const submitBtn = form.find('button[type="submit"]');
        submitBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> 提交中...');

        // 模拟提交
        setTimeout(() => {
            submitBtn.prop('disabled', false).text('提交成功');
            setTimeout(() => {
                submitBtn.text(submitBtn.data('original-text') || '提交');
            }, 2000);
        }, 1500);
    });

    // 处理加入群组按钮
    $('.group-item button').click(function() {
        const btn = $(this);
        btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> 加入中...');
        
        setTimeout(() => {
            btn.text('已加入').removeClass('btn-primary').addClass('btn-success');
        }, 1500);
    });

    // 处理挑战进度
    function updateChallengeProgress() {
        $('.challenge-progress .progress-bar').each(function() {
            const progress = $(this);
            const percent = progress.attr('aria-valuenow');
            progress.css('width', percent + '%');
        });
    }

    // 初始化
    updateChallengeProgress();
});
