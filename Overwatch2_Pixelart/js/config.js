// config-interactive.js - Configuración interactiva con sliders y controles
$(document).ready(function() {
    console.log('Inicializando configuración interactiva...');
    
    // Inicializar sistema de configuración
    initConfigSystem();
    
    // Cargar configuración guardada
    loadSavedConfig();
    
    // Configurar interactividad de sliders
    setupSliders();
    
    // Configurar botones y controles
    setupConfigControls();
    
    // Inicializar vista previa en tiempo real
    initRealtimePreview();
    
    // Configurar validación de rendimiento
    setupPerformanceValidation();
});

/**
 * Inicializar sistema de configuración
 */
function initConfigSystem() {
    console.log('Configurando sistema de configuración...');
    
    // Variables de configuración actual
    window.currentConfig = {
        graphics: {
            resolution: '1920x1080',
            quality: 4, // 1-5
            fps: 144,
            particles: 75,
            shadows: true,
            textures: 'high',
            antialiasing: true,
            reflections: true
        },
        audio: {
            master: 80,
            sfx: 90,
            music: 70,
            voice: 100,
            surround: true,
            reverb: false,
            hrtf: true
        },
        controls: {
            sensitivity: 15.0,
            pollingRate: 1000,
            keybindings: {
                forward: 'W',
                backward: 'S',
                left: 'A',
                right: 'D',
                jump: 'SPACE',
                ability1: 'Q',
                ability2: 'E',
                ultimate: 'R'
            },
            invertY: false,
            rawInput: true
        },
        gameplay: {
            crosshair: 'default',
            killfeed: true,
            subtitles: true,
            chat: true,
            autoswitch: true
        },
        interface: {
            hudScale: 100,
            chatScale: 100,
            killfeedScale: 100,
            showFPS: true,
            showPing: true,
            showNetwork: false
        }
    };
    
    // Categorías de configuración
    window.configCategories = ['graphics', 'audio', 'controls', 'gameplay', 'interface'];
    
    // Estado del sistema
    window.configState = {
        hasChanges: false,
        isApplying: false,
        lastSaved: null,
        performanceWarnings: []
    };
}

/**
 * Cargar configuración guardada
 */
function loadSavedConfig() {
    console.log('Cargando configuración guardada...');
    
    try {
        const savedConfig = localStorage.getItem('overwatch-config');
        if (savedConfig) {
            const parsed = JSON.parse(savedConfig);
            
            // Merge con configuración por defecto
            window.currentConfig = deepMerge(window.currentConfig, parsed);
            window.configState.lastSaved = new Date();
            
            showNotification('Configuración cargada correctamente', 'success');
            updateAllDisplays();
        }
    } catch (error) {
        console.error('Error cargando configuración:', error);
        showNotification('Error cargando configuración guardada', 'error');
    }
}

/**
 * Configurar sliders interactivos
 */
function setupSliders() {
    console.log('Configurando sliders...');
    
    // Slider de calidad gráfica
    $('#quality-slider').on('input change', function() {
        const value = parseInt($(this).val());
        const qualityLevels = ['Muy Baja', 'Baja', 'Media', 'Alta', 'Ultra'];
        
        window.currentConfig.graphics.quality = value;
        $('#quality-value').text(qualityLevels[value - 1]);
        $('#preview-quality').text(qualityLevels[value - 1]);
        
        markAsChanged();
        checkPerformance();
        updateGraphicsPreview();
    }).val(window.currentConfig.graphics.quality).trigger('input');
    
    // Slider de partículas
    $('#particles-slider').on('input change', function() {
        const value = parseInt($(this).val());
        
        window.currentConfig.graphics.particles = value;
        $('#particles-value').text(value + '%');
        
        markAsChanged();
        checkPerformance();
        updateGraphicsPreview();
    }).val(window.currentConfig.graphics.particles).trigger('input');
    
    // Slider de volumen general
    $('#master-volume-slider').on('input change', function() {
        const value = parseInt($(this).val());
        
        window.currentConfig.audio.master = value;
        $('#master-volume-value').text(value + '%');
        $('#audio-preview-master').text(value + '%');
        
        markAsChanged();
        updateAudioPreview();
    }).val(window.currentConfig.audio.master).trigger('input');
    
    // Slider de efectos de sonido
    $('#sfx-volume-slider').on('input change', function() {
        const value = parseInt($(this).val());
        
        window.currentConfig.audio.sfx = value;
        $('#sfx-volume-value').text(value + '%');
        $('#audio-preview-sfx').text(value + '%');
        
        markAsChanged();
        updateAudioPreview();
    }).val(window.currentConfig.audio.sfx).trigger('input');
    
    // Slider de música
    $('#music-volume-slider').on('input change', function() {
        const value = parseInt($(this).val());
        
        window.currentConfig.audio.music = value;
        $('#music-volume-value').text(value + '%');
        $('#audio-preview-music').text(value + '%');
        
        markAsChanged();
        updateAudioPreview();
    }).val(window.currentConfig.audio.music).trigger('input');
    
    // Slider de sensibilidad
    $('#sensitivity-slider').on('input change', function() {
        const value = parseFloat($(this).val()).toFixed(2);
        
        window.currentConfig.controls.sensitivity = parseFloat(value);
        $('#sensitivity-value').text(value);
        $('#summary-sensitivity').text(value);
        
        markAsChanged();
    }).val(window.currentConfig.controls.sensitivity).trigger('input');
    
    // Sliders adicionales
    setupAdditionalSliders();
}

