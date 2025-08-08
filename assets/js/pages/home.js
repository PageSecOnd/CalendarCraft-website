// 主页模块
class HomePage {
    constructor(options = {}) {
        this.route = options.route;
        this.container = options.container;
        this.router = options.router;
        
        this.isRendered = false;
        this.animations = [];
    }

    async render() {
        if (this.isRendered) return;

        const homeHTML = `
            <div class="page-view home-view">
                <!-- 英雄区域 -->
                <section class="hero-section">
                    <div class="hero-container">
                        <div class="hero-content">
                            <!-- 问候区域 -->
                            <div class="greeting-section animate-in delay-1">
                                <div class="greeting-badge">
                                    <span class="badge-icon">👋</span>
                                    <span class="badge-text" data-zh="欢迎回来" data-en="Welcome back">欢迎回来</span>
                                </div>
                                <div class="greeting-info">
                                    <h2 class="greeting-title">
                                        <span data-zh="你好，PageSecOnd" data-en="Hello, PageSecOnd">你好，PageSecOnd</span>
                                    </h2>
                                    <p class="greeting-time" id="heroTime">2025-08-08 11:22:50</p>
                                </div>
                            </div>

                            <!-- 主标题 -->
                            <div class="main-title-section animate-in delay-2">
                                <h1 class="main-title">
                                    <span class="title-primary" data-zh="日历工艺" data-en="CalendarCraft">日历工艺</span>
                                    <span class="title-secondary" data-zh="融合传统与现代的时间艺术" data-en="The Art of Time, Bridging Tradition and Modernity">融合传统与现代的时间艺术</span>
                                </h1>
                            </div>

                            <!-- 描述文字 -->
                            <div class="description-section animate-in delay-3">
                                <p class="description-text" data-zh="将中华传统节气与现代日历完美融合，创造属于您的个性化时间管理工具。支持多国节日、智能提醒、优雅界面设计。" data-en="Perfectly blending Chinese traditional solar terms with modern calendars, creating your personalized time management tool. Supporting international holidays, smart reminders, and elegant interface design.">将中华传统节气与现代日历完美融合，创造属于您的个性化时间管理工具。支持多国节日、智能提醒、优雅界面设计。</p>
                            </div>

                            <!-- 行动按钮 -->
                            <div class="action-buttons animate-in delay-4">
                                <button class="btn-primary hero-btn" data-route="calendar">
                                    <span class="btn-text" data-zh="开始使用" data-en="Get Started">开始使用</span>
                                    <span class="btn-icon">→</span>
                                </button>
                                <button class="btn-secondary hero-btn" data-route="features">
                                    <span class="btn-icon">✨</span>
                                    <span class="btn-text" data-zh="探索功能" data-en="Explore Features">探索功能</span>
                                </button>
                            </div>

                            <!-- 特色标签 -->
                            <div class="feature-tags animate-in delay-5">
                                <div class="feature-tag">
                                    <span class="tag-icon">🏮</span>
                                    <span class="tag-text" data-zh="二十四节气" data-en="24 Solar Terms">二十四节气</span>
                                </div>
                                <div class="feature-tag">
                                    <span class="tag-icon">🌍</span>
                                    <span class="tag-text" data-zh="国际节日" data-en="Global Holidays">国际节日</span>
                                </div>
                                <div class="feature-tag">
                                    <span class="tag-icon">🎨</span>
                                    <span class="tag-text" data-zh="个性定制" data-en="Customization">个性定制</span>
                                </div>
                                <div class="feature-tag">
                                    <span class="tag-icon">📱</span>
                                    <span class="tag-text" data-zh="响应式设计" data-en="Responsive Design">响应式设计</span>
                                </div>
                            </div>
                        </div>

                        <!-- 预览区域 -->
                        <div class="hero-preview">
                            <div class="preview-container animate-in delay-3">
                                <div class="calendar-preview-card hover-lift">
                                    <div class="preview-header">
                                        <div class="preview-title" data-zh="八月 2025" data-en="August 2025">八月 2025</div>
                                        <div class="preview-subtitle" data-zh="立秋 · 处暑" data-en="Beginning of Autumn">立秋 · 处暑</div>
                                    </div>
                                    
                                    <div class="preview-calendar" id="homeCalendarPreview">
                                        <!-- 日历将在这里动态生成 -->
                                    </div>

                                    <div class="preview-footer">
                                        <div class="today-highlight">
                                            <span class="today-label" data-zh="今日" data-en="Today">今日</span>
                                            <span class="today-date" id="homeTodayDate">8</span>
                                            <div class="today-details">
                                                <span class="today-weekday" data-zh="星期五" data-en="Friday">星期五</span>
                                                <span class="today-lunar" data-zh="七月初四" data-en="7th Month, 4th Day">七月初四</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 装饰元素 -->
                                <div class="preview-decorations">
                                    <div class="floating-element solar-term-1 float" data-zh="立秋" data-en="Autumn">立秋</div>
                                    <div class="floating-element solar-term-2 float" data-zh="处暑" data-en="Heat">处暑</div>
                                    <div class="floating-element number-1 float">08</div>
                                    <div class="floating-element number-2 float">23</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- 特色功能区域 -->
                <section class="features-overview">
                    <div class="features-container">
                        <div class="section-header animate-in">
                            <h2 class="section-title" data-zh="核心功能" data-en="Core Features">核心功能</h2>
                            <p class="section-subtitle" data-zh="精心设计的功能，让时间管理更加优雅" data-en="Thoughtfully designed features for elegant time management">精心设计的功能，让时间管理更加优雅</p>
                        </div>

                        <div class="features-grid">
                            <div class="feature-card animate-in delay-1 hover-lift" data-route="features">
                                <div class="feature-icon">🏮</div>
                                <h3 class="feature-title" data-zh="传统节气" data-en="Solar Terms">传统节气</h3>
                                <p class="feature-description" data-zh="完整的二十四节气信息，传承千年的时间智慧" data-en="Complete 24 solar terms information, millennium-old time wisdom">完整的二十四节气信息，传承千年的时间智慧</p>
                            </div>

                            <div class="feature-card animate-in delay-2 hover-lift" data-route="calendar">
                                <div class="feature-icon">📅</div>
                                <h3 class="feature-title" data-zh="智能日历" data-en="Smart Calendar">智能日历</h3>
                                <p class="feature-description" data-zh="集成农历、节日、提醒的全功能日历系统" data-en="Full-featured calendar system with lunar calendar, holidays, and reminders">集成农历、节日、提醒的全功能日历系统</p>
                            </div>

                            <div class="feature-card animate-in delay-3 hover-lift" data-route="features">
                                <div class="feature-icon">🌍</div>
                                <h3 class="feature-title" data-zh="国际化" data-en="Internationalization">国际化</h3>
                                <p class="feature-description" data-zh="支持多语言界面和各国节日信息" data-en="Multi-language interface and international holiday information">支持多语言界面和各国节日信息</p>
                            </div>

                            <div class="feature-card animate-in delay-4 hover-lift" data-route="features">
                                <div class="feature-icon">🎨</div>
                                <h3 class="feature-title" data-zh="个性定制" data-en="Customization">个性定制</h3>
                                <p class="feature-description" data-zh="丰富的主题选项和个性化设置" data-en="Rich theme options and personalization settings">丰富的主题选项和个性化设置</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- 统计信息区域 -->
                <section class="stats-section">
                    <div class="stats-container">
                        <div class="stats-grid">
                            <div class="stat-item animate-in delay-1">
                                <div class="stat-number">24</div>
                                <div class="stat-label" data-zh="节气支持" data-en="Solar Terms">节气支持</div>
                            </div>
                            <div class="stat-item animate-in delay-2">
                                <div class="stat-number">195+</div>
                                <div class="stat-label" data-zh="国家节日" data-en="Countries">国家节日</div>
                            </div>
                            <div class="stat-item animate-in delay-3">
                                <div class="stat-number">100%</div>
                                <div class="stat-label" data-zh="开源免费" data-en="Open Source">开源免费</div>
                            </div>
                            <div class="stat-item animate-in delay-4">
                                <div class="stat-number">⚡</div>
                                <div class="stat-label" data-zh="响应迅速" data-en="Fast Response">响应迅速</div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `;

        this.container.innerHTML = homeHTML;
        this.isRendered = true;
    }

