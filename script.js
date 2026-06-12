// ========================================
// 婚礼邀请函 - 静态部署版（无需服务器）
// ========================================

// --- 音乐控制 ---
const music = document.getElementById('background-music');
const musicToggle = document.getElementById('music-toggle');
let isPlaying = false;

// ===== WeChat 浏览器音乐自动播放 =====
// 微信内置浏览器禁止自动播放，需要用户交互或使用WeixinJSBridge
function autoPlayMusic() {
    // 方法1：微信JS-SDK（如果已配置）
    if (typeof WeixinJSBridge !== 'undefined') {
        WeixinJSBridge.invoke('getNetworkType', {}, function () {
            music.play().then(() => {
                isPlaying = true;
                musicToggle.textContent = '🔊';
            }).catch(() => {});
        });
        return;
    }

    // 方法2：监听WeixinJSBridge就绪事件
    if (typeof window.WeixinJSBridge !== 'undefined') {
        window.WeixinJSBridge.invoke('getNetworkType', {}, function () {
            music.play().then(() => {
                isPlaying = true;
                musicToggle.textContent = '🔊';
            }).catch(() => {});
        });
        return;
    }

    // 方法3：标准浏览器自动播放尝试
    music.play().then(() => {
        isPlaying = true;
        musicToggle.textContent = '🔊';
    }).catch(() => {
        isPlaying = false;
        musicToggle.textContent = '🔇';
    });
}

// 页面加载完成后尝试播放
window.addEventListener('DOMContentLoaded', function () {
    autoPlayMusic();

    // 微信WeixinJSBridge就绪事件
    document.addEventListener('WeixinJSBridgeReady', function () {
        music.play().then(() => {
            isPlaying = true;
            musicToggle.textContent = '🔊';
        }).catch(() => {});
    });
});

// 用户首次触摸/点击页面时尝试播放（解决大部分移动浏览器限制）
document.addEventListener('click', function tryPlayOnce() {
    if (!isPlaying) {
        music.play().then(() => {
            isPlaying = true;
            musicToggle.textContent = '🔊';
        }).catch(() => {});
    }
}, { once: true });

// 音乐切换按钮
musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlaying) {
        music.pause();
        musicToggle.textContent = '🔇';
    } else {
        music.play().then(() => {
            musicToggle.textContent = '🔊';
        }).catch(() => {
            musicToggle.textContent = '🔇';
        });
    }
    isPlaying = !isPlaying;
});

// --- 表单提交 ---
const rsvpForm = document.getElementById('rsvp-form');
const submitBtn = document.getElementById('submit-btn');
const nameInput = document.getElementById('name');
const relationshipInput = document.getElementById('relationship');

rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const relationship = relationshipInput.value.trim();

    // 前端校验
    if (name.length < 2) {
        showMessage('请输入至少2个字的姓名', 'error');
        nameInput.focus();
        return;
    }
    if (relationship.length < 1) {
        showMessage('请填写您与新人的关系', 'error');
        relationshipInput.focus();
        return;
    }

    // 禁用按钮，显示加载状态
    setSubmitting(true);

    const guestData = {
        name: name,
        relationship: relationship,
        time: new Date().toLocaleString('zh-CN'),
    };

    // 尝试发送到后端API（如果存在的话）
    fetch('/api/guest/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guestData)
    })
    .then(response => {
        if (response.ok) return response.json();
        throw new Error('API不可用');
    })
    .then(data => {
        if (data.success) {
            showMessage(data.message || '提交成功！感谢您的回复 ❤️', 'success');
        } else {
            throw new Error(data.message || '提交失败');
        }
    })
    .catch(() => {
        // === 后端不可用时的降级方案 ===
        // 保存到localStorage
        saveToLocal(guestData);
        showMessage('提交成功！感谢您的回复 ❤️', 'success');
    })
    .finally(() => {
        setSubmitting(false);
        rsvpForm.reset();
        nameInput.style.borderColor = '#ffd9d9';
        relationshipInput.style.borderColor = '#ffd9d9';
    });
});

// --- LocalStorage 降级存储 ---
function saveToLocal(data) {
    try {
        const guests = JSON.parse(localStorage.getItem('wedding_guests') || '[]');
        guests.push(data);
        localStorage.setItem('wedding_guests', JSON.stringify(guests));
        console.log('✅ 宾客信息已保存（本地存储），共', guests.length, '条');
    } catch (e) {
        console.warn('localStorage不可用');
    }
}

// 设置提交状态
function setSubmitting(loading) {
    if (loading) {
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-loading');
        submitBtn.textContent = '提交中...';
    } else {
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
        submitBtn.textContent = '确定';
    }
}

// 显示提示消息
function showMessage(msg, type) {
    const oldMsg = document.querySelector('.form-message');
    if (oldMsg) oldMsg.remove();

    const msgDiv = document.createElement('div');
    msgDiv.className = 'form-message form-message-' + type;
    msgDiv.textContent = msg;
    rsvpForm.appendChild(msgDiv);

    setTimeout(() => {
        msgDiv.style.opacity = '0';
        msgDiv.style.transition = 'opacity 0.5s';
        setTimeout(() => msgDiv.remove(), 500);
    }, 4000);
}

// --- 输入框实时验证 ---
nameInput.addEventListener('input', () => {
    const val = nameInput.value.trim();
    if (val.length > 0 && val.length < 2) {
        nameInput.style.borderColor = '#ff6b6b';
    } else if (val.length >= 2) {
        nameInput.style.borderColor = '#4caf50';
    } else {
        nameInput.style.borderColor = '#ffd9d9';
    }
});

relationshipInput.addEventListener('input', () => {
    const val = relationshipInput.value.trim();
    if (val.length === 0) {
        relationshipInput.style.borderColor = '#ffd9d9';
    } else {
        relationshipInput.style.borderColor = '#4caf50';
    }
});

// --- 页面加载动画 ---
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// --- 图片点击放大效果 ---
document.querySelectorAll('.photo-container, .photo-frame').forEach(container => {
    container.addEventListener('click', () => {
        container.style.transform = 'scale(1.05)';
        container.style.transition = 'transform 0.3s ease';
        setTimeout(() => {
            container.style.transform = '';
        }, 300);
    });
});
