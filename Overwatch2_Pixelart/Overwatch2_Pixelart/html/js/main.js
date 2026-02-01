// main.js - Funciones globales para toda la web
$(document).ready(function() {
    console.log('Overwatch 2 Pixel Art - Cargando...');
    
    // Inicializar todas las funcionalidades
    initCommonFeatures();
    setupEventListeners();
    handleResponsiveMenu();
    initAnimations();
    initThemeToggle();
    
    // Mostrar loader y luego contenido
    showLoader();
});

/**
 * Inicializar características comunes
 */
function initCommonFeatures() {
    console.log('Inicializando características comunes...');
    
    // Sistema de notificaciones
    initNotificationSystem();
    
    // Tooltips
    initTooltips();
    
    // Formularios
    initForms();
    
    // Botones interactivos
    initInteractiveButtons();
    
    // Sonidos (opcional)
    initSoundEffects();
}

/**
 * Configurar event listeners globales
 */
function setupEventListeners() {
    console.log('Configurando event listeners...');
    
    // Navegación suave para anclas
    $('a[href^="#"]:not([href="#"])').on('click', function(e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 800, 'swing');
        }
    });
    
    // Detectar cambios de tamaño de ventana
    $(window).on('resize', debounce(function() {
        handleWindowResize();
    }, 250));
    
    // Scroll animations
    $(window).on('scroll', throttle(function() {
        handleScrollAnimations();
    }, 100));
    
    // Prevenir comportamiento por defecto en formularios
    $('form').on('submit', function(e) {
        if ($(this).hasClass('prevent-default')) {
            e.preventDefault();
        }
    });
}

/**
 * Manejar menú responsive
 */
function handleResponsiveMenu() {
    const $mobileBtn = $('.mobile-menu-btn');
    const $navLinks = $('.nav-links');
    
    if ($mobileBtn.length && $navLinks.length) {
        $mobileBtn.on('click', function(e) {
            e.stopPropagation();
            $mobileBtn.toggleClass('active');
            $navLinks.toggleClass('active');
            
            // Toggle aria-expanded para accesibilidad
            const isExpanded = $mobileBtn.attr('aria-expanded') === 'true';
            $mobileBtn.attr('aria-expanded', !isExpanded);
        });
        
        // Cerrar menú al hacer clic en un enlace
        $navLinks.find('a').on('click', function() {
            $mobileBtn.removeClass('active');
            $navLinks.removeClass('active');
            $mobileBtn.attr('aria-expanded', 'false');
        });
        
        // Cerrar menú al hacer clic fuera
        $(document).on('click', function(e) {
            if (!$mobileBtn.is(e.target) && !$navLinks.is(e.target) && 
                $mobileBtn.has(e.target).length === 0 && $navLinks.has(e.target).length === 0) {
                $mobileBtn.removeClass('active');
                $navLinks.removeClass('active');
                $mobileBtn.attr('aria-expanded', 'false');
            }
        });
        
        // Tecla Escape para cerrar menú
        $(document).on('keydown', function(e) {
            if (e.key === 'Escape' && $navLinks.hasClass('active')) {
                $mobileBtn.removeClass('active');
                $navLinks.removeClass('active');
                $mobileBtn.attr('aria-expanded', 'false');
            }
        });
    }
}

/**
 * Inicializar animaciones
 */
function initAnimations() {
    // Añadir clase loaded cuando la página esté lista
    setTimeout(() => {
        $('body').addClass('loaded');
    }, 100);
    
    // Animación de elementos al entrar en viewport
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                $(entry.target).addClass('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar elementos con clase animate-on-scroll
    $('.animate-on-scroll').each(function() {
        observer.observe(this);
    });
}

/**
 * Inicializar toggle de tema claro/oscuro
 */
function initThemeToggle() {
    const $themeToggle = $('#themeToggle');
    const $themeIcon = $('.theme-icon');
    const $themeText = $('.theme-text');
    
    if ($themeToggle.length) {
        // Cargar tema guardado o usar preferencia del sistema
        const savedTheme = localStorage.getItem('overwatch-theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        applyTheme(currentTheme);
        
        $themeToggle.on('click', function() {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(currentTheme);
            localStorage.setItem('overwatch-theme', currentTheme);
            
            // Efecto de sonido
            playSound('click');
        });
        
        function applyTheme(theme) {
            $('body').removeClass('theme-dark theme-light').addClass('theme-' + theme);
            
            // Actualizar icono y texto
            if (theme === 'dark') {
                $themeIcon.text('🌙');
                $themeText.text('TEMA OSCURO');
                $themeToggle.addClass('active');
            } else {
                $themeIcon.text('☀️');
                $themeText.text('TEMA CLARO');
                $themeToggle.removeClass('active');
            }
            
            // Notificación
            showNotification(`Tema ${theme === 'dark' ? 'oscuro' : 'claro'} activado`, 'info');
        }
        
        // Escuchar cambios en la preferencia del sistema
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!savedTheme) {
                currentTheme = e.matches ? 'dark' : 'light';
                applyTheme(currentTheme);
            }
        });
    }
}

