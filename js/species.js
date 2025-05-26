document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.species-card');
    
    cards.forEach(card => {
        let isClicked = false;
        
        // Handle click
        card.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle click state
            isClicked = !isClicked;
            this.classList.toggle('clicked', isClicked);
            
            // Prevent quick hide/show
            if (isClicked) {
                setTimeout(() => {
                    this.style.transition = 'opacity 0.3s ease-out';
                }, 100);
            } else {
                setTimeout(() => {
                    this.style.transition = 'opacity 0.3s ease-out';
                }, 300);
            }
        });
    });
});
