pc.script.createLoadingScreen(function (app) {
    function dg_createHTMLElements() {
        
        // Базовый путь к директории с изображениями
        // Убедитесь, что эта папка доступна относительно index.html
        const imagePath = 'files/assets/images/loading/';

        // Create and style the preloader container
        const preloaderContainer = document.createElement('div');
        preloaderContainer.id = 'preloaderContainer';
        preloaderContainer.style.position = 'fixed';
        preloaderContainer.style.top = '0';
        preloaderContainer.style.left = '0';
        preloaderContainer.style.width = '100%';
        preloaderContainer.style.height = '100%';
        preloaderContainer.style.overflow = 'hidden';
        preloaderContainer.style.display = 'flex';
        preloaderContainer.style.flexDirection = 'column';
        preloaderContainer.style.justifyContent = 'center';
        preloaderContainer.style.alignItems = 'center';
        preloaderContainer.style.backgroundColor = '#000';

        // 1. Saturated Image (Background)
        const saturatedImage = new Image();
        saturatedImage.src = imagePath + 'saturatedImage.jpg'; // Загрузка из файла
        saturatedImage.style.position = 'absolute';
        saturatedImage.style.top = '0';
        saturatedImage.style.left = '0';
        saturatedImage.style.width = '100%';
        saturatedImage.style.height = '100%';
        saturatedImage.style.objectFit = 'cover';
        saturatedImage.style.zIndex = '1';

        // 2. Normal Image (Overlay bar)
        const normalImage = new Image();
        normalImage.id = 'img_loadingbaroverlay';
        normalImage.src = imagePath + 'normalImage.jpg'; // Загрузка из файла
        normalImage.style.position = 'absolute';
        normalImage.style.top = '50%';
        normalImage.style.left = '50%';
        normalImage.style.height = '100%';
        normalImage.style.width = 'auto';
        normalImage.style.transform = 'translate(-50%, -50%)';
        normalImage.style.objectFit = 'cover';
        normalImage.style.zIndex = '2';
        normalImage.style.clipPath = 'inset(0 100% 0 0)';

        // 3. Logo Image
        const logoImage = new Image();
        logoImage.src = imagePath + 'logoImage.png'; // Загрузка из файла
        logoImage.style.position = 'absolute';
        logoImage.style.zIndex = '3';
        logoImage.onload = () => {
            const logoHeight = window.innerHeight * 0.25;
            logoImage.style.height = `${logoHeight}px`;
            logoImage.style.width = 'auto';
            logoImage.style.top = '40%';
            logoImage.style.left = '50%';
            logoImage.style.transform = 'translate(-50%, -50%)';
        };

        // Create container for rotating images
        const rotatingImagesContainer = document.createElement('div');
        rotatingImagesContainer.id = 'rotatingImagesContainer';
        rotatingImagesContainer.style.position = 'absolute';
        rotatingImagesContainer.style.top = '80%';
        rotatingImagesContainer.style.left = '50%';
        rotatingImagesContainer.style.transform = 'translate(-50%, -50%)';
        rotatingImagesContainer.style.height = `${window.innerHeight * 0.038}px`;
        rotatingImagesContainer.style.display = 'flex';
        rotatingImagesContainer.style.alignItems = 'center';
        rotatingImagesContainer.style.justifyContent = 'center';
        rotatingImagesContainer.style.zIndex = '3';

        // 4. Rotating Images
        const img1 = new Image();
        const img2 = new Image();
        const img3 = new Image();
        
        // Загрузка изображений из файлов
        img1.src = imagePath + 'img1.png';
        img2.src = imagePath + 'img2.png';
        img3.src = imagePath + 'img3.png';

        [img1, img2, img3].forEach(img => {
            img.style.height = '100%';
            img.style.width = 'auto';
            img.style.position = 'absolute';
            img.style.transition = 'opacity 1s';
            img.style.opacity = '0';
        });
        img1.style.opacity = '1';

        rotatingImagesContainer.appendChild(img1);
        rotatingImagesContainer.appendChild(img2);
        rotatingImagesContainer.appendChild(img3);

        // Append all elements to the preloader container
        preloaderContainer.appendChild(saturatedImage);
        preloaderContainer.appendChild(normalImage);
        preloaderContainer.appendChild(logoImage);
        preloaderContainer.appendChild(rotatingImagesContainer);
        document.body.appendChild(preloaderContainer);

        let currentImageIndex = 0;
        const images = [img1, img2, img3];
        setInterval(() => {
            images[currentImageIndex].style.opacity = '0';
            currentImageIndex = (currentImageIndex + 1) % images.length;
            images[currentImageIndex].style.opacity = '1';
        }, 3500);
    }

    let currentWidth = 0;
    let targetWidth = 0;
    let interval;

    function dj_loading(value) {
        targetWidth = Math.min(1, Math.max(0, value)) * 100;
    }

    function animate(deltaTime) {
        const bar = document.getElementById('img_loadingbaroverlay');
        if (bar) {
            currentWidth += (targetWidth - currentWidth) * deltaTime * 1;
            bar.style.clipPath = `inset(0 ${100 - currentWidth}% 0 0)`;
        }
    }

    function startAnimation() {
        const fps = 60;
        const intervalTime = 1000 / fps;
        let lastTime = Date.now();

        interval = setInterval(() => {
            const deltaTime = 1 / 60;
            animate(deltaTime);
        }, intervalTime);
    }

    function stopAnimation() {
        clearInterval(interval);
    }

    function isPortrait() {
        return window.innerHeight > window.innerWidth;
    }

    // Изменение высоты контейнера с вращающимися изображениями в зависимости от ориентации экрана
    function setRotatingImagesContainerHeight() {
        const rotatingImagesContainer = document.getElementById('rotatingImagesContainer');
        
        if (rotatingImagesContainer) {
            if (isPortrait()) {
                rotatingImagesContainer.style.height = `${window.innerHeight * 0.025}px`; // Высота 2.5% экрана в портретном режиме
            } else {
                rotatingImagesContainer.style.height = `${window.innerHeight * 0.038}px`; // Высота 3.8% экрана в альбомном режиме
            }
        }
    }

    function dg_hide_loading_pls() {
        const preloaderContainer = document.getElementById('preloaderContainer');
        if (preloaderContainer) {
            preloaderContainer.style.opacity = '0';
            setTimeout(() => {
                stopAnimation();
                if (preloaderContainer.parentNode) {
                    document.body.removeChild(preloaderContainer);
                }
            }, 1000);
        }
    }

    dg_createHTMLElements();

    // Вызов функции для установки начальной высоты
    setRotatingImagesContainerHeight();

    // Вы можете добавить событие resize для обновления высоты контейнера при изменении ориентации устройства
    window.addEventListener('resize', setRotatingImagesContainerHeight);

    const setProgress = function (value) {
        dj_loading(value);
    };

    app.on('preload:end', function () {
        app.off('preload:progress');
    });
    app.on('preload:progress', setProgress);
    app.on('start', dg_hide_loading_pls);

    startAnimation();
});
