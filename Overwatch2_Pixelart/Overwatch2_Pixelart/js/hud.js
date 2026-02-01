// hud-customization.js - Sistema de personalización de HUD
$(document).ready(function() {
    console.log('Inicializando personalización de HUD...');
    
    // Inicializar sistema HUD
    initHUDSystem();
    
    // Cargar configuración HUD guardada
    loadHUDConfig();
    
    // Configurar elementos arrastrables
    setupDraggableElements();
    
    // Configurar controles de personalización
    setupHUDControls();
    
    // Inicializar vista previa interactiva
    initInteractivePreview();
    
    // Configurar sistema de presets
    setupPresetsSystem();
});

/**
 * Inicializar sistema HUD
 */
function initHUDSystem() {
    console.log('Inicializando sistema HUD...');
    
    // Configuración actual del HUD
    window.hudConfig = {
        elements: {
            health: {
                enabled: true,
                position: { x: 20, y: 20 },
                size: { width: 200, height: 80 },
                appearance: {
                    primaryColor: '#FF9C00',
                    secondaryColor: '#FFE600',
                    backgroundColor: '#1A1A1A',
                    opacity: 90,
                    borderWidth: 2,
                    shadow: true
                },
                behavior: {
                    alwaysVisible: true,
                    hideInCombat: false,
                    showOnHover: false,
                    damageAnimation: true,
                    lowHealthAnimation: true,
                    lowHealthSound: true
                }
            },
            ultimate: {
                enabled: true,
                position: { x: 20, y: 120 },
                size: { width: 200, height: 60 },
                appearance: {
                    primaryColor: '#9B59B6',
                    secondaryColor: '#8E44AD',
                    backgroundColor: '#1A1A1A',
                    opacity: 90,
                    borderWidth: 2,
                    shadow: true
                },
                behavior: {
                    alwaysVisible: true,
                    readyAnimation: true,
                    readySound: true
                }
            },
            abilities: {
                enabled: true,
                position: { x: 20, y: 200 },
                size: { width: 180, height: 70 },
                appearance: {
                    primaryColor: '#4CD964',
                    secondaryColor: '#2ECC71',
                    backgroundColor: '#1A1A1A',
                    opacity: 90,
                    borderWidth: 2,
                    shadow: true
                },
                behavior: {
                    alwaysVisible: true,
                    cooldownAnimation: true,
                    readySound: true
                }
            },
            ammo: {
                enabled: true,
                position: { x: 20, y: 290 },
                size: { width: 150, height: 50 },
                appearance: {
                    primaryColor: '#007AFF',
                    secondaryColor: '#5AC8FA',
                    backgroundColor: '#1A1A1A',
                    opacity: 90,
                    borderWidth: 2,
                    shadow: true
                },
                behavior: {
                    alwaysVisible: true,
                    lowAmmoWarning: true,
                    reloadAnimation: true
                }
            },
            minimap: {
                enabled: true,
                position: { x: 250, y: 20 },
                size: { width: 150, height: 150 },
                appearance: {
                    primaryColor: '#FFFFFF',
                    secondaryColor: '#CCCCCC',
                    backgroundColor: '#0A0A0A',
                    opacity: 85,
                    borderWidth: 1,
                    shadow: false
                },
                behavior: {
                    alwaysVisible: true,
                    rotateWithPlayer: false,
                    showObjectives: true
                }
            },
            team: {
                enabled: true,
                position: { x: 250, y: 190 },
                size: { width: 150, height: 120 },
                appearance: {
                    primaryColor: '#3498DB',
                    secondaryColor: '#2980B9',
                    backgroundColor: '#1A1A1A',
                    opacity: 80,
                    borderWidth: 1,
                    shadow: false
                },
                behavior: {
                    alwaysVisible: true,
                    showHealthBars: true,
                    showUltimateStatus: true
                }
            }
        },
        general: {
            hudScale: 100,
            opacity: 90,
            colorScheme: 'default',
            animationSpeed: 'normal',
            showTooltips: true
        },
        presets: {
            current: 'default',
            custom: {}
        }
    };
    
    // Elemento seleccionado actualmente
    window.selectedHUDElement = 'health';
    
    // Estado del sistema
    window.hudState = {
        isDragging: false,
        hasChanges: false,
        previewMode: false,
        testMode: false
    };
}

