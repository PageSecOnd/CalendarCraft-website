// 语言管理器
class LanguageManager {
    constructor(options = {}) {
        this.currentLanguage = options.defaultLang || 'zh';
        this.onLanguageChange = options.onLanguageChange || (() => {});
        
        this.supportedLanguages = ['zh', 'en'];
        this.translations = new Map();
        
        // DOM 元素
        this.langCube = null;
        this.langTexts = [];
        
        this.init();
    }

    init() {
        this.initDOMElements();
        this.bindEvents();
        this.loadTranslations();
        this.updateUI();
        
        console.log('🌐 语言管理器已初始化');
    }

    initDOMElements() {
        this.langCube = document.getElementById('langCube');
        this.langTexts = document.querySelectorAll('.lang-text');
    }

    bindEvents() {
        // 语言切换按钮点击
        this.langTexts.forEach(text => {
            text.addEventListener('click', () => {
                const targetLang = text.dataset.lang;
                if (targetLang !== this.currentLanguage) {
                    this.setLanguage(targetLang);
                }
            });
        });

        // 立方体点击
        if (this.langCube) {
            this.langCube.addEventListener('click', () => {
                this.toggle();
            });
        }
    }

    loadTranslations() {
        // 加载翻译数据
        this.translations.set('zh', {
            // 导航
            'Home': '首页',
            'Calendar': '日历',
            'Features': '功能',
            'About': '关于',
            
            // 时间相关
            'Current Time': '当前时间',
            'Today': '今日',
            'Yesterday': '昨日',
            'Tomorrow': '明日',
            
            // 节气
            'Beginning of Autumn': '立秋',
            'End of Heat': '处暑',
            'White Dew': '白露',
            'Autumnal Equinox': '秋分',
            
            // 月份
            'January': '一月',
            'February': '二月',
            'March': '三月',
            'April': '四月',
            'May': '五月',
            'June': '六月',
            'July': '七月',
            'August': '八月',
            'September': '九月',
            'October': '十月',
            'November': '十一月',
            'December': '十二月',
            
            // 星期
            'Sunday': '星期日',
            'Monday': '星期一',
            'Tuesday': '星期二',
            'Wednesday': '星期三',
            'Thursday': '星期四',
            'Friday': '星期五',
            'Saturday': '星期六',
            
            // 操作
            'Export': '导出',
            'Print': '打印',
            'Share': '分享',
            'Settings': '设置',
            'Help': '帮助',
            
            // 消息
            'Loading': '加载中',
            'Error': '错误',
            'Success': '成功',
            'Warning': '警告',
            'Info': '信息'
        });

        this.translations.set('en', {
            // 导航
            '首页': 'Home',
            '日历': 'Calendar',
            '功能': 'Features',
            '关于': 'About',
            
            // 时间相关
            '当前时间': 'Current Time',
            '今日': 'Today',
            '昨日': 'Yesterday',
            '明日': 'Tomorrow',
            
            // 节气
            '立秋': 'Beginning of Autumn',
            '处暑': 'End of Heat',
            '白露': 'White Dew',
            '秋分': 'Autumnal Equinox',
            
            // 月份
            '一月': 'January',
            '二月': 'February',
            '三月': 'March',
            '四月': 'April',
            '五月': 'May',
            '六月': 'June',
            '七月': 'July',
            '八月': 'August',
            '九月': 'September',
            '十月': 'October',
            '十一月': 'November',
            '十二月': 'December',
            
            // 星期
            '星期日': 'Sunday',
            '星期一': 'Monday',
            '星期二': 'Tuesday',
            '星期三': 'Wednesday',
            '星期四': 'Thursday',
            '星期五': 'Friday',
            '星期六': 'Saturday',
            
            // 操作
            '导出': 'Export',
            '打印': 'Print',
            '分享': 'Share',
            '设置': 'Settings',
            '帮助': 'Help',
            
            // 消息
            '加载中': 'Loading',
            '错误': 'Error',
            '成功': 'Success',
            '警告': 'Warning',
            '信息': 'Info'
        });
    }

    setLanguage(language) {
        if (!this.supportedLanguages.includes(language)) {
            console.warn(`不支持的语言: ${language}`);
            return false;
        }

        if (language === this.currentLanguage) {
            return true;
        }

        const previousLanguage = this.currentLanguage;
        this.currentLanguage = language;

        // 更新 UI
        this.updateUI();
        
        // 更新页面内容
        this.updatePageContent();
        
        // 保存到本地存储
        localStorage.setItem('calendar-craft-lang', language);
        
        // 触发回调
        this.onLanguageChange(language, previousLanguage);
        
        console.log(`🌐 语言切换: ${previousLanguage} → ${language}`);
        return true;
    }

