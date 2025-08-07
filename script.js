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

    // নতুন ভেরিয়েবল: মোট পয়েন্ট ট্র্যাক করার জন্য
    let totalPoints = 0;
    const pointsPerAd = 10;

    // UI এলিমেন্টগুলো সিলেক্ট করা হয়েছে
    const totalPointsDisplay = document.getElementById('total-points');
    const userNameDisplay = document.getElementById('user-name-display');
    const welcomeUserNameDisplay = document.getElementById('welcome-user-name');
    const editNameBtn = document.getElementById('edit-name-btn');
    const adsLeftValue = document.getElementById('ads-left-value');
    const totalAdsWatched = document.getElementById('total-ads-watched');
    const welcomeAdsLeft = document.getElementById('welcome-ads-left');
    
    // Function to update the points display
    const updatePointsDisplay = () => {
        totalPointsDisplay.textContent = totalPoints;
    };

    // Function to update all ads-related counters
    const updateAdsCounter = () => {
        adWatchedCountSpan.textContent = `${adsWatched}/${maxAdsPerCycle} watched`;
        adsLeftValue.textContent = maxAdsPerCycle - adsWatched;
        welcomeAdsLeft.textContent = maxAdsPerCycle - adsWatched;
        totalAdsWatched.textContent = adsWatched;
    };

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

    // User name editing logic
    editNameBtn.addEventListener('click', () => {
        const currentName = userNameDisplay.textContent;
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = currentName;
        nameInput.className = 'user-name-input';
        nameInput.maxLength = 20; // নাম কত বড় হবে তা ঠিক করে দেওয়া হয়েছে

        userNameDisplay.replaceWith(nameInput);
        nameInput.focus();

        const saveName = () => {
            const newName = nameInput.value.trim() || 'User'; // খালি থাকলে ডিফল্ট 'User' সেট হবে
            userNameDisplay.textContent = newName;
            welcomeUserNameDisplay.textContent = newName;
            nameInput.replaceWith(userNameDisplay);
        };

        nameInput.addEventListener('blur', saveName); // যখন ইনপুট থেকে ফোকাস চলে যাবে
        nameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                saveName();
            }
        });
    });

    // Watch Ads logic
    const startAdTimer = () => {
        let timeLeft = adResetTimeInMinutes * 60;
        adTimerSpan.textContent = formatTime(timeLeft);
        timerInterval = setInterval(() => {
            timeLeft--;
            adTimerSpan.textContent = formatTime(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                adsWatched = 0;
                updateAdsCounter();
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
            show_9673543().then(() => {
                // যখন ব্যবহারকারী অ্যাড দেখা শেষ করবে, তখন এই কোডটি এক্সিকিউট হবে
                adsWatched++;
                totalPoints += pointsPerAd; // পয়েন্ট যোগ করা হয়েছে
                updateAdsCounter();
                updatePointsDisplay(); // পয়েন্ট ডিসপ্লে আপডেট করা হয়েছে

                if (adsWatched === maxAdsPerCycle) {
                    alert('You have watched all ads for this cycle. The timer has started!');
                    startAdTimer();
                } else {
                    alert('You earned ' + pointsPerAd + ' points!');
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
    
    updateAdsCounter(); // Initial update
    updatePointsDisplay(); // Initial update
});