/**
 * Sistema de notificaciones
 */
function initNotificationSystem() {
    // Crear contenedor de notificaciones si no existe
    if ($('#notifications-container').length === 0) {
        $('body').append('<div id="notifications-container"></div>');
    }
}

/**
 * Mostrar notificación
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo: 'success', 'error', 'info', 'warning'
 * @param {number} duration - Duración en milisegundos
 */
function showNotification(message, type = 'info', duration = 5000) {
    const $container = $('#notifications-container');
    const notificationId = 'notification-' + Date.now();
    
    const notification = $(`
        <div id="${notificationId}" class="notification notification-${type}">
            <div class="notification-content">
                <span class="notification-icon">${getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Cerrar notificación">×</button>
            </div>
            <div class="notification-progress"></div>
        </div>
    `);
    
    $container.append(notification);
    
    // Animar entrada
    setTimeout(() => notification.addClass('show'), 10);
    
    // Configurar cierre
    notification.find('.notification-close').on('click', function() {
        closeNotification(notificationId);
    });
    
    // Cierre automático
    if (duration > 0) {
        setTimeout(() => {
            closeNotification(notificationId);
        }, duration);
    }
    
    // Animar barra de progreso
    notification.find('.notification-progress').css({
        'animation-duration': duration + 'ms',
        'animation-name': 'notificationProgress'
    });
}

function getNotificationIcon(type) {
    const icons = {
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'info': 'ℹ️'
    };
    return icons[type] || 'ℹ️';
}

function closeNotification(id) {
    const $notification = $('#' + id);
    if ($notification.length) {
        $notification.removeClass('show');
        setTimeout(() => $notification.remove(), 300);
    }
}

/**
 * Inicializar tooltips
 */
function initTooltips() {
    $('[data-tooltip]').each(function() {
        const $element = $(this);
        const tooltipText = $element.data('tooltip');
        
        $element.on('mouseenter focus', function() {
            const tooltip = $(`
                <div class="tooltip">
                    <div class="tooltip-content">${tooltipText}</div>
                    <div class="tooltip-arrow"></div>
                </div>
            `);
            
            $('body').append(tooltip);
            
            // Posicionar tooltip
            const elementRect = $element[0].getBoundingClientRect();
            const tooltipHeight = tooltip.outerHeight();
            
            tooltip.css({
                position: 'fixed',
                top: elementRect.top - tooltipHeight - 10 + 'px',
                left: elementRect.left + (elementRect.width / 2) + 'px',
                transform: 'translateX(-50%)'
            });
            
            $element.data('tooltip-element', tooltip);
        });
        
        $element.on('mouseleave blur', function() {
            const tooltip = $element.data('tooltip-element');
            if (tooltip) {
                tooltip.remove();
                $element.removeData('tooltip-element');
            }
        });
    });
}

/**
 * Inicializar formularios
 */
function initForms() {
    $('form').each(function() {
        const $form = $(this);
        
        // Validación en tiempo real
        $form.find('input, select, textarea').on('blur', function() {
            validateField($(this));
        });
        
        // Envío de formulario
        $form.on('submit', function(e) {
            if (!validateForm($form)) {
                e.preventDefault();
                showNotification('Por favor, corrige los errores en el formulario', 'error');
            }
        });
    });
}