/**
 * Configurar sliders adicionales
 */
function setupAdditionalSliders() {
    // Slider de escala HUD
    if ($('#hud-scale-slider').length) {
        $('#hud-scale-slider').on('input change', function() {
            const value = parseInt($(this).val());
            window.currentConfig.interface.hudScale = value;
            $('#hud-scale-value').text(value + '%');
            markAsChanged();
        }).val(window.currentConfig.interface.hudScale || 100).trigger('input');
    }
    
    // Slider de escala chat
    if ($('#chat-scale-slider').length) {
        $('#chat-scale-slider').on('input change', function() {
            const value = parseInt($(this).val());
            window.currentConfig.interface.chatScale = value;
            $('#chat-scale-value').text(value + '%');
            markAsChanged();
        }).val(window.currentConfig.interface.chatScale || 100).trigger('input');
    }
}

/**
 * Configurar botones y controles
 */
function setupConfigControls() {
    console.log('Configurando controles de configuración...');
    
    // Botones de resolución
    $('.resolution-option').on('click', function() {
        const resolution = $(this).data('resolution');
        
        $('.resolution-option').removeClass('active');
        $(this).addClass('active');
        
        window.currentConfig.graphics.resolution = resolution;
        $('#resolution-value').text(resolution);
        $('#preview-resolution').text(resolution);
        $('#summary-resolution').text(resolution);
        
        markAsChanged();
        checkPerformance();
        updateGraphicsPreview();
        
        playSound('click');
    });
    
    // Botones de FPS
    $('.fps-option').on('click', function() {
        const fps = parseInt($(this).data('fps'));
        
        $('.fps-option').removeClass('active');
        $(this).addClass('active');
        
        window.currentConfig.graphics.fps = fps;
        $('#fps-value').text(fps);
        $('#preview-fps').text(fps + ' FPS');
        $('#summary-fps').text(fps + ' FPS');
        
        markAsChanged();
        checkPerformance();
        updateGraphicsPreview();
        
        playSound('click');
    });
    
    // Toggle de sombras
    $('#shadows-toggle').on('change', function() {
        const enabled = $(this).is(':checked');
        
        window.currentConfig.graphics.shadows = enabled;
        $('#shadows-value').text(enabled ? 'Activado' : 'Desactivado');
        
        markAsChanged();
        checkPerformance();
        updateGraphicsPreview();
        
        playSound('click');
    }).prop('checked', window.currentConfig.graphics.shadows);
    
    // Toggle de efectos avanzados de audio
    $('#surround-toggle, #reverb-toggle, #hrtf-toggle').on('change', function() {
        const id = $(this).attr('id').replace('-toggle', '');
        const enabled = $(this).is(':checked');
        
        window.currentConfig.audio[id] = enabled;
        markAsChanged();
        updateAudioPreview();
        
        playSound('click');
    });
    
    // Botones de prueba de audio
    $('.test-btn').on('click', function() {
        const testType = $(this).attr('id').replace('test-', '').replace('-volume', '');
        testAudio(testType);
        playSound('click');
    });
    
    // Botones de tasa de refresco
    $('.polling-option').on('click', function() {
        const rate = parseInt($(this).data('rate'));
        
        $('.polling-option').removeClass('active');
        $(this).addClass('active');
        
        window.currentConfig.controls.pollingRate = rate;
        $('#polling-rate-value').text(rate + ' Hz');
        
        markAsChanged();
        playSound('click');
    });
    
    // Asignación de teclas
    $('.key-button').on('click', function() {
        const $button = $(this);
        const action = $button.data('action');
        
        if ($button.hasClass('rebinding')) return;
        
        $button.addClass('rebinding').text('Pulsa una tecla...');
        
        // Capturar siguiente tecla presionada
        const keyHandler = function(e) {
            e.preventDefault();
            
            let keyName;
            if (e.key === ' ') {
                keyName = 'ESPACIO';
            } else if (e.key.length === 1) {
                keyName = e.key.toUpperCase();
            } else {
                // Para teclas especiales
                const specialKeys = {
                    'Escape': 'ESC',
                    'Tab': 'TAB',
                    'CapsLock': 'CAPS',
                    'Shift': 'SHIFT',
                    'Control': 'CTRL',
                    'Alt': 'ALT',
                    'Meta': 'META',
                    'ArrowUp': '↑',
                    'ArrowDown': '↓',
                    'ArrowLeft': '←',
                    'ArrowRight': '→'
                };
                keyName = specialKeys[e.key] || e.key.toUpperCase();
            }
            
            // Actualizar configuración
            window.currentConfig.controls.keybindings[action] = keyName;
            $button.removeClass('rebinding').text(keyName);
            
            markAsChanged();
            playSound('click');
            
            // Remover event listeners
            $(document).off('keydown', keyHandler);
            $(document).off('click', clickHandler);
        };
        
        // También permitir clic fuera para cancelar
        const clickHandler = function(e) {
            if (!$button.is(e.target)) {
                $button.removeClass('rebinding').text(window.currentConfig.controls.keybindings[action]);
                $(document).off('keydown', keyHandler);
                $(document).off('click', clickHandler);
            }
        };
        
        $(document).on('keydown', keyHandler);
        setTimeout(() => $(document).on('click', clickHandler), 100);
    });
    
    // Botón de reinicio de controles
    $('#reset-controls').on('click', function() {
        if (confirm('¿Restaurar controles a la configuración predeterminada?')) {
            resetControlsToDefault();
            playSound('click');
        }
    });
    
    // Botones de acción
    $('.apply-btn').on('click', applyChanges);
    $('.cancel-btn').on('click', cancelChanges);
    $('.save-btn').on('click', saveProfile);
}

