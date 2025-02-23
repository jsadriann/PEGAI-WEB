"use strict";
function initializeSuporte() {
    const checkElements = setInterval(() => {
        const faqButtons = document.querySelectorAll('.faq-question');
        const contactForm = document.getElementById('form-contato');
        const faqSection = document.getElementById('faq-section');
        const contactButton = document.getElementById('contact-btn');
        const faqButton = document.getElementById('faq-btn');
        const chatButton = document.getElementById('chat-btn');
        const chatbotSection = document.getElementById('chatbot');
        const faqSearchInput = document.getElementById('faq-search');
        if (faqButtons.length > 0 && contactForm && faqSection && contactButton && faqButton && chatButton && chatbotSection && faqSearchInput) {
            clearInterval(checkElements);
            // Mostrar respostas das perguntas no FAQ
            faqButtons.forEach(button => {
                button.addEventListener('click', function () {
                    const answer = this.nextElementSibling;
                    answer.classList.toggle('visible');
                });
            });
            // Alternar entre as abas
            contactButton.addEventListener('click', function () {
                showSection(contactForm);
                hideSection(faqSection);
                hideSection(chatbotSection);
                toggleActiveTab(contactButton);
                removeActiveTab(faqButton);
                removeActiveTab(chatButton);
            });
            faqButton.addEventListener('click', function () {
                showSection(faqSection);
                hideSection(contactForm);
                hideSection(chatbotSection);
                toggleActiveTab(faqButton);
                removeActiveTab(contactButton);
                removeActiveTab(chatButton);
            });
            chatButton.addEventListener('click', function () {
                showSection(chatbotSection);
                hideSection(contactForm);
                hideSection(faqSection);
                toggleActiveTab(chatButton);
                removeActiveTab(contactButton);
                removeActiveTab(faqButton);
            });
            // Mostrar a seção de FAQ inicialmente
            showSection(faqSection);
            hideSection(contactForm);
            hideSection(chatbotSection);
            // Funcionalidade de pesquisa no FAQ
            faqSearchInput.addEventListener('input', function () {
                const searchQuery = faqSearchInput.value.toLowerCase();
                const faqItems = document.querySelectorAll('.faq-item');
                faqItems.forEach(item => {
                    const question = item.querySelector('.faq-question')?.textContent?.toLowerCase() || '';
                    if (question.includes(searchQuery)) {
                        item.style.display = 'block';
                    }
                    else {
                        item.style.display = 'none';
                    }
                });
            });
            function showSection(section) {
                if (section)
                    section.classList.add('active');
            }
            function hideSection(section) {
                if (section)
                    section.classList.remove('active');
            }
            function toggleActiveTab(button) {
                if (button)
                    button.classList.add('active-tab');
            }
            function removeActiveTab(button) {
                if (button)
                    button.classList.remove('active-tab');
            }
        }
    }, 100);
}
// Chamar a função para inicializar o suporte
initializeSuporte();
