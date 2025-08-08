// 日历组件
class Calendar {
    constructor(options = {}) {
        this.currentUser = options.currentUser || 'Guest';
        this.onDateSelect = options.onDateSelect || (() => {});
        
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.viewDate = new Date();
        
        // 配置选项
        this.config = {
            showSolarTerms: true,
            showFestivals: true,
            showLunar: true,
            firstDayOfWeek: 0, // 0 = Sunday, 1 = Monday
            theme: 'default'
        };
        
        // 数据存储
        this.solarTermsData = new Map();
        this.festivalsData = new Map();
        this.lunarData = new Map();
        
        this.init();
    }

    init() {
        this.loadCalendarData();
        this.updateCurrentTime();
        
        // 每分钟更新一次时间
        this.timeUpdateInterval = setInterval(() => {
            this.updateCurrentTime();
        }, 60000);
        
        console.log('📅 日历组件已初始化');
    }

    updateCurrentTime() {
        this.currentDate = new Date();
        
        // 更新今日信息
        this.updateTodayInfo();
    }

    updateTodayInfo() {
        const today = this.currentDate;
        const todayDateElements = document.querySelectorAll('#todayDate');
        
        todayDateElements.forEach(element => {
            if (element) {
                element.textContent = today.getDate();
            }
        });
    }

    loadCalendarData() {
        // 2025年二十四节气数据
        this.solarTermsData.set(2025, {
            1: { 5: '小寒', 20: '大寒' },
            2: { 4: '立春', 19: '雨水' },
            3: { 5: '惊蛰', 20: '春分' },
            4: { 5: '清明', 20: '谷雨' },
            5: { 5: '立夏', 21: '小满' },
            6: { 5: '芒种', 21: '夏至' },
            7: { 7: '小暑', 22: '大暑' },
            8: { 7: '立秋', 23: '处暑' },
            9: { 7: '白露', 23: '秋分' },
            10: { 8: '寒露', 23: '霜降' },
            11: { 7: '立冬', 22: '小雪' },
            12: { 7: '大雪', 22: '冬至' }
        });

        // 传统节日数据
        this.festivalsData.set(2025, {
            '01-01': '元旦',
            '02-12': '除夕',
            '02-13': '春节',
            '02-14': '情人节',
            '03-08': '妇女节',
            '04-05': '清明节',
            '05-01': '劳动节',
            '06-01': '儿童节',
            '08-13': '七夕节',
            '09-15': '中秋节',
            '10-01': '国庆节',
            '12-25': '圣诞节'
        });

        // 农历数据（简化版）
        this.lunarData.set('2025-08-08', {
            year: '乙巳年',
            month: '七月',
            day: '初四',
            zodiac: '蛇',
            element: '木'
        });
    }

    generateCalendar(year = null, month = null) {
        const targetDate = new Date(year || this.viewDate.getFullYear(), month !== null ? month : this.viewDate.getMonth(), 1);
        const currentYear = targetDate.getFullYear();
        const currentMonth = targetDate.getMonth();
        
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay();
        
        const calendarData = {
            year: currentYear,
            month: currentMonth,
            monthName: this.getMonthName(currentMonth),
            daysInMonth,
            startDayOfWeek,
            weeks: []
        };

        // 生成日历网格
        let currentWeek = [];
        let dayCount = 1;
        
        // 填充第一周的空白日期（上个月的日期）
        const prevMonth = new Date(currentYear, currentMonth - 1, 0);
        const prevMonthDays = prevMonth.getDate();
        
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            currentWeek.push({
                date: prevMonthDays - i,
                isCurrentMonth: false,
                isPrevMonth: true,
                isNextMonth: false,
                fullDate: new Date(currentYear, currentMonth - 1, prevMonthDays - i),
                events: []
            });
        }
        