/**
 * Inicializar vista previa en tiempo real
 */
function initRealtimePreview() {
    console.log('Inicializando vista previa...');
    
    // Actualizar vista previa gráfica
    updateGraphicsPreview();
    
    // Actualizar vista previa de audio
    updateAudioPreview();
    
    // Actualizar resumen
    updateSummary();
    
    // Configurar animación de vista previa
    setupPreviewAnimation();
}

/**
 * Actualizar vista previa gráfica
 */
function updateGraphicsPreview() {
    const $preview = $('#graphics-preview');
    if (!$preview.length) return;
    
    const config = window.currentConfig.graphics;
    
    // Aplicar efectos visuales según configuración
    let effects = [];
    
    if (config.quality >= 4) effects.push('high-quality');
    if (config.shadows) effects.push('shadows');
    if (config.particles >= 50) effects.push('particles');
    
    $preview.removeClass().addClass('preview-image ' + effects.join(' '));
    
    // Actualizar información de vista previa
    $('#preview-resolution').text(config.resolution);
    $('#preview-quality').text(getQualityName(config.quality));
    $('#preview-fps').text(config.fps + ' FPS');
}

/**
 * Actualizar vista previa de audio
 */
function updateAudioPreview() {
    const $visualizer = $('#audio-visualizer .visualizer-bars');
    if (!$visualizer.length) return;
    
    const config = window.currentConfig.audio;
    
    // Actualizar barras del visualizador
    $visualizer.find('.bar').each(function(index) {
        const $bar = $(this);
        const baseHeight = [60, 80, 40, 90, 30, 70, 50, 85][index] || 50;
        const masterMultiplier = config.master / 100;
        const randomized = baseHeight * masterMultiplier * (0.8 + Math.random() * 0.4);
        
        $bar.css('height', Math.min(100, randomized) + '%');
    });
    
    // Actualizar información de audio
    $('#audio-preview-master').text(config.master + '%');
    $('#audio-preview-sfx').text(config.sfx + '%');
    $('#audio-preview-music').text(config.music + '%');
}

