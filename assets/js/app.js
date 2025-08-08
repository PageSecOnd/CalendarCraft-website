// 主应用控制器
import Router from './router.js';
import LanguageManager from './components/language.js';
import Calendar from './components/calendar.js';
import Utils from './components/utils.js';

class CalendarCraftApp {
    constructor() {
        this.version = '1.0.0';
        this.currentUser = 'PageSecOnd';
        this.isLoading = true;
        this.isTransitioning = false;
        
        // 核心组件
        this.router = null;
        this.language = null;
        this.calendar = null;
        this.utils = null;
        
        // DOM 引用
        this.elements = {};
        
        // 状态管理
        this.state = {
            currentPage: 'home',
            language: 'zh',
            user: this.currentUser,
            time: new Date(),
            theme: 'light'
        };
        
        this.init();
    }

    async init() {
        try {
            console.log('🚀 CalendarCraft App 启动中...');
            
            // 1. 初始化 DOM 引用
            this.initDOMReferences();
            
            // 2. 初始化核心组件
            await this.initComponents();
            
            // 3. 绑定全局事件
            this.bindGlobalEvents();
            
            // 4. 启动路由系统
            this.initRouting();
            
            // 5. 启动实时更新
            this.startRealTimeUpdates();
            
            // 6. 检测用户偏好
            this.detectUserPreferences();
            
            // 7. 完成加载
            await this.completeLoading();
            
            console.log('✅ CalendarCraft App 启动完成');
            
        } catch (error) {
            console.error('❌ App 启动失败:', error);
            this.handleInitError(error);
        }
    }

    initDOMReferences() {
        this.elements = {
            // 加载器
            pageLoader: document.getElementById('pageLoader'),
            
            // 过渡层
            pageTransition: document.getElementById('pageTransition'),
            
            // 主容器
            appContainer: document.getElementById('appContainer'),
            pageContainer: document.getElementById('pageContainer'),
            
            // 导航
            appNavigation: document.getElementById('appNavigation'),
            
            // 语言切换
            languageSwitcher: document.getElementById('languageSwitcher'),
            langCube: document.getElementById('langCube'),
            
            // 状态栏
            statusBar: document.getElementById('statusBar'),
            currentTime: document.getElementById('currentTime'),
            
            // 快捷键面板
            shortcutsPanel: document.getElementById('shortcutsPanel')
        };
    }

    async initComponents() {
        // 工具类
        this.utils = new Utils();
        
        // 语言管理器
        this.language = new LanguageManager({
            defaultLang: this.state.language,
            onLanguageChange: (lang) => this.handleLanguageChange(lang)
        });
        
        // 日历组件
        this.calendar = new Calendar({
            currentUser: this.currentUser,
            onDateSelect: (date) => this.handleDateSelect(date)
        });
        
        // 路由器
        this.router = new Router({
            container: this.elements.pageContainer,
            onRouteChange: (route) => this.handleRouteChange(route),
            onTransitionStart: () => this.handleTransitionStart(),
            onTransitionEnd: () => this.handleTransitionEnd()
        });
    }