/**
 * Cargar configuración HUD guardada
 */
function loadHUDConfig() {
    console.log('Cargando configuración HUD...');
    
    try {
        const savedHUD = localStorage.getItem('overwatch-hud-config');
        if (savedHUD) {
            const parsed = JSON.parse(savedHUD);
            window.hudConfig = deepMerge(window.hudConfig, parsed);
            applyHUDConfigToUI();
            showNotification('Configuración HUD cargada', 'success');
        }
    } catch (error) {
        console.error('Error cargando HUD:', error);
        showNotification('Error cargando configuración HUD', 'error');
    }
}

/**
 * Aplicar configuración HUD a la interfaz
 */
function applyHUDConfigToUI() {
    Object.entries(window.hudConfig.elements).forEach(([elementId, config]) => {
        // Actualizar posición
        $(`.hud-element[data-element="${elementId}"]`).css({
            top: config.position.y + 'px',
            left: config.position.x + 'px',
            width: config.size.width + 'px',
            height: config.size.height + 'px'
        });
        
        // Actualizar apariencia
        updateElementAppearance(elementId, config.appearance);
        
        // Actualizar visibilidad
        if (!config.enabled) {
            $(`.hud-element[data-element="${elementId}"]`).addClass('hidden');
        }
    });
    
    // Actualizar controles
    updateHUDControls();
}

/**
 * Actualizar apariencia de elemento
 */
function updateElementAppearance(elementId, appearance) {
    const $element = $(`.hud-element[data-element="${elementId}"]`);
    
    $element.css({
        'background-color': hexToRgba(appearance.backgroundColor, appearance.opacity / 100),
        'border-color': appearance.primaryColor,
        'border-width': appearance.borderWidth + 'px',
        'box-shadow': appearance.shadow ? `0 2px 10px ${hexToRgba(appearance.primaryColor, 0.3)}` : 'none'
    });
    
    // Aplicar colores a elementos internos
    $element.find('.element-name').css('color', appearance.secondaryColor);
    $element.find('.health-fill, .ultimate-fill').css('background', 
        `linear-gradient(90deg, ${appearance.primaryColor}, ${appearance.secondaryColor})`);
}

/**
 * Configurar elementos arrastrables
 */