/**
 * Configurar animación de vista previa
 */
function setupPreviewAnimation() {
    // Animación de partículas en vista previa gráfica
    setInterval(() => {
        if (window.currentConfig.graphics.particles > 0) {
            createParticleEffect();
        }
    }, 1000);
    
    // Animación del visualizador de audio
    setInterval(updateAudioPreview, 200);
}

/**
 * Crear efecto de partículas (simulado)
 */
function createParticleEffect() {
    const $preview = $('#graphics-preview');
    if (!$preview.length) return;
    
    const particleCount = Math.floor(window.currentConfig.graphics.particles / 20);
    
    for (let i = 0; i < particleCount; i++) {
        const $particle = $('<div class="particle"></div>');
        $preview.append($particle);
        
        const size = 2 + Math.random() * 4;
        const x = Math.random() * 100;
        const duration = 1 + Math.random() * 2;
        
        $particle.css({
            width: size + 'px',
            height: size + 'px',
            left: x + '%',
            background: `rgba(255, ${156 + Math.random() * 100}, 0, ${0.3 + Math.random() * 0.7})`,
            animation: `particleFloat ${duration}s linear forwards`
        });
        
        setTimeout(() => $particle.remove(), duration * 1000);
    }
}

/**
 * Probar audio
 * @param {string} type - Tipo de audio a probar
 */
function testAudio(type) {
    console.log(`Probando audio: ${type}`);
    
    // En un proyecto real, aquí reproducirías un sonido
    // Por ahora, mostramos una notificación y efecto visual
    
    let message, icon;
    switch (type) {
        case 'master':
            message = 'Probando volumen general';
            icon = '🔊';
            break;
        case 'sfx':
            message = 'Probando efectos de sonido';
            icon = '🎮';
            break;
        case 'music':
            message = 'Probando música';
            icon = '🎵';
            break;
        case 'voice':
            message = 'Probando voz';
            icon = '🎤';
            break;
        default:
            message = 'Probando audio';
            icon = '🔊';
    }
    
    showNotification(`${icon} ${message}`, 'info');
    
    // Efecto visual en el visualizador
    const $visualizer = $('#audio-visualizer');
    $visualizer.addClass('testing');
    
    setTimeout(() => {
        $visualizer.removeClass('testing');
    }, 1000);
}

/**
 * Restaurar controles a valores predeterminados
 */
function resetControlsToDefault() {
    const defaultKeybindings = {
        forward: 'W',
        backward: 'S',
        left: 'A',
        right: 'D',
        jump: 'ESPACIO',
        ability1: 'Q',
        ability2: 'E',
        ultimate: 'R'
    };
    
    window.currentConfig.controls.keybindings = { ...defaultKeybindings };
    
    // Actualizar botones en la interfaz
    Object.entries(defaultKeybindings).forEach(([action, key]) => {
        $(`.key-button[data-action="${action}"]`).text(key);
    });
    
    // Restaurar otros valores
    window.currentConfig.controls.sensitivity = 15.0;
    window.currentConfig.controls.pollingRate = 1000;
    
    // Actualizar sliders
    $('#sensitivity-slider').val(15.0).trigger('input');
    $('.polling-option').removeClass('active')
        .filter('[data-rate="1000"]').addClass('active');
    
    showNotification('Controles restaurados a valores predeterminados', 'success');
    markAsChanged();
}

/**
 * Aplicar cambios
 */
function applyChanges() {
    if (window.configState.isApplying) return;
    
    window.configState.isApplying = true;
    
    console.log('Aplicando cambios de configuración...');
    
    // Validar rendimiento antes de aplicar
    if (!validatePerformance()) {
        window.configState.isApplying = false;
        return;
    }
    
    // Simular aplicación de cambios
    showNotification('Aplicando configuración...', 'info');
    
    // Efecto visual
    $('.apply-btn').addClass('applying').prop('disabled', true);
    
    setTimeout(() => {
        // Aquí iría la lógica real de aplicación
        window.configState.hasChanges = false;
        window.configState.lastApplied = new Date();
        
        // Actualizar resumen
        updateSummary();
        
        // Notificación de éxito
        showNotification('✅ Configuración aplicada correctamente', 'success');
        
        // Restaurar botón
        $('.apply-btn').removeClass('applying').prop('disabled', false);
        
        window.configState.isApplying = false;
        
        // Guardar automáticamente
        saveConfig();
        
        playSound('success');
    }, 1500);
}

