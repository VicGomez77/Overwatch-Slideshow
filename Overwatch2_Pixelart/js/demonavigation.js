// demo-navigation.js - Navegación entre las 4 pantallas demo
$(document).ready(function() {
    console.log('Inicializando navegación demo...');
    
    // Inicializar navegación demo
    initDemoNavigation();
    
    // Cargar contenido de pantallas
    loadDemoContent();
    
    // Configurar controles de teclado
    setupKeyboardNavigation();
    
    // Configurar sonidos de navegación
    setupNavigationSounds();
});

/**
 * Inicializar sistema de navegación demo
 */
function initDemoNavigation() {
    const $navButtons = $('.demo-nav-btn');
    const $screens = $('.demo-screen');
    let currentScreen = 0;
    
    // Ocultar todas las pantallas excepto la primera
    $screens.removeClass('active');
    $screens.eq(0).addClass('active');
    
    // Configurar botones de navegación
    $navButtons.on('click', function(e) {
        e.preventDefault();
        
        const $button = $(this);
        const screenIndex = $button.index();
        
        // Si ya está activo, no hacer nada
        if ($button.hasClass('active')) return;
        
        // Efecto de sonido
        playSound('click');
        
        // Actualizar botón activo
        $navButtons.removeClass('active');
        $button.addClass('active');
        
        // Cambiar pantalla con animación
        switchScreen(screenIndex);
        
        // Actualizar historial del navegador
        updateURLHash(screenIndex);
    });
    
    /**
     * Cambiar a una pantalla específica
     * @param {number} index - Índice de la pantalla (0-3)
     */
    function switchScreen(index) {
        // Validar índice
        if (index < 0 || index >= $screens.length) return;
        
        // Obtener pantallas
        const $currentScreen = $screens.filter('.active');
        const $nextScreen = $screens.eq(index);
        
        // Si es la misma pantalla, no hacer nada
        if ($currentScreen.is($nextScreen)) return;
        
        // Animación de transición
        $currentScreen.removeClass('active').addClass('exiting');
        $nextScreen.addClass('entering');
        
        setTimeout(() => {
            $currentScreen.removeClass('exiting');
            $nextScreen.removeClass('entering').addClass('active');
            
            // Actualizar índice actual
            currentScreen = index;
            
            // Llamar a función específica de la pantalla si existe
            const screenName = getScreenName(index);
            if (typeof window[`on${screenName}ScreenEnter`] === 'function') {
                window[`on${screenName}ScreenEnter`]();
            }
            
            // Actualizar título de la página
            updatePageTitle(index);
        }, 300);
    }
    
    /**
     * Obtener nombre de pantalla por índice
     */
    function getScreenName(index) {
        const screenNames = ['Config', 'Characters', 'HUD', 'Maps'];
        return screenNames[index] || 'Unknown';
    }
    
    /**
     * Actualizar título de la página
     */
    function updatePageTitle(index) {
        const screenNames = ['Configuración', 'Personajes', 'HUD', 'Mapas'];
        const baseTitle = 'Overwatch 2 Pixel - Demo Interactiva';
        document.title = `${screenNames[index]} | ${baseTitle}`;
    }
    
    /**
     * Actualizar hash en la URL
     */
    function updateURLHash(index) {
        const screenNames = ['config', 'characters', 'hud', 'maps'];
        const hash = `#${screenNames[index]}`;
        
        if (history.pushState) {
            history.pushState(null, null, hash);
        } else {
            window.location.hash = hash;
        }
    }
    
    // Cargar pantalla desde hash de URL
    function loadFromHash() {
        const hash = window.location.hash.substring(1);
        const screenMap = {
            'config': 0,
            'characters': 1,
            'hud': 2,
            'maps': 3
        };
        
        if (screenMap.hasOwnProperty(hash)) {
            const index = screenMap[hash];
            $navButtons.removeClass('active').eq(index).addClass('active');
            switchScreen(index);
        }
    }
    
    // Escuchar cambios en el hash
    $(window).on('hashchange', loadFromHash);
    
    // Cargar desde hash al inicio
    setTimeout(loadFromHash, 100);
    
    // Exponer función para uso externo
    window.switchDemoScreen = switchScreen;
    window.getCurrentDemoScreen = () => currentScreen;
}

/**
 * Cargar contenido de las pantallas demo
 */
function loadDemoContent() {
    console.log('Cargando contenido demo...');
    
    // Mapa de archivos a cargar
    const screenFiles = {
        'config': 'config.html',
        'characters': 'characters.html',
        'hud': 'hud.html',
        'maps': 'maps.html'
    };
    
    // Función para cargar contenido
    function loadScreenContent(screenId, contentId) {
        const file = screenFiles[screenId];
        if (!file) return;
        
        const $content = $(`#${contentId}`);
        if (!$content.length) return;
        
        // Mostrar loader
        $content.html(`
            <div class="content-loader">
                <div class="loader-spinner"></div>
                <div class="loader-text">Cargando ${screenId}...</div>
            </div>
        `);
        
        // Cargar contenido (en un proyecto real, esto sería AJAX)
        // Por ahora, simulamos la carga
        setTimeout(() => {
            switch (screenId) {
                case 'config':
                    $content.html(getConfigContent());
                    initConfigScreen();
                    break;
                case 'characters':
                    $content.html(getCharactersContent());
                    initCharactersScreen();
                    break;
                case 'hud':
                    $content.html(getHUDContent());
                    initHUDScreen();
                    break;
                case 'maps':
                    $content.html(getMapsContent());
                    initMapsScreen();
                    break;
            }
        }, 500);
    }
    
    // Observar cuando se active cada pantalla
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const $screen = $(mutation.target);
                if ($screen.hasClass('active')) {
                    const screenId = $screen.attr('id').replace('-screen', '');
                    const contentId = `${screenId}-content`;
                    loadScreenContent(screenId, contentId);
                }
            }
        });
    });
    
    // Configurar observador para cada pantalla
    $('.demo-screen').each(function() {
        observer.observe(this, { attributes: true });
    });
    
    // Cargar contenido inicial
    const initialScreen = $('.demo-screen.active').attr('id').replace('-screen', '');
    loadScreenContent(initialScreen, `${initialScreen}-content`);
}

