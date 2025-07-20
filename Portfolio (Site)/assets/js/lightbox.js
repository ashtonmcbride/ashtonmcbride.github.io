// Cache DOM elements outside loops
const galleryLinks = document.querySelectorAll('.image, .image-slider .slide, .box.alt .image.fit img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

let currentSliderImages = [];
let currentImageIndex = 0;
let currentSliderContainer = null;

// Update the image slider on the site and manage arrow visibility
function updateSlider(index) {
    const slides = currentSliderContainer.querySelector('.slides');
    const currentImageElem = currentSliderContainer.querySelector('#current-image');
    const prevArrow = currentSliderContainer.querySelector('.prev');
    const nextArrow = currentSliderContainer.querySelector('.next');
    
    // Calculate the offset and directly apply transform for smooth transition
    const offset = -index * 100;
    slides.style.transition = 'transform 0.5s ease'; // Ensure smooth transition
    slides.style.transform = `translateX(${offset}%)`;

    // Update the current slide number on the site if it exists
    if (currentImageElem) {
        currentImageElem.innerHTML = index + 1;
    }

    // Hide/show navigation arrows based on the current image index
    if (index === 0) {
        prevArrow.style.display = 'none'; // Hide left arrow on the first image
    } else {
        prevArrow.style.display = 'block'; // Show left arrow for other images
    }

    if (index === currentSliderImages.length - 1) {
        nextArrow.style.display = 'none'; // Hide right arrow on the last image
    } else {
        nextArrow.style.display = 'block'; // Show right arrow for other images
    }
}

// Function to show the current image in the lightbox (skipping videos)
function showImage(index) {
    // Skip over videos in the lightbox
    while (currentSliderImages[index].tagName === 'VIDEO') {
        if (index === 0) {
            // If the first slide is a video, skip forward
            index++;
        } else if (index === currentSliderImages.length - 1) {
            // If the last slide is a video, skip backward
            index--;
        } else {
            // Otherwise, skip the video and move in the current direction
            index = (index < currentImageIndex) ? index - 1 : index + 1;
        }
    }

    if (index >= 0 && index < currentSliderImages.length) {
        const newSlide = currentSliderImages[index];

        // Handle image slides only
        if (newSlide.tagName === 'IMG') {
            lightboxImg.style.display = 'block'; // Show the image
        
            // Check if there's an `href` attribute and use it for the lightbox image
            const customSrc = newSlide.getAttribute('href');
            lightboxImg.src = customSrc ? customSrc : newSlide.src;

            // Hide any video in the lightbox
            if (lightbox.querySelector('video')) {
                const video = lightbox.querySelector('video');
                currentSliderContainer.querySelector('.slides').appendChild(video); // Move video back to slider
                video.pause(); // Pause the video if playing
            }
        }

        currentImageIndex = index;

        // Determine whether to show the left arrow (prev)
        let hasPrevImage = false;
        for (let i = currentImageIndex - 1; i >= 0; i--) {
            if (currentSliderImages[i].tagName === 'IMG') {
                hasPrevImage = true; // There's a valid image before the current one
                break;
            }
        }
        lightboxPrev.style.display = hasPrevImage ? 'block' : 'none';

        // Determine whether to show the right arrow (next)
        let hasNextImage = false;
        for (let i = currentImageIndex + 1; i < currentSliderImages.length; i++) {
            if (currentSliderImages[i].tagName === 'IMG') {
                hasNextImage = true; // There's a valid image after the current one
                break;
            }
        }
        lightboxNext.style.display = hasNextImage ? 'block' : 'none';
        
        // Update the global index
        currentImageIndex = index;

        // Update navigation arrows
        updateNavigationArrows();
    }
}


// Function to update the visibility of navigation arrows
function updateNavigationArrows() {
    if (!currentSliderContainer) {
        // If not in a slider (e.g., gallery), hide the arrows
        lightboxPrev.style.display = 'none';
        lightboxNext.style.display = 'none';
    } else {
        // Show/hide arrows based on available images
        let hasPrevImage = false;
        for (let i = currentImageIndex - 1; i >= 0; i--) {
            if (currentSliderImages[i].tagName === 'IMG') {
                hasPrevImage = true;
                break;
            }
        }
        lightboxPrev.style.display = hasPrevImage ? 'block' : 'none';

        let hasNextImage = false;
        for (let i = currentImageIndex + 1; i < currentSliderImages.length; i++) {
            if (currentSliderImages[i].tagName === 'IMG') {
                hasNextImage = true;
                break;
            }
        }
        lightboxNext.style.display = hasNextImage ? 'block' : 'none';
    }
}


// Function to navigate to the previous image in the slider and lightbox, skipping videos
function showPrevImage() {
    const currentVideo = lightbox.querySelector('video');
    if (currentVideo) {
        currentVideo.pause(); // Pause the video before navigating
    }
    
    let newIndex = currentImageIndex - 1;
    // Skip over any videos
    while (newIndex >= 0 && currentSliderImages[newIndex].tagName === 'VIDEO') {
        newIndex--;
    }

    if (newIndex >= 0) {
        showImage(newIndex);
    }
}

// Function to navigate to the next image in the slider and lightbox, skipping videos
function showNextImage() {
    const currentVideo = lightbox.querySelector('video');
    if (currentVideo) {
        currentVideo.pause(); // Pause the video before navigating
    }
    
    let newIndex = currentImageIndex + 1;
    // Skip over any videos
    while (newIndex < currentSliderImages.length && currentSliderImages[newIndex].tagName === 'VIDEO') {
        newIndex++;
    }

    if (newIndex < currentSliderImages.length) {
        showImage(newIndex);
    }
}


// Loop through each gallery link or image
galleryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent the link from navigating

        if (link.closest('.box.alt')) {
            // For gallery images inside `.box.alt`
            currentSliderContainer = null; // No slider context
            currentSliderImages = [...document.querySelectorAll('.box.alt .image.fit img')]; // Get only `.box.alt` images
            currentImageIndex = currentSliderImages.indexOf(link); // Correctly track the clicked image index
            showImage(currentImageIndex); // Display the clicked image in the lightbox

            // Show the lightbox
            lightbox.style.display = 'block';
            setTimeout(() => {
                lightbox.classList.add('show'); // Trigger fade-in
                lightboxImg.classList.add('show');
            }, 10); // Slight delay to allow the display change
        } else if (link.closest('.image-slider')) {
            // For images in the slider
            currentSliderContainer = link.closest('.image-slider');
            currentSliderImages = [...currentSliderContainer.querySelectorAll('.slide')]; // Get only slider images
            currentImageIndex = currentSliderImages.indexOf(link); // Correctly track the clicked image index
            showImage(currentImageIndex); // Display the clicked image in the lightbox

            // Show the lightbox
            lightbox.style.display = 'block';
            setTimeout(() => {
                lightbox.classList.add('show'); // Trigger fade-in
                lightboxImg.classList.add('show');
            }, 10);
        } else if (link.tagName === 'A') {
            // For single images wrapped in <a> tags
            const imgSrc = link.href;
            lightboxImg.src = imgSrc;
            lightboxPrev.style.display = 'none'; // Hide arrows for single images
            lightboxNext.style.display = 'none'; // Hide arrows for single images

            // Display the lightbox immediately
            lightbox.style.display = 'block';
            setTimeout(() => {
                lightbox.classList.add('show'); // Fade in the lightbox
                lightboxImg.classList.add('show'); // Fade in the image
            }, 10);
        } else if (link.tagName === 'IMG') {
            // For images in the slider
            currentSliderContainer = link.closest('.image-slider'); // Identify the parent slider
            currentSliderImages = [...currentSliderContainer.querySelectorAll('.slide')]; // Get only images from the current slider
            currentImageIndex = currentSliderImages.indexOf(link); // Set current image index
            showImage(currentImageIndex); // Display the clicked image in the lightbox

            lightbox.style.display = 'block'; // Show the lightbox immediately
            setTimeout(() => {
                lightbox.classList.add('show'); // Trigger the fade-in after lightbox is visible
                lightboxImg.classList.add('show'); // Trigger fade-in for the image
            }, 10); // Delay slightly to allow the display change to take effect
        }
    });
});


// Attach event listeners to lightbox navigation arrows
lightboxPrev.addEventListener('click', showPrevImage);
lightboxNext.addEventListener('click', showNextImage);

// Close the lightbox when clicking outside the image
lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg && e.target !== lightboxPrev && e.target !== lightboxNext) {
        lightbox.classList.remove('show');
        lightboxImg.classList.remove('show');

        lightbox.classList.add('hide');
        lightboxImg.classList.add('hide');

        setTimeout(() => {
            lightbox.style.display = 'none';
            lightbox.classList.remove('hide');
            lightboxImg.classList.remove('hide');
        }, 500); // Wait for the fade-out transition to finish
    }
});