// 路由管理器
class Router {
    constructor(options = {}) {
        this.container = options.container || document.getElementById('pageContainer');
        this.onRouteChange = options.onRouteChange || (() => {});
        this.onTransitionStart = options.onTransitionStart || (() => {});
        this.onTransitionEnd = options.onTransitionEnd || (() => {});
        
        this.routes = new Map();
        this.currentRoute = null;
        this.isTransitioning = false;
        this.history = [];
        
        // 过渡动画配置
        this.transitionDuration = 800;
        this.transitionEasing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }

    registerRoutes(routeMap) {
        Object.entries(routeMap).forEach(([path, loader]) => {
            this.routes.set(path, {
                loader,
                component: null,
                isLoaded: false
            });
        });
    }

    start() {
        // 监听浏览器前进后退
        window.addEventListener('popstate', (e) => {
            const route = e.state?.route || this.getRouteFromURL();
            this.navigate(route, false);
        });
        
        // 获取初始路由
        const initialRoute = this.getRouteFromURL() || 'home';
        this.navigate(initialRoute, false);
        
        console.log('🧭 路由器已启动');
    }

    getRouteFromURL() {
        const path = window.location.pathname;
        if (path === '/' || path === '') return 'home';
        return path.slice(1); // 移除开头的 /
    }

    async navigate(route, updateHistory = true) {
        if (this.isTransitioning || route === this.currentRoute) {
            return false;
        }

        console.log(`🧭 导航到: ${route}`);

        try {
            this.isTransitioning = true;
            this.onTransitionStart();

            // 开始过渡动画
            await this.startTransition();

            // 加载并渲染页面
            await this.loadAndRenderRoute(route);

            // 更新状态
            this.updateRouteState(route, updateHistory);

            // 结束过渡动画
            await this.endTransition();

            this.onTransitionEnd();
            return true;

        } catch (error) {
            console.error(`路由导航失败: ${route}`, error);
            await this.handleNavigationError(error);
            return false;
        } finally {
            this.isTransitioning = false;
        }
    }

    async startTransition() {
        return new Promise((resolve) => {
            const transition = document.getElementById('pageTransition');
            if (transition) {
                transition.classList.add('active');
                setTimeout(resolve, this.transitionDuration / 2);
            } else {
                resolve();
            }
        });
    }

    async endTransition() {
        return new Promise((resolve) => {
            const transition = document.getElementById('pageTransition');
            if (transition) {
                transition.classList.add('slide-out');
                setTimeout(() => {
                    transition.classList.remove('active', 'slide-out');
                    resolve();
                }, this.transitionDuration / 2);
            } else {
                resolve();
            }
        });
    }

    async loadAndRenderRoute(route) {
        const routeConfig = this.routes.get(route);
        
        if (!routeConfig) {
            throw new Error(`路由未找到: ${route}`);
        }

        // 懒加载组件
        if (!routeConfig.isLoaded) {
            try {
                const module = await routeConfig.loader();
                routeConfig.component = module.default || module;
                routeConfig.isLoaded = true;
            } catch (error) {
                throw new Error(`加载页面组件失败: ${route}, ${error.message}`);
            }
        }

        // 渲染页面
        await this.renderPage(routeConfig.component, route);
    }

    async renderPage(PageComponent, route) {
        if (!this.container) {
            throw new Error('页面容器未找到');
        }

        // 清空当前内容
        this.container.innerHTML = '';

        // 创建页面实例
        if (typeof PageComponent === 'function') {
            const pageInstance = new PageComponent({
                route,
                container: this.container,
                router: this
            });
            
            // 渲染页面
            await pageInstance.render();
            
            // 执行页面初始化
            if (pageInstance.init) {
                await pageInstance.init();
            }
            
        } else if (typeof PageComponent === 'string') {
            // 如果是 HTML 字符串
            this.container.innerHTML = PageComponent;
        }

        // 添加页面类名
        this.container.className = `page-container page-${route}`;
        
        // 触发页面进入动画
        this.triggerPageAnimation();
    }

