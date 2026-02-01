// characters-slideshow.js - Sistema de slideshow para personajes
$(document).ready(function() {
    console.log('Inicializando slideshow de personajes...');
    
    // Inicializar slideshow
    initCharactersSlideshow();
    
    // Cargar datos de personajes
    loadCharactersData();
    
    // Configurar interactividad
    setupCharacterInteractions();
    
    // Inicializar selección de skins
    initSkinsSystem();
});

/**
 * Inicializar slideshow de personajes
 */
function initCharactersSlideshow() {
    console.log('Configurando slideshow...');
    
    // Variables del slideshow
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 5000; // 5 segundos
    let autoPlay = true;
    
    // Elementos del DOM
    const $slides = $('.skin-slideshow .slide');
    const $dots = $('.slideshow-dots .dot');
    const $prevBtn = $('.prev-btn');
    const $nextBtn = $('.next-btn');
    const $currentSlide = $('.current-slide');
    const $totalSlides = $('.total-slides');
    
    // Configurar total de slides
    $totalSlides.text($slides.length);
    
    /**
     * Mostrar un slide específico
     * @param {number} index - Índice del slide
     */
    function showSlide(index) {
        // Validar índice
        if (index < 0) index = $slides.length - 1;
        if (index >= $slides.length) index = 0;
        
        // Ocultar slide actual
        $slides.removeClass('active').eq(currentSlide).addClass('exiting');
        $dots.removeClass('active');
        
        setTimeout(() => {
            // Mostrar nuevo slide
            $slides.removeClass('exiting').eq(index).addClass('active');
            $dots.eq(index).addClass('active');
            
            // Actualizar contador
            $currentSlide.text(index + 1);
            
            // Actualizar variable
            currentSlide = index;
            
            // Actualizar información del personaje según la skin
            updateCharacterInfoForSkin(index);
            
            // Disparar evento
            $(document).trigger('slideChanged', [index, getCurrentSkinInfo()]);
        }, 300);
    }
    
    /**
     * Slide siguiente
     */
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    /**
     * Slide anterior
     */
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    /**
     * Iniciar autoplay
     */
    function startAutoPlay() {
        if (autoPlay && !slideInterval) {
            slideInterval = setInterval(nextSlide, slideDuration);
        }
    }
    
    /**
     * Detener autoplay
     */
    function stopAutoPlay() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }
    
    /**
     * Toggle autoplay
     */
    function toggleAutoPlay() {
        autoPlay = !autoPlay;
        if (autoPlay) {
            startAutoPlay();
            showNotification('Autoplay activado', 'info');
        } else {
            stopAutoPlay();
            showNotification('Autoplay desactivado', 'info');
        }
    }
    
    /**
     * Obtener información de la skin actual
     */
    function getCurrentSkinInfo() {
        const $currentSlide = $slides.eq(currentSlide);
        return {
            name: $currentSlide.find('.skin-name').text(),
            rarity: $currentSlide.find('.skin-rarity').text(),
            index: currentSlide
        };
    }
    
    /**
     * Actualizar información del personaje según la skin
     */
    function updateCharacterInfoForSkin(slideIndex) {
        const $currentHero = $('.hero-item.active');
        const heroName = $currentHero.find('.hero-name').text();
        
        // En un proyecto real, aquí cargarías datos específicos de la skin
        console.log(`Mostrando skin ${slideIndex + 1} para ${heroName}`);
        
        // Actualizar estadísticas visuales si es necesario
        updateStatsForSkin(heroName, slideIndex);
    }
    
    /**
     * Actualizar estadísticas para la skin (simulado)
     */
    function updateStatsForSkin(heroName, skinIndex) {
        // Esto sería dinámico en un proyecto real
        const statMultipliers = [1.0, 1.1, 0.9, 1.2]; // Ejemplo de modificadores
        
        // Aplicar efectos visuales a las barras de estadísticas
        $('.stat-fill').each(function(index) {
            const $fill = $(this);
            const currentWidth = parseFloat($fill.css('width'));
            const multiplier = statMultipliers[skinIndex] || 1.0;
            
            // Animación suave
            $fill.animate({
                width: (currentWidth * multiplier) + '%'
            }, 500);
        });
    }
    
    // Configurar event listeners
    $prevBtn.on('click', function(e) {
        e.preventDefault();
        prevSlide();
        playSound('click');
    });
    
    $nextBtn.on('click', function(e) {
        e.preventDefault();
        nextSlide();
        playSound('click');
    });
    
    $dots.on('click', function() {
        const index = $(this).data('slide');
        showSlide(index);
        playSound('click');
    });
    
    // Pausar autoplay al interactuar
    $('.skin-slideshow').on('mouseenter', stopAutoPlay);
    $('.skin-slideshow').on('mouseleave', startAutoPlay);
    
    // Controles de teclado
    $(document).on('keydown', function(e) {
        if (!$('body').hasClass('characters-page')) return;
        
        switch (e.key) {
            case 'ArrowLeft':
                prevSlide();
                e.preventDefault();
                break;
            case 'ArrowRight':
                nextSlide();
                e.preventDefault();
                break;
            case ' ':
                toggleAutoPlay();
                e.preventDefault();
                break;
        }
    });
    
    // Iniciar autoplay
    startAutoPlay();
    
    // Exponer funciones
    window.characterSlideshow = {
        nextSlide,
        prevSlide,
        showSlide,
        startAutoPlay,
        stopAutoPlay,
        toggleAutoPlay,
        getCurrentSkin: getCurrentSkinInfo
    };
}

