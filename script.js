// Voice Sample Comparison and Customization Tools

// Initialize waveforms when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeWaveforms();
    setupPlayButtons();
    setupCustomizationSliders();
    animateSimilarityMeter();
});

// Generate animated waveforms
function initializeWaveforms() {
    const originalCanvas = document.getElementById('originalWaveform');
    const clonedCanvas = document.getElementById('clonedWaveform');
    
    if (originalCanvas && clonedCanvas) {
        drawWaveform(originalCanvas, 'original');
        drawWaveform(clonedCanvas, 'cloned');
    }
}

// Draw waveform on canvas
function drawWaveform(canvas, type) {
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    ctx.clearRect(0, 0, width, height);
    
    const centerY = height / 2;
    const barCount = 50;
    const barWidth = width / barCount;
    
    // Different patterns for original vs cloned
    const amplitude = type === 'original' ? 0.6 : 0.7;
    const frequency = type === 'original' ? 0.05 : 0.06;
    
    ctx.fillStyle = type === 'original' ? '#2196F3' : '#9C27B0';
    
    for (let i = 0; i < barCount; i++) {
        const x = i * barWidth;
        const barHeight = Math.sin(i * frequency + Date.now() * 0.001) * amplitude * height * 0.4 + height * 0.1;
        
        ctx.fillRect(x, centerY - barHeight / 2, barWidth - 2, barHeight);
    }
    
    // Animate waveform
    if (type === 'original' || type === 'cloned') {
        requestAnimationFrame(() => drawWaveform(canvas, type));
    }
}

// Setup play buttons for voice samples
function setupPlayButtons() {
    const playButtons = document.querySelectorAll('.btn-play');
    
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sampleType = this.getAttribute('data-sample');
            togglePlayback(this, sampleType);
        });
    });
}

// Toggle playback animation
function togglePlayback(button, sampleType) {
    const icon = button.querySelector('i');
    const isPlaying = button.classList.contains('playing');
    
    if (isPlaying) {
        // Stop playback
        button.classList.remove('playing');
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        
        // Reset waveform animation
        const canvasId = sampleType === 'original' ? 'originalWaveform' : 'clonedWaveform';
        const canvas = document.getElementById(canvasId);
        if (canvas) {
            drawWaveform(canvas, sampleType);
        }
    } else {
        // Start playback
        button.classList.add('playing');
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
        
        // Animate waveform during playback
        animatePlayback(sampleType);
    }
}