/**
 * Cancelar cambios
 */
function cancelChanges() {
    if (!window.configState.hasChanges) return;
    
    if (confirm('¿Descartar todos los cambios no guardados?')) {
        // Recargar configuración guardada
        loadSavedConfig();
        
        // Resetear estado
        window.configState.hasChanges = false;
        
        showNotification('Cambios descartados', 'info');
        playSound('click');
    }
}

/**
 * Guardar perfil
 */
function saveProfile() {
    const profileName = prompt('Nombre del perfil de configuración:', 
        `Perfil_${new Date().toLocaleDateString().replace(/\//g, '-')}`);
    
    if (!profileName) return;
    
    try {
        // Obtener perfiles existentes
        let profiles = JSON.parse(localStorage.getItem('overwatch-profiles') || '[]');
        
        // Crear nuevo perfil
        const profile = {
            id: Date.now(),
            name: profileName,
            config: { ...window.currentConfig },
            timestamp: new Date().toISOString(),
            systemInfo: getSystemInfo()
        };
        
        // Añadir a la lista
        profiles.push(profile);
        
        // Guardar
        localStorage.setItem('overwatch-profiles', JSON.stringify(profiles));
        
        showNotification(`Perfil "${profileName}" guardado`, 'success');
        playSound('success');
        
    } catch (error) {
        console.error('Error guardando perfil:', error);
        showNotification('Error guardando perfil', 'error');
    }
}

/**
 * Guardar configuración
 */
function saveConfig() {
    try {
        localStorage.setItem('overwatch-config', JSON.stringify(window.currentConfig));
        window.configState.lastSaved = new Date();
        console.log('Configuración guardada');
    } catch (error) {
        console.error('Error guardando configuración:', error);
        showNotification('Error guardando configuración', 'error');
    }
}

/**
 * Marcar como modificado
 */
function markAsChanged() {
    if (!window.configState.hasChanges) {
        window.configState.hasChanges = true;
        
        // Añadir indicador visual
        $('.config-container').addClass('has-changes');
        
        // Mostrar recordatorio después de 30 segundos
        setTimeout(() => {
            if (window.configState.hasChanges) {
                showNotification('Tienes cambios sin aplicar', 'warning');
            }
        }, 30000);
    }
}

/**
 * Configurar validación de rendimiento
 */
function setupPerformanceValidation() {
    // Verificar rendimiento inicial
    checkPerformance();
    
    // Verificar periódicamente
    setInterval(checkPerformance, 5000);
    
    // Escuchar cambios que afecten al rendimiento
    $(document).on('configChanged', function(e, category) {
        if (['graphics', 'resolution', 'quality', 'fps'].includes(category)) {
            checkPerformance();
        }
    });
}

/**
 * Verificar rendimiento
 */
function checkPerformance() {
    const config = window.currentConfig.graphics;
    const warnings = [];
    
    // Reglas de rendimiento (simuladas)
    if (config.resolution === '3840x2160' && config.quality >= 4) {
        warnings.push('4K + Calidad Ultra puede afectar el rendimiento');
    }
    
    if (config.fps >= 240 && config.resolution !== '1280x720') {
        warnings.push('240 FPS puede requerir reducción de calidad');
    }
    
    if (config.particles >= 90 && config.quality >= 4) {
        warnings.push('Partículas al máximo puede reducir FPS');
    }
    
    // Actualizar advertencias
    window.configState.performanceWarnings = warnings;
    updatePerformanceWarnings();
    
    return warnings.length === 0;
}

/**
 * Validar rendimiento
 */
function validatePerformance() {
    const warnings = window.configState.performanceWarnings;
    
    if (warnings.length > 0) {
        const message = warnings.join('\n') + 
            '\n\n¿Deseas aplicar la configuración de todas formas?';
        
        return confirm(message);
    }
    
    return true;
}

/**
 * Actualizar advertencias de rendimiento
 */
function updatePerformanceWarnings() {
    const $warning = $('#performance-warning');
    const $details = $('#warning-details');
    const warnings = window.configState.performanceWarnings;
    
    if (warnings.length > 0) {
        $warning.addClass('show');
        $details.text(` (${warnings.length} advertencia${warnings.length > 1 ? 's' : ''})`);
        
        // Tooltip con detalles
        $warning.attr('title', warnings.join('\n'));
    } else {
        $warning.removeClass('show');
    }
}

