class ScheduleReminder {
    constructor() {
        this.currentDay = this.getCurrentDay();
        this.notificationEnabled = false;
        this.notificationTime = 10; // minutes before class
        this.soundEnabled = true;
        this.autoAdvanceDay = true;
        this.notificationTimeouts = [];
        
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.updateCurrentTime();
        this.displaySchedule(this.currentDay);
        this.setActiveDay(this.currentDay);
        this.checkNotificationPermission();
        this.scheduleNotifications();
        
        // Update time every minute
        setInterval(() => {
            this.updateCurrentTime();
            this.updateScheduleStatus();
        }, 60000);
    }

    getCurrentDay() {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const today = new Date().getDay();
        const dayName = days[today];
        
        // If it's weekend, show Monday's schedule
        if (dayName === 'Sabtu' || dayName === 'Minggu') {
            return 'Senin';
        }
        return dayName;
    }

    setupEventListeners() {
        document.querySelectorAll('.day-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const day = e.target.dataset.day;
                this.setActiveDay(day);
                this.displaySchedule(day);
            });
        });
        document.getElementById('notificationToggle').addEventListener('click', () => {
            this.toggleNotifications();
        });

        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.openSettings();
        });

        document.getElementById('closeSettings').addEventListener('click', () => {
            this.closeSettings();
        });

        document.getElementById('saveSettings').addEventListener('click', () => {
            this.saveSettings();
        });
        document.getElementById('settingsModal').addEventListener('click', (e) => {
            if (e.target.id === 'settingsModal') {
                this.closeSettings();
            }
        });
    }

    setActiveDay(day) {
        document.querySelectorAll('.day-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-day="${day}"]`).classList.add('active');
        this.currentDay = day;
    }

    displaySchedule(day) {
        const container = document.getElementById('scheduleContainer');
        const daySchedule = scheduleData.filter(item => item.day === day);
        
        if (daySchedule.length === 0) {
            container.innerHTML = `
                <div class="no-schedule">
                    <i class="fas fa-calendar-times"></i>
                    <h3>Tidak ada jadwal untuk hari ${day}</h3>
                    <p>Hari ini libur atau belum ada jadwal yang tersedia.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        
        daySchedule.forEach((item, index) => {
            const scheduleItem = this.createScheduleItem(item, index);
            container.appendChild(scheduleItem);
        });

        this.updateScheduleStatus();
    }

    createScheduleItem(item, index) {
        const div = document.createElement('div');
        div.className = 'schedule-item';
        
        const status = this.getScheduleStatus(item);
        if (status.class) {
            div.classList.add(status.class);
        }
        
        div.innerHTML = `
            <div class="schedule-header">
                <div class="schedule-time">
                    <i class="fas fa-clock"></i>
                    ${item.time}
                </div>
                <div class="schedule-status ${status.statusClass}">
                    ${status.text}
                </div>
            </div>
            <div class="schedule-subject">${item.subject}</div>
            <div class="schedule-teacher">
                <i class="fas fa-user-tie"></i>
                ${item.teacher}
            </div>
        `;
        
        return div;
    }

    getScheduleStatus(item) {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const currentDay = this.getCurrentDay();
        
        if (item.day !== currentDay) {
            return {
                class: '',
                statusClass: '',
                text: ''
            };
        }
        
        const [startTime, endTime] = item.time.split('-');
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        
        const startTimeMinutes = startHour * 60 + startMinute;
        const endTimeMinutes = endHour * 60 + endMinute;
        
        if (currentTime >= startTimeMinutes && currentTime <= endTimeMinutes) {
            return {
                class: 'current',
                statusClass: 'status-current',
                text: 'Sedang Berlangsung'
            };
        } else if (currentTime < startTimeMinutes) {
            return {
                class: 'upcoming',
                statusClass: 'status-upcoming',
                text: 'Akan Datang'
            };
        } else {
            return {
                class: 'completed',
                statusClass: 'status-completed',
                text: 'Selesai'
            };
        }
    }

    updateScheduleStatus() {
        const scheduleItems = document.querySelectorAll('.schedule-item');
        const daySchedule = scheduleData.filter(item => item.day === this.currentDay);
        
        scheduleItems.forEach((item, index) => {
            if (daySchedule[index]) {
                const status = this.getScheduleStatus(daySchedule[index]);
                
                item.classList.remove('current', 'upcoming', 'completed');
                
                if (status.class) {
                    item.classList.add(status.class);
                }
                
                const statusElement = item.querySelector('.schedule-status');
                if (statusElement) {
                    statusElement.className = `schedule-status ${status.statusClass}`;
                    statusElement.textContent = status.text;
                }
            }
        });
    }

    updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const dateString = now.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        document.getElementById('currentTime').textContent = `${dateString} - ${timeString}`;
        
        // Auto advance to current day if enabled
        if (this.autoAdvanceDay) {
            const currentDay = this.getCurrentDay();
            if (currentDay !== this.currentDay) {
                this.setActiveDay(currentDay);
                this.displaySchedule(currentDay);
            }
        }
    }

    async toggleNotifications() {
        if (!this.notificationEnabled) {
            const permission = await this.requestNotificationPermission();
            if (permission === 'granted') {
                this.notificationEnabled = true;
                this.scheduleNotifications();
                this.updateNotificationUI();
                this.saveSettings();
                this.showNotification('Notifikasi Diaktifkan', 'Anda akan menerima pengingat sebelum kelas dimulai.');
            }
        } else {
            this.notificationEnabled = false;
            this.clearNotifications();
            this.updateNotificationUI();
            this.saveSettings();
        }
    }

    async requestNotificationPermission() {
        if (!('Notification' in window)) {
            alert('Browser ini tidak mendukung notifikasi.');
            return 'denied';
        }
        
        if (Notification.permission === 'granted') {
            return 'granted';
        }
        
        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission;
        }
        
        return 'denied';
    }

    checkNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'granted') 
        }
    }

    scheduleNotifications() {
        if (!this.notificationEnabled) return;
        
        this.clearNotifications();
        
        const now = new Date();
        const currentDay = this.getCurrentDay();
        const todaySchedule = scheduleData.filter(item => item.day === currentDay);
        
        todaySchedule.forEach(item => {
            const [startTime] = item.time.split('-');
            const [hour, minute] = startTime.split(':').map(Number);
            
            const classTime = new Date();
            classTime.setHours(hour, minute, 0, 0);
            
            const notificationTime = new Date(classTime.getTime() - (this.notificationTime * 60 * 1000));
            
            if (notificationTime > now) {
                const timeout = setTimeout(() => {
                    this.showNotification(
                        `${item.subject} akan dimulai dalam ${this.notificationTime} menit`,
                        `Guru: ${item.teacher}\nWaktu: ${item.time}`
                    );
                }, notificationTime.getTime() - now.getTime());
                
                this.notificationTimeouts.push(timeout);
            }
        });
    }

    clearNotifications() {
        this.notificationTimeouts.forEach(timeout => clearTimeout(timeout));
        this.notificationTimeouts = [];
    }

    showNotification(title, body) {
        if (this.notificationEnabled && Notification.permission === 'granted') {
            const notification = new Notification(title, {
                body: body,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234facfe"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>',
                badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234facfe"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
                silent: !this.soundEnabled
            });
            
            // Auto close notification after 10 seconds
            setTimeout(() => notification.close(), 10000);
        }
    }

    updateNotificationUI() {
        const toggleBtn = document.getElementById('notificationToggle');
        const statusSpan = document.getElementById('notificationStatus');
        const footerStatus = document.getElementById('notificationStatusFooter');
        
        if (this.notificationEnabled) {
            toggleBtn.classList.add('active');
            statusSpan.textContent = 'Notifikasi Aktif';
            footerStatus.textContent = 'Notifikasi: Aktif';
        } else {
            toggleBtn.classList.remove('active');
            statusSpan.textContent = 'Aktifkan Notifikasi';
            footerStatus.textContent = 'Notifikasi: Nonaktif';
        }
    }

    openSettings() {
        document.getElementById('settingsModal').style.display = 'block';
        document.getElementById('notificationTime').value = this.notificationTime;
        document.getElementById('soundNotification').checked = this.soundEnabled;
        document.getElementById('autoAdvanceDay').checked = this.autoAdvanceDay;
    }

    closeSettings() {
        document.getElementById('settingsModal').style.display = 'none';
    }

    saveSettings() {
        this.notificationTime = parseInt(document.getElementById('notificationTime').value);
        this.soundEnabled = document.getElementById('soundNotification').checked;
        this.autoAdvanceDay = document.getElementById('autoAdvanceDay').checked;
        
        const settings = {
            notificationEnabled: this.notificationEnabled,
            notificationTime: this.notificationTime,
            soundEnabled: this.soundEnabled,
            autoAdvanceDay: this.autoAdvanceDay
        };
        
        localStorage.setItem('scheduleReminderSettings', JSON.stringify(settings));
        
        // Reschedule notifications with new time
        if (this.notificationEnabled) {
            this.scheduleNotifications();
        }
        
        this.closeSettings();
        this.showNotification('Pengaturan Disimpan', 'Pengaturan notifikasi telah berhasil disimpan.');
    }

    loadSettings() {
        const saved = localStorage.getItem('scheduleReminderSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.notificationEnabled = settings.notificationEnabled || false;
            this.notificationTime = settings.notificationTime || 10;
            this.soundEnabled = settings.soundEnabled !== undefined ? settings.soundEnabled : true;
            this.autoAdvanceDay = settings.autoAdvanceDay !== undefined ? settings.autoAdvanceDay : true;
        }
        
        this.updateNotificationUI();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ScheduleReminder();
});

// Service Worker registration for better notification support
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => {
        console.log('Service Worker registration failed:', err);
    });
}

