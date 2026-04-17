(function () {
    'use strict';

    /* ----- Navbar Scroll ----- */
    var nav = document.getElementById('nav');
    var backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', function () {
        var scrolled = window.scrollY > 60;
        nav.classList.toggle('scrolled', scrolled);
        backToTop.classList.toggle('visible', window.scrollY > 600);
    });

    /* ----- Smooth Scroll ----- */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                /* Close mobile menu if open */
                navOverlay.classList.remove('active');
                document.body.style.overflow = '';
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    /* ----- Back to Top ----- */
    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ----- Mobile Menu ----- */
    var navToggle = document.getElementById('navToggle');
    var navOverlay = document.getElementById('navOverlay');
    navToggle.addEventListener('click', function () {
        var isActive = navOverlay.classList.toggle('active');
        document.body.style.overflow = isActive ? 'hidden' : '';
        this.setAttribute('aria-expanded', isActive);
    });

    /* ----- Portfolio Filter ----- */
    var filterBtns = document.querySelectorAll('.filter-btn');
    var portfolioItems = document.querySelectorAll('.portfolio-item');
    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');
            var filter = this.getAttribute('data-filter');
            portfolioItems.forEach(function (item) {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = '';
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(function () { item.style.display = 'none'; }, 300);
                }
            });
        });
    });

    /* ----- Portfolio Modal ----- */
    var modal = document.getElementById('portfolioModal');
    var modalClose = document.querySelector('.portfolio-modal-close');
    var modalOverlay = document.querySelector('.portfolio-modal-overlay');
    var modalCategory = document.getElementById('portfolioModalCategory');
    var modalTitle = document.getElementById('portfolioModalTitle');
    var modalMaterials = document.getElementById('portfolioModalMaterials');
    var modalDesc = document.getElementById('portfolioModalDesc');
    var modalCta = document.getElementById('portfolioModalCta');

    var modalTrack = document.getElementById('modalCarouselTrack');
    var modalPrev = document.getElementById('modalCarouselPrev');
    var modalNext = document.getElementById('modalCarouselNext');
    var modalDotsContainer = document.getElementById('modalCarouselDots');
    var currentCarouselIndex = 0;
    var carouselMedia = [];
    var modalCounter = null;

    function updateCarousel() {
        modalTrack.style.transform = 'translateX(-' + (currentCarouselIndex * 100) + '%)';
        Array.from(modalDotsContainer.children).forEach(function (dot, i) {
            dot.classList.toggle('active', i === currentCarouselIndex);
        });
        modalPrev.style.display = carouselMedia.length > 1 ? 'flex' : 'none';
        modalNext.style.display = carouselMedia.length > 1 ? 'flex' : 'none';
        if (modalCounter) {
            modalCounter.textContent = (currentCarouselIndex + 1) + ' / ' + carouselMedia.length;
        }
    }

    if (modalPrev) modalPrev.addEventListener('click', function () {
        if (carouselMedia.length <= 1) return;
        currentCarouselIndex = (currentCarouselIndex - 1 + carouselMedia.length) % carouselMedia.length;
        updateCarousel();
    });

    if (modalNext) modalNext.addEventListener('click', function () {
        if (carouselMedia.length <= 1) return;
        currentCarouselIndex = (currentCarouselIndex + 1) % carouselMedia.length;
        updateCarousel();
    });

    function openModal(item) {
        var img = item.querySelector('img');
        var category = item.getAttribute('data-category');
        var name = item.getAttribute('data-name') || item.querySelector('h3').textContent;
        var materials = item.getAttribute('data-materials') || '';
        var desc = item.getAttribute('data-description') || '';
        var dataImages = item.getAttribute('data-images');
        var dataVideos = item.getAttribute('data-videos');

        /* Build media list: images first, then videos */
        carouselMedia = [];
        if (dataImages) {
            dataImages.split(',').map(function (s) { return s.trim(); }).filter(Boolean).forEach(function (src) {
                carouselMedia.push({ type: 'image', src: src });
            });
        } else {
            carouselMedia.push({ type: 'image', src: img.src });
        }
        if (dataVideos) {
            dataVideos.split(',').map(function (s) { return s.trim(); }).filter(Boolean).forEach(function (src) {
                carouselMedia.push({ type: 'video', src: src });
            });
        }

        modalTrack.innerHTML = '';
        modalDotsContainer.innerHTML = '';

        /* Remove old counter if present */
        var oldCounter = document.getElementById('portfolioModalLeft').querySelector('.modal-carousel-counter');
        if (oldCounter) oldCounter.remove();

        /* Add counter badge */
        if (carouselMedia.length > 1) {
            modalCounter = document.createElement('span');
            modalCounter.className = 'modal-carousel-counter';
            modalCounter.textContent = '1 / ' + carouselMedia.length;
            document.getElementById('portfolioModalLeft').appendChild(modalCounter);
        } else {
            modalCounter = null;
        }

        carouselMedia.forEach(function (media, i) {
            if (media.type === 'video') {
                var iframe = document.createElement('iframe');
                iframe.src = media.src;
                iframe.setAttribute('allow', 'autoplay; encrypted-media');
                iframe.setAttribute('allowfullscreen', 'true');
                iframe.setAttribute('loading', 'lazy');
                iframe.title = name + ' video ' + (i + 1);
                modalTrack.appendChild(iframe);
            } else {
                var newImg = document.createElement('img');
                newImg.src = media.src;
                newImg.alt = name;
                modalTrack.appendChild(newImg);
            }

            if (carouselMedia.length > 1) {
                var dot = document.createElement('button');
                dot.className = 'modal-carousel-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', 'View ' + media.type + ' ' + (i + 1));
                dot.addEventListener('click', function () {
                    currentCarouselIndex = i;
                    updateCarousel();
                });
                modalDotsContainer.appendChild(dot);
            }
        });

        currentCarouselIndex = 0;
        updateCarousel();

        modalCategory.textContent = category;
        modalTitle.textContent = name;
        modalMaterials.textContent = materials;
        modalDesc.textContent = desc;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        /* Stop any playing videos */
        var iframes = modalTrack.querySelectorAll('iframe');
        iframes.forEach(function (iframe) {
            iframe.src = iframe.src;
        });
    }

    portfolioItems.forEach(function (item) {
        item.addEventListener('click', function () {
            openModal(this);
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    if (modalCta) {
        modalCta.addEventListener('click', function () {
            closeModal();
        });
    }

    /* ----- Testimonial Dots ----- */
    var track = document.getElementById('testimonialsTrack');
    var dots = document.querySelectorAll('.testimonial-dot');
    if (track) {
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var idx = parseInt(this.getAttribute('data-slide'));
                var card = track.children[idx];
                if (card) {
                    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' });
                }
                dots.forEach(function (d) { d.classList.remove('active'); });
                this.classList.add('active');
            });
        });
        /* Update dots on scroll */
        track.addEventListener('scroll', function () {
            var scrollLeft = track.scrollLeft;
            var cardWidth = track.children[0].offsetWidth + 24;
            var idx = Math.round(scrollLeft / cardWidth);
            dots.forEach(function (d, i) { d.classList.toggle('active', i === idx); });
        });
    }

    /* ----- Scroll Reveal ----- */
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        document.querySelectorAll('.reveal, .reveal-clip').forEach(function (el) { observer.observe(el); });
    } else {
        document.querySelectorAll('.reveal, .reveal-clip').forEach(function (el) { el.classList.add('revealed'); });
    }

    /* ----- Contact Form (AJAX with native fallback) ----- */
    var form = document.getElementById('contactForm');
    var successMsg = document.getElementById('formSuccess');
    var errorMsg = document.getElementById('formError');
    var submitBtn = document.getElementById('formSubmit');
    form.addEventListener('submit', function (e) {
        /* Check honeypot */
        if (form.querySelector('[name="_gotcha"]').value) return;
        e.preventDefault();
        var btnSpan = submitBtn.querySelector('span');
        var originalHTML = btnSpan.innerHTML;
        btnSpan.textContent = 'Sending...';
        submitBtn.disabled = true;
        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        }).then(function (resp) {
            if (resp.ok) {
                successMsg.style.display = 'block';
                errorMsg.style.display = 'none';
                form.reset();
            } else {
                throw new Error('Form submission failed');
            }
        }).catch(function () {
            errorMsg.style.display = 'block';
            successMsg.style.display = 'none';
        }).finally(function () {
            btnSpan.innerHTML = originalHTML;
            submitBtn.disabled = false;
        });
    });

})();
