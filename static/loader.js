/**
 * AI_SOC Custom Loader:
 * 1. Tự động kiểm tra quyền Admin: Ẩn nút chọn Model đối với người dùng thông thường, giữ lại cho Admin.
 * 2. Nút công tắc [🧠 Suy luận] trên thanh công cụ chat (Bật/Tắt think cho Ollama).
 * 3. Request Interceptor: Gán tham số think vào payload gửi tới API chat.
 */

(function () {
    // 1. Kiểm tra vai trò người dùng (Admin vs User) và áp dụng phân quyền hiển thị model
    function ensureNotAdminStyle() {
        let style = document.getElementById('ai-soc-not-admin-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'ai-soc-not-admin-style';
            style.textContent = `
                html.not-admin #model-selector-model-button,
                html.not-admin .self-end > div:has(#model-selector-model-button) {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    async function checkUserRole() {
        ensureNotAdminStyle();

        const token = localStorage.getItem('token');
        if (!token) {
            applyRole('user');
            return;
        }

        const cachedRole = sessionStorage.getItem('ai_soc_user_role');
        if (cachedRole) {
            applyRole(cachedRole);
            return;
        }

        try {
            const res = await fetch('/api/v1/auths/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const role = data?.role || 'user';
                sessionStorage.setItem('ai_soc_user_role', role);
                applyRole(role);
            } else {
                applyRole('user');
            }
        } catch (e) {
            console.warn('[AI_SOC] Không thể kiểm tra quyền user:', e);
            applyRole('user');
        }
    }

    function applyRole(role) {
        if (role === 'admin') {
            document.documentElement.classList.add('is-admin');
            document.documentElement.classList.remove('not-admin');
        } else {
            document.documentElement.classList.add('not-admin');
            document.documentElement.classList.remove('is-admin');
        }
    }

    // 2. Intercept fetch để tự động thêm params.think vào request /api/chat/completions
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
        const url = typeof args[0] === 'string' ? args[0] : (args[0]?.url || '');
        if (url.includes('/api/chat/completions') || url.includes('/ollama/api/chat')) {
            const options = args[1];
            if (options && options.method === 'POST' && options.body) {
                try {
                    const body = JSON.parse(options.body);
                    const isThink = localStorage.getItem('ai_soc_think') !== 'false';
                    body.params = body.params || {};
                    body.params.think = isThink;
                    options.body = JSON.stringify(body);
                } catch (err) {
                    // Không phải JSON, bỏ qua
                }
            }
        }
        return originalFetch.apply(this, args);
    };

    // 3. Icon bộ não SVG chuẩn (Brain Icon)
    const brainSvg = `
        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; display:inline-block; vertical-align:middle;">
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04Z"/>
            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04Z"/>
        </svg>
    `;

    // 4. Khởi tạo và cắm nút [🧠 Suy luận] vào thanh công cụ
    function injectReasoningButton() {
        if (document.getElementById('ai-soc-reasoning-btn')) return;

        // Tìm vị trí nút Micro hoặc container thanh công cụ
        const voiceBtn = document.getElementById('voice-input-button');
        if (!voiceBtn) return;

        const targetContainer = voiceBtn.closest('.self-end') || voiceBtn.parentElement?.parentElement;
        if (!targetContainer) return;

        let isThink = localStorage.getItem('ai_soc_think') !== 'false';

        const btn = document.createElement('button');
        btn.id = 'ai-soc-reasoning-btn';
        btn.type = 'button';
        btn.innerHTML = `${brainSvg}<span style="white-space:nowrap; line-height:1;">Suy luận</span>`;
        btn.style.cssText = "display:inline-flex !important; flex-direction:row !important; align-items:center !important; justify-content:center !important; white-space:nowrap !important; flex-shrink:0 !important; gap:0.35rem !important; height:1.875rem !important; padding:0 0.65rem !important; font-size:0.8125rem !important; font-weight:500 !important; border-radius:9999px !important; cursor:pointer !important; user-select:none !important; margin:0 0.25rem !important; align-self:center !important;";

        function updateBtnState() {
            if (isThink) {
                btn.className = 'btn-reasoning-toggle active';
                btn.title = 'Suy luận: ĐANG BẬT (Mô hình suy nghĩ chuyên sâu)';
            } else {
                btn.className = 'btn-reasoning-toggle inactive';
                btn.title = 'Suy luận: ĐANG TẮT (Mô hình phản hồi tức thì, không suy nghĩ)';
            }
        }

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            isThink = !isThink;
            localStorage.setItem('ai_soc_think', isThink ? 'true' : 'false');
            updateBtnState();
        });

        updateBtnState();

        // Chèn trước nút Micro (div cha của voice-input-button)
        const voiceWrapper = voiceBtn.closest('.flex');
        if (voiceWrapper && voiceWrapper.parentElement === targetContainer) {
            targetContainer.insertBefore(btn, voiceWrapper);
        } else {
            targetContainer.appendChild(btn);
        }
    }

    // 5. Quan sát DOM để tự động gắn nút khi chuyển trang/cuộc trò chuyện
    const observer = new MutationObserver(function () {
        injectReasoningButton();
    });

    function init() {
        checkUserRole();
        injectReasoningButton();
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