/**
 * Configurar navegación por teclado
 */
function setupKeyboardNavigation() {
    $(document).on('keydown', function(e) {
        // Solo en páginas demo
        if (!$('body').hasClass('demo-page')) return;
        
        const currentScreen = getCurrentDemoScreen();
        
        switch (e.key) {
            case '1':
            case '2':
            case '3':
            case '4':
                const index = parseInt(e.key) - 1;
                if (index >= 0 && index <= 3) {
                    switchDemoScreen(index);
                    e.preventDefault();
                }
                break;
                
            case 'ArrowLeft':
                const prevIndex = (currentScreen - 1 + 4) % 4;
                switchDemoScreen(prevIndex);
                e.preventDefault();
                break;
                
            case 'ArrowRight':
                const nextIndex = (currentScreen + 1) % 4;
                switchDemoScreen(nextIndex);
                e.preventDefault();
                break;
                
            case 'Escape':
                // Volver al inicio
                window.location.href = 'index.html';
                break;
        }
    });
    
    // Mostrar atajos de teclado
    showNotification('Atajos: Teclas 1-4 para navegar, ← → para cambiar pantalla', 'info', 3000);
}

/**
 * Configurar sonidos de navegación
 */
function setupNavigationSounds() {
    // Sonido al cambiar de pantalla
    $(document).on('screenChange', function(e, from, to) {
        playSound('click');
    });
    
    // Sonido al pasar sobre elementos interactivos
    $('.demo-nav-btn, .screen-control').on('mouseenter', function() {
        playSound('hover');
    });
}

/**
 * Funciones para generar contenido (simuladas)
 * En un proyecto real, esto cargaría archivos externos
 */
function getConfigContent() {
    return `
        <div class="config-content-loaded">
            <div class="config-sections">
                <!-- El contenido real se cargaría desde config.html -->
            </div>
        </div>
    `;
}

function getCharactersContent() {
    return `
        <div class="characters-content-loaded">
            <div class="characters-sections">
                <!-- El contenido real se cargaría desde characters.html -->
            </div>
        </div>
    `;
}

function getHUDContent() {
    return `
        <div class="hud-content-loaded">
            <div class="hud-sections">
                <!-- El contenido real se cargaría desde hud.html -->
            </div>
        </div>
    `;
}

function getMapsContent() {
    return `
        <div class="maps-content-loaded">
            <div class="maps-grid">
                <!-- Generar mapas dinámicamente -->
                ${generateMaps()}
            </div>
        </div>
    `;
}

function generateMaps() {
    const maps = [
        { name: 'Kings Row', type: 'Híbrido', description: 'Callejones de Londres' },
        { name: 'Hanamura', type: 'Asalto', description: 'Templo japonés' },
        { name: 'Ilios', type: 'Control', description: 'Pueblo griego' },
        { name: 'Route 66', type: 'Carga', description: 'Carretera desértica' },
        { name: 'Numbani', type: 'Híbrido', description: 'Ciudad africana' },
        { name: 'Volskaya', type: 'Asalto', description: 'Fábrica rusa' }
    ];
    
    return maps.map(map => `
        <div class="map-card" data-map="${map.name.toLowerCase().replace(' ', '-')}">
            <div class="map-image" style="background-color: #${Math.floor(Math.random()*16777215).toString(16)}">
                <span class="map-preview">${map.name.charAt(0)}</span>
            </div>
            <div class="map-info">
                <h4 class="map-name">${map.name}</h4>
                <span class="map-type">${map.type}</span>
                <p class="map-description">${map.description}</p>
                <button class="map-select-btn">Seleccionar</button>
            </div>
        </div>
    `).join('');
}

/**
 * Inicializar pantallas específicas
 */
function initConfigScreen() {
    console.log('Inicializando pantalla de configuración...');
    // Esta función se implementa en config-interactive.js
    if (typeof initConfigInteractive === 'function') {
        initConfigInteractive();
    }
}

function initCharactersScreen() {
    console.log('Inicializando pantalla de personajes...');
    // Esta función se implementa en characters-slideshow.js
    if (typeof initCharactersSlideshow === 'function') {
        initCharactersSlideshow();
    }
}

function initHUDScreen() {
    console.log('Inicializando pantalla de HUD...');
    // Esta función se implementa en hud-customization.js
    if (typeof initHUDCustomization === 'function') {
        initHUDCustomization();
    }
}

function initMapsScreen() {
    console.log('Inicializando pantalla de mapas...');
    
    // Configurar selección de mapas
    $('.map-select-btn').on('click', function() {
        const $card = $(this).closest('.map-card');
        const mapName = $card.find('.map-name').text();
        
        playSound('click');
        showNotification(`Mapa "${mapName}" seleccionado`, 'success');
        
        // Resaltar selección
        $('.map-card').removeClass('selected');
        $card.addClass('selected');
    });
    
    // Hover en mapas
    $('.map-card').on('mouseenter', function() {
        $(this).addClass('hover');
        playSound('hover');
    }).on('mouseleave', function() {
        $(this).removeClass('hover');
    });
}

// Exportar funciones
window.initDemoNavigation = initDemoNavigation;
window.loadDemoContent = loadDemoContent;