        // 填充当月日期
        for (let day = 1; day <= daysInMonth; day++) {
            const fullDate = new Date(currentYear, currentMonth, day);
            const dayData = {
                date: day,
                isCurrentMonth: true,
                isPrevMonth: false,
                isNextMonth: false,
                fullDate,
                isToday: this.isSameDate(fullDate, this.currentDate),
                isSelected: this.isSameDate(fullDate, this.selectedDate),
                events: this.getEventsForDate(fullDate),
                solarTerm: this.getSolarTermForDate(fullDate),
                festival: this.getFestivalForDate(fullDate),
                lunar: this.getLunarForDate(fullDate)
            };
            
            currentWeek.push(dayData);
            
            // 如果一周已满，添加到weeks数组
            if (currentWeek.length === 7) {
                calendarData.weeks.push(currentWeek);
                currentWeek = [];
            }
        }
        
        // 填充最后一周的空白日期（下个月的日期）
        let nextMonthDay = 1;
        while (currentWeek.length < 7) {
            currentWeek.push({
                date: nextMonthDay,
                isCurrentMonth: false,
                isPrevMonth: false,
                isNextMonth: true,
                fullDate: new Date(currentYear, currentMonth + 1, nextMonthDay),
                events: []
            });
            nextMonthDay++;
        }
        
        if (currentWeek.length > 0) {
            calendarData.weeks.push(currentWeek);
        }
        
