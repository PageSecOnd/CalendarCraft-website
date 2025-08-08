// 工具函数集合
class Utils {
    // 时间格式化
    static formatDateTime(date = new Date(), format = 'full') {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        switch (format) {
            case 'full':
                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            case 'date':
                return `${year}-${month}-${day}`;
            case 'time':
                return `${hours}:${minutes}:${seconds}`;
            case 'datetime-local':
                return `${year}-${month}-${day}T${hours}:${minutes}`;
            case 'iso':
                return date.toISOString();
            default:
                return date.toString();
        }
    }

    // 防抖函数
    static debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    }

    // 节流函数
    static throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function executedFunction(...args) {
            if (!lastRan) {
                func.apply(this, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(() => {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(this, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    // 深拷贝
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => Utils.deepClone(item));
        if (typeof obj === 'object') {
            const cloned = {};
            Object.keys(obj).forEach(key => {
                cloned[key] = Utils.deepClone(obj[key]);
            });
            return cloned;
        }
    }

    // 生成唯一ID
    static generateId(prefix = '') {
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substr(2, 9);
        return `${prefix}${timestamp}${randomStr}`;
    }

    // 颜色工具
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    static rgbToHex(r, g, b) {
        return `#${[r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('')}`;
    }

    static getContrastColor(hexColor) {
        const rgb = Utils.hexToRgb(hexColor);
        if (!rgb) return '#000000';
        
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        return brightness > 155 ? '#000000' : '#ffffff';
    }

    // DOM 操作工具
    static createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else if (key.startsWith('data-')) {
                element.setAttribute(key, value);
            } else {
                element[key] = value;
            }
        });
        
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Element) {
                element.appendChild(child);
            }
        });
        
        return element;
    }

    static findParent(element, selector) {
        let parent = element.parentElement;
        while (parent && !parent.matches(selector)) {
            parent = parent.parentElement;
        }
        return parent;
    }

    static getElementOffset(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.pageYOffset,
            left: rect.left + window.pageXOffset,
            width: rect.width,
            height: rect.height
        };
    }

    // 数据验证
    static isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    static isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // 数组工具
    static chunk(array, size) {
        const chunked = [];
        for (let i = 0; i < array.length; i += size) {
            chunked.push(array.slice(i, i + size));
        }
        return chunked;
    }

    static unique(array) {
        return [...new Set(array)];
    }

    static shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // 对象工具
    static isEmpty(obj) {
        if (obj == null) return true;
        if (typeof obj === 'string' || Array.isArray(obj)) return obj.length === 0;
        return Object.keys(obj).length === 0;
    }

    static pick(obj, keys) {
        const result = {};
        keys.forEach(key => {
            if (key in obj) {
                result[key] = obj[key];
            }
        });
        return result;
    }

    static omit(obj, keys) {
        const result = { ...obj };
        keys.forEach(key => {
            delete result[key];
        });
        return result;
    }

    // 字符串工具
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static camelCase(str) {
        return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
    }

    static kebabCase(str) {
        return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
    }

    static truncate(str, length, suffix = '...') {
        if (str.length <= length) return str;
        return str.slice(0, length) + suffix;
    }

    // 数学工具
    static clamp(number, min, max) {
        return Math.min(Math.max(number, min), max);
    }

    static randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    static randomInt(min, max) {
        return Math.floor(Math.randomBetween(min, max + 1));
    }

    // 存储工具
    static storage = {
        set(key, value, expiry = null) {
            const item = {
                value,
                expiry: expiry ? Date.now() + expiry : null
            };
            localStorage.setItem(key, JSON.stringify(item));
        },

        get(key) {
            const itemStr = localStorage.getItem(key);
            if (!itemStr) return null;

            try {
                const item = JSON.parse(itemStr);
                if (item.expiry && Date.now() > item.expiry) {
                    localStorage.removeItem(key);
                    return null;
                }
                return item.value;
            } catch (e) {
                return null;
            }
        },

        remove(key) {
            localStorage.removeItem(key);
        },

        clear() {
            localStorage.clear();
        }
    };

    // 文件工具
    static downloadFile(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    static readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    // 网络工具
    static async fetchWithTimeout(url, options = {}, timeout = 10000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    // 性能工具
    static performance = {
        mark(name) {
            if ('performance' in window && 'mark' in performance) {
                performance.mark(name);
            }
        },

        measure(name, startMark, endMark) {
            if ('performance' in window && 'measure' in performance) {
                performance.measure(name, startMark, endMark);
                const entries = performance.getEntriesByName(name);
                return entries[entries.length - 1]?.duration || 0;
            }
            return 0;
        },

        now() {
            return 'performance' in window && 'now' in performance 
                ? performance.now() 
                : Date.now();
        }
    };

    // 设备检测
    static device = {
        isMobile() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },

        isTablet() {
            return /iPad|Android|webOS/i.test(navigator.userAgent) && window.innerWidth >= 768;
        },

        isDesktop() {
            return !this.isMobile() && !this.isTablet();
        },

        getTouchSupport() {
            return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        },

        getScreenSize() {
            return {
                width: window.innerWidth,
                height: window.innerHeight,
                pixelRatio: window.devicePixelRatio || 1
            };
        }
    };

    // 浏览器检测
    static browser = {
        isChrome() {
            return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        },

        isFirefox() {
            return /Firefox/.test(navigator.userAgent);
        },

        isSafari() {
            return /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
        },

        isEdge() {
            return /Edg/.test(navigator.userAgent);
        },

        getVersion() {
            const ua = navigator.userAgent;
            const match = ua.match(/(chrome|firefox|safari|edge)\/(\d+)/i);
            return match ? { name: match[1].toLowerCase(), version: parseInt(match[2]) } : null;
        }
    };

    // 动画工具
    static animate(element, keyframes, options = {}) {
        if ('animate' in element) {
            return element.animate(keyframes, {
                duration: 300,
                easing: 'ease-in-out',
                fill: 'forwards',
                ...options
            });
        } else {
            // 降级处理
            return {
                finished: Promise.resolve(),
                cancel: () => {},
                finish: () => {}
            };
        }
    }

    // 错误处理
    static handleError(error, context = '') {
        console.error(`[${context}] 错误:`, error);
        
        // 可以在这里添加错误上报逻辑
        if (window.calendarApp && window.calendarApp.onError) {
            window.calendarApp.onError(error, context);
        }
    }

    // 调试工具
    static debug = {
        log(...args) {
            if (process.env.NODE_ENV === 'development') {
                console.log('[DEBUG]', ...args);
            }
        },

        table(data) {
            if (process.env.NODE_ENV === 'development') {
                console.table(data);
            }
        },

        time(label) {
            if (process.env.NODE_ENV === 'development') {
                console.time(label);
            }
        },

        timeEnd(label) {
            if (process.env.NODE_ENV === 'development') {
                console.timeEnd(label);
            }
        }
    };
}

export default Utils;