/**
 * Cargar datos de personajes
 */
function loadCharactersData() {
    console.log('Cargando datos de personajes...');
    
    // Datos de los 4 héroes
    const heroesData = {
        tracer: {
            name: 'Tracer',
            realName: 'Lena Oxton',
            role: 'Daño',
            age: 26,
            origin: 'Londres, Inglaterra',
            birthday: '17 de febrero',
            affiliation: 'Overwatch',
            base: 'Londres, Inglaterra',
            difficulty: 2,
            stats: {
                damage: 8,
                mobility: 10,
                survival: 4,
                utility: 6
            },
            bio: 'Lena Oxton era la piloto de pruebas más joven del programa experimental de teleportación de Overwatch. Durante una misión fallida, su avión se desintegró y ella quedó desfasada en el tiempo, apareciendo y desapareciendo de la realidad. Winston y Mercy lograron estabilizarla con un acelerador cronológico implantado en su pecho. Desde entonces, Tracer se convirtió en el rostro alegre y valiente de Overwatch, luchando por la justicia en todo el mundo.',
            abilities: [
                {
                    name: 'Pistolas de pulso',
                    icon: '🔫',
                    description: 'Disparas dos armas automáticas de corto alcance con gran cadencia.',
                    cooldown: 'N/A',
                    type: 'Primaria'
                },
                {
                    name: 'Traslación',
                    icon: '⚡',
                    description: 'Te teletransportas rápidamente en la dirección en la que te mueves.',
                    cooldown: '3s',
                    type: 'Habilidad'
                },
                {
                    name: 'Regresión temporal',
                    icon: '🕰️',
                    description: 'Regresas a la posición, salud y munición que tenías hace unos segundos.',
                    cooldown: '12s',
                    type: 'Habilidad'
                },
                {
                    name: 'Bomba de pulsos',
                    icon: '💣',
                    description: 'Lanzas una carga explosiva que se adhiere a enemigos o superficies y detona tras unos instantes.',
                    cooldown: 'Ultimate',
                    type: 'Definitiva'
                }
            ],
            skins: [
                { name: 'Clásica', rarity: 'Común', color: '#FF9C00' },
                { name: 'Punk', rarity: 'Legendaria', color: '#9B59B6' },
                { name: 'Neón', rarity: 'Épica', color: '#00A8FF' },
                { name: 'Rastafari', rarity: 'Rara', color: '#4CD964' }
            ]
        },
        genji: {
            name: 'Genji',
            realName: 'Genji Shimada',
            role: 'Daño',
            age: 35,
            origin: 'Japón',
            birthday: 'Desconocido',
            affiliation: 'Overwatch',
            base: 'Japón',
            difficulty: 3,
            stats: {
                damage: 9,
                mobility: 9,
                survival: 5,
                utility: 7
            },
            bio: 'Hijo menor del clan Shimada, fue herido por su hermano Hanzo y reconstruido como cyborg por Overwatch. Encontró paz con Zenyatta. Luchó como agente de alto impacto tras la reunificación.',
            abilities: [
                {
                    name: 'Shurikens',
                    icon: '🌟',
                    description: 'Lanzas tres estrellas ninja.',
                    cooldown: 'N/A',
                    type: 'Primaria'
                },
                {
                    name: 'Desvío',
                    icon: '🛡️',
                    description: 'Rediriges proyectiles.',
                    cooldown: '8s',
                    type: 'Habilidad'
                },
                {
                    name: 'Salto con giro',
                    icon: '🌀',
                    description: 'Desplazamiento rápido.',
                    cooldown: '6s',
                    type: 'Habilidad'
                },
                {
                    name: 'Dragonblade',
                    icon: '🐉',
                    description: 'Espada dragón de gran daño.',
                    cooldown: 'Ultimate',
                    type: 'Definitiva'
                }
            ],
            skins: [
                { name: 'Clásica', rarity: 'Común', color: '#4CD964' },
                { name: 'Oni', rarity: 'Legendaria', color: '#FF3B30' },
                { name: 'Cyborg', rarity: 'Épica', color: '#CCCCCC' },
                { name: 'Carbon', rarity: 'Rara', color: '#333333' }
            ]
        },
        mercy: {
            name: 'Mercy',
            realName: 'Dra. Angela Ziegler',
            role: 'Apoyo',
            age: 37,
            origin: 'Zúrich, Suiza',
            birthday: 'Desconocido',
            affiliation: 'Overwatch',
            base: 'Zúrich, Suiza',
            difficulty: 1,
            stats: {
                damage: 3,
                mobility: 8,
                survival: 5,
                utility: 10
            },
            bio: 'Angela Ziegler es una médica y científica suiza reconocida internacionalmente. Fue directora de investigación en Overwatch, desarrollando tecnologías médicas que salvaron millones de vidas. Como jefa médica, lideró misiones humanitarias por todo el mundo.',
            abilities: [
                {
                    name: 'Caduceus Staff',
                    icon: '➕',
                    description: 'Sanación o aumento de daño continuo a un aliado.',
                    cooldown: 'N/A',
                    type: 'Primaria'
                },
                {
                    name: 'Caduceus Blaster',
                    icon: '🔫',
                    description: 'Arma secundaria para defensa personal.',
                    cooldown: 'N/A',
                    type: 'Secundaria'
                },
                {
                    name: 'Ángel Guardián',
                    icon: '👼',
                    description: 'Te desplazas volando hacia un aliado.',
                    cooldown: '1.5s',
                    type: 'Habilidad'
                },
                {
                    name: 'Resurrección',
                    icon: '❤️',
                    description: 'Devuelves a la vida a un compañero.',
                    cooldown: '30s',
                    type: 'Habilidad'
                }
            ],
            skins: [
                { name: 'Clásica', rarity: 'Común', color: '#FFFFFF' },
                { name: 'Ángel', rarity: 'Legendaria', color: '#FFE600' },
                { name: 'Valkyrie', rarity: 'Épica', color: '#9B59B6' },
                { name: 'Médica', rarity: 'Rara', color: '#4CD964' }
            ]
        },
        winston: {
            name: 'Winston',
            realName: 'Winston',
            role: 'Tanque',
            age: 29,
            origin: 'Colonia Lunar Horizon',
            birthday: 'Desconocido',
            affiliation: 'Overwatch',
            base: 'Numbani',
            difficulty: 2,
            stats: {
                damage: 6,
                mobility: 7,
                survival: 9,
                utility: 8
            },
            bio: 'Winston nació en la Colonia Lunar Horizon, donde los simios fueron modificados genéticamente. Tras escapar, decidió proteger a la humanidad. Reactivó Overwatch con su llamada global.',
            abilities: [
                {
                    name: 'Cañón Tesla',
                    icon: '⚡',
                    description: 'Haz eléctrico que daña a múltiples enemigos.',
                    cooldown: 'N/A',
                    type: 'Primaria'
                },
                {
                    name: 'Paquete de salto',
                    icon: '🚀',
                    description: 'Salto propulsado de gran alcance.',
                    cooldown: '5s',
                    type: 'Habilidad'
                },
                {
                    name: 'Campo de protección',
                    icon: '🛡️',
                    description: 'Escudo esférico.',
                    cooldown: '13s',
                    type: 'Habilidad'
                },
                {
                    name: 'Furia primigenia',
                    icon: '🦍',
                    description: 'Aumenta salud y potencia cuerpo a cuerpo.',
                    cooldown: 'Ultimate',
                    type: 'Definitiva'
                }
            ],
            skins: [
                { name: 'Clásica', rarity: 'Común', color: '#FF9C00' },
                { name: 'Explorador', rarity: 'Legendaria', color: '#007AFF' },
                { name: 'Yeti', rarity: 'Épica', color: '#FFFFFF' },
                { name: 'Safari', rarity: 'Rara', color: '#4CD964' }
            ]
        }
    };
    
    // Guardar datos globalmente
    window.heroesData = heroesData;
    
    // Actualizar interfaz con datos
    updateCharacterDisplay('tracer');
}

