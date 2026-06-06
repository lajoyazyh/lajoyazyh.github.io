(function() {
    // 多语言"你好"列表
    const greetings = [
        '你好',
        'Hello',
        'こんにちは',
        '안녕하세요',
        'Bonjour',
        'Guten Tag',
        'Hola',
        'Привет',
        'Ciao',
        'Olá',
        '你好',
        'Hello',
        'こんにちは',
        '안녕하세요'
    ];

    // Canvas 画布
    let canvas = null;
    let ctx = null;
    let particles = [];
    let animationId = null;
    let isRunning = false;

    // 创建画布
    function createCanvas() {
        if (canvas) return;
        
        canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        canvas.id = 'hello-rain-canvas';
        
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    // 调整画布大小
    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // 粒子类
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.text = greetings[Math.floor(Math.random() * greetings.length)];
            this.x = Math.random() * canvas.width;
            this.y = -30;
            this.size = Math.random() * 16 + 12;
            this.speed = Math.random() * 3 + 2;
            this.rotation = Math.random() * 60 - 30;
            this.rotationSpeed = (Math.random() - 0.5) * 2;
            this.opacity = Math.random() * 0.5 + 0.5;
            this.color = this.getRandomColor();
        }

        getRandomColor() {
            // 检测是否为深色模式
            const isDarkMode = document.body.classList.contains('dark-mode') || 
                               document.documentElement.getAttribute('data-theme') === 'dark';
            
            // 浅色模式用深色字体，深色模式用浅色字体
            const lightColors = [
                'rgba(60, 60, 60, 1)',
                'rgba(80, 80, 80, 1)',
                'rgba(100, 100, 100, 1)',
                'rgba(120, 120, 120, 1)'
            ];
            
            const darkColors = [
                'rgba(255, 255, 255, 1)',
                'rgba(240, 240, 240, 1)',
                'rgba(220, 220, 220, 1)',
                'rgba(200, 200, 200, 1)'
            ];
            
            const colors = isDarkMode ? darkColors : lightColors;
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.y += this.speed;
            this.rotation += this.rotationSpeed;
            
            // 只有在动画运行时才重置粒子
            if (isRunning && this.y > canvas.height + 30) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.font = `${this.size}px "Georgia", "Noto Serif SC", "Source Han Serif SC", serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.text, 0, 0);
            ctx.restore();
        }
    }

    // 创建粒子
    function createParticles(count) {
        particles = [];
        for (let i = 0; i < count; i++) {
            const particle = new Particle();
            // 让粒子的初始 y 坐标在屏幕上方随机分布，这样它们会陆续下落
            particle.y = -30 - Math.random() * canvas.height;
            particles.push(particle);
        }
    }

    // 动画循环
    function animate() {
        if (!isRunning) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        animationId = requestAnimationFrame(animate);
    }

    // 开始动画
    function startHelloRain() {
        if (isRunning) return;
        
        createCanvas();
        createParticles(30);
        isRunning = true;
        animate();
        
        // 3秒后自动停止
        setTimeout(stopHelloRain, 3000);
    }

    // 停止动画
    function stopHelloRain() {
        // 设置标志位，不再生成新粒子
        isRunning = false;
        
        // 让现有粒子继续下落直到掉出屏幕
        const naturalFadeOut = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // 更新并绘制每个粒子
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            // 过滤掉已掉出屏幕的粒子
            particles = particles.filter(particle => particle.y < canvas.height + 50);
            
            // 如果还有粒子，继续动画
            if (particles.length > 0) {
                animationId = requestAnimationFrame(naturalFadeOut);
            } else {
                // 所有粒子都掉出屏幕后，清理
                cleanup();
            }
        };
        
        // 开始自然淡出
        animationId = requestAnimationFrame(naturalFadeOut);
    }

    // 清理
    function cleanup() {
        if (canvas) {
            document.body.removeChild(canvas);
            canvas = null;
            ctx = null;
        }
        particles = [];
    }

    // 检查是否为首页
    function isHomePage() {
        const path = window.location.pathname;
        return path === '/' || path === '/index.html' || path.endsWith('/');
    }

    // 检查是否已经触发过动画（使用 sessionStorage）
    function hasTriggered() {
        return sessionStorage.getItem('helloRainTriggered') === 'true';
    }

    // 记录已触发
    function markTriggered() {
        sessionStorage.setItem('helloRainTriggered', 'true');
    }

    // 页面加载时触发（仅首页且未触发过）
    function handlePageLoad() {
        if (isHomePage() && !hasTriggered()) {
            setTimeout(() => {
                startHelloRain();
                markTriggered();
            }, 500);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', handlePageLoad);
    } else {
        handlePageLoad();
    }

    // 头像点击时触发
    document.addEventListener('click', (e) => {
        // 检查点击元素或其父元素是否是头像
        const avatar = e.target.closest('.avatar');
        if (avatar) {
            e.preventDefault();
            e.stopPropagation();
            startHelloRain();
        }
    });

    // 不再监听 PJAX 页面切换

})();