    async init() {
        // 绑定事件
        this.bindEvents();
        
        // 生成日历预览
        this.generateCalendarPreview();
        
        // 启动实时更新
        this.startRealTimeUpdates();
        
        // 播放入场动画
        this.playEntryAnimations();
        
        console.log('🏠 主页已初始化');
    }

    bindEvents() {
        // 路由按钮
        this.container.addEventListener('click', (e) => {
            const routeBtn = e.target.closest('[data-route]');
            if (routeBtn) {
                e.preventDefault();
                const route = routeBtn.dataset.route;
                this.router.navigate(route);
            }
        });

        // 预览卡片点击
        const previewCard = this.container.querySelector('.calendar-preview-card');
        if (previewCard) {
            previewCard.addEventListener('click', () => {
                this.router.navigate('calendar');
            });
        }

        // 功能卡片悬停效果
        const featureCards = this.container.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
                card.style.boxShadow = '0 12px 48px rgba(44, 44, 44, 0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '0 4px 16px rgba(44, 44, 44, 0.1)';
            });
        });
    }

    generateCalendarPreview() {
        const previewContainer = this.container.querySelector('#homeCalendarPreview');
        if (!previewContainer) return;

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const today = now.getDate();

        // 生成星期头
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        const weekdaysHTML = `
            <div class="preview-weekdays">
                ${weekdays.map(day => `<div class="preview-weekday">${day}</div>`).join('')}
            </div>
        `;

        // 生成日期网格
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay();

        let datesHTML = '<div class="preview-dates">';
        
        // 空白日期（上个月）
        for (let i = 0; i < startDayOfWeek; i++) {
            datesHTML += '<div class="preview-date empty"></div>';
        }
        
        // 当月日期
        for (let day = 1; day <= daysInMonth; day++) {
            const classes = ['preview-date'];
            
            if (day === today) {
                classes.push('today');
            }
            
            // 特殊日期标记
            if (day === 7) { // 立秋
                classes.push('solar-term');
            }
            if (day === 23) { // 处暑
                classes.push('solar-term');
            }
            if (day === 13) { // 七夕
                classes.push('festival');
            }
            
            datesHTML += `<div class="${classes.join(' ')}">${day}</div>`;
        }
        
        datesHTML += '</div>';

        previewContainer.innerHTML = weekdaysHTML + datesHTML;

        // 添加日期点击动画
        const dates = previewContainer.querySelectorAll('.preview-date:not(.empty)');
        dates.forEach(date => {
            date.addEventListener('click', () => {
                date.classList.add('clicked');
                setTimeout(() => date.classList.remove('clicked'), 300);
            });
        });
    }

    startRealTimeUpdates() {
        this.updateTime();
        
        this.timeInterval = setInterval(() => {
            this.updateTime();
        }, 1000);
    }

    updateTime() {
        const timeElement = this.container.querySelector('#heroTime');
        const todayElement = this.container.querySelector('#homeTodayDate');
        
        if (timeElement) {
            const now = new Date();
            const timeString = now.getFullYear() + '-' + 
                String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                String(now.getDate()).padStart(2, '0') + ' ' +
                String(now.getHours()).padStart(2, '0') + ':' +
                String(now.getMinutes()).padStart(2, '0') + ':' +
                String(now.getSeconds()).padStart(2, '0');
            
            timeElement.textContent = timeString;
            
            if (todayElement) {
                todayElement.textContent = now.getDate();
            }
        }
    }

    playEntryAnimations() {
        // 使用 Intersection Observer 来触发动画
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        const animatedElements = this.container.querySelectorAll('.animate-in');
        animatedElements.forEach(el => {
            observer.observe(el);
        });

        // 数字动画
        this.animateCounters();
    }

    animateCounters() {
        const statNumbers = this.container.querySelectorAll('.stat-number');
        
        statNumbers.forEach(numberEl => {
            const finalNumber = numberEl.textContent;
            
            if (!isNaN(finalNumber)) {
                const duration = 2000;
                const increment = parseInt(finalNumber) / (duration / 16);
                let current = 0;
                
                const updateNumber = () => {
                    current += increment;
                    if (current >= parseInt(finalNumber)) {
                        numberEl.textContent = finalNumber;
                    } else {
                        numberEl.textContent = Math.floor(current);
                        requestAnimationFrame(updateNumber);
                    }
                };
                
                // 延迟开始动画
                setTimeout(updateNumber, 500);
            }
        });
    }

    destroy() {
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
        }
        
        this.animations.forEach(animation => {
            if (animation.cancel) animation.cancel();
        });
        
        console.log('🏠 主页已销毁');
    }
}

export default HomePage;