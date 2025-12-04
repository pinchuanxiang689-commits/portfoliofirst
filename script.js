// ===================================
// グローバル変数
// ===================================
let particles = [];
const particleCount = 50; // パーティクル数を減らして軽量化

// ===================================
// DOMが読み込まれたら実行
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    // 初期化関数を実行
    initParticles();
    initScrollAnimations();
    initNavbar();
    initTypingEffect();
    initCounters();
    initSkillBars();
    initScrollTop();
    initFormSubmit();
});

// ===================================
// パーティクル背景の初期化
// ===================================
function initParticles() {
    const container = document.getElementById('particles-container');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    container.appendChild(canvas);
    
    // キャンバスのサイズ設定
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // パーティクルクラス
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            // 明るいカラーに変更
            const colors = ['#3b82f6', '#8b5cf6', '#06b6d4'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // 画面外に出たら反対側から出現
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // パーティクルの生成
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // パーティクル間の接続を描画
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    ctx.strokeStyle = `rgba(59, 130, 246, ${0.3 * (1 - distance / 120)})`;
                    ctx.lineWidth = 0.3;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // アニメーションループ
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles();
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ===================================
// スクロールアニメーションの初期化
// ===================================
function initScrollAnimations() {
    // Intersection Observer API を使用してスクロールで要素を表示
    const observerOptions = {
        threshold: 0.1, // 要素が10%見えたら発火
        rootMargin: '0px 0px -50px 0px' // 下から50px手前で発火
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 要素が画面内に入ったらactiveクラスを追加
                entry.target.classList.add('active');
                
                // スキルバーのアニメーション
                if (entry.target.classList.contains('skill-card')) {
                    const progressBar = entry.target.querySelector('.skill-progress');
                    const progress = progressBar.dataset.progress;
                    progressBar.style.width = progress + '%';
                }
            }
        });
    }, observerOptions);
    
    // アニメーション対象の要素を監視
    const animatedElements = document.querySelectorAll(
        '.fade-up, .fade-left, .fade-right, .fade-in'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ===================================
// ナビゲーションバーの初期化
// ===================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // スクロール時のナビゲーションバーのスタイル変更
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // ハンバーガーメニューのトグル
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // アニメーション
            const spans = hamburger.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(10px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // ナビゲーションリンクのスムーズスクロール
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // モバイル対応のオフセット調整
                const isMobile = window.innerWidth <= 768;
                const offset = isMobile ? 70 : 80;
                const offsetTop = targetSection.offsetTop - offset;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // モバイルメニューを閉じる
                navMenu.classList.remove('active');
                if (hamburger) {
                    const spans = hamburger.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        });
    });
    
    // アクティブリンクのハイライト
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// ===================================
// タイピングエフェクトの初期化
// ===================================
function initTypingEffect() {
    const texts = [
        'AIエンジニア × 最新技術の探究者',
        'AI技術で、ビジネスの可能性を広げる',
        'あなたのビジョンを、AIの力で実現します'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    const typingElement = document.querySelector('.typing-text');
    const cursor = document.querySelector('.typing-cursor');
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            // 文字を削除
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            // 文字を追加
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        // カーソルを最後に追加
        typingElement.appendChild(cursor);
        
        // テキストの最後まで来たら削除開始
        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 2000; // 2秒待つ
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length; // 次のテキストへ
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // タイピングエフェクト開始
    setTimeout(type, 1000);
}

// ===================================
// カウンターアニメーションの初期化
// ===================================
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.dataset.target);
        let count = 0;
        const increment = target / 100; // 100ステップで目標値に到達
        
        const updateCounter = () => {
            count += increment;
            
            if (count < target) {
                counter.textContent = Math.ceil(count) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        updateCounter();
    };
    
    // Intersection Observerでカウンターを監視
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target); // 一度だけ実行
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// ===================================
// スキルバーのアニメーション初期化
// ===================================
function initSkillBars() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.skill-progress');
                const progress = progressBar.dataset.progress;
                
                // 遅延を追加してアニメーション効果を高める
                setTimeout(() => {
                    progressBar.style.width = progress + '%';
                }, 200);
                
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    skillCards.forEach(card => {
        skillObserver.observe(card);
    });
}

// ===================================
// スクロールトップボタンの初期化
// ===================================
function initScrollTop() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    // スクロール位置に応じてボタンを表示/非表示
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    // ボタンクリックでページトップへスクロール
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// コンタクトフォームの送信処理
// ===================================
function initFormSubmit() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // フォームデータの取得
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // ここで実際の送信処理を行う
        // 例: fetch APIを使ってサーバーに送信
        
        // デモ用のアラート
        showNotification('メッセージを送信しました！', 'success');
        
        // フォームをリセット
        form.reset();
    });
}

