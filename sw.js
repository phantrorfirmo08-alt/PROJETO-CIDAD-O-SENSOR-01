// ==========================================
// MÓDULO DE RADAR RAINVIEWER (OTIMIZADO PARA REACT)
// ==========================================

// Substitua ou utilize estas funções dentro do seu componente principal ou gerencie via refs:
const initRadarModule = (mapInstance, setRadarSliderMax, setRadarSliderValue, setRadarTimeLabel, setZoomWarningVisible) => {
    let radarLayers = [];
    let mapFrames = [];
    let currentFrameIndex = 0;
    let playInterval = null;
    let isPlaying = false;
    let radarHost = "https://tilecache.rainviewer.com";

    const carregarCamadaRadar = () => {
        if (!mapInstance) {
            console.error("Instância do mapa Leaflet não encontrada.");
            return;
        }

        fetch('https://api.rainviewer.com/public/weather-maps.json')
            .then(response => response.json())
            .then(data => {
                if (!data || !data.radar || !data.radar.past) {
                    console.error("Estrutura de dados do RainViewer inválida.");
                    return;
                }

                mapFrames = data.radar.past;
                radarHost = data.host || "https://tilecache.rainviewer.com";

                setRadarSliderMax(mapFrames.length - 1);
                setRadarSliderValue(mapFrames.length - 1);

                prepararCamadasRadar();
                showFrame(mapFrames.length - 1);

                mapInstance.off('zoomend', verificarZoomRadar);
                mapInstance.on('zoomend', verificarZoomRadar);
                verificarZoomRadar();
            })
            .catch(err => {
                console.error("Falha ao sincronizar com API do RainViewer:", err);
                setRadarTimeLabel("Erro no Radar");
            });
    };

    const prepararCamadasRadar = () => {
        radarLayers.forEach(layer => {
            if (mapInstance.hasLayer(layer)) mapInstance.removeLayer(layer);
        });
        radarLayers = [];

        mapFrames.forEach((frame) => {
            const tileUrl = `${radarHost}${frame.path}/512/{z}/{x}/{y}/2/1_1.png`;
            const layer = L.tileLayer(tileUrl, {
                tileSize: 512,
                zoomOffset: -1,
                opacity: 0.70,
                attribution: 'Radar &copy; <a href="https://rainviewer.com" target="_blank">RainViewer</a>',
                zIndex: 100
            });
            radarLayers.push(layer);
        });
    };

    const showFrame = (index) => {
        if (mapFrames.length === 0 || index < 0 || index >= mapFrames.length) return;

        currentFrameIndex = parseInt(index);
        setRadarSliderValue(currentFrameIndex);

        radarLayers.forEach(layer => {
            if (mapInstance.hasLayer(layer)) {
                mapInstance.removeLayer(layer);
            }
        });

        const currentZoom = mapInstance.getZoom();
        if (currentZoom >= 4 && currentZoom <= 7) {
            const activeLayer = radarLayers[currentFrameIndex];
            if (activeLayer && !mapInstance.hasLayer(activeLayer)) {
                activeLayer.addTo(mapInstance);
            }
        }

        const frameTime = new Date(mapFrames[currentFrameIndex].time * 1000);
        const timeString = frameTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setRadarTimeLabel(`${timeString} (${currentFrameIndex + 1}/${mapFrames.length})`);
    };

    const verificarZoomRadar = () => {
        const zoom = mapInstance.getZoom();
        
        if (zoom < 4 || zoom > 7) {
            setZoomWarningVisible(true);
            radarLayers.forEach(layer => {
                if (mapInstance.hasLayer(layer)) mapInstance.removeLayer(layer);
            });
        } else {
            setZoomWarningVisible(false);
            if (radarLayers[currentFrameIndex] && !mapInstance.hasLayer(radarLayers[currentFrameIndex])) {
                radarLayers[currentFrameIndex].addTo(mapInstance);
            }
        }
    };

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
                currentFrameIndex = (currentFrameIndex + 1) % mapFrames.length;
                showFrame(currentFrameIndex);
            }, 550);
        }
    };

    const onSliderChange = (value) => {
        pauseRadarAnimation();
        showFrame(value);
    };

    // Retorna os métodos encapsulados para controle externo
    return {
        carregarCamadaRadar,
        onSliderChange,
        toggleRadarAnimation,
        pauseRadarAnimation
    };
};