/**
 * Actualizar todos los displays
 */
function updateAllDisplays() {
    // Actualizar todos los valores en la interfaz
    updateResolutionDisplay();
    updateQualityDisplay();
    updateFPSDisplay();
    updateVolumeDisplays();
    updateSensitivityDisplay();
    updateKeybindingsDisplay();
    updateSummary();
}

/**
 * Actualizar display de resolución
 */
function updateResolutionDisplay() {
    const resolution = window.currentConfig.graphics.resolution;
    $(`.resolution-option[data-resolution="${resolution}"]`).addClass('active')
        .siblings().removeClass('active');
    $('#resolution-value, #preview-resolution, #summary-resolution').text(resolution);
}

/**
 * Actualizar display de calidad
 */
function updateQualityDisplay() {
    const quality = window.currentConfig.graphics.quality;
    const qualityLevels = ['Muy Baja', 'Baja', 'Media', 'Alta', 'Ultra'];
    
    $('#quality-slider').val(quality);
    $('#quality-value, #preview-quality, #summary-quality').text(qualityLevels[quality - 1]);
}

/**
 * Actualizar display de FPS
 */
function updateFPSDisplay() {
    const fps = window.currentConfig.graphics.fps;
    $(`.fps-option[data-fps="${fps}"]`).addClass('active')
        .siblings().removeClass('active');
    $('#fps-value, #preview-fps, #summary-fps').text(fps + (fps === 144 ? '' : ' FPS'));
}

/**
 * Actualizar displays de volumen
 */
function updateVolumeDisplays() {
    const audio = window.currentConfig.audio;
    
    $('#master-volume-slider').val(audio.master);
    $('#master-volume-value, #audio-preview-master, #summary-volume').text(audio.master + '%');
    
    $('#sfx-volume-slider').val(audio.sfx);
    $('#sfx-volume-value, #audio-preview-sfx').text(audio.sfx + '%');
    
    $('#music-volume-slider').val(audio.music);
    $('#music-volume-value, #audio-preview-music').text(audio.music + '%');
    
    $('#voice-volume-slider').val(audio.voice);
    $('#voice-volume-value').text(audio.voice + '%');
    
    $('#surround-toggle').prop('checked', audio.surround);
    $('#reverb-toggle').prop('checked', audio.reverb);
    $('#hrtf-toggle').prop('checked', audio.hrtf);
}

/**
 * Actualizar display de sensibilidad
 */
function updateSensitivityDisplay() {
    const sensitivity = window.currentConfig.controls.sensitivity;
    $('#sensitivity-slider').val(sensitivity);
    $('#sensitivity-value, #summary-sensitivity').text(sensitivity.toFixed(2));
}

/**
 * Actualizar display de keybindings
 */
function updateKeybindingsDisplay() {
    const keybindings = window.currentConfig.controls.keybindings;
    Object.entries(keybindings).forEach(([action, key]) => {
        $(`.key-button[data-action="${action}"]`).text(key);
    });
}

/**
 * Actualizar resumen
 */
function updateSummary() {
    const config = window.currentConfig;
    
    $('#summary-resolution').text(config.graphics.resolution);
    $('#summary-quality').text(getQualityName(config.graphics.quality));
    $('#summary-fps').text(config.graphics.fps + ' FPS');
    $('#summary-volume').text(config.audio.master + '%');
    $('#summary-sensitivity').text(config.controls.sensitivity.toFixed(2));
}

/**
 * Funciones de utilidad
 */
function getQualityName(level) {
    const names = ['Muy Baja', 'Baja', 'Media', 'Alta', 'Ultra'];
    return names[level - 1] || 'Desconocida';
}

function getSystemInfo() {
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screen: `${screen.width}x${screen.height}`,
        cores: navigator.hardwareConcurrency || 'desconocido'
    };
}

function deepMerge(target, source) {
    const output = { ...target };
    
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    output[key] = source[key];
                } else {
                    output[key] = deepMerge(target[key], source[key]);
                }
            } else {
                output[key] = source[key];
            }
        });
    }
    
    return output;
}

function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

// Exportar funciones
window.initConfigSystem = initConfigSystem;
window.applyConfigChanges = applyChanges;
window.saveConfigProfile = saveProfile;