// ===================================
// 通知表示関数
// ===================================
function showNotification(message, type = 'info') {
    // 通知要素を作成
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // スタイルを設定
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 2rem',
        background: type === 'success' ? '#10b981' : '#3b82f6',
        color: '#f8fafc',
        borderRadius: '10px',
        fontWeight: 'bold',
        zIndex: '10000',
        boxShadow: `0 10px 30px ${type === 'success' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(59, 130, 246, 0.5)'}`,
        animation: 'slideIn 0.5s ease',
        fontFamily: 'Rajdhani, sans-serif'
    });
    
    // CSSアニメーションを追加
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 通知を表示
    document.body.appendChild(notification);
    
    // 3秒後に自動的に削除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// ===================================
// マウス追従エフェクト（デスクトップのみ）
// ===================================
// タッチデバイスではマウスエフェクトを無効化
if (!('ontouchstart' in window)) {
    document.addEventListener('mousemove', function(e) {
        // カーソル位置に小さな光のエフェクトを作成
        const cursor = document.createElement('div');
        cursor.className = 'cursor-glow';
        
        Object.assign(cursor.style, {
            position: 'fixed',
            left: e.clientX + 'px',
            top: e.clientY + 'px',
            width: '4px',
            height: '4px',
            background: 'rgba(59, 130, 246, 0.4)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: '9999',
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)'
        });
        
        document.body.appendChild(cursor);
        
        // フェードアウトして削除
        setTimeout(() => {
            cursor.style.transition = 'all 0.5s ease';
            cursor.style.transform = 'scale(0)';
            cursor.style.opacity = '0';
            
            setTimeout(() => {
                cursor.remove();
            }, 500);
        }, 100);
    });
}

// ===================================
// ページ読み込み時のアニメーション
// ===================================
window.addEventListener('load', function() {
    // ローディング画面がある場合の処理
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1000);
    }
    
    // ヒーローコンテンツのフェードイン
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 500);
    }
});

// ===================================
// パフォーマンス最適化: スクロールイベントのスロットリング
// ===================================
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// スクロールイベントに適用
window.addEventListener('scroll', throttle(function() {
    // スクロール関連の処理をここに追加
}, 100));

// ===================================
// デバッグ用のコンソールメッセージ
// ===================================
console.log('%c✨ SHO PORTFOLIO LOADED ✨', 'color: #3b82f6; font-size: 20px; font-weight: bold;');
console.log('%cAIエンジニア × 最新技術', 'color: #8b5cf6; font-size: 16px;');
console.log('%cAI技術でビジネスを革新', 'color: #06b6d4; font-size: 14px;');

// ===================================
// スマホ対応の追加機能
// ===================================

// タッチデバイスの検出と最適化
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (isTouchDevice) {
    // タッチデバイス用のクラスを追加
    document.body.classList.add('touch-device');
    
    // プロジェクトカードのタップ処理を改善
    const projectLinks = document.querySelectorAll('.project-link-wrapper');
    projectLinks.forEach(link => {
        let tapCount = 0;
        let tapTimer;
        
        link.addEventListener('touchstart', function(e) {
            tapCount++;
            
            if (tapCount === 1) {
                // 1回目のタップでオーバーレイを表示
                const overlay = this.querySelector('.project-overlay');
                if (overlay) {
                    overlay.style.opacity = '1';
                }
                
                // 3秒後にオーバーレイを非表示
                tapTimer = setTimeout(() => {
                    if (overlay) {
                        overlay.style.opacity = '0';
                    }
                    tapCount = 0;
                }, 3000);
            } else if (tapCount === 2) {
                // 2回目のタップでリンク先へ
                clearTimeout(tapTimer);
                tapCount = 0;
            }
        }, { passive: true });
    });
}

// 画面の向きが変わった時の処理
window.addEventListener('orientationchange', function() {
    // 画面の向きが変わったら、メニューを閉じる
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        
        if (hamburger) {
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
    
    // レイアウトを再計算
    setTimeout(() => {
        window.scrollTo(window.scrollX, window.scrollY + 1);
        window.scrollTo(window.scrollX, window.scrollY - 1);
    }, 100);
});

// iOSのSafariでのスクロール問題を修正
if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    document.body.style.webkitOverflowScrolling = 'touch';
}