/**
 * Configurar interacciones de personajes
 */
function setupCharacterInteractions() {
    console.log('Configurando interacciones de personajes...');
    
    // Selección de personaje
    $('.hero-item').on('click', function() {
        const $item = $(this);
        const heroKey = $item.data('hero');
        
        // Actualizar selección
        $('.hero-item').removeClass('active');
        $item.addClass('active');
        
        // Efecto de sonido
        playSound('click');
        
        // Actualizar display del personaje
        updateCharacterDisplay(heroKey);
        
        // Reiniciar slideshow
        if (window.characterSlideshow) {
            window.characterSlideshow.showSlide(0);
        }
        
        // Mostrar notificación
        const heroName = $item.find('.hero-name').text();
        showNotification(`${heroName} seleccionado`, 'success');
    });
    
    // Botón de selección aleatoria
    $('.random-btn').on('click', function() {
        const heroes = ['tracer', 'genji', 'mercy', 'winston'];
        const randomHero = heroes[Math.floor(Math.random() * heroes.length)];
        
        // Seleccionar aleatoriamente
        $(`.hero-item[data-hero="${randomHero}"]`).click();
        
        // Efecto especial
        $('.random-btn').addClass('spinning');
        setTimeout(() => $('.random-btn').removeClass('spinning'), 1000);
    });
    
    // Botón de selección confirmada
    $('.select-btn').on('click', function() {
        const $selectedHero = $('.hero-item.active');
        const heroName = $selectedHero.find('.hero-name').text();
        
        // Efecto visual
        $(this).addClass('selected');
        setTimeout(() => $(this).removeClass('selected'), 1000);
        
        // Actualizar estado
        $('.status-value').text(heroName);
        
        // Mostrar notificación
        showNotification(`¡${heroName} listo para la batalla!`, 'success');
        
        // Efecto de sonido especial
        playSound('success');
        
        // Guardar selección
        localStorage.setItem('selected-hero', heroName);
    });
}

