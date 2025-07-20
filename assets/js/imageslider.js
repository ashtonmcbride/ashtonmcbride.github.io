// Function to initialize each slider
function initSlider(slider) {
    let currentSlideIndex = 0;
    const slides = slider.querySelector('.slides');
    const slideImages = slider.querySelectorAll('.slide');
    const totalSlides = slideImages.length;
    const currentImage = slider.querySelector('#current-image');
    const totalImages = slider.querySelector('#total-images');
    const prevButton = slider.querySelector('.prev');
    const nextButton = slider.querySelector('.next');

    // Exit if essential elements are missing
    if (!slides || !slideImages.length || !currentImage || !totalImages || !prevButton || !nextButton) {
        console.warn('Missing elements in slider:', slider);
        return;
    }
    
    // Set total number of images
    totalImages.innerHTML = totalSlides;

    function showSlide(index) {
        // Ensure index is within bounds
        if (index >= totalSlides) {
            currentSlideIndex = 0;
        } else if (index < 0) {
            currentSlideIndex = totalSlides - 1;
        } else {
            currentSlideIndex = index;
        }

        // Move the slides container to show the current slide
        const offset = -currentSlideIndex * 100; // Move by percentage
        slides.style.transition = 'transform 0.5s ease'; // Ensure smooth transition
        slides.style.transform = `translateX(${offset}%)`;

        // Update image counter
        currentImage.innerHTML = currentSlideIndex + 1;

        // Show or hide navigation arrows
        prevButton.style.display = currentSlideIndex === 0 ? 'none' : 'block';
        nextButton.style.display = currentSlideIndex === totalSlides - 1 ? 'none' : 'block';
    }

    
    // Add play/pause functionality when clicking on a video
    slider.querySelectorAll('video').forEach(video => {
        video.addEventListener('click', () => {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });
    });

    // Initial setup to hide the left arrow on the first slide
    prevButton.style.display = 'none';

    function changeSlide(direction) {
        // Get the current video (if it exists)
        const currentSlide = slideImages[currentSlideIndex];
        const currentVideo = currentSlide.querySelector('video');

        // Pause the video if it exists
        if (currentVideo) {
            currentVideo.pause(); // Pause the video before changing the slide
        }
        
        // Show the next slide
        showSlide(currentSlideIndex + direction);
    }
    
    // Attach event listeners to navigation buttons
    prevButton.onclick = () => changeSlide(-1);
    nextButton.onclick = () => changeSlide(1);

    // Initialize the slider
    showSlide(currentSlideIndex);
}

// Select all sliders and initialize each one
document.querySelectorAll('.image-slider').forEach(initSlider);