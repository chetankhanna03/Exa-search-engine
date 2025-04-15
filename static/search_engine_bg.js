// Configuration
const config = {
    dots: 120,
    maxDistance: 150,
    mouseSensitivity: 0.1,
    dotSizeRange: [4, 8]
  };
  
  // Container
  const container = document.getElementById('container');
  const containerRect = container.getBoundingClientRect();
  
  // Dots array to store all dot elements and their data
  const dots = [];
  
  // Create dots
  for (let i = 0; i < config.dots; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    
    // Random position
    const x = Math.random() * containerRect.width;
    const y = Math.random() * containerRect.height;
    
    // Random size
    const size = config.dotSizeRange[0] + Math.random() * (config.dotSizeRange[1] - config.dotSizeRange[0]);
    
    // Set initial position and size
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    
    // Store original position
    const dotData = {
      element: dot,
      x,
      y,
      size,
      originalX: x,
      originalY: y
    };
    
    dots.push(dotData);
    container.appendChild(dot);
  }
  
  // Last known mouse position
  let mouseX = containerRect.width / 2;
  let mouseY = containerRect.height / 2;
  
  // Update mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Animation loop
  function animate() {
    dots.forEach(dot => {
      // Calculate distance from mouse
      const dx = mouseX - dot.originalX;
      const dy = mouseY - dot.originalY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Move dot away from mouse based on distance
      if (distance < config.maxDistance) {
        // Calculate how much to move (closer = more movement)
        const factor = 1 - (distance / config.maxDistance);
        const moveX = dx * factor * config.mouseSensitivity;
        const moveY = dy * factor * config.mouseSensitivity;
        
        // Apply new position
        dot.x = dot.originalX - moveX;
        dot.y = dot.originalY - moveY;
        
        // Increase size slightly based on proximity
        const sizeFactor = 1 + (factor * 0.5);
        dot.element.style.transform = `scale(${sizeFactor})`;
        dot.element.style.backgroundColor = 'var(--dot-color-hover)';
      } else {
        // Return to original position and size
        dot.x = dot.originalX;
        dot.y = dot.originalY;
        dot.element.style.transform = 'scale(1)';
        dot.element.style.backgroundColor = 'var(--dot-color)';
      }
      
      // Update position
      dot.element.style.left = `${dot.x}px`;
      dot.element.style.top = `${dot.y}px`;
    });
    
    requestAnimationFrame(animate);
  }
  
  // Start animation
  animate();
  
  // Resize handler
  window.addEventListener('resize', () => {
    const newContainerRect = container.getBoundingClientRect();
    
    // Update dot positions based on new container size
    dots.forEach(dot => {
      // Scale original positions to new container size
      dot.originalX = (dot.originalX / containerRect.width) * newContainerRect.width;
      dot.originalY = (dot.originalY / containerRect.height) * newContainerRect.height;
      
      // Update current positions
      dot.x = dot.originalX;
      dot.y = dot.originalY;
      
      // Update DOM
      dot.element.style.left = `${dot.x}px`;
      dot.element.style.top = `${dot.y}px`;
    });
    
    // Update container rect reference
    containerRect.width = newContainerRect.width;
    containerRect.height = newContainerRect.height;
  });