/**
 * Actualizar display del personaje
 * @param {string} heroKey - Clave del héroe (tracer, genji, etc.)
 */
function updateCharacterDisplay(heroKey) {
    const heroData = window.heroesData[heroKey];
    if (!heroData) return;
    
    console.log(`Actualizando display para ${heroData.name}`);
    
    // Actualizar información básica
    $('#current-hero-name').text(heroData.name);
    $('#current-real-name').text(heroData.realName);
    $('#current-age').text(`${heroData.age} años`);
    $('#current-origin').text(heroData.origin);
    $('#current-bio').text(heroData.bio);
    
    // Actualizar estadísticas
    updateStatsDisplay(heroData.stats);
    
    // Actualizar habilidades
    updateAbilitiesDisplay(heroData.abilities);
    
    // Actualizar skins en el slideshow
    updateSkinsDisplay(heroData.skins, heroKey);
    
    // Actualizar rol
    updateRoleBadge(heroData.role);
    
    // Disparar evento
    $(document).trigger('characterChanged', [heroKey, heroData]);
}

/**
 * Actualizar display de estadísticas
 */
function updateStatsDisplay(stats) {
    const statItems = [
        { id: 'damage', value: stats.damage },
        { id: 'mobility', value: stats.mobility },
        { id: 'survival', value: stats.survival },
        { id: 'utility', value: stats.utility }
    ];
    
    statItems.forEach(stat => {
        const $fill = $(`.stat-item .stat-fill[data-stat="${stat.id}"]`);
        const $value = $(`.stat-item .stat-value[data-stat="${stat.id}"]`);
        
        if ($fill.length) {
            $fill.animate({
                width: `${stat.value * 10}%`
            }, 800);
        }
        
        if ($value.length) {
            $value.text(`${stat.value}/10`);
        }
    });
}

/**
 * Actualizar display de habilidades
 */
function updateAbilitiesDisplay(abilities) {
    const $container = $('.abilities-grid');
    if (!$container.length) return;
    
    $container.empty();
    
    abilities.forEach((ability, index) => {
        const abilityHTML = `
            <div class="ability-card" data-ability="${index}">
                <div class="ability-header">
                    <div class="ability-icon">${ability.icon}</div>
                    <h4 class="ability-name">${ability.name}</h4>
                    <span class="ability-type">${ability.type}</span>
                </div>
                <p class="ability-description">${ability.description}</p>
                <div class="ability-footer">
                    <span class="ability-cooldown">CD: ${ability.cooldown}</span>
                    <button class="ability-test-btn" data-ability="${index}">Probar</button>
                </div>
            </div>
        `;
        
        $container.append(abilityHTML);
    });
    
    // Configurar botones de prueba
    $('.ability-test-btn').on('click', function() {
        const abilityIndex = $(this).data('ability');
        const ability = abilities[abilityIndex];
        
        playSound('click');
        showNotification(`Probando: ${ability.name}`, 'info');
        
        // Efecto visual
        $(this).closest('.ability-card').addClass('testing');
        setTimeout(() => {
            $(this).closest('.ability-card').removeClass('testing');
        }, 1000);
    });
}