function setupDraggableElements() {
    console.log('Configurando elementos arrastrables...');
    
    $('.hud-element').each(function() {
        const $element = $(this);
        const elementId = $element.data('element');
        
        // Hacer arrastrable
        $element.on('mousedown touchstart', startDrag);
        
        // Botón de toggle
        $element.find('.element-toggle').on('click', function(e) {
            e.stopPropagation();
            toggleElement(elementId);
        });
    });
    
    let dragOffset = { x: 0, y: 0 };
    let isDragging = false;
    
    function startDrag(e) {
        e.preventDefault();
        
        const $element = $(this);
        const elementId = $element.data('element');
        
        // Seleccionar elemento
        selectElement(elementId);
        
        // Calcular offset
        const rect = $element[0].getBoundingClientRect();
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        
        dragOffset = {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
        
        isDragging = true;
        window.hudState.isDragging = true;
        $element.addClass('dragging');
        
        // Configurar eventos de arrastre
        $(document).on('mousemove touchmove', doDrag);
        $(document).on('mouseup touchend', stopDrag);
    }
    
    function doDrag(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        
        const $element = $(`.hud-element[data-element="${window.selectedHUDElement}"]`);
        const $previewArea = $('#hud-preview-area');
        
        // Obtener posición del mouse/touch
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        
        // Calcular posición relativa al área de preview
        const previewRect = $previewArea[0].getBoundingClientRect();
        let newX = clientX - previewRect.left - dragOffset.x;
        let newY = clientY - previewRect.top - dragOffset.y;
        
        // Limitar al área de preview
        const maxX = $previewArea.width() - $element.width();
        const maxY = $previewArea.height() - $element.height();
        
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        // Actualizar posición
        $element.css({
            left: newX + 'px',
            top: newY + 'px'
        });
        
        // Actualizar controles de posición
        $('#pos-x').val(Math.round(newX));
        $('#pos-y').val(Math.round(newY));
        
        // Actualizar configuración
        window.hudConfig.elements[window.selectedHUDElement].position = {
            x: Math.round(newX),
            y: Math.round(newY)
        };
        
        markHUDAsChanged();
    }
    
    function stopDrag() {
        if (!isDragging) return;
        
        isDragging = false;
        window.hudState.isDragging = false;
        
        $(`.hud-element[data-element="${window.selectedHUDElement}"]`).removeClass('dragging');
        
        $(document).off('mousemove touchmove', doDrag);
        $(document).off('mouseup touchend', stopDrag);
        
        // Guardar posición
        saveHUDConfig();
        
        console.log(`Elemento ${window.selectedHUDElement} movido a posición:`, 
            window.hudConfig.elements[window.selectedHUDElement].position);
    }
}

/**
 * Seleccionar elemento HUD
 */
function selectElement(elementId) {
    window.selectedHUDElement = elementId;
    
    // Actualizar UI
    $('.hud-element').removeClass('selected');
    $(`.hud-element[data-element="${elementId}"]`).addClass('selected');
    
    // Actualizar selector
    $('#element-selector').val(elementId);
    
    // Cargar configuración del elemento en controles
    loadElementConfigToControls(elementId);
    
    playSound('click');
}

/**
 * Cargar configuración de elemento a controles
 */
function loadElementConfigToControls(elementId) {
    const elementConfig = window.hudConfig.elements[elementId];
    if (!elementConfig) return;
    
    // Posición
    $('#pos-x').val(elementConfig.position.x);
    $('#pos-y').val(elementConfig.position.y);
    
    // Tamaño
    $('#width-slider').val(elementConfig.size.width);
    $('#height-slider').val(elementConfig.size.height);
    $('#width-value').text(elementConfig.size.width + 'px');
    $('#height-value').text(elementConfig.size.height + 'px');
    
    // Colores
    $('#primary-color').val(elementConfig.appearance.primaryColor);
    $('#secondary-color').val(elementConfig.appearance.secondaryColor);
    $('#background-color').val(elementConfig.appearance.backgroundColor);
    $('#primary-color-value').text(elementConfig.appearance.primaryColor);
    $('#secondary-color-value').text(elementConfig.appearance.secondaryColor);
    $('#background-color-value').text(elementConfig.appearance.backgroundColor);
    
    // Opacidad
    $('#opacity-slider').val(elementConfig.appearance.opacity);
    $('#opacity-value').text(elementConfig.appearance.opacity + '%');
    
    // Bordes
    $('#border-slider').val(elementConfig.appearance.borderWidth);
    $('#border-value').text(elementConfig.appearance.borderWidth + 'px');
    $('#shadow-toggle').prop('checked', elementConfig.appearance.shadow);
    
    // Comportamiento
    $('#always-visible').prop('checked', elementConfig.behavior.alwaysVisible);
    $('#hide-in-combat').prop('checked', elementConfig.behavior.hideInCombat);
    $('#show-on-hover').prop('checked', elementConfig.behavior.showOnHover);
    $('#damage-animation').prop('checked', elementConfig.behavior.damageAnimation);
    $('#low-health-animation').prop('checked', elementConfig.behavior.lowHealthAnimation);
    $('#low-health-sound').prop('checked', elementConfig.behavior.lowHealthSound);
}

/**
 * Toggle elemento (mostrar/ocultar)
 */
function toggleElement(elementId) {
    const $element = $(`.hud-element[data-element="${elementId}"]`);
    const isHidden = $element.hasClass('hidden');
    
    if (isHidden) {
        $element.removeClass('hidden');
        window.hudConfig.elements[elementId].enabled = true;
        showNotification(`${getElementName(elementId)} activado`, 'success');
    } else {
        $element.addClass('hidden');
        window.hudConfig.elements[elementId].enabled = false;
        showNotification(`${getElementName(elementId)} desactivado`, 'info');
    }
    
    markHUDAsChanged();
    saveHUDConfig();
    playSound('click');
}

/**
 * Configurar controles HUD
 */
function setupHUDControls() {
    console.log('Configurando controles HUD...');
    
    // Selector de elemento
    $('#element-selector').on('change', function() {
        const elementId = $(this).val();
        selectElement(elementId);
    });
    
    // Controles de posición
    $('#pos-x, #pos-y').on('input change', function() {
        const elementId = window.selectedHUDElement;
        const $element = $(`.hud-element[data-element="${elementId}"]`);
        
        const x = parseInt($('#pos-x').val()) || 0;
        const y = parseInt($('#pos-y').val()) || 0;
        
        $element.css({
            left: x + 'px',
            top: y + 'px'
        });
        
        window.hudConfig.elements[elementId].position = { x, y };
        markHUDAsChanged();
    });
    
    // Controles de tamaño
    $('#width-slider, #height-slider').on('input change', function() {
        const elementId = window.selectedHUDElement;
        const $element = $(`.hud-element[data-element="${elementId}"]`);
        
        const width = parseInt($('#width-slider').val()) || 200;
        const height = parseInt($('#height-slider').val()) || 80;
        
        $element.css({
            width: width + 'px',
            height: height + 'px'
        });
        
        $('#width-value').text(width + 'px');
        $('#height-value').text(height + 'px');
        
        window.hudConfig.elements[elementId].size = { width, height };
        markHUDAsChanged();
    });
    
    // Selectores de color
    $('.color-input').on('input change', function() {
        const elementId = window.selectedHUDElement;
        const colorType = $(this).attr('id').replace('-color', '');
        const colorValue = $(this).val();
        
        // Actualizar valor mostrado
        $(`#${colorType}-color-value`).text(colorValue);
        
        // Actualizar configuración
        window.hudConfig.elements[elementId].appearance[`${colorType}Color`] = colorValue;
        
        // Aplicar cambios visuales
        updateElementAppearance(elementId, window.hudConfig.elements[elementId].appearance);
        
        markHUDAsChanged();
    });
    
    // Control de opacidad
    $('#opacity-slider').on('input change', function() {
        const value = parseInt($(this).val());
        const elementId = window.selectedHUDElement;
        
        $('#opacity-value').text(value + '%');
        window.hudConfig.elements[elementId].appearance.opacity = value;
        
        updateElementAppearance(elementId, window.hudConfig.elements[elementId].appearance);
        markHUDAsChanged();
    });
    
    // Control de borde
    $('#border-slider').on('input change', function() {
        const value = parseInt($(this).val());
        const elementId = window.selectedHUDElement;
        
        $('#border-value').text(value + 'px');
        window.hudConfig.elements[elementId].appearance.borderWidth = value;
        
        updateElementAppearance(elementId, window.hudConfig.elements[elementId].appearance);
        markHUDAsChanged();
    });
    
    // Toggle de sombra
    $('#shadow-toggle').on('change', function() {
        const enabled = $(this).is(':checked');
        const elementId = window.selectedHUDElement;
        
        window.hudConfig.elements[elementId].appearance.shadow = enabled;
        updateElementAppearance(elementId, window.hudConfig.elements[elementId].appearance);
        markHUDAsChanged();
    });
    
    // Controles de comportamiento
    $('input[type="checkbox"]').not('.color-input').on('change', function() {
        const elementId = window.selectedHUDElement;
        const controlId = $(this).attr('id');
        const value = $(this).is(':checked');
        
        // Mapear control a propiedad de configuración
        const controlMap = {
            'always-visible': 'alwaysVisible',
            'hide-in-combat': 'hideInCombat',
            'show-on-hover': 'showOnHover',
            'damage-animation': 'damageAnimation',
            'low-health-animation': 'lowHealthAnimation',
            'low-health-sound': 'lowHealthSound',
            'hover-opacity': 'hoverOpacity',
            'ability-ready-sound': 'abilityReadySound',
            'ultimate-ready-sound': 'ultimateReadySound'
        };
        
        const property = controlMap[controlId];
        if (property && window.hudConfig.elements[elementId].behavior.hasOwnProperty(property)) {
            window.hudConfig.elements[elementId].behavior[property] = value;
            markHUDAsChanged();
        }
    });
    
    // Pestañas
    $('.element-tab').on('click', function() {
        const tabId = $(this).data('tab');
        
        $('.element-tab').removeClass('active');
        $(this).addClass('active');
        
        $('.tab-content').removeClass('active');
        $(`#${tabId}-tab`).addClass('active');
        
        playSound('click');
    });
    
    // Botones de acción
    $('#reset-hud-position').on('click', resetHUDPositions);
    $('#toggle-hud-elements').on('click', toggleAllHUDElements);
    $('#test-hud').on('click', testHUDMode);
    $('#save-hud').on('click', saveHUDConfig);
    $('#apply-hud').on('click', applyHUDChanges);
    $('#cancel-hud').on('click', cancelHUDChanges);
    
    // Botones rápidos
    $('#toggle-all-hud').on('click', toggleAllHUDElements);
    $('#reset-hud-appearance').on('click', resetHUDAppearance);
    $('#export-hud').on('click', exportHUDConfig);
    $('#import-hud').on('click', importHUDConfig);
    
    // Presets de posición
    $('.preset-btn').on('click', function() {
        const preset = $(this).data('preset');
        applyPreset(preset);
    });
}

/**
 * Inicializar vista previa interactiva
 */
function initInteractivePreview() {
    console.log('Inicializando vista previa interactiva...');
    
    // Simular cambios dinámicos en elementos HUD
    simulateHUDChanges();
    
    // Configurar eventos de prueba
    setupTestEvents();
}

/**
 * Simular cambios dinámicos en HUD
 */
function simulateHUDChanges() {
    // Cambiar valores de salud dinámicamente
    setInterval(() => {
        if (window.hudState.testMode) {
            const $health = $('.health-fill');
            const currentWidth = parseInt($health.css('width')) || 85;
            const newWidth = Math.max(10, Math.min(100, currentWidth + (Math.random() * 20 - 10)));
            
            $health.animate({ width: newWidth + '%' }, 500);
            $('.health-text').text(`${Math.round(newWidth * 10)}/1000`);
            
            // Efecto de daño si baja mucho
            if (newWidth < 30) {
                $('.health-bar').addClass('low-health');
                setTimeout(() => $('.health-bar').removeClass('low-health'), 1000);
            }
        }
    }, 3000);
    
    // Cambiar carga de definitiva
    setInterval(() => {
        if (window.hudState.testMode) {
            const $ultimate = $('.ultimate-fill');
            const currentWidth = parseInt($ultimate.css('width')) || 60;
            const newWidth = currentWidth >= 100 ? 0 : currentWidth + 10;
            
            $ultimate.animate({ width: newWidth + '%' }, 500);
            $('.ultimate-text').text(newWidth + '%');
            
            // Efecto cuando está cargada
            if (newWidth >= 100) {
                $('.ultimate-bar').addClass('ready');
                setTimeout(() => $('.ultimate-bar').removeClass('ready'), 1000);
            }
        }
    }, 2000);
    
    // Simular cooldowns de habilidades
    setInterval(() => {
        if (window.hudState.testMode) {
            $('.ability-cooldown').each(function() {
                const $cooldown = $(this);
                const text = $cooldown.text();
                
                if (text === 'Listo') {
                    $cooldown.text('3s').removeClass('active');
                    setTimeout(() => {
                        $cooldown.text('Listo').addClass('active');
                    }, 3000);
                }
            });
        }
    }, 5000);
}

/**
 * Configurar eventos de prueba
 */
function setupTestEvents() {
    // Click en elementos HUD para probar interacciones
    $('.hud-element').on('click', function(e) {
        if (window.hudState.testMode && !window.hudState.isDragging) {
            const elementId = $(this).data('element');
            testElementInteraction(elementId);
            e.stopPropagation();
        }
    });
    
    // Doble click para activar/desactivar modo prueba
    $('#hud-preview-area').on('dblclick', function() {
        toggleTestMode();
    });
}

/**
 * Probar interacción con elemento
 */
function testElementInteraction(elementId) {
    const $element = $(`.hud-element[data-element="${elementId}"]`);
    
    switch (elementId) {
        case 'health':
            // Simular daño
            $element.addClass('damage-taken');
            setTimeout(() => $element.removeClass('damage-taken'), 500);
            playSound('damage');
            break;
            
        case 'ultimate':
            // Simular uso de definitiva
            $element.addClass('ultimate-used');
            $('.ultimate-fill').css('width', '0%');
            $('.ultimate-text').text('0%');
            setTimeout(() => $element.removeClass('ultimate-used'), 1000);
            playSound('ultimate');
            break;
            
        case 'abilities':
            // Simular uso de habilidad
            const randomAbility = Math.floor(Math.random() * 3) + 1;
            $(`.ability-slot[data-ability="${randomAbility}"]`).addClass('ability-used');
            setTimeout(() => $(`.ability-slot[data-ability="${randomAbility}"]`).removeClass('ability-used'), 1000);
            playSound('ability');
            break;
            
        case 'ammo':
            // Simular disparo y recarga
            const $ammoCurrent = $('.ammo-current');
            let current = parseInt($ammoCurrent.text()) || 24;
            
            if (current > 0) {
                current--;
                $ammoCurrent.text(current);
                
                if (current === 0) {
                    $element.addClass('reloading');
                    setTimeout(() => {
                        $ammoCurrent.text('24');
                        $element.removeClass('reloading');
                    }, 2000);
                    playSound('reload');
                } else {
                    playSound('shoot');
                }
            }
            break;
    }
}

/**
 * Configurar sistema de presets
 */
function setupPresetsSystem() {
    console.log('Configurando sistema de presets...');
    
    // Presets predefinidos
    window.hudPresets = {
        default: {
            name: 'Por Defecto',
            description: 'Configuración estándar recomendada',
            config: {
                health: { position: { x: 20, y: 20 }, size: { width: 200, height: 80 } },
                ultimate: { position: { x: 20, y: 120 }, size: { width: 200, height: 60 } },
                abilities: { position: { x: 20, y: 200 }, size: { width: 180, height: 70 } },
                ammo: { position: { x: 20, y: 290 }, size: { width: 150, height: 50 } },
                minimap: { position: { x: 250, y: 20 }, size: { width: 150, height: 150 } },
                team: { position: { x: 250, y: 190 }, size: { width: 150, height: 120 } }
            }
        },
        minimal: {
            name: 'Mínimo',
            description: 'Interfaz limpia para máxima visibilidad',
            config: {
                health: { position: { x: 10, y: 10 }, size: { width: 150, height: 60 } },
                ultimate: { position: { x: 170, y: 10 }, size: { width: 150, height: 40 } },
                abilities: { position: { x: 10, y: 80 }, size: { width: 120, height: 50 } },
                ammo: { position: { x: 140, y: 80 }, size: { width: 100, height: 40 } },
                minimap: { position: { x: 250, y: 10 }, size: { width: 120, height: 120 } },
                team: { enabled: false }
            }
        },
        pro: {
            name: 'Competitivo',
            description: 'Optimizado para jugadores profesionales',
            config: {
                health: { position: { x: 10, y: 10 }, size: { width: 180, height: 70 } },
                ultimate: { position: { x: 200, y: 10 }, size: { width: 180, height: 50 } },
                abilities: { position: { x: 10, y: 90 }, size: { width: 150, height: 60 } },
                ammo: { position: { x: 170, y: 90 }, size: { width: 120, height: 45 } },
                minimap: { position: { x: 300, y: 10 }, size: { width: 130, height: 130 } },
                team: { position: { x: 300, y: 150 }, size: { width: 130, height: 100 } }
            }
        }
    };
    
    // Cargar presets personalizados guardados
    loadCustomPresets();
}

/**
 * Aplicar preset
 */
function applyPreset(presetName) {
    const preset = window.hudPresets[presetName];
    if (!preset) {
        showNotification(`Preset "${presetName}" no encontrado`, 'error');
        return;
    }
    
    // Actualizar botones de preset
    $('.preset-btn').removeClass('active');
    $(`.preset-btn[data-preset="${presetName}"]`).addClass('active');
    
    // Aplicar configuración del preset
    Object.entries(preset.config).forEach(([elementId, elementConfig]) => {
        if (window.hudConfig.elements[elementId]) {
            // Fusionar configuración
            window.hudConfig.elements[elementId] = {
                ...window.hudConfig.elements[elementId],
                ...elementConfig
            };
            
            // Actualizar posición y tamaño en UI
            const $element = $(`.hud-element[data-element="${elementId}"]`);
            $element.css({
                left: elementConfig.position.x + 'px',
                top: elementConfig.position.y + 'px',
                width: elementConfig.size.width + 'px',
                height: elementConfig.size.height + 'px'
            });
            
            // Actualizar visibilidad
            if (elementConfig.enabled !== undefined) {
                if (elementConfig.enabled) {
                    $element.removeClass('hidden');
                } else {
                    $element.addClass('hidden');
                }
            }
        }
    });
    
    // Actualizar controles
    if (window.selectedHUDElement) {
        loadElementConfigToControls(window.selectedHUDElement);
    }
    
    window.hudConfig.presets.current = presetName;
    markHUDAsChanged();
    
    showNotification(`Preset "${preset.name}" aplicado`, 'success');
    playSound('success');
}

/**
 * Restaurar posiciones del HUD
 */
function resetHUDPositions() {
    if (confirm('¿Restaurar todas las posiciones del HUD a los valores por defecto?')) {
        applyPreset('default');
        playSound('click');
    }
}

/**
 * Restaurar apariencia del HUD
 */
function resetHUDAppearance() {
    if (confirm('¿Restaurar toda la apariencia del HUD a los valores por defecto?')) {
        Object.keys(window.hudConfig.elements).forEach(elementId => {
            // Restaurar valores por defecto de apariencia
            const defaultAppearance = {
                health: { primaryColor: '#FF9C00', secondaryColor: '#FFE600', backgroundColor: '#1A1A1A', opacity: 90 },
                ultimate: { primaryColor: '#9B59B6', secondaryColor: '#8E44AD', backgroundColor: '#1A1A1A', opacity: 90 },
                abilities: { primaryColor: '#4CD964', secondaryColor: '#2ECC71', backgroundColor: '#1A1A1A', opacity: 90 },
                ammo: { primaryColor: '#007AFF', secondaryColor: '#5AC8FA', backgroundColor: '#1A1A1A', opacity: 90 },
                minimap: { primaryColor: '#FFFFFF', secondaryColor: '#CCCCCC', backgroundColor: '#0A0A0A', opacity: 85 },
                team: { primaryColor: '#3498DB', secondaryColor: '#2980B9', backgroundColor: '#1A1A1A', opacity: 80 }
            };
            
            if (defaultAppearance[elementId]) {
                window.hudConfig.elements[elementId].appearance = {
                    ...window.hudConfig.elements[elementId].appearance,
                    ...defaultAppearance[elementId],
                    borderWidth: 2,
                    shadow: true
                };
                
                updateElementAppearance(elementId, window.hudConfig.elements[elementId].appearance);
            }
        });
        
        // Actualizar controles
        if (window.selectedHUDElement) {
            loadElementConfigToControls(window.selectedHUDElement);
        }
        
        markHUDAsChanged();
        showNotification('Apariencia del HUD restaurada', 'success');
        playSound('success');
    }
}

/**
 * Mostrar/ocultar todos los elementos HUD
 */
function toggleAllHUDElements() {
    const allVisible = $('.hud-element.hidden').length === 0;
    
    if (allVisible) {
        // Ocultar todos
        $('.hud-element').addClass('hidden');
        Object.keys(window.hudConfig.elements).forEach(id => {
            window.hudConfig.elements[id].enabled = false;
        });
        showNotification('Todos los elementos del HUD ocultos', 'info');
    } else {
        // Mostrar todos
        $('.hud-element').removeClass('hidden');
        Object.keys(window.hudConfig.elements).forEach(id => {
            window.hudConfig.elements[id].enabled = true;
        });
        showNotification('Todos los elementos del HUD mostrados', 'success');
    }
    
    markHUDAsChanged();
    saveHUDConfig();
    playSound('click');
}

/**
 * Activar/desactivar modo prueba
 */
function toggleTestMode() {
    window.hudState.testMode = !window.hudState.testMode;
    
    const $previewArea = $('#hud-preview-area');
    
    if (window.hudState.testMode) {
        $previewArea.addClass('test-mode');
        showNotification('Modo prueba activado - Haz clic en los elementos para probarlos', 'info');
        
        // Simular juego
        startTestSimulation();
    } else {
        $previewArea.removeClass('test-mode');
        showNotification('Modo prueba desactivado', 'info');
        
        // Detener simulación
        stopTestSimulation();
    }
}

/**
 * Iniciar simulación de prueba
 */
function startTestSimulation() {
    // Ya se maneja en simulateHUDChanges()
}

/**
 * Detener simulación de prueba
 */
function stopTestSimulation() {
    // Restaurar valores por defecto
    $('.health-fill').css('width', '85%');
    $('.health-text').text('850/1000');
    $('.ultimate-fill').css('width', '60%');
    $('.ultimate-text').text('60%');
    $('.ammo-current').text('24');
    $('.ability-cooldown').text('Listo').addClass('active');
}

/**
 * Aplicar cambios del HUD
 */
function applyHUDChanges() {
    saveHUDConfig();
    showNotification('Cambios del HUD aplicados y guardados', 'success');
    window.hudState.hasChanges = false;
    $('.hud-status .status-value').text('Configuración aplicada');
    playSound('success');
}

/**
 * Cancelar cambios del HUD
 */
function cancelHUDChanges() {
    if (window.hudState.hasChanges) {
        if (confirm('¿Descartar todos los cambios no guardados en el HUD?')) {
            loadHUDConfig();
            window.hudState.hasChanges = false;
            $('.hud-status .status-value').text('Cambios descartados');
            showNotification('Cambios del HUD descartados', 'info');
            playSound('click');
        }
    }
}

/**
 * Guardar configuración HUD
 */
function saveHUDConfig() {
    try {
        localStorage.setItem('overwatch-hud-config', JSON.stringify(window.hudConfig));
        
        // Actualizar estado
        window.hudState.hasChanges = false;
        $('.hud-container').removeClass('has-changes');
        $('.hud-status .status-value').text('Configuración guardada');
        
        console.log('Configuración HUD guardada');
    } catch (error) {
        console.error('Error guardando HUD:', error);
        showNotification('Error guardando configuración HUD', 'error');
    }
}

/**
 * Exportar configuración HUD
 */
function exportHUDConfig() {
    const configStr = JSON.stringify(window.hudConfig, null, 2);
    const blob = new Blob([configStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `overwatch-hud-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
    
    showNotification('Configuración HUD exportada', 'success');
    playSound('success');
}

/**
 * Importar configuración HUD
 */
function importHUDConfig() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedConfig = JSON.parse(e.target.result);
                window.hudConfig = deepMerge(window.hudConfig, importedConfig);
                applyHUDConfigToUI();
                saveHUDConfig();
                showNotification('Configuración HUD importada correctamente', 'success');
                playSound('success');
            } catch (error) {
                console.error('Error importando HUD:', error);
                showNotification('Error importando configuración HUD', 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

/**
 * Marcar HUD como modificado
 */
function markHUDAsChanged() {
    if (!window.hudState.hasChanges) {
        window.hudState.hasChanges = true;
        $('.hud-container').addClass('has-changes');
        $('.hud-status .status-value').text('Cambios pendientes');
    }
}

/**
 * Actualizar controles HUD
 */
function updateHUDControls() {
    // Actualizar según el estado actual
    if (window.hudState.hasChanges) {
        $('.hud-container').addClass('has-changes');
    }
}

/**
 * Cargar presets personalizados
 */
function loadCustomPresets() {
    try {
        const customPresets = localStorage.getItem('overwatch-hud-presets');
        if (customPresets) {
            const parsed = JSON.parse(customPresets);
            window.hudPresets.custom = parsed;
            window.hudConfig.presets.custom = parsed;
        }
    } catch (error) {
        console.error('Error cargando presets personalizados:', error);
    }
}

/**
 * Funciones de utilidad
 */
function getElementName(elementId) {
    const names = {
        health: 'Barra de Salud',
        ultimate: 'Barra de Definitiva',
        abilities: 'Habilidades',
        ammo: 'Munición',
        minimap: 'Minimapa',
        team: 'Información de Equipo'
    };
    return names[elementId] || elementId;
}

function hexToRgba(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Exportar funciones
window.initHUDCustomization = initHUDSystem;
window.applyHUDPreset = applyPreset;
window.toggleHUDTestMode = toggleTestMode;