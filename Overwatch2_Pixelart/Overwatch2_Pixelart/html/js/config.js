// config-interactive.js
$(document).ready(function() {
    // Variables globales
    let currentCategory = 'graphics';
    let isEditingKeybind = false;
    let currentKeybindElement = null;
    
    // Configuración por defecto
    const defaultConfig = {
        graphics: {
            resolution: '1920x1080',
            quality: 'Alta',
            fps: '144',
            particles: 75,
            shadows: true
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
            keybinds: {
                forward: 'W',
                backward: 'S',
                left: 'A',
                right: 'D',
                jump: 'ESPACIO',
                ability1: 'Q',
                ability2: 'E',
                ultimate: 'R'
            }
        }
    };
    
    // Categorías disponibles
    const categories = ['graphics', 'audio', 'controls', 'gameplay', 'interface'];
    
    // ========== FUNCIONES DE CATEGORÍAS ==========
    function initCategories() {
        $('.category-item').click(function() {
            const category = $(this).data('category');
            switchCategory(category);
        });
    }
    
    function switchCategory(category) {
        // Actualizar categoría activa
        $('.category-item').removeClass('active');
        $(`.category-item[data-category="${category}"]`).addClass('active');
        
        // Mostrar/ocultar categorías
        $('.config-category').removeClass('active');
        $(`#${category}-category`).addClass('active');
        
        currentCategory = category;
        
        // Actualizar resumen
        updateSummary();
    }
    
    // ========== CONFIGURACIÓN GRÁFICA ==========
    function initGraphicsControls() {
        // Resolución
        $('.resolution-option').click(function() {
            $('.resolution-option').removeClass('active');
            $(this).addClass('active');
            
            const resolution = $(this).data('resolution');
            $('#resolution-value').text(resolution);
            $('#preview-resolution').text(resolution);
            
            // Actualizar advertencia de rendimiento
            checkPerformanceWarning();
        });
        
        // Calidad gráfica
        $('#quality-slider').on('input', function() {
            const value = parseInt($(this).val());
            const qualities = ['Muy Baja', 'Baja', 'Media', 'Alta', 'Ultra'];
            const quality = qualities[value - 1];
            
            $('#quality-value').text(quality);
            $('#preview-quality').text(quality);
            
            checkPerformanceWarning();
        });
        
        // FPS
        $('.fps-option').click(function() {
            $('.fps-option').removeClass('active');
            $(this).addClass('active');
            
            const fps = $(this).data('fps');
            $('#fps-value').text(fps);
            $('#preview-fps').text(fps + ' FPS');
        });
        
        // Partículas
        $('#particles-slider').on('input', function() {
            const value = $(this).val();
            $('#particles-value').text(value + '%');
        });
        
        // Sombras
        $('#shadows-toggle').change(function() {
            const isChecked = $(this).is(':checked');
            $('#shadows-value').text(isChecked ? 'Activado' : 'Desactivado');
        });
    }
    
    // ========== CONFIGURACIÓN DE AUDIO ==========
    function initAudioControls() {
        // Volumen maestro
        $('#master-volume-slider').on('input', function() {
            const value = $(this).val();
            $('#master-volume-value').text(value + '%');
            $('#audio-preview-master').text(value + '%');
            
            // Actualizar visualizador de audio
            updateAudioVisualizer();
        });
        
        // Efectos de sonido
        $('#sfx-volume-slider').on('input', function() {
            const value = $(this).val();
            $('#sfx-volume-value').text(value + '%');
            $('#audio-preview-sfx').text(value + '%');
        });
        
        // Música
        $('#music-volume-slider').on('input', function() {
            const value = $(this).val();
            $('#music-volume-value').text(value + '%');
            $('#audio-preview-music').text(value + '%');
        });
        
        // Voz
        $('#voice-volume-slider').on('input', function() {
            const value = $(this).val();
            $('#voice-volume-value').text(value + '%');
        });
        
        // Botones de prueba
        $('#test-master-volume').click(function() {
            playTestSound('master');
        });
        
        $('#test-sfx-volume').click(function() {
            playTestSound('sfx');
        });
        
        $('#test-music-volume').click(function() {
            playTestSound('music');
        });
        
        $('#test-voice-volume').click(function() {
            playTestSound('voice');
        });
        
        // Checkboxes avanzados
        $('#surround-toggle, #reverb-toggle, #hrtf-toggle').change(function() {
            // Actualizar configuración
            // En una implementación real, aquí se aplicaría la configuración
        });
    }
    
    function playTestSound(type) {
        // En una implementación real, aquí se reproduciría un sonido de prueba
        // Por ahora, mostramos un feedback visual
        const btn = $(`#test-${type}-volume`);
        btn.html('🎵 PROBANDO...');
        
        setTimeout(() => {
            btn.html(type === 'master' ? '🔊 PROBAR' : 
                     type === 'sfx' ? '🎮 PROBAR' :
                     type === 'music' ? '🎵 PROBAR' : '🎤 PROBAR');
        }, 1000);
        
        // Animación en el visualizador
        $('.visualizer-bars .bar').css('animation', 'none');
        setTimeout(() => {
            $('.visualizer-bars .bar').css('animation', 'audioBars 1.5s infinite ease-in-out');
        }, 10);
    }
    
    function updateAudioVisualizer() {
        // Ajustar altura de las barras basado en el volumen
        const volume = parseInt($('#master-volume-slider').val()) / 100;
        $('.visualizer-bars .bar').each(function(index) {
            const baseHeight = [60, 80, 40, 90, 30, 70, 50, 85][index];
            const newHeight = baseHeight * volume;
            $(this).css('height', newHeight + '%');
        });
    }
    
    // ========== CONFIGURACIÓN DE CONTROLES ==========
    function initControls() {
        // Sensibilidad
        $('#sensitivity-slider').on('input', function() {
            const value = parseFloat($(this).val()).toFixed(2);
            $('#sensitivity-value').text(value);
        });
        
        // Polling rate
        $('.polling-option').click(function() {
            $('.polling-option').removeClass('active');
            $(this).addClass('active');
            
            const rate = $(this).data('rate');
            $('#polling-rate-value').text(rate + ' Hz');
        });
        
        // Keybindings
        $('.key-button').click(function() {
            if (isEditingKeybind) return;
            
            isEditingKeybind = true;
            currentKeybindElement = $(this);
            
            // Marcar como editando
            $(this).addClass('editing');
            $(this).text('PRESIONA UNA TECLA...');
            
            // Escuchar tecla
            $(document).on('keydown.keybind', handleKeybindInput);
        });
        
        // Reiniciar controles
        $('#reset-controls').click(function() {
            if (confirm('¿Reiniciar todos los controles a valores por defecto?')) {
                resetControlsToDefault();
            }
        });
    }
    
    function handleKeybindInput(e) {
        if (!isEditingKeybind || !currentKeybindElement) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        // Obtener tecla presionada
        let keyName = e.key.toUpperCase();
        
        // Mapear nombres especiales
        const specialKeys = {
            ' ': 'ESPACIO',
            'ESCAPE': 'ESC',
            'CONTROL': 'CTRL',
            'ALT': 'ALT',
            'SHIFT': 'SHIFT',
            'TAB': 'TAB',
            'CAPSLOCK': 'BLOQ MAYÚS',
            'ENTER': 'ENTER',
            'BACKSPACE': 'RETROCESO',
            'ARROWUP': 'FLECHA ARRIBA',
            'ARROWDOWN': 'FLECHA ABAJO',
            'ARROWLEFT': 'FLECHA IZQUIERDA',
            'ARROWRIGHT': 'FLECHA DERECHA'
        };
        
        if (specialKeys[e.key.toUpperCase()]) {
            keyName = specialKeys[e.key.toUpperCase()];
        }
        
        // Actualizar botón
        currentKeybindElement.removeClass('editing');
        currentKeybindElement.text(keyName);
        
        // Limpiar
        $(document).off('keydown.keybind');
        isEditingKeybind = false;
        currentKeybindElement = null;
        
        // Mostrar feedback
        showFeedback('Tecla asignada correctamente', 'success');
    }
    
    function resetControlsToDefault() {
        // Restablecer sensibilidad
        $('#sensitivity-slider').val(defaultConfig.controls.sensitivity);
        $('#sensitivity-value').text(defaultConfig.controls.sensitivity.toFixed(2));
        
        // Restablecer polling rate
        $('.polling-option').removeClass('active');
        $(`.polling-option[data-rate="${defaultConfig.controls.pollingRate}"]`).addClass('active');
        $('#polling-rate-value').text(defaultConfig.controls.pollingRate + ' Hz');
        
        // Restablecer keybinds
        Object.entries(defaultConfig.controls.keybinds).forEach(([action, key]) => {
            $(`.key-button[data-action="${action}"]`).text(key);
        });
        
        showFeedback('Controles restablecidos a valores por defecto', 'success');
    }
    
    // ========== PANEL DE RESUMEN ==========
    function updateSummary() {
        // Actualizar valores del resumen
        $('#summary-resolution').text($('#resolution-value').text());
        $('#summary-quality').text($('#quality-value').text());
        $('#summary-fps').text($('#fps-value').text());
        $('#summary-volume').text($('#master-volume-value').text());
        $('#summary-sensitivity').text($('#sensitivity-value').text());
    }
    
    // ========== ADVERTENCIA DE RENDIMIENTO ==========
    function checkPerformanceWarning() {
        const resolution = $('#resolution-value').text();
        const quality = $('#quality-value').text();
        const fps = parseInt($('#fps-value').text());
        
        let warningText = '';
        let showWarning = false;
        
        // Verificar configuraciones demandantes
        if (resolution === '3840x2160' && quality === 'Ultra' && fps >= 144) {
            warningText = '4K Ultra a 144+ FPS requiere hardware de gama alta.';
            showWarning = true;
        } else if (resolution === '2560x1440' && quality === 'Ultra' && fps >= 240) {
            warningText = '1440p Ultra a 240 FPS puede afectar el rendimiento.';
            showWarning = true;
        } else if (resolution === '3840x2160' && quality === 'Ultra') {
            warningText = '4K Ultra es muy demandante para la mayoría de sistemas.';
            showWarning = true;
        }
        
        // Mostrar/ocultar advertencia
        const warningElement = $('#performance-warning');
        const warningDetails = $('#warning-details');
        
        if (showWarning) {
            warningDetails.text(warningText);
            warningElement.addClass('show');
        } else {
            warningElement.removeClass('show');
        }
    }
    
    // ========== BOTONES DE ACCIÓN ==========
    function initActionButtons() {
        // Aplicar cambios
        $('.apply-btn').click(function() {
            applyChanges();
        });
        
        // Cancelar
        $('.cancel-btn').click(function() {
            if (confirm('¿Cancelar todos los cambios no guardados?')) {
                resetToSavedConfig();
            }
        });
        
        // Guardar perfil
        $('.save-btn').click(function() {
            saveProfile();
        });
    }
    
    function applyChanges() {
        // Recolectar configuración actual
        const config = {
            graphics: {
                resolution: $('#resolution-value').text(),
                quality: $('#quality-value').text(),
                fps: parseInt($('#fps-value').text()),
                particles: parseInt($('#particles-slider').val()),
                shadows: $('#shadows-toggle').is(':checked')
            },
            audio: {
                master: parseInt($('#master-volume-slider').val()),
                sfx: parseInt($('#sfx-volume-slider').val()),
                music: parseInt($('#music-volume-slider').val()),
                voice: parseInt($('#voice-volume-slider').val()),
                surround: $('#surround-toggle').is(':checked'),
                reverb: $('#reverb-toggle').is(':checked'),
                hrtf: $('#hrtf-toggle').is(':checked')
            },
            controls: {
                sensitivity: parseFloat($('#sensitivity-value').text()),
                pollingRate: parseInt($('#polling-rate-value').text().replace(' Hz', '')),
                keybinds: {
                    forward: $('.key-button[data-action="forward"]').text(),
                    backward: $('.key-button[data-action="backward"]').text(),
                    left: $('.key-button[data-action="left"]').text(),
                    right: $('.key-button[data-action="right"]').text(),
                    jump: $('.key-button[data-action="jump"]').text(),
                    ability1: $('.key-button[data-action="ability1"]').text(),
                    ability2: $('.key-button[data-action="ability2"]').text(),
                    ultimate: $('.key-button[data-action="ultimate"]').text()
                }
            }
        };
        
        // En una implementación real, aquí se enviaría la configuración al juego
        console.log('Configuración aplicada:', config);
        
        showFeedback('Configuración aplicada correctamente', 'success');
    }
    
    function resetToSavedConfig() {
        // En una implementación real, aquí se cargaría la configuración guardada
        // Por ahora, restablecemos a valores por defecto
        location.reload();
    }
    
    function saveProfile() {
        const profileName = prompt('Nombre del perfil de configuración:', 'Mi Perfil');
        
        if (profileName) {
            // En una implementación real, aquí se guardaría el perfil
            showFeedback(`Perfil "${profileName}" guardado correctamente`, 'success');
        }
    }
    
    // ========== FUNCIONES AUXILIARES ==========
    function showFeedback(message, type) {
        // Crear elemento de feedback
        const feedback = $('<div class="feedback-message"></div>');
        feedback.text(message);
        feedback.css({
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
            color: 'white',
            padding: '15px 25px',
            borderRadius: '10px',
            zIndex: '10000',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 'bold',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        $('body').append(feedback);
        
        // Mostrar
        setTimeout(() => {
            feedback.css('transform', 'translateX(0)');
        }, 10);
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            feedback.css('transform', 'translateX(100%)');
            setTimeout(() => feedback.remove(), 300);
        }, 3000);
    }
    
    
    function init() {
        initCategories();
        initGraphicsControls();
        initAudioControls();
        initControls();
        initActionButtons();
        updateAudioVisualizer();
        checkPerformanceWarning();
        
        // Inicializar con la primera categoría
        switchCategory('graphics');
        
        // Actualizar resumen periódicamente
        setInterval(updateSummary, 1000);
    }
    
    // Iniciar cuando el DOM esté listo
    init();
});