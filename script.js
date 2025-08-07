document.addEventListener('DOMContentLoaded', () => {
    // Select all navigation items and pages
    const navItems = document.querySelectorAll('.app-footer .nav-item');
    const pages = document.querySelectorAll('.main-content .page');
    const adWatchedCountSpan = document.getElementById('ad-watched-count');
    const adTimerSpan = document.getElementById('ad-timer');

    let adsWatched = 0;
    const maxAdsPerCycle = 10;
    const adResetTimeInMinutes = 30;
    let timerInterval = null;

    // Function to switch pages
    const switchPage = (pageId) => {
        // Hide all pages
        pages.forEach(page => {
            page.classList.remove('active');
        });
        // Show the selected page
        document.getElementById(pageId).classList.add('active');

        // Update active class on nav items
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page + '-page' === pageId) {
                item.classList.add('active');
            }
        });
    };

    // Add click event listeners to nav items
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const pageId = item.dataset.page + '-page';
            switchPage(pageId);
        });
    });

    // Handle copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const input = e.target.previousElementSibling;
            input.select();
            input.setSelectionRange(0, 99999); // For mobile devices
            document.execCommand('copy');
            alert('Copied to clipboard!');
        });
    });

    // Handle share button
    document.querySelector('.share-btn').addEventListener('click', () => {
        const referralLink = document.getElementById('referral-link').value;
        if (navigator.share) {
            navigator.share({
                title: 'Coin Bazar Referral',
                text: 'Join Coin Bazar and earn points!',
                url: referralLink,
            }).then(() => {
                console.log('Shared successfully');
            }).catch(console.error);
        } else {
            alert('Web Share API is not supported in this browser. Please use the copy button.');
        }
    });

    // Handle withdraw form submission
    document.getElementById('withdraw-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = document.getElementById('amount').value;
        const method = document.getElementById('payment-method').value;
        const accountId = document.getElementById('account-id').value;

        // In a real app, you would send this to your backend
        console.log('Withdrawal request submitted:', { amount, method, accountId });
        alert('Withdrawal request submitted successfully!');
        e.target.reset(); // Clear the form
    });

    // Watch Ads logic
    const updateAdCounter = () => {
        adWatchedCountSpan.textContent = `${adsWatched}/${maxAdsPerCycle} watched`;
    };

    const startAdTimer = () => {
        let timeLeft = adResetTimeInMinutes * 60;
        adTimerSpan.textContent = formatTime(timeLeft);
        timerInterval = setInterval(() => {
            timeLeft--;
            adTimerSpan.textContent = formatTime(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                adsWatched = 0;
                updateAdCounter();
                adTimerSpan.textContent = 'Ready!';
            }
        }, 1000);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')} remaining`;
    };

    document.querySelector('.watch-ad-btn').addEventListener('click', () => {
        if (adsWatched < maxAdsPerCycle) {
            // Monetag Rewarded Interstitial অ্যাড দেখানোর কোড এখানে যুক্ত করা হয়েছে
            show_9673543().then(() => {
                // যখন ব্যবহারকারী অ্যাড দেখা শেষ করবে, তখন এই কোডটি এক্সিকিউট হবে
                adsWatched++;
                updateAdCounter();
                if (adsWatched === maxAdsPerCycle) {
                    alert('You have watched all ads for this cycle. The timer has started!');
                    startAdTimer();
                } else {
                    alert('You earned 10 points!');
                }
            }).catch(e => {
                // অ্যাড লোড হতে কোনো সমস্যা হলে এই কোডটি কাজ করবে
                console.error('Monetag ad error:', e);
                alert('There was an error loading the ad. Please try again.');
            });
        } else {
            alert('You have reached the ad limit for this cycle. Please wait for the timer to finish.');
        }
    });
    
    updateAdCounter(); // Initial update
});
