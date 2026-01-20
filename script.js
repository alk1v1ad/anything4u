// Основной файл JavaScript для сайта

// Ждём полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт готов к работе');
    
    // ========== МОБИЛЬНОЕ МЕНЮ ==========
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            // Меняем иконку
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                if (mobileMenu.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            }
        });
        
        // Закрываем меню при клике на ссылку
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            });
        });
    }
    
    // ========== ПЛАВНАЯ НАВИГАЦИЯ ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Пропускаем якорь "#"
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                // Прокручиваем плавно
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Обновляем активную ссылку в навигации
                updateActiveNavLink(href);
            }
        });
    });
    
    // Функция обновления активной ссылки
    function updateActiveNavLink(targetId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`.nav-link[href="${targetId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    // ========== АНИМИРОВАННЫЕ СЧЁТЧИКИ С "+" ==========
    function initCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        // Наблюдатель за появлением элементов
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounterAnimation(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        // Начинаем наблюдение
        statNumbers.forEach(number => {
            if (number) observer.observe(number);
        });
    }
    
    // Анимация счётчика с добавлением "+"
    function startCounterAnimation(element) {
        const target = parseInt(element.getAttribute('data-count')) || 0;
        const duration = 2000; // 2 секунды
        const stepTime = 16; // ~60fps
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;
        
        const timer = setInterval(function() {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, stepTime);
    }
    
    // ========== ПОРТФОЛИО С ПЛАВНЫМИ ПЕРЕХОДАМИ ==========
    function initPortfolio() {
        const portfolioGrid = document.getElementById('portfolioGrid');
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        // Данные портфолио
        const portfolioItems = [
            {
                title: "Последний рассвет",
                category: "film",
                year: "2023",
                description: "Полнометражный драматический фильм",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Kinofilm.jpg/800px-Kinofilm.jpg"
            },
            {
                title: "Тени города",
                category: "series",
                year: "2022-2023",
                description: "Криминальный сериал в 12 серий",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Broadway_at_night.jpg/800px-Broadway_at_night.jpg"
            },
            {
                title: "Премиум класс",
                category: "commercial",
                year: "2024",
                description: "Рекламная кампания для автомобильного бренда",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Filming_a_commercial_for_Mountain_Dew.jpg/800px-Filming_a_commercial_for_Mountain_Dew.jpg"
            },
            {
                title: "Эхо прошлого",
                category: "film",
                year: "2021",
                description: "Историческая драма",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/A_Blacksmiths_Shop.jpg/800px-A_Blacksmiths_Shop.jpg"
            },
            {
                title: "Ночная смена",
                category: "series",
                year: "2023",
                description: "Медицинский сериал",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Hospital_Corridor.jpg/800px-Hospital_Corridor.jpg"
            },
            {
                title: "Бренд стиля",
                category: "commercial",
                year: "2022",
                description: "Реклама fashion-бренда",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Photo_shoot_for_fashion_magazine.jpg/800px-Photo_shoot_for_fashion_magazine.jpg"
            }
        ];
        
        // Рендерим все проекты при загрузке
        renderPortfolio(portfolioItems, true);
        
        // Вешаем обработчики на кнопки фильтрации
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Убираем активный класс у всех кнопок
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Добавляем активный класс текущей кнопке
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                let filteredItems;
                
                if (filter === 'all') {
                    filteredItems = portfolioItems;
                } else {
                    filteredItems = portfolioItems.filter(item => item.category === filter);
                }
                
                renderPortfolio(filteredItems, false);
            });
        });
        
        // Функция рендеринга портфолио с плавной анимацией
        function renderPortfolio(items, initialLoad = false) {
            if (!portfolioGrid) return;
            
            // Анимация исчезновения
            if (!initialLoad) {
                portfolioGrid.style.opacity = '0';
                portfolioGrid.style.transform = 'translateY(20px)';
                portfolioGrid.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            }
            
            // Ждём завершения анимации исчезновения
            setTimeout(() => {
                // Очищаем сетку
                portfolioGrid.innerHTML = '';
                
                items.forEach(item => {
                    const categoryName = getCategoryName(item.category);
                    
                    const projectElement = document.createElement('div');
                    projectElement.className = 'portfolio-item';
                    projectElement.style.opacity = '0';
                    projectElement.style.transform = 'translateY(20px)';
                    projectElement.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    
                    projectElement.innerHTML = `
                        <img src="${item.image}" alt="${item.title}" class="portfolio-img" loading="lazy">
                        <div class="portfolio-content">
                            <span class="portfolio-category">${categoryName}</span>
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                            <div class="portfolio-year">${item.year}</div>
                        </div>
                    `;
                    
                    portfolioGrid.appendChild(projectElement);
                });
                
                // Анимация появления
                setTimeout(() => {
                    portfolioGrid.style.opacity = '1';
                    portfolioGrid.style.transform = 'translateY(0)';
                    
                    // Анимация для каждого элемента
                    const projectElements = portfolioGrid.querySelectorAll('.portfolio-item');
                    projectElements.forEach((element, index) => {
                        setTimeout(() => {
                            element.style.opacity = '1';
                            element.style.transform = 'translateY(0)';
                        }, index * 100); // Задержка для каждого элемента
                    });
                }, 50);
            }, initialLoad ? 0 : 300);
        }
        
        // Перевод категории
        function getCategoryName(category) {
            const categories = {
                'film': 'Кино',
                'series': 'Сериалы',
                'commercial': 'Реклама'
            };
            return categories[category] || category;
        }
    }
    
    // ========== ФОРМА ОБРАТНОЙ СВЯЗИ ==========
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Получаем значения полей
                const nameInput = this.querySelector('input[type="text"]');
                const emailInput = this.querySelector('input[type="email"]');
                const messageInput = this.querySelector('textarea');
                
                const name = nameInput ? nameInput.value.trim() : '';
                const email = emailInput ? emailInput.value.trim() : '';
                const message = messageInput ? messageInput.value.trim() : '';
                
                // Простая валидация
                if (!name || !email || !message) {
                    showFormMessage('Пожалуйста, заполните все поля', 'error');
                    return;
                }
                
                // Проверка email
                if (!isValidEmail(email)) {
                    showFormMessage('Пожалуйста, введите корректный email', 'error');
                    return;
                }
                
                // Показываем состояние "отправка"
                const submitButton = this.querySelector('.submit-btn');
                if (submitButton) {
                    const originalText = submitButton.innerHTML;
                    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
                    submitButton.disabled = true;
                    
                    // Имитация отправки (в реальном проекте здесь будет fetch)
                    setTimeout(function() {
                        // Восстанавливаем кнопку
                        submitButton.innerHTML = originalText;
                        submitButton.disabled = false;
                        
                        // Показываем сообщение об успехе
                        showFormMessage('Сообщение успешно отправлено! Скоро свяжусь с вами.', 'success');
                        
                        // Очищаем форму
                        contactForm.reset();
                    }, 1500);
                }
            });
        }
    }
    
    // Проверка email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Показ сообщения формы
    function showFormMessage(text, type) {
        // Удаляем старое сообщение
        const oldMessage = document.querySelector('.form-message');
        if (oldMessage) oldMessage.remove();
        
        // Создаём новое сообщение
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message-${type}`;
        messageElement.textContent = text;
        messageElement.style.cssText = `
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 5px;
            text-align: center;
            font-weight: 500;
            opacity: 0;
            transform: translateY(-10px);
            transition: opacity 0.3s ease, transform 0.3s ease;
        `;
        
        if (type === 'success') {
            messageElement.style.background = 'rgba(46, 213, 115, 0.2)';
            messageElement.style.color = '#2ED573';
            messageElement.style.border = '1px solid #2ED573';
        } else {
            messageElement.style.background = 'rgba(255, 71, 87, 0.2)';
            messageElement.style.color = '#FF4757';
            messageElement.style.border = '1px solid #FF4757';
        }
        
        // Вставляем сообщение перед формой
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.parentNode.insertBefore(messageElement, contactForm);
            
            // Анимация появления
            setTimeout(() => {
                messageElement.style.opacity = '1';
                messageElement.style.transform = 'translateY(0)';
            }, 10);
            
            // Удаляем сообщение через 5 секунд
            setTimeout(function() {
                messageElement.style.opacity = '0';
                messageElement.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    messageElement.remove();
                }, 300);
            }, 5000);
        }
    }
    
    // ========== АКТИВНАЯ НАВИГАЦИЯ ПРИ СКРОЛЛЕ ==========
    function initScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (sections.length === 0 || navLinks.length === 0) return;
        
        window.addEventListener('scroll', function() {
            let currentSection = '';
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPosition >= sectionTop && 
                    scrollPosition < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });
            
            // Обновляем активную ссылку
            if (currentSection) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    const href = link.getAttribute('href');
                    if (href === `#${currentSection}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // ========== КНОПКА "НАВЕРХ" С АНИМАЦИЕЙ ==========
    function initScrollTopButton() {
        // Создаём кнопку
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        scrollTopBtn.id = 'scrollTopBtn';
        scrollTopBtn.setAttribute('aria-label', 'Наверх');
        scrollTopBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: #D4AF37;
            color: #0a0a0a;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            z-index: 999;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
            opacity: 0;
            transform: translateY(20px) scale(0.8);
            pointer-events: none;
        `;
        
        document.body.appendChild(scrollTopBtn);
        
        // Показываем/скрываем кнопку
        function updateScrollTopButton() {
            if (window.scrollY > 300) {
                scrollTopBtn.style.opacity = '1';
                scrollTopBtn.style.transform = 'translateY(0) scale(1)';
                scrollTopBtn.style.pointerEvents = 'auto';
            } else {
                scrollTopBtn.style.opacity = '0';
                scrollTopBtn.style.transform = 'translateY(20px) scale(0.8)';
                scrollTopBtn.style.pointerEvents = 'none';
            }
        }
        
        window.addEventListener('scroll', updateScrollTopButton);
        updateScrollTopButton(); // Инициализация
        
        // Обработчик клика с анимацией нажатия
        scrollTopBtn.addEventListener('click', function() {
            this.style.transform = 'scale(0.9)';
            
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
        
        // Анимация наведения
        scrollTopBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        scrollTopBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    // ========== ПЛАВНЫЕ ПЕРЕХОДЫ ДЛЯ КНОПОК ФИЛЬТРА ==========
    function initFilterAnimations() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            // Анимация наведения
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
            
            // Анимация клика
            button.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }
    
    // ========== ОБРАБОТКА ОШИБОК ИЗОБРАЖЕНИЙ ==========
    function handleImageErrors() {
        // Резервные изображения
        const fallbackImages = {
            'default': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZpbG0gUHJvamVjdDwvdGV4dD48L3N2Zz4='
        };
        
        document.querySelectorAll('img').forEach(img => {
            // Проверяем, загрузилось ли изображение
            if (!img.complete) {
                img.addEventListener('load', function() {
                    // Изображение загрузилось успешно
                    this.style.opacity = '1';
                });
                
                img.addEventListener('error', function() {
                    console.warn('Не удалось загрузить изображение:', this.src);
                    this.src = fallbackImages.default;
                    this.alt = 'Изображение не загрузилось';
                    this.style.opacity = '1';
                });
                
                // Начальное состояние
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s ease';
            }
            
            // Добавляем ленивую загрузку для производительности
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }
    
    // ========== АНИМАЦИЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ ==========
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.portfolio-item, .about-card, .contact-item, .location-tag');
        
        if (animatedElements.length === 0) return;
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Устанавливаем начальные стили
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    }
    
    // ========== АНИМАЦИЯ ГЛАВНОГО ЗАГОЛОВКА ==========
    function initTitleAnimation() {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.style.opacity = '0';
            heroTitle.style.transform = 'translateY(30px)';
            heroTitle.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s';
            
            setTimeout(() => {
                heroTitle.style.opacity = '1';
                heroTitle.style.transform = 'translateY(0)';
            }, 300);
        }
    }
    
    // ========== ИНИЦИАЛИЗАЦИЯ ВСЕХ ФУНКЦИЙ ==========
    
    // Запускаем все функции
    initTitleAnimation();
    initCounters();
    initPortfolio();
    initContactForm();
    initScrollSpy();
    initScrollTopButton();
    initFilterAnimations();
    handleImageErrors();
    initScrollAnimations();
    
    // Логирование успешной инициализации
    console.log('Все функции JavaScript инициализированы успешно!');
    
    // ========== ДОПОЛНИТЕЛЬНЫЕ УТИЛИТЫ ==========
    
    // Обновление года в футере
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(el => {
        if (el.textContent.includes('2024')) {
            el.textContent = el.textContent.replace('2024', currentYear);
        }
    });
    
    // Плавная анимация для всех ссылок
    document.querySelectorAll('a').forEach(link => {
        link.style.transition = 'color 0.3s ease, opacity 0.3s ease';
    });
    
    // Обработка клавиатуры
    document.addEventListener('keydown', function(e) {
        // ESC закрывает мобильное меню
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        }
        
        // Tab переключает фокус
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('click', function() {
        document.body.classList.remove('keyboard-navigation');
    });
});

// ========== ГЛОБАЛЬНЫЕ УТИЛИТЫ ==========

// Функция форматирования чисел с пробелами и "+"
function formatNumberWithPlus(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + '+';
}

// Дебаунс для оптимизации обработчиков событий
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Троттлинг для оптимизации
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

// Проверка поддержки веб-функций
function checkWebFeatures() {
    const features = {
        smoothScroll: 'scrollBehavior' in document.documentElement.style,
        intersectionObserver: 'IntersectionObserver' in window,
        cssTransitions: 'transition' in document.documentElement.style
    };
    
    // Добавляем классы для поддержки
    if (!features.smoothScroll) {
        document.documentElement.classList.add('no-smooth-scroll');
    }
    
    return features;
}

// Инициализация проверки функций
checkWebFeatures();

// Полифил для requestAnimationFrame
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
        return setTimeout(callback, 1000 / 60);
    };
}

if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
}