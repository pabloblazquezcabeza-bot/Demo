// Obtener acceso al micrófono
navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        // Crear un contexto de audio
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();

        // Conectar el micrófono al analizador
        source.connect(analyser);
        analyser.connect(audioContext.destination); // Agregar esta línea

        // Configurar el analizador
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // Función para obtener el nivel de ruido
        function getNoiseLevel() {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
            }
            const average = sum / bufferLength;
            return average;
        }

        // Ejemplo de uso
        setInterval(() => {
            const noiseLevel = getNoiseLevel();
            console.log(`Nivel de ruido: ${noiseLevel}`);
            if (noiseLevel > 50) { // Ajusta este valor según tus necesidades
                console.log('Ruido detectado!');
            }
        }, 100);
    })
    .catch(error => {
        console.error('Error al acceder al micrófono:', error);
    });