    toggle() {
        const nextLanguage = this.currentLanguage === 'zh' ? 'en' : 'zh';
        return this.setLanguage(nextLanguage);
    }

    updateUI() {
        // 更新语言切换器状态
        this.langTexts.forEach(text => {
            if (text.dataset.lang === this.currentLanguage) {
                text.classList.add('active');
                text.classList.remove('inactive');
            } else {
                text.classList.remove('active');
                text.classList.add('inactive');
            }
        });

        // 更新立方体状态
        if (this.langCube) {
            this.langCube.className = `lang-cube ${this.currentLanguage}`;
        }

        // 更新文档语言属性
        document.documentElement.lang = this.currentLanguage === 'zh' ? 'zh-CN' : 'en-US';
    }

    updatePageContent() {
        // 更新所有带有多语言属性的元素
        const elements = document.querySelectorAll('[data-zh][data-en]');
        
        elements.forEach(element => {
            const text = element.dataset[this.currentLanguage];
            if (text) {
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.placeholder = text;
                } else {
                    element.textContent = text;
                }
            }
        });

        // 更新页面标题
        this.updatePageTitle();
        
        // 触发自定义事件
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { 
                language: this.currentLanguage,
                timestamp: Date.now()
            }
        }));
    }

    updatePageTitle() {
        const currentRoute = window.calendarApp?.router?.getCurrentRoute() || 'home';
        const titles = {
            home: { zh: '日历工艺 · CalendarCraft', en: 'CalendarCraft · Home' },
            calendar: { zh: '智能日历 · CalendarCraft', en: 'Smart Calendar · CalendarCraft' },
            features: { zh: '功能特色 · CalendarCraft', en: 'Features · CalendarCraft' },
            about: { zh: '关于我们 · CalendarCraft', en: 'About Us · CalendarCraft' }
        };
        
        const title = titles[currentRoute]?.[this.currentLanguage] || titles.home[this.currentLanguage];
        document.title = title;
    }

    // 翻译方法
    translate(key, fallback = null) {
        const translations = this.translations.get(this.currentLanguage);
        return translations?.get?.(key) || fallback || key;
    }

    // 格式化日期
    formatDate(date, format = 'full') {
        const options = {
            full: {
                zh: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
                en: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
            },
            short: {
                zh: { month: 'numeric', day: 'numeric' },
                en: { month: 'short', day: 'numeric' }
            },
            month: {
                zh: { year: 'numeric', month: 'long' },
                en: { year: 'numeric', month: 'long' }
            }
        };

        const locale = this.currentLanguage === 'zh' ? 'zh-CN' : 'en-US';
        const formatOptions = options[format]?.[this.currentLanguage] || options.full[this.currentLanguage];
        
        return date.toLocaleDateString(locale, formatOptions);
    }

    // 格式化时间
    formatTime(date, format24 = true) {
        const locale = this.currentLanguage === 'zh' ? 'zh-CN' : 'en-US';
        const options = {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: !format24
        };
        
        return date.toLocaleTimeString(locale, options);
    }

    // 格式化数字
    formatNumber(number, style = 'decimal') {
        const locale = this.currentLanguage === 'zh' ? 'zh-CN' : 'en-US';
        
        if (style === 'percent') {
            return new Intl.NumberFormat(locale, { style: 'percent' }).format(number);
        } else if (style === 'currency') {
            const currency = this.currentLanguage === 'zh' ? 'CNY' : 'USD';
            return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(number);
        } else {
            return new Intl.NumberFormat(locale).format(number);
        }
    }

    // 获取当前语言
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // 获取支持的语言列表
    getSupportedLanguages() {
        return [...this.supportedLanguages];
    }

    // 检查是否支持某种语言
    isLanguageSupported(language) {
        return this.supportedLanguages.includes(language);
    }

    // 添加翻译
    addTranslation(language, key, value) {
        if (!this.translations.has(language)) {
            this.translations.set(language, new Map());
        }
        this.translations.get(language).set(key, value);
    }

    // 批量添加翻译
    addTranslations(language, translations) {
        Object.entries(translations).forEach(([key, value]) => {
            this.addTranslation(language, key, value);
        });
    }
}

export default LanguageManager;