/**
 * Actualizar display de skins
 */
function updateSkinsDisplay(skins, heroKey) {
    const $slides = $('.skin-slideshow .slide');
    const $dots = $('.slideshow-dots .dot');
    
    skins.forEach((skin, index) => {
        if ($slides.eq(index).length) {
            $slides.eq(index).find('.skin-name').text(skin.name);
            $slides.eq(index).find('.skin-rarity').text(skin.rarity)
                .removeClass('common rare epic legendary')
                .addClass(skin.rarity.toLowerCase());
            
            // Cambiar color de fondo según la skin
            $slides.eq(index).find('.slide-image').css('background-color', skin.color);
        }
    });
    
    // Actualizar imágenes según el héroe
    updateSkinImages(heroKey);
}

/**
 * Actualizar imágenes de skins (simulado)
 */
function updateSkinImages(heroKey) {
    const $slides = $('.skin-slideshow .slide');
    
    $slides.each(function(index) {
        const $slide = $(this);
        const $image = $slide.find('.slide-image');
        
        // En un proyecto real, cambiarías la imagen de fondo
        $image.css('background-image', `url('images/skins/${heroKey}-skin-${index + 1}.png')`);
        
        // Texto alternativo
        $image.attr('alt', `${heroKey} skin ${index + 1}`);
    });
}

/**
 * Actualizar badge de rol
 */
function updateRoleBadge(role) {
    const $badge = $('.hero-role-badge');
    if (!$badge.length) return;
    
    $badge.text(role).removeClass('damage support tank');
    
    switch (role.toLowerCase()) {
        case 'daño':
            $badge.addClass('damage');
            break;
        case 'apoyo':
            $badge.addClass('support');
            break;
        case 'tanque':
            $badge.addClass('tank');
            break;
    }
}

/**
 * Inicializar sistema de skins
 */
function initSkinsSystem() {
    console.log('Inicializando sistema de skins...');
    
    // Botón de compra skin (simulado)
    $('.skin-slideshow').on('click', '.slide', function() {
        const $slide = $(this);
        const skinName = $slide.find('.skin-name').text();
        const skinRarity = $slide.find('.skin-rarity').text();
        
        // Mostrar modal de compra (simulado)
        showSkinPurchaseModal(skinName, skinRarity);
    });
    
    // Sistema de favoritos
    $('.skin-slideshow').on('dblclick', '.slide', function() {
        const $slide = $(this);
        const skinName = $slide.find('.skin-name').text();
        
        // Toggle favorito
        $slide.toggleClass('favorite');
        
        if ($slide.hasClass('favorite')) {
            showNotification(`"${skinName}" añadida a favoritos`, 'success');
            playSound('success');
        } else {
            showNotification(`"${skinName}" eliminada de favoritos`, 'info');
        }
    });
}

/**
 * Mostrar modal de compra de skin (simulado)
 */
function showSkinPurchaseModal(skinName, rarity) {
    const prices = {
        'Común': 'Gratis',
        'Rara': '250 créditos',
        'Épica': '750 créditos',
        'Legendaria': '1500 créditos'
    };
    
    const price = prices[rarity] || 'Precio no disponible';
    
    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${skinName}</h3>
                    <button class="modal-close">×</button>
                </div>
                <div class="modal-body">
                    <p class="skin-rarity ${rarity.toLowerCase()}">${rarity}</p>
                    <p class="skin-price">Precio: ${price}</p>
                    <div class="modal-actions">
                        <button class="btn-primary purchase-btn">Comprar</button>
                        <button class="btn-secondary cancel-btn">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('body').append(modalHTML);
    
    // Configurar eventos del modal
    $('.modal-close, .cancel-btn').on('click', function() {
        $('.modal-overlay').remove();
        playSound('click');
    });
    
    $('.purchase-btn').on('click', function() {
        // Simular compra
        showNotification(`¡${skinName} adquirida!`, 'success');
        playSound('success');
        $('.modal-overlay').remove();
        
        // Efecto visual
        $('body').addClass('purchase-effect');
        setTimeout(() => $('body').removeClass('purchase-effect'), 1000);
    });
}

// Exportar funciones
window.initCharactersSlideshow = initCharactersSlideshow;
window.updateCharacterDisplay = updateCharacterDisplay;