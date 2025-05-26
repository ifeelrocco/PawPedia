document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navLinks = document.getElementById('navLinks');

    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburgerMenu.classList.toggle('active'); // To animate the hamburger icon itself
        });
    }
    // End of existing hamburger menu logic

    // Scroll Animation for Continent Sections
    function checkContinentSections() {
        const sections = document.querySelectorAll('.continent-section');
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.75) {
                section.classList.add('visible');
            } else {
                section.classList.remove('visible');
            }
        });
    }

    window.addEventListener('scroll', checkContinentSections);
    window.addEventListener('load', checkContinentSections);

    // Hero Section Animations
    const heroElementsToAnimate = document.querySelectorAll('.fade-in-up-on-load, .fade-in-on-load');

    setTimeout(() => {
        heroElementsToAnimate.forEach((element, index) => {
            // Stagger the animation slightly for a nicer effect if desired,
            // or apply 'aos-animate' to all at once.
            // The CSS transition will handle the individual delays if set via `transition-delay`.
            // For simplicity here, we apply them with a very minor direct stagger via JS if needed,
            // but the CSS `aos-animate` class is the main trigger.
            setTimeout(() => {
                element.classList.add('aos-animate');
            }, index * 100); // Small stagger: 0ms, 100ms, 200ms etc.
        });
    }, 100); // Initial delay to ensure styles are applied before animation starts

    // Stat Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    const animationDuration = 2000; // 2 seconds for counter animation
    const frameDuration = 1000 / 60; // 60 FPS

    const animateCounter = (element) => {
        const target = parseInt(element.dataset.target, 10);
        const totalFrames = Math.round(animationDuration / frameDuration);
        let frame = 0;
        const increment = target / totalFrames;

        const timer = setInterval(() => {
            frame++;
            const currentValue = Math.round(increment * frame);
            element.textContent = currentValue;

            if (frame === totalFrames) {
                element.textContent = target; // Ensure it ends exactly on target
                clearInterval(timer);
            }
        }, frameDuration);
        element.dataset.animated = 'true'; // Mark as animated
    };

    const statObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                // Find the .stat-number within the .stat-item that is intersecting
                const statNumberElement = entry.target.querySelector('.stat-number');
                if (statNumberElement && !statNumberElement.dataset.animated) {
                     animateCounter(statNumberElement);
                } else if (entry.target.classList.contains('stat-number') && !entry.target.dataset.animated) {
                    // If the .stat-number itself is observed (e.g., if we change to observe them directly)
                    animateCounter(entry.target);
                }
                // observer.unobserve(entry.target); // Optional: unobserve after animation
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the item is visible

    // Observe each .stat-item or .hero-stats container
    // Observing individual .stat-item elements is more precise
    const statItems = document.querySelectorAll('.stat-item');
    if (statItems.length > 0) {
        statItems.forEach(item => {
            statObserver.observe(item);
        });
    } else {
        // Fallback: if .stat-item isn't found (e.g. structure change), try observing .stat-number directly
        // This requires .stat-number to have some layout for intersection to be detected.
        statNumbers.forEach(num => {
            statObserver.observe(num); 
        });
    }

    // Video Slider Functionality (REMOVED)

    // --- YouTube Playlist Dynamic Video Loading ---
    const YOUTUBE_API_KEY = 'AIzaSyCgniQXSLpzjaWRfuuoaUvOBepzfozX-nk'; // Your API Key
    const PLAYLIST_ID = 'PL1O-OmZJUAf0DfQBNiElUu3tN9gEH1v0B'; // Your Playlist ID
    const MAX_VIDEOS_TO_DISPLAY = 3;

    async function fetchYouTubePlaylistVideos(apiKey, playlistId, maxResults = 10) {
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${apiKey}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json();
                console.error('YouTube API Error:', response.status, errorData.error.message);
                throw new Error(`YouTube API request failed: ${response.status} - ${errorData.error.message}`);
            }
            const data = await response.json();
            return data.items; // Array of video items
        } catch (error) {
            console.error('Failed to fetch YouTube playlist videos:', error);
            for (let i = 1; i <= MAX_VIDEOS_TO_DISPLAY; i++) {
                const titleEl = document.getElementById(`video-title-${i}`);
                const descEl = document.getElementById(`video-desc-${i}`);
                if (titleEl) titleEl.textContent = 'Could not load video';
                if (descEl) descEl.textContent = 'API error. Check console.';
            }
            return [];
        }
    }

    function updateVideoCards(videoItems) {
        if (!videoItems) {
            console.warn('updateVideoCards called with null/undefined videoItems.');
            return;
        }
        
        for (let i = 0; i < MAX_VIDEOS_TO_DISPLAY; i++) {
            const videoData = videoItems[i]; 
            const cardIndex = i + 1;

            const thumbEl = document.getElementById(`video-thumb-${cardIndex}`);
            const titleEl = document.getElementById(`video-title-${cardIndex}`);
            const descEl = document.getElementById(`video-desc-${cardIndex}`);
            const thumbLinkEl = document.getElementById(`video-link-thumb-${cardIndex}`);
            const titleLinkEl = document.getElementById(`video-link-title-${cardIndex}`);
            const cardEl = document.getElementById(`video-card-${cardIndex}`);

            if (videoData && videoData.snippet) {
                const snippet = videoData.snippet;
                const videoId = snippet.resourceId && snippet.resourceId.videoId;
                const videoUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : '#';

                if (thumbEl) {
                    thumbEl.src = snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || '';
                    thumbEl.alt = snippet.title || 'Video thumbnail';
                }
                if (titleEl) {
                    titleEl.textContent = snippet.title || 'Video Title';
                }
                if (descEl) {
                    let description = snippet.description || 'No description available.';
                    if (description.length > 100) {
                        description = description.substring(0, 97) + '...';
                    }
                    descEl.textContent = description;
                }
                if (thumbLinkEl) thumbLinkEl.href = videoUrl;
                if (titleLinkEl) titleLinkEl.href = videoUrl;
                if (cardEl) cardEl.style.display = 'block';
            } else {
                if (cardEl) cardEl.style.display = 'none';
                console.warn(`Video data not available for card ${cardIndex}. Hiding card.`);
            }
        }
    }

    function getRandomVideos(allVideos, count) {
        if (!allVideos || allVideos.length === 0) {
            return [];
        }
        const shuffled = [...allVideos].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, shuffled.length));
    }

    async function initYouTubeVideos() {
        console.log('Fetching new YouTube videos from API...');
        const allVideoItems = await fetchYouTubePlaylistVideos(YOUTUBE_API_KEY, PLAYLIST_ID, 50); // Fetch more to ensure variety
        let videosToDisplay = [];

        if (allVideoItems && allVideoItems.length > 0) {
            videosToDisplay = getRandomVideos(allVideoItems, MAX_VIDEOS_TO_DISPLAY);
        } else {
            console.warn('No video items fetched from API or playlist is empty.');
        }

        if (videosToDisplay.length < MAX_VIDEOS_TO_DISPLAY) {
            console.warn(`Could only select ${videosToDisplay.length} videos. Displaying what's available.`)
            // Fill remaining cards with a 'not available' message or hide them
            for (let i = videosToDisplay.length; i < MAX_VIDEOS_TO_DISPLAY; i++) {
                const cardIndex = i + 1;
                const cardEl = document.getElementById(`video-card-${cardIndex}`);
                const titleEl = document.getElementById(`video-title-${cardIndex}`);
                const descEl = document.getElementById(`video-desc-${cardIndex}`);
                if (titleEl) titleEl.textContent = 'Video not available';
                if (descEl) descEl.textContent = 'Try refreshing later.';
                // Optionally hide the card or thumbnail
            }
        }
        updateVideoCards(videosToDisplay);
    }

    initYouTubeVideos();

    const refreshButton = document.getElementById('refresh-videos-btn');
    if (refreshButton) {
        refreshButton.addEventListener('click', initYouTubeVideos);
    }

    // --- Floating Detail Panel for Threat Cards ---
    const allThreatCards = document.querySelectorAll('.threats-grid .threat-card');
    const floatingPanel = document.getElementById('floatingDetailPanel');
    const panelTitleElem = document.getElementById('panelTitle');
    const panelBodyElem = document.getElementById('panelBody');
    const panelCloseBtn = floatingPanel.querySelector('.close-panel-btn');
    // Removed panelImageElem declaration

    // Store the currently active card to toggle panel or change content
    let activeThreatCard = null;

    const threatDetailsData = {
        "Deforestation": {
            title: "Deforestation Deep Dive",
            body: "Forests are cleared for agriculture, logging, and urban expansion, leading to habitat loss for countless species and impacting global climate patterns."
        },
        "Climate Change": {
            title: "Climate Change Effects",
            body: "Rising global temperatures alter weather patterns, melt ice caps, and disrupt ecosystems, affecting wildlife migration, breeding, and food availability."
        },
        "Poaching": {
            title: "The Threat of Poaching",
            body: "Illegal hunting and trafficking of animals for their parts (ivory, horns, fur) drives many species like elephants, rhinos, and tigers towards extinction."
        },
        "Pollution": {
            title: "Pollution's Impact",
            body: "Chemical runoff, plastic waste, and other pollutants contaminate water bodies and land, directly harming wildlife and their habitats."
        },
        "Habitat Loss": { 
            title: "Habitat Loss Explained",
            body: "Urban sprawl, infrastructure development, and agricultural expansion continuously shrink natural habitats, displacing animals and reducing biodiversity."
        },
        "Ocean Plastic": {
            title: "Ocean Plastic Crisis",
            body: "Millions of tons of plastic enter the oceans annually, entangling marine life, being ingested, and releasing toxins into the marine food web."
        }
    };

    function showFloatingPanel(card, content) {
        panelTitleElem.textContent = content.title;
        panelBodyElem.textContent = content.body;

        // Image logic removed

        const cardRect = card.getBoundingClientRect();
        
        // Position the panel directly on top of the card
        let top = window.scrollY + cardRect.top;
        let left = window.scrollX + cardRect.left;

        floatingPanel.style.top = `${top}px`;
        floatingPanel.style.left = `${left}px`;
        floatingPanel.style.width = `${cardRect.width}px`;
        floatingPanel.style.height = `${cardRect.height}px`;
        
        // Optional: Add overflow if content might exceed card dimensions
        // floatingPanel.style.overflowY = 'auto'; 

        floatingPanel.style.display = 'block';
        setTimeout(() => floatingPanel.classList.add('visible'), 10);
        activeThreatCard = card;
    }

    function hideFloatingPanel() {
        floatingPanel.classList.remove('visible');
        // Wait for transition to complete before hiding
        setTimeout(() => {
            if (!floatingPanel.classList.contains('visible')) { // Check again in case it was re-opened
                 floatingPanel.style.display = 'none';
            }
        }, 200); // Match CSS transition duration
        activeThreatCard = null;
    }

    if (allThreatCards.length > 0 && floatingPanel) {
        allThreatCards.forEach(card => {
            card.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent click from bubbling to document listener immediately
                const cardTitle = card.querySelector('.threat-title').textContent.trim();
                const details = threatDetailsData[cardTitle];

                if (details) {
                    if (activeThreatCard === card) { // Clicked same card - toggle
                        hideFloatingPanel();
                    } else if (activeThreatCard !== null) { // Different card clicked, and one is already open
                        hideFloatingPanel();
                        // Wait for the hide animation to mostly complete before showing the new one
                        setTimeout(() => {
                            showFloatingPanel(card, details);
                        }, 250); // Slightly less than the full 0.3s animation (300ms)
                    } else { // No panel is open, just show it
                        showFloatingPanel(card, details);
                    }
                } else {
                    console.warn(`No details found for threat card: ${cardTitle}`);
                    hideFloatingPanel(); // Hide if other panel was open
                }
            });
        });

        panelCloseBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            hideFloatingPanel();
        });

        // Click outside to close
        document.addEventListener('click', (event) => {
            if (floatingPanel.classList.contains('visible') && !floatingPanel.contains(event.target)) {
                 // Check if the click was on a threat card; if so, the card's listener handles it
                let clickedOnThreatCard = false;
                allThreatCards.forEach(tc => {
                    if (tc.contains(event.target)) {
                        clickedOnThreatCard = true;
                    }
                });
                if (!clickedOnThreatCard) {
                    hideFloatingPanel();
                }
            }
        });
    }
    // --- End Floating Detail Panel for Threat Cards ---

    // --- Habitats Around the World Section --- 
    // const habitatData = { ... }; // Removed habitatData

    const habitatCards = document.querySelectorAll('.habitat-card');

    // Auto-scroll for habitats is now handled by CSS animations.
    // const scrollContainer = document.querySelector('.habitats-scroll-container'); // Kept for potential future JS interactions, but not for current scroll.

    habitatCards.forEach(card => {
        // const habitatType = card.dataset.habitat; // No longer needed for animal lists
        // const animalListElement = card.querySelector('.animal-list'); // Removed
        // const animalDisplayPanel = card.querySelector('.animal-display-panel'); // Removed
        // const habitatNameElement = card.querySelector('.habitat-name'); // No longer needed for click listener
        // const imageLinkElement = card.querySelector('.habitat-image-link');

        // Animal list population logic removed.
        // Click listener for panel toggle removed.
    });
    // --- End Habitats Around the World Section ---

    // Intersection Observer for Threat Cards Fade-in
    const threatCards = document.querySelectorAll('.threat-card');
    if (threatCards.length > 0) {
        const cardObserverOptions = {
            root: null, // relative to document viewport
            rootMargin: '0px',
            threshold: 0.1 // 10% of the item is visible
        };

        const cardObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add a slight delay for each card to make them appear sequentially
                    entry.target.style.transitionDelay = `${index * 150}ms`;
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Stop observing once it's visible
                }
            });
        }, cardObserverOptions);

        threatCards.forEach(card => {
            cardObserver.observe(card);
        });
    }

}); // Closes DOMContentLoaded