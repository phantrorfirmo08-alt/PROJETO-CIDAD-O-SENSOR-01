// ==========================================
// MÓDULO DE RADAR RAINVIEWER & CAMADAS TÁTICAS
// SARAH IA Core v5.2 PRO - Defesa Civil Comunitária
// ==========================================

const initRadarModule = (mapInstance, setRadarSliderMax, setRadarSliderValue, setRadarTimeLabel, setZoomWarningVisible) => {
    let radarLayers = [];
    let mapFrames = [];
    let currentFrameIndex = 0;
    let playInterval = null;
    let isPlaying = false;
    let radarHost = "https://tilecache.rainviewer.com";
    let baseLayersControl = null;

    const carregarCamadaRadar = () => {
        if (!mapInstance) {
            console.error("Instância do mapa Leaflet não encontrada.");
            return;
        }

        // Configuração de limites de zoom seguros para Mesquita / Serra do Mendanha
        mapInstance.setMinZoom(10);
        mapInstance.setMaxZoom(19);

        // Adiciona as Camadas Base (Modo Tático Escuro e Satélite)
        configurarCamadasBase(mapInstance);

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

    const configurarCamadasBase = (map) => {
        // Remove controle de camadas anterior se existir para evitar duplicação
        if (baseLayersControl) {
            map.removeControl(baseLayersControl);
        }

        const camadaTaticaEscura = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            maxNativeZoom: 18,
            attribution: '&copy; CartoDB'
        });

        const camadaSatelite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 19,
            maxNativeZoom: 18,
            attribution: 'Tiles &copy; Esri'
        });

        // Adiciona a camada padrão inicial (Tático Escuro)
        camadaTaticaEscura.addTo(map);

        const baseMaps = {
            "Modo Tático Escuro": camadaTaticaEscura,
            "Satélite (Esri World Imagery)": camadaSatelite
        };

        // Insere o seletor de camadas no canto superior direito do mapa
        baseLayersControl = L.control.layers(baseMaps, null, { position: 'topright' }).addTo(map);
    };

    const prepararCamadasRadar = () => {
        radarLayers.forEach(layer => {
            if (mapInstance.hasLayer(layer)) mapInstance.removeLayer(layer);
        });
        radarLayers = [];

        mapFrames.forEach((frame) => {
            const tileUrl = `${radarHost}${frame.path}/256/{z}/{x}/{y}/2/1_1.png`;
            const layer = L.tileLayer(tileUrl, {
                tileSize: 256,
                opacity: 0.80,
                maxZoom: 19,
                maxNativeZoom: 18,
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
        if (currentZoom >= 10) {
            const activeLayer = radarLayers[currentFrameIndex];
            if (activeLayer && !mapInstance.hasLayer(activeLayer)) {
                activeLayer.addTo(mapInstance);
            }
        }

        const frameTime = new Date(mapFrames[currentFrameIndex].time * 1000);
        const timeString = frameTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const suffix = currentFrameIndex === mapFrames.length - 1 ? " [AGORA]" : " [HISTÓRICO]";
        setRadarTimeLabel(`${timeString}${suffix} (${currentFrameIndex + 1}/${mapFrames.length})`);
    };

    const verificarZoomRadar = () => {
        const zoom = mapInstance.getZoom();
        
        if (zoom < 11) {
            setZoomWarningVisible(true);
        } else {
            setZoomWarningVisible(false);
        }

        if (radarLayers[currentFrameIndex] && !mapInstance.hasLayer(radarLayers[currentFrameIndex])) {
            radarLayers[currentFrameIndex].addTo(mapInstance);
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
            }, 700);
        }
    };

    const onSliderChange = (value) => {
        pauseRadarAnimation();
        showFrame(value);
    };

    // Inicializa carregamento e camadas
    carregarCamadaRadar();

    // Retorna os métodos de controle encapsulados
    return {
        carregarCamadaRadar,
        onSliderChange,
        toggleRadarAnimation,
        pauseRadarAnimation
    };
};