    bindGlobalEvents() {
        // 键盘快捷键
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // 窗口事件
        window.addEventListener('resize', Utils.debounce(() => this.handleResize(), 250));
        window.addEventListener('beforeunload', () => this.handleBeforeUnload());
        
        // 网络状态
        window.addEventListener('online', () => this.handleNetworkChange(true));
        window.addEventListener('offline', () => this.handleNetworkChange(false));
        
        // 可见性变化
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
        
        // 导航点击
        this.elements.appNavigation?.addEventListener('click', (e) => this.handleNavigation(e));
        
        // 品牌点击
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-brand')) {
                e.preventDefault();
                this.router.navigate('home');
            }
        });
    }

    initRouting() {
        // 注册路由
        this.router.registerRoutes({
            'home': () => import('./pages/home.js'),
            'calendar': () => import('./pages/calendar.js'),
            'features': () => import('./pages/features.js'),
            'about': () => import('./pages/about.js')
        });
        
        // 启动路由
        this.router.start();
    }

    startRealTimeUpdates() {
        // 时间更新 (每秒)
        this.timeInterval = setInterval(() => {
            this.updateTime();
        }, 1000);
        
        // 状态同步 (每分钟)
        this.syncInterval = setInterval(() => {
            this.syncApplicationState();
        }, 60000);
        
        // 立即更新一次
        this.updateTime();
    }

    detectUserPreferences() {
        // 检测主题偏好
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.state.theme = 'dark';
        }
        
        // 检测语言偏好
        const savedLang = localStorage.getItem('calendar-craft-lang');
        if (savedLang && ['zh', 'en'].includes(savedLang)) {
            this.state.language = savedLang;
            this.language.setLanguage(savedLang);
        }
        
        // 检测减少动画偏好
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduce-motion');
        }
    }

    async completeLoading() {
        return new Promise((resolve) => {
            // 模拟加载时间以展示加载动画
            setTimeout(() => {
                document.body.classList.remove('loading');
                this.elements.pageLoader?.classList.add('hidden');
                this.isLoading = false;
                
                // 播放入场动画
                this.playEntryAnimation();
                
                resolve();
            }, 1500);
        });
    }

    // 事件处理器
    handleKeyboardShortcuts(e) {
        // 忽略输入框中的快捷键
        if (e.target.matches('input, textarea, select')) return;
        
        const { key, ctrlKey, metaKey, shiftKey } = e;
        const modKey = ctrlKey || metaKey;
        
        switch (key.toLowerCase()) {
            case 'h':
                if (!modKey) {
                    e.preventDefault();
                    this.router.navigate('home');
                }
                break;
                
            case 'c':
                if (!modKey) {
                    e.preventDefault();
                    this.router.navigate('calendar');
                }
                break;
                
            case 'f':
                if (!modKey) {
                    e.preventDefault();
                    this.router.navigate('features');
                }
                break;
                
            case 'l':
                if (!modKey) {
                    e.preventDefault();
                    this.language.toggle();
                }
                break;
                
            case '?':
                if (!modKey) {
                    e.preventDefault();
                    this.toggleShortcutsPanel();
                }
                break;
                
            case 'escape':
                this.handleEscapeKey();
                break;
                
            case 'enter':
                if (modKey) {
                    e.preventDefault();
                    this.handleQuickAction();
                }
                break;
        }
    }

    handleNavigation(e) {
        const link = e.target.closest('[data-route]');
        if (link && !link.classList.contains('external')) {
            e.preventDefault();
            const route = link.dataset.route;
            this.router.navigate(route);
        }
    }

    handleLanguageChange(language) {
        this.state.language = language;
        localStorage.setItem('calendar-craft-lang', language);
        
        // 更新页面内容
        this.language.updatePageContent();
        
        // 触发组件更新
        this.calendar.updateLanguage(language);
        
        console.log(`🌐 语言切换至: ${language}`);
    }

    handleRouteChange(route) {
        this.state.currentPage = route;
        
        // 更新导航状态
        this.updateNavigationState(route);
        
        // 更新页面标题
        this.updatePageTitle(route);
        
        console.log(`📍 路由切换至: ${route}`);
    }

    handleTransitionStart() {
        this.isTransitioning = true;
        this.elements.pageTransition?.classList.add('active');
    }

    handleTransitionEnd() {
        this.isTransitioning = false;
        this.elements.pageTransition?.classList.remove('active');
        
        // 播放页面进入动画
        this.playPageEnterAnimation();
    }

    handleResize() {
        // 响应式处理
        const width = window.innerWidth;
        
        if (width < 768) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
        
        // 通知组件更新
        this.calendar.handleResize();
    }

    handleBeforeUnload() {
        // 保存应用状态
        this.saveApplicationState();
    }

    handleNetworkChange(isOnline) {
        if (isOnline) {
            console.log('🌐 网络已连接');
            document.body.classList.remove('offline');
        } else {
            console.log('📴 网络已断开');
            document.body.classList.add('offline');
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // 页面不可见时暂停更新
            this.pauseUpdates();
        } else {
            // 页面可见时恢复更新
            this.resumeUpdates();
        }
    }

    handleDateSelect(date) {
        console.log(`📅 选择日期: ${date}`);
        // 处理日期选择逻辑
    }

    handleEscapeKey() {
        // 关闭快捷键面板
        if (this.elements.shortcutsPanel?.classList.contains('visible')) {
            this.toggleShortcutsPanel();
            return;
        }
        
        // 返回首页
        if (this.state.currentPage !== 'home') {
            this.router.navigate('home');
        }
    }

    handleQuickAction() {
        // 根据当前页面执行快速操作
        switch (this.state.currentPage) {
            case 'home':
                this.router.navigate('calendar');
                break;
            case 'calendar':
                this.calendar.exportCalendar();
                break;
            default:
                this.router.navigate('home');
        }
    }

    handleInitError(error) {
        console.error('App 初始化失败:', error);
        
        // 显示错误页面
        if (this.elements.pageContainer) {
            this.elements.pageContainer.innerHTML = `
                <div class="error-container">
                    <h1>应用启动失败</h1>
                    <p>请刷新页面重试</p>
                    <button onclick="location.reload()">刷新页面</button>
                </div>
            `;
        }
        
        // 隐藏加载器
        this.elements.pageLoader?.classList.add('hidden');
    }

    // 工具方法
    updateTime() {
        const now = new Date();
        this.state.time = now;
        
        const timeString = Utils.formatDateTime(now);
        
        if (this.elements.currentTime) {
            this.elements.currentTime.textContent = timeString;
        }
        
        // 更新状态栏中的其他时间相关信息
        this.updateTimeRelatedInfo(now);
    }

    updateTimeRelatedInfo(date) {
        // 更新今日信息
        const todayElement = document.querySelector('[data-zh="今日: 8月8日"]');
        if (todayElement) {
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const zhText = `今日: ${month}月${day}日`;
            const enText = `Today: ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
            
            if (this.state.language === 'zh') {
                todayElement.textContent = zhText;
            } else {
                todayElement.textContent = enText;
            }
        }
    }

    updateNavigationState(currentRoute) {
        const navLinks = document.querySelectorAll('.nav-link[data-route]');
        navLinks.forEach(link => {
            if (link.dataset.route === currentRoute) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    updatePageTitle(route) {
        const titles = {
            home: { zh: '日历工艺 · CalendarCraft', en: 'CalendarCraft · Home' },
            calendar: { zh: '智能日历 · CalendarCraft', en: 'Smart Calendar · CalendarCraft' },
            features: { zh: '功能特色 · CalendarCraft', en: 'Features · CalendarCraft' },
            about: { zh: '关于我们 · CalendarCraft', en: 'About Us · CalendarCraft' }
        };
        
        const title = titles[route]?.[this.state.language] || titles.home[this.state.language];
        document.title = title;
    }

    toggleShortcutsPanel() {
        const panel = this.elements.shortcutsPanel;
        if (panel) {
            panel.classList.toggle('visible');
        }
    }

    playEntryAnimation() {
        // 应用入场动画
        const animatedElements = document.querySelectorAll('.animate-in');
        animatedElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.1}s`;
            el.classList.add('animate-in');
        });
    }

    playPageEnterAnimation() {
        // 页面进入动画
        const pageContent = this.elements.pageContainer.querySelector('.page-view');
        if (pageContent) {
            pageContent.classList.add('enter');
        }
    }

    syncApplicationState() {
        // 同步应用状态到 localStorage
        this.saveApplicationState();
        
        // 检查更新
        this.checkForUpdates();
    }

    saveApplicationState() {
        const state = {
            language: this.state.language,
            theme: this.state.theme,
            lastVisit: new Date().toISOString(),
            version: this.version
        };
        
        localStorage.setItem('calendar-craft-state', JSON.stringify(state));
    }

    checkForUpdates() {
        // 检查应用更新逻辑
        // 这里可以实现 PWA 更新检查
    }

    pauseUpdates() {
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
        }
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
    }

    resumeUpdates() {
        this.startRealTimeUpdates();
    }

    // 公共 API
    getState() {
        return { ...this.state };
    }

    navigate(route) {
        return this.router.navigate(route);
    }

    setLanguage(language) {
        return this.language.setLanguage(language);
    }

    exportData() {
        return {
            state: this.getState(),
            calendar: this.calendar.exportData(),
            timestamp: new Date().toISOString()
        };
    }

    // 析构函数
    destroy() {
        // 清理定时器
        if (this.timeInterval) clearInterval(this.timeInterval);
        if (this.syncInterval) clearInterval(this.syncInterval);
        
        // 清理事件监听器
        // 保存状态
        this.saveApplicationState();
        
        console.log('🔄 CalendarCraft App 已销毁');
    }
}

// 全局错误处理
window.addEventListener('error', (e) => {
    console.error('全局错误:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('未处理的 Promise 拒绝:', e.reason);
});

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
    window.calendarApp = new CalendarCraftApp();
});

// 导出给其他模块使用
export default CalendarCraftApp;