// Animate waveform during playback
function animatePlayback(sampleType) {
    const canvasId = sampleType === 'original' ? 'originalWaveform' : 'clonedWaveform';
    const canvas = document.getElementById(canvasId);
    const button = document.querySelector(`[data-sample="${sampleType}"]`);
    
    if (!canvas || !button) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    let frame = 0;
    
    function animate() {
        if (!button.classList.contains('playing')) return;
        
        ctx.clearRect(0, 0, width, height);
        
        const centerY = height / 2;
        const barCount = 50;
        const barWidth = width / barCount;
        
        const color = sampleType === 'original' ? '#2196F3' : '#9C27B0';
        ctx.fillStyle = color;
        
        for (let i = 0; i < barCount; i++) {
            const x = i * barWidth;
            const time = frame * 0.1;
            const frequency = sampleType === 'original' ? 0.05 : 0.06;
            const amplitude = 0.7 + Math.sin(time + i * 0.1) * 0.2;
            const barHeight = Math.sin(i * frequency + time) * amplitude * height * 0.4 + height * 0.1;
            
            // Add glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = color;
            
            ctx.fillRect(x, centerY - barHeight / 2, barWidth - 2, barHeight);
            
            ctx.shadowBlur = 0;
        }
        
        frame++;
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Animate similarity meter on load
function animateSimilarityMeter() {
    const meterFill = document.getElementById('similarityFill');
    if (!meterFill) return;
    
    let currentWidth = 0;
    const targetWidth = 98.7;
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    
    function updateMeter() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        currentWidth = easeOutQuart * targetWidth;
        
        meterFill.style.width = currentWidth + '%';
        
        if (progress < 1) {
            requestAnimationFrame(updateMeter);
        }
    }
    
    // Start animation after a short delay
    setTimeout(() => {
        updateMeter();
    }, 500);
}

// Setup customization sliders
function setupCustomizationSliders() {
    const sliders = document.querySelectorAll('.slider');
    
    sliders.forEach(slider => {
        slider.addEventListener('input', function() {
            updateSliderVisual(this);
            updatePreview();
        });
    });
    
    // Initialize slider visuals
    sliders.forEach(slider => {
        updateSliderVisual(slider);
    });
}

// Update slider visual feedback
function updateSliderVisual(slider) {
    const value = slider.value;
    const percentage = (value / 100) * 100;
    
    // Update slider track color based on value
    slider.style.background = `linear-gradient(to right, 
        rgba(156, 39, 176, 0.8) 0%, 
        rgba(33, 150, 243, 0.8) ${percentage}%, 
        rgba(0, 0, 0, 0.5) ${percentage}%, 
        rgba(0, 0, 0, 0.5) 100%)`;
}

// Update preview based on slider values
function updatePreview() {
    const emotion = document.getElementById('emotion').value;
    const pace = document.getElementById('pace').value;
    const pitch = document.getElementById('pitch').value;
    const tone = document.getElementById('tone').value;
    
    // Update waveforms based on customization
    updateCustomizedWaveforms(emotion, pace, pitch, tone);
}

// Update waveforms with customization parameters
function updateCustomizedWaveforms(emotion, pace, pitch, tone) {
    // This would typically send parameters to backend for voice generation
    // For demo purposes, we'll just update the visual representation
    
    const clonedCanvas = document.getElementById('clonedWaveform');
    if (!clonedCanvas) return;
    
    const ctx = clonedCanvas.getContext('2d');
    const width = clonedCanvas.offsetWidth;
    const height = clonedCanvas.offsetHeight;
    
    clonedCanvas.width = width;
    clonedCanvas.height = height;
    
    ctx.clearRect(0, 0, width, height);
    
    const centerY = height / 2;
    const barCount = 50;
    const barWidth = width / barCount;
    
    // Adjust waveform based on parameters
    const emotionFactor = emotion / 100;
    const paceFactor = pace / 100;
    const pitchFactor = pitch / 100;
    
    ctx.fillStyle = '#9C27B0';
    
    for (let i = 0; i < barCount; i++) {
        const x = i * barWidth;
        const baseFreq = 0.06 * (1 + paceFactor * 0.5);
        const baseAmp = 0.7 * (1 + emotionFactor * 0.3);
        const pitchOffset = pitchFactor * 0.1;
        
        const barHeight = Math.sin(i * baseFreq + Date.now() * 0.001 + pitchOffset) * baseAmp * height * 0.4 + height * 0.1;
        
        ctx.fillRect(x, centerY - barHeight / 2, barWidth - 2, barHeight);
    }
}

// Generate preview button handler
document.getElementById('generatePreview')?.addEventListener('click', function() {
    const button = this;
    const originalText = button.textContent;
    
    // Show loading state
    button.textContent = 'Generating...';
    button.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        button.textContent = 'Preview Generated!';
        button.style.background = 'linear-gradient(135deg, #4CAF50, #2196F3)';
        
        // Update similarity meter
        const meterFill = document.getElementById('similarityFill');
        if (meterFill) {
            const newScore = 98.7 + Math.random() * 1.3;
            meterFill.style.width = newScore + '%';
            meterFill.textContent = newScore.toFixed(1) + '%';
        }
        
        // Reset button after delay
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            button.style.background = '';
        }, 2000);
    }, 1500);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to header
let lastScroll = 0;
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.5)';
    } else {
        header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

