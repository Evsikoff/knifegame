var loadModules = function (modules, urlPrefix, doneCallback) { // eslint-disable-line no-unused-vars
    var MODULE_LOAD_TIMEOUT = 30000; // 30 секунд таймаут для загрузки модуля

    if (typeof modules === "undefined" || modules.length === 0) {
        // caller may depend on callback behaviour being async
        setTimeout(doneCallback);
    } else {
        let remaining = modules.length;
        const loadedModules = new Set();

        const moduleLoaded = (moduleName) => {
            if (loadedModules.has(moduleName)) {
                return; // Уже обработан (например, по таймауту)
            }
            loadedModules.add(moduleName);
            if (--remaining === 0) {
                doneCallback();
            }
        };

        modules.forEach(function (m) {
            pc.WasmModule.setConfig(m.moduleName, {
                glueUrl: urlPrefix + m.glueUrl,
                wasmUrl: urlPrefix + m.wasmUrl,
                fallbackUrl: urlPrefix + m.fallbackUrl
            });

            // Устанавливаем таймаут для предотвращения бесконечного зависания
            const timeoutId = setTimeout(() => {
                if (!loadedModules.has(m.moduleName)) {
                    console.warn('Module load timeout: ' + m.moduleName + '. Continuing without it.');
                    moduleLoaded(m.moduleName);
                }
            }, MODULE_LOAD_TIMEOUT);

            const onModuleLoaded = () => {
                clearTimeout(timeoutId);
                moduleLoaded(m.moduleName);
            };

            if (!m.hasOwnProperty('preload') || m.preload) {
                if (m.moduleName === 'BASIS') {
                    // preload basis transcoder
                    pc.basisInitialize();
                    onModuleLoaded();
                } else if (m.moduleName === 'DracoDecoderModule') {
                    // preload draco decoder
                    if (pc.dracoInitialize) {
                        // 1.63 onwards
                        pc.dracoInitialize();
                        onModuleLoaded();
                    } else {
                        // 1.62 and earlier
                        pc.WasmModule.getInstance(m.moduleName, () => { onModuleLoaded(); });
                    }
                } else {
                    // load remaining modules in global scope
                    pc.WasmModule.getInstance(m.moduleName, () => { onModuleLoaded(); });
                }
            } else {
                onModuleLoaded();
            }
        });
    }
};

window.loadModules = loadModules;
