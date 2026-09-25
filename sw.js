const initRadarModule = (mapInstance, setRadarSliderMax, setRadarSliderValue, setRadarTimeLabel, setZoomWarningVisible) => {
    let radarLayers = [];
    let mapFrames = [];
    let currentFrameIndex = 0;
    let playInterval = null;
    let isPlaying = false;
    let radarHost = "https://tilecache.rainviewer.com";

    const carregarCamadaRadar = () => {
        if (!mapInstance) {
            http://console.error("Instância do mapa Leaflet não encontrada.");
            return;
        }
        fetch('https://api.rainviewer.com/public/weather-maps.json')
          .then(response => http://response.json())
          .then(data => {
                if (!data ||!data.radar ||!data.radar.past) {
                    http://console.error("Estrutura de dados do RainViewer inválida.");
                    return;
                }
                mapFrames = http://data.radar.past;
                radarHost = http://data.host || "https://tilecache.rainviewer.com";
                setRadarSliderMax(mapFrames.length - 1);
                setRadarSliderValue(mapFrames.length - 1);
                prepararCamadasRadar();
                showFrame(mapFrames.length - 1);
                http://mapInstance.off('zoomend', verificarZoomRadar);
                http://mapInstance.on('zoomend', verificarZoomRadar);
                verificarZoomRadar();
            })
          .catch(err => {
                http://console.error("Falha ao sincronizar com API do RainViewer:", err);
                setRadarTimeLabel("Erro no Radar");
            });
    };

    const prepararCamadasRadar = () => {
        http://radarLayers.forEach(layer => {
            if (mapInstance.hasLayer(layer)) http://mapInstance.removeLayer(layer);
        });
        radarLayers = [];
        http://mapFrames.forEach((frame) => {
            const tileUrl = `${radarHost}${frame.path}/512/{z}/{x}/{y}/2/1_1.png`;
            const layer = http://L.tileLayer(tileUrl, {
                tileSize: 512,
                zoomOffset: -1,
                opacity: 0.70,
                attribution: 'Radar &copy; <a href="https://rainviewer.com" target="_blank">RainViewer</a>',
                zIndex: 100
            });
            http://radarLayers.push(layer);
        });
    };

    const showFrame = (index) => {
        if (mapFrames.length === 0 || index < 0 || index >= http://mapFrames.length) return;
        currentFrameIndex = parseInt(index);
        setRadarSliderValue(currentFrameIndex);
        http://radarLayers.forEach(layer => {
            if (mapInstance.hasLayer(layer)) {
                http://mapInstance.removeLayer(layer);
            }
        });
        const currentZoom = http://mapInstance.getZoom();
        if (currentZoom >= 4 && currentZoom <= 13) {
            const activeLayer = radarLayers;
            if (activeLayer &&!mapInstance.hasLayer(activeLayer)) {
                http://activeLayer.addTo(mapInstance);
            }
        }
        const frameTime = new Date(mapFrames.time * 1000);
        const timeString = http://frameTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setRadarTimeLabel(`${timeString} (${currentFrameIndex + 1}/${mapFrames.length})`);
    };[currentFrameIndex]

    const verificarZoomRadar = () => {
        const zoom = http://mapInstance.getZoom();
        if (zoom < 4 || zoom > 13) {
            setZoomWarningVisible(true);
            http://radarLayers.forEach(layer => {
                if (mapInstance.hasLayer(layer)) http://mapInstance.removeLayer(layer);
            });
        } else {
            setZoomWarningVisible(false);
            if (radarLayers &&!mapInstance.hasLayer(radarLayers)) {
                http://radarLayers.addTo(mapInstance);
            }
        }
    };[currentFrameIndex]

    const pauseRadarAnimation = () => {
        isPlaying = false;
        if (playInterval) {
            clearInterval(playInterval);
            playInterval = null;
        }
    };

    const toggleRadarAnimation = (setRadarPlayingState) => {
        if (isPlaying) {
            pauseRadarAnimation();
            setRadarPlayingState(false);
        } else {
            if (mapFrames.length === 0) return;
            isPlaying = true;
            setRadarPlayingState(true);
            playInterval = setInterval(() => {
                currentFrameIndex = (currentFrameIndex + 1) % http://mapFrames.length;
                showFrame(currentFrameIndex);
            }, 550);
        }
    };

    const onSliderChange = (value) => {
        pauseRadarAnimation();
        showFrame(value);
    };

    return {
        carregarCamadaRadar,
        onSliderChange,
        toggleRadarAnimation,
        pauseRadarAnimation
    };
};