        return calendarData;
    }

    renderCalendar(container, options = {}) {
        if (!container) return;
        
        const calendarData = this.generateCalendar(options.year, options.month);
        
        const calendarHTML = `
            <div class="calendar-widget">
                <div class="calendar-header">
                    <button class="nav-btn prev-month" data-action="prevMonth">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M10 2L4 8l6 6V2z"/>
                        </svg>
                    </button>
                    
                    <div class="calendar-title-container">
                        <h3 class="calendar-title">${calendarData.monthName} ${calendarData.year}</h3>
                        <div class="calendar-subtitle">${this.getMonthSubtitle(calendarData.year, calendarData.month)}</div>
                    </div>
                    
                    <button class="nav-btn next-month" data-action="nextMonth">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M6 2l6 6-6 6V2z"/>
                        </svg>
                    </button>
                </div>
                
                <div class="calendar-weekdays">
                    ${this.renderWeekdays()}
                </div>
                
                <div class="calendar-grid">
                    ${this.renderCalendarGrid(calendarData)}
                </div>
                
                <div class="calendar-footer">
                    <div class="calendar-legend">
                        ${this.renderLegend()}
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = calendarHTML;
        this.bindCalendarEvents(container);
    }

    renderWeekdays() {
        const weekdays = [
            { zh: '日', en: 'Sun' },
            { zh: '一', en: 'Mon' },
            { zh: '二', en: 'Tue' },
            { zh: '三', en: 'Wed' },
            { zh: '四', en: 'Thu' },
            { zh: '五', en: 'Fri' },
            { zh: '六', en: 'Sat' }
        ];
        
        return weekdays.map(day => 
            `<div class="weekday" data-zh="${day.zh}" data-en="${day.en}">${day.zh}</div>`
        ).join('');
    }

    renderCalendarGrid(calendarData) {
        return calendarData.weeks.map(week => 
            `<div class="calendar-week">
                ${week.map(day => this.renderCalendarDay(day)).join('')}
            </div>`
        ).join('');
    }

    renderCalendarDay(dayData) {
        const classes = [
            'calendar-day',
            dayData.isCurrentMonth ? 'current-month' : 'other-month',
            dayData.isToday ? 'today' : '',
            dayData.isSelected ? 'selected' : '',
            dayData.solarTerm ? 'has-solar-term' : '',
            dayData.festival ? 'has-festival' : '',
            dayData.events.length > 0 ? 'has-events' : ''
        ].filter(Boolean).join(' ');
        
        const eventsHTML = dayData.events.length > 0 ? 
            `<div class="day-events">${dayData.events.map(e => `<span class="event-dot" title="${e.title}"></span>`).join('')}</div>` : '';
        
        const specialHTML = this.renderDaySpecialContent(dayData);
        
        return `
            <div class="${classes}" 
                 data-date="${dayData.fullDate.toISOString().split('T')[0]}"
                 data-day="${dayData.date}">
                <div class="day-number">${dayData.date}</div>
                ${specialHTML}
                ${eventsHTML}
            </div>
        `;
    }

    renderDaySpecialContent(dayData) {
        let content = '';
        
        if (this.config.showSolarTerms && dayData.solarTerm) {
            content += `<div class="solar-term">${dayData.solarTerm}</div>`;
        }
        
        if (this.config.showFestivals && dayData.festival) {
            content += `<div class="festival">${dayData.festival}</div>`;
        }
        
        if (this.config.showLunar && dayData.lunar) {
            content += `<div class="lunar">${dayData.lunar.day}</div>`;
        }
        
        return content;
    }

    renderLegend() {
        const legends = [];
        
        if (this.config.showSolarTerms) {
            legends.push('<span class="legend-item"><span class="legend-color solar-term-color"></span><span data-zh="节气" data-en="Solar Terms">节气</span></span>');
        }
        
        if (this.config.showFestivals) {
            legends.push('<span class="legend-item"><span class="legend-color festival-color"></span><span data-zh="节日" data-en="Festivals">节日</span></span>');
        }
        
        if (this.config.showLunar) {
            legends.push('<span class="legend-item"><span class="legend-color lunar-color"></span><span data-zh="农历" data-en="Lunar">农历</span></span>');
        }
        
        return legends.join('');
    }

    bindCalendarEvents(container) {
        // 月份导航
        container.addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]')?.dataset.action;
            
            if (action === 'prevMonth') {
                this.navigateMonth(-1);
                this.renderCalendar(container);
            } else if (action === 'nextMonth') {
                this.navigateMonth(1);
                this.renderCalendar(container);
            }
        });
        
        // 日期选择
        container.addEventListener('click', (e) => {
            const dayElement = e.target.closest('.calendar-day');
            if (dayElement && dayElement.classList.contains('current-month')) {
                const dateStr = dayElement.dataset.date;
                const selectedDate = new Date(dateStr);
                this.selectDate(selectedDate);
                this.renderCalendar(container);
            }
        });
        
        // 日期悬停
        container.addEventListener('mouseenter', (e) => {
            const dayElement = e.target.closest('.calendar-day');
            if (dayElement) {
                this.showDateTooltip(e, dayElement);
            }
        }, true);
        
        container.addEventListener('mouseleave', (e) => {
            const dayElement = e.target.closest('.calendar-day');
            if (dayElement) {
                this.hideDateTooltip();
            }
        }, true);
    }

    navigateMonth(direction) {
        this.viewDate.setMonth(this.viewDate.getMonth() + direction);
    }

    selectDate(date) {
        this.selectedDate = new Date(date);
        this.onDateSelect(date);
        
        console.log(`📅 选择日期: ${date.toISOString().split('T')[0]}`);
    }

    showDateTooltip(event, dayElement) {
        const dateStr = dayElement.dataset.date;
        const date = new Date(dateStr);
        const dayData = this.getDayData(date);
        
        const tooltip = document.createElement('div');
        tooltip.className = 'calendar-tooltip';
        tooltip.innerHTML = this.renderTooltipContent(dayData);
        
        document.body.appendChild(tooltip);
        
        // 定位提示框
        const rect = dayElement.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 10}px`;
        tooltip.style.transform = 'translate(-50%, -100%)';
        
        this.currentTooltip = tooltip;
    }

    hideDateTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }

    renderTooltipContent(dayData) {
        let content = `<div class="tooltip-date">${this.formatDate(dayData.fullDate)}</div>`;
        
        if (dayData.solarTerm) {
            content += `<div class="tooltip-solar-term">节气: ${dayData.solarTerm}</div>`;
        }
        
        if (dayData.festival) {
            content += `<div class="tooltip-festival">节日: ${dayData.festival}</div>`;
        }
        
        if (dayData.lunar) {
            content += `<div class="tooltip-lunar">农历: ${dayData.lunar.month}${dayData.lunar.day}</div>`;
        }
        
        if (dayData.events.length > 0) {
            content += `<div class="tooltip-events">事件: ${dayData.events.map(e => e.title).join(', ')}</div>`;
        }
        
        return content;
    }

    // 工具方法
    getMonthName(month) {
        const monthNames = [
            '一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'
        ];
        return monthNames[month];
    }

    getMonthSubtitle(year, month) {
        const solarTerms = this.solarTermsData.get(year)?.[month + 1];
        if (solarTerms) {
            const terms = Object.values(solarTerms);
            return terms.join(' · ');
        }
        return '';
    }

    getSolarTermForDate(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        const monthData = this.solarTermsData.get(year)?.[month];
        return monthData?.[day] || null;
    }

    getFestivalForDate(date) {
        const year = date.getFullYear();
        const dateKey = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        
        return this.festivalsData.get(year)?.[dateKey] || null;
    }

    getLunarForDate(date) {
        const dateKey = date.toISOString().split('T')[0];
        return this.lunarData.get(dateKey) || null;
    }

    getEventsForDate(date) {
        // 返回该日期的事件列表
        // 这里可以接入外部事件数据源
        return [];
    }

    getDayData(date) {
        return {
            fullDate: date,
            isToday: this.isSameDate(date, this.currentDate),
            isSelected: this.isSameDate(date, this.selectedDate),
            solarTerm: this.getSolarTermForDate(date),
            festival: this.getFestivalForDate(date),
            lunar: this.getLunarForDate(date),
            events: this.getEventsForDate(date)
        };
    }

    isSameDate(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    formatDate(date) {
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
    }

    // 配置方法
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    toggleSolarTerms() {
        this.config.showSolarTerms = !this.config.showSolarTerms;
    }

    toggleFestivals() {
        this.config.showFestivals = !this.config.showFestivals;
    }

    toggleLunar() {
        this.config.showLunar = !this.config.showLunar;
    }

    // 导出功能
    exportCalendar(format = 'json') {
        const calendarData = this.generateCalendar();
        
        switch (format) {
            case 'json':
                return JSON.stringify(calendarData, null, 2);
            case 'csv':
                return this.exportToCSV(calendarData);
            case 'ical':
                return this.exportToICS(calendarData);
            default:
                return calendarData;
        }
    }

    exportToCSV(calendarData) {
        const headers = ['日期', '星期', '节气', '节日', '农历'];
        const rows = [headers.join(',')];
        
        calendarData.weeks.flat().forEach(day => {
            if (day.isCurrentMonth) {
                const row = [
                    day.fullDate.toISOString().split('T')[0],
                    day.fullDate.toLocaleDateString('zh-CN', { weekday: 'long' }),
                    day.solarTerm || '',
                    day.festival || '',
                    day.lunar ? `${day.lunar.month}${day.lunar.day}` : ''
                ];
                rows.push(row.join(','));
            }
        });
        
        return rows.join('\n');
    }

    exportToICS(calendarData) {
        // ICS 格式导出（简化版）
        const icsLines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//CalendarCraft//Calendar//EN'
        ];
        
        calendarData.weeks.flat().forEach(day => {
            if (day.isCurrentMonth && (day.solarTerm || day.festival)) {
                const dateStr = day.fullDate.toISOString().split('T')[0].replace(/-/g, '');
                const summary = day.solarTerm || day.festival;
                
                icsLines.push('BEGIN:VEVENT');
                icsLines.push(`DTSTART;VALUE=DATE:${dateStr}`);
                icsLines.push(`SUMMARY:${summary}`);
                icsLines.push('END:VEVENT');
            }
        });
        
        icsLines.push('END:VCALENDAR');
        return icsLines.join('\r\n');
    }

    // 响应式处理
    handleResize() {
        // 处理窗口大小变化
        const tooltips = document.querySelectorAll('.calendar-tooltip');
        tooltips.forEach(tooltip => tooltip.remove());
    }

    // 语言更新
    updateLanguage(language) {
        // 重新渲染当前显示的日历以应用新语言
        const containers = document.querySelectorAll('.calendar-widget');
        containers.forEach(container => {
            const parent = container.parentElement;
            if (parent) {
                this.renderCalendar(parent);
            }
        });
    }

    // 析构函数
    destroy() {
        if (this.timeUpdateInterval) {
            clearInterval(this.timeUpdateInterval);
        }
        
        if (this.currentTooltip) {
            this.currentTooltip.remove();
        }
        
        console.log('📅 日历组件已销毁');
    }
}

export default Calendar;