function validateField($field) {
    const value = $field.val().trim();
    const $errorContainer = $field.siblings('.error-message');
    
    // Limpiar error previo
    $field.removeClass('error');
    $errorContainer.remove();
    
    // Validaciones
    if ($field.prop('required') && !value) {
        showFieldError($field, 'Este campo es obligatorio');
        return false;
    }
    
    if ($field.attr('type') === 'email' && value && !isValidEmail(value)) {
        showFieldError($field, 'Por favor, introduce un email válido');
        return false;
    }
    
    if ($field.attr('minlength') && value.length < parseInt($field.attr('minlength'))) {
        showFieldError($field, `Mínimo ${$field.attr('minlength')} caracteres`);
        return false;
    }
    
    if ($field.attr('maxlength') && value.length > parseInt($field.attr('maxlength'))) {
        showFieldError($field, `Máximo ${$field.attr('maxlength')} caracteres`);
        return false;
    }
    
    return true;
}

function validateForm($form) {
    let isValid = true;
    
    $form.find('input, select, textarea').each(function() {
        if (!validateField($(this))) {
            isValid = false;
        }
    });
    
    return isValid;
}

function showFieldError($field, message) {
    $field.addClass('error');
    const $error = $(`<div class="error-message">${message}</div>`);
    $field.after($error);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Inicializar botones interactivos
 */
function initInteractiveButtons() {
    $('.btn-primary, .btn-secondary, .nav-cta').on('mouseenter', function() {
        $(this).addClass('hover');
        playSound('hover');
    }).on('mouseleave', function() {
        $(this).removeClass('hover');
    }).on('click', function() {
        playSound('click');
    });
}

/**
 * Sistema de efectos de sonido
 */
function initSoundEffects() {
    // Solo inicializar si el usuario no ha desactivado sonidos
    if (localStorage.getItem('sound-enabled') !== 'false') {
        window.soundEnabled = true;
        
        // Precargar sonidos
        const sounds = {
            hover: 'sounds/hover.mp3',
            click: 'sounds/click.mp3',
            success: 'sounds/success.mp3',
            error: 'sounds/error.mp3'
        };
        
        // Crear elementos de audio (simulado - necesitarías archivos de sonido reales)
        window.sounds = {};
        for (const [key, src] of Object.entries(sounds)) {
            window.sounds[key] = new Audio(src);
            window.sounds[key].volume = 0.3;
        }
    } else {
        window.soundEnabled = false;
    }
}

function playSound(soundName) {
    if (window.soundEnabled && window.sounds && window.sounds[soundName]) {
        const sound = window.sounds[soundName].cloneNode();
        sound.volume = 0.3;
        sound.play().catch(e => console.log('Error reproduciendo sonido:', e));
    }
}

/**
 * Manejar redimensionamiento de ventana
 */
function handleWindowResize() {
    const windowWidth = $(window).width();
    
    // Actualizar clases según tamaño
    $('body').removeClass('mobile tablet desktop');
    if (windowWidth < 768) {
        $('body').addClass('mobile');
    } else if (windowWidth < 1024) {
        $('body').addClass('tablet');
    } else {
        $('body').addClass('desktop');
    }
    
    // Recalcular posiciones si es necesario
    if (typeof window.recalculateLayout === 'function') {
        window.recalculateLayout();
    }
}

/**
 * Animaciones al hacer scroll
 */
function handleScrollAnimations() {
    const scrollTop = $(window).scrollTop();
    const windowHeight = $(window).height();
    
    $('.animate-on-scroll').each(function() {
        const $element = $(this);
        const elementTop = $element.offset().top;
        
        if (elementTop < scrollTop + windowHeight - 100) {
            $element.addClass('in-view');
        }
    });
    
    // Efecto parallax en elementos específicos
    $('.parallax').each(function() {
        const $element = $(this);
        const speed = $element.data('parallax-speed') || 0.5;
        const yPos = -(scrollTop * speed);
        $element.css('transform', `translateY(${yPos}px)`);
    });
}

/**
 * Mostrar/Ocultar loader
 */
function showLoader() {
    const $loader = $('.loader');
    if ($loader.length) {
        setTimeout(() => {
            $loader.addClass('hidden');
            setTimeout(() => $loader.remove(), 500);
        }, 1000);
    }
}

/**
 * Funciones de utilidad
 */
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

// Exportar funciones globales para uso en otros archivos
window.showNotification = showNotification;
window.playSound = playSound;
window.validateForm = validateForm;

console.log('main.js cargado correctamente');