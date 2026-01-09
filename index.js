<script>
    const socket = io('https://class-7ly0.onrender.com'); 
    const METERED_SECRET_KEY = "CLHPQWNtmuZOG-pwUF0rhLVNWCYVp5hlsWJgni0Dd0KucLFE";
    const METERED_DOMAIN = "60483901.metered.live";
    
    // कड़वा सच: रूम का नाम हमेशा छोटे अक्षरों (lowercase) में रखें
    let currentRoom = "publicroom" + Math.floor(Math.random() * 10); 
    let userName = "User-" + Math.floor(Math.random() * 1000);

    socket.emit('join-room', currentRoom);

    // ... sendMessage और receive-message वही रहेगा ...

    async function startPrivateVideo() {
        document.getElementById('video-overlay').style.display = 'block';
        const meetDiv = document.getElementById('meet');
        meetDiv.innerHTML = "<h2 style='text-align:center; margin-top:50px;'>कनेक्ट हो रहा है...</h2>";

        try {
            // १. रूम बनाने के लिए API कॉल में खाली बॉडी भेजें
            await fetch(`https://${METERED_DOMAIN}/api/v1/room/${currentRoom}?secretKey=${METERED_SECRET_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}) // यह भेजना ज़रूरी है
            });

            // २. Iframe URL में परमिशन और ऑटो-जॉइन जोड़ें
            // 'skipToggel' और 'join' जोड़ने से परमिशन पॉप-अप तुरंत आएगा
            const videoUrl = `https://${METERED_DOMAIN}/${currentRoom}?skipPrejoin=true`;

            meetDiv.innerHTML = `
                <iframe 
                    src="${videoUrl}" 
                    allow="camera *; microphone *; display-capture *; fullscreen" 
                    style="width: 100%; height: 100%; border: none;">
                </iframe>`;
        } catch (e) {
            console.error(e);
            alert("सर्वर रिस्पॉन्स नहीं दे रहा।");
            closeVideo();
        }
    }

    // बाकी फंक्शन्स वही रहेंगे...
</script>
