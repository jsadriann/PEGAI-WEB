function initializeSobrenos(): void {
    let currentIndex = 0;
    const items = document.querySelectorAll('.carousel-item');
    const totalItems = items.length;
    
    function changeSlide(direction:any) {
        currentIndex += direction;
        if (currentIndex < 0) currentIndex = totalItems - 1;
        if (currentIndex >= totalItems) currentIndex = 0;
        
        // Mover o carrossel
        document.querySelector('.carousel-inner').style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    
    document.querySelector('.prev').addEventListener('click', () => changeSlide(-1));
    document.querySelector('.next').addEventListener('click', () => changeSlide(1));   
}

initializeSobrenos();


