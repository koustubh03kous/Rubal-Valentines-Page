
document.addEventListener('DOMContentLoaded', () => {
    const timelineEvents = document.querySelectorAll('.timeline-event');
    const loveWords = document.querySelectorAll('.love-word');
    const closePopups = document.querySelectorAll('.close-popup');
    const adventureCards = document.querySelectorAll('.adventure-card');

    // --- Scroll Visibility Logic (Fixed) ---
    function isElementInViewport(el, buffer = 0.15) {
        const rect = el.getBoundingClientRect();
        const viewportHeight = (window.innerHeight || document.documentElement.clientHeight);
        
        return (
            rect.top <= (viewportHeight - viewportHeight * buffer) &&
            rect.bottom >= (viewportHeight * buffer)
        );
    }

    function checkTimelineVisibility() {
        timelineEvents.forEach(event => {
            if (isElementInViewport(event)) {
                event.classList.add('visible');
            }
            // IMPORTANT: Removed the else block that would remove 'visible' class
            // This ensures elements stay visible once they've been seen.
        });

        // Dynamically adjust the timeline line height
        adjustTimelineLineHeight();
    }

    // --- Dynamic Timeline Line Height Logic ---
    function adjustTimelineLineHeight() {
        const timeline = document.querySelector('.timeline');
        const finalMessage = document.querySelector('.final-message');
        const timelineBefore = document.querySelector('.timeline::before');

        if (timeline && finalMessage && timelineBefore) {
            const timelineRect = timeline.getBoundingClientRect();
            const finalMessageRect = finalMessage.getBoundingClientRect();

            // Calculate the height from the top of the timeline to the top of the final message
            // Considering scroll position for accuracy
            const heightUntilFinalMessage = (finalMessageRect.top + window.scrollY) - (timelineRect.top + window.scrollY);

            // Adjust the bottom of the pseudo-element. 
            // Add some buffer to ensure it doesn't overlap, e.g., 60px
            const lineBottomOffset = 60; 
            const actualLineHeight = heightUntilFinalMessage - lineBottomOffset;

            if (actualLineHeight > 0) {
                timeline.style.setProperty('--timeline-line-height', `${actualLineHeight}px`);
            } else {
                timeline.style.setProperty('--timeline-line-height', '0px'); // Hide if no events or conflict
            }
        }
    }

    // --- Camera Feed Logic for Event 5 ---
    const liveCameraFeed = document.getElementById('liveCameraFeed');
    const cameraFallbackMessage = document.querySelector('.camera-fallback-message');

    async function startCamera() {
        if (liveCameraFeed) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
                liveCameraFeed.srcObject = stream;
                liveCameraFeed.onloadedmetadata = () => {
                    liveCameraFeed.play();
                };
                if (cameraFallbackMessage) {
                    cameraFallbackMessage.style.display = 'none'; // Hide fallback if camera works
                }
            } catch (err) {
                console.error('Error accessing camera: ', err);
                if (cameraFallbackMessage) {
                    cameraFallbackMessage.textContent = 'Camera access denied or not available. Enjoy the message below instead!';
                    cameraFallbackMessage.style.display = 'block';
                }
            }
        }
    }

    // Initial checks and event listeners
    checkTimelineVisibility();
    window.addEventListener('scroll', checkTimelineVisibility);
    window.addEventListener('resize', checkTimelineVisibility); // Adjust on resize too

    // Call startCamera when the DOM is ready
    startCamera();

    // --- Love words click handler for timeline popups ---
    loveWords.forEach(button => {
        button.addEventListener('click', (e) => {
            const targetId = e.target.dataset.target;
            const popup = document.getElementById(targetId);
            if (popup) {
                popup.style.display = 'block';
            }
        });
    });

    // --- Future Adventures Click Handler ---
    adventureCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const adventureId = e.currentTarget.dataset.adventure; // Use currentTarget for the card itself
            const details = document.getElementById(adventureId);
            if (details) {
                // Hide any other open details first
                document.querySelectorAll('.adventure-details').forEach(det => {
                    if (det.id !== adventureId) {
                        det.style.display = 'none';
                    }
                });
                // Toggle display for the clicked card's details
                details.style.display = details.style.display === 'block' ? 'none' : 'block';
            }
        });
    });

    // --- Close Adventure Details buttons ---
    document.querySelectorAll('.close-adventure-details').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click event from bubbling up
            e.target.closest('.adventure-details').style.display = 'none';
        });
    });

    // --- Close popup handlers for ALL popups ---
    closePopups.forEach(button => {
        button.addEventListener('click', (e) => {
            e.target.closest('.love-popup').style.display = 'none';
        });
    });

    // Initial adjustment of timeline line height
    adjustTimelineLineHeight();
});
