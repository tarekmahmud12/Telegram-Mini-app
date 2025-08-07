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

    let totalPoints = 0;
    let userName = 'User';
    const pointsPerAd = 10;

    // UI elements
    const totalPointsDisplay = document.getElementById('total-points');
    const userNameDisplay = document.getElementById('user-name-display');
    const welcomeUserNameDisplay = document.getElementById('welcome-user-name');
    const editNameBtn = document.getElementById('edit-name-btn');
    const adsLeftValue = document.getElementById('ads-left-value');
    const totalAdsWatched = document.getElementById('total-ads-watched');
    const welcomeAdsLeft = document.getElementById('welcome-ads-left');
    
    // BACKEND SERVER URL - REPLACE THIS WITH YOUR VERCEL URL
    const backendUrl = "https://coin-bazar-backend.vercel.app"; // আপনার Vercel URL এখানে বসিয়ে দেওয়া হয়েছে।

    // Get the Telegram user ID from WebApp data
    const telegramId = window.Telegram.WebApp.initDataUnsafe.user.id.toString();

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

    // Function to save user data to the backend
    const saveUserDataToBackend = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/user/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    telegramId: telegramId,
                    userName: userName,
                    points: totalPoints
                })
            });

            if (response.ok) {
                console.log("User data saved successfully to backend.");
            } else {
                console.error("Failed to save data to backend.");
            }
        } catch (error) {
            console.error('Error saving data to backend:', error);
        }
    };

    // Function to load user data from the backend
    const loadUserDataFromBackend = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/user/${telegramId}`);
            
            if (response.ok) {
                const userData = await response.json();
                userName = userData.userName || 'User';
                totalPoints = userData.points || 0;
                
                userNameDisplay.textContent = userName;
                welcomeUserNameDisplay.textContent = userName;
                updatePointsDisplay();
            } else {
                console.log("User not found or error loading data. Using default values.");
            }
        } catch (error) {
            console.error('Error loading data from backend:', error);
        }
    };

    // Function to switch pages
    const switchPage = (pageId) => {
        pages.forEach(page => page.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page + '-page' === pageId) {
                item.classList.add('active');
            }
        });
    };

    // Event listeners
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
            input.setSelectionRange(0, 99999);
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
        console.log('Withdrawal request submitted:', { amount, method, accountId });
        alert('Withdrawal request submitted successfully!');
        e.target.reset();
    });

    // User name editing logic
    editNameBtn.addEventListener('click', () => {
        const currentName = userNameDisplay.textContent;
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = currentName;
        nameInput.className = 'user-name-input';
        nameInput.maxLength = 20;

        userNameDisplay.replaceWith(nameInput);
        nameInput.focus();

        const saveName = () => {
            const newName = nameInput.value.trim() || 'User';
            userName = newName;
            userNameDisplay.textContent = newName;
            welcomeUserNameDisplay.textContent = newName;
            nameInput.replaceWith(userNameDisplay);
            saveUserDataToBackend(); // Save updated name to backend
        };

        nameInput.addEventListener('blur', saveName);
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
                adsWatched++;
                totalPoints += pointsPerAd;
                updateAdsCounter();
                updatePointsDisplay();
                saveUserDataToBackend(); // Save updated points to backend

                if (adsWatched === maxAdsPerCycle) {
                    alert('You have watched all ads for this cycle. The timer has started!');
                    // startAdTimer();
                } else {
                    alert('You earned ' + pointsPerAd + ' points!');
                }
            }).catch(e => {
                console.error('Monetag ad error:', e);
                alert('There was an error loading the ad. Please try again.');
            });
        } else {
            alert('You have reached the ad limit for this cycle. Please wait for the timer to finish.');
        }
    });

    // Initial load - লোড হওয়ার সাথে সাথে ডেটাবেস থেকে ডেটা লোড করা হবে
    loadUserDataFromBackend();
    updateAdsCounter();
});