    triggerPageAnimation() {
        const pageView = this.container.querySelector('.page-view');
        if (pageView) {
            // 重置动画
            pageView.classList.remove('enter', 'exit');
            
            // 强制重排
            pageView.offsetHeight;
            
            // 触发进入动画
            requestAnimationFrame(() => {
                pageView.classList.add('enter');
            });
        }
    }

    updateRouteState(route, updateHistory) {
        const previousRoute = this.currentRoute;
        this.currentRoute = route;
        
        // 更新历史记录
        this.history.push({
            route,
            timestamp: Date.now()
        });
        
        // 限制历史记录长度
        if (this.history.length > 50) {
            this.history = this.history.slice(-25);
        }
        
        // 更新浏览器 URL
        if (updateHistory) {
            const url = route === 'home' ? '/' : `/${route}`;
            const title = this.getPageTitle(route);
            
            history.pushState(
                { route, timestamp: Date.now() },
                title,
                url
            );
        }
        
        // 触发路由变化回调
        this.onRouteChange(route, previousRoute);
    }

    getPageTitle(route) {
        const titles = {
            home: '日历工艺 · CalendarCraft',
            calendar: '智能日历 · CalendarCraft',
            features: '功能特色 · CalendarCraft',
            about: '关于我们 · CalendarCraft'
        };
        return titles[route] || titles.home;
    }

    async handleNavigationError(error) {
        console.error('导航错误:', error);
        
        // 尝试导航到错误页面或首页
        if (this.currentRoute !== 'home') {
            try {
                await this.loadAndRenderRoute('home');
                this.updateRouteState('home', true);
            } catch (fallbackError) {
                console.error('回退到首页失败:', fallbackError);
                this.renderErrorPage(error);
            }
        } else {
            this.renderErrorPage(error);
        }
    }

    renderErrorPage(error) {
        if (this.container) {
            this.container.innerHTML = `
                <div class="error-page">
                    <div class="error-content">
                        <h1>页面加载失败</h1>
                        <p>抱歉，页面加载时出现了问题。</p>
                        <p class="error-message">${error.message}</p>
                        <div class="error-actions">
                            <button onclick="location.reload()" class="btn btn-primary">
                                刷新页面
                            </button>
                            <button onclick="window.calendarApp.navigate('home')" class="btn btn-secondary">
                                返回首页
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // 工具方法
    getCurrentRoute() {
        return this.currentRoute;
    }

    getPreviousRoute() {
        return this.history[this.history.length - 2]?.route || null;
    }

    getHistory() {
        return [...this.history];
    }

    canGoBack() {
        return this.history.length > 1;
    }

    goBack() {
        if (this.canGoBack()) {
            const previousRoute = this.getPreviousRoute();
            if (previousRoute) {
                return this.navigate(previousRoute);
            }
        }
        return false;
    }

    reload() {
        if (this.currentRoute) {
            // 强制重新加载当前路由
            const routeConfig = this.routes.get(this.currentRoute);
            if (routeConfig) {
                routeConfig.isLoaded = false;
                routeConfig.component = null;
            }
            return this.navigate(this.currentRoute, false);
        }
        return false;
    }

    // 预加载路由
    async preloadRoute(route) {
        const routeConfig = this.routes.get(route);
        
        if (routeConfig && !routeConfig.isLoaded) {
            try {
                const module = await routeConfig.loader();
                routeConfig.component = module.default || module;
                routeConfig.isLoaded = true;
                console.log(`📦 预加载完成: ${route}`);
                return true;
            } catch (error) {
                console.error(`预加载失败: ${route}`, error);
                return false;
            }
        }
        
        return true;
    }

    // 预加载所有路由
    async preloadAllRoutes() {
        const preloadPromises = Array.from(this.routes.keys()).map(route => 
            this.preloadRoute(route)
        );
        
        const results = await Promise.allSettled(preloadPromises);
        const successful = results.filter(r => r.status === 'fulfilled').length;
        
        console.log(`📦 预加载完成: ${successful}/${results.length} 个路由`);
        return results;
    }
}

export default Router;