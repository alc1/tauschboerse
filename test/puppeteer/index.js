const path = require('path');
const puppeteer = require('puppeteer');
const PixelDiff = require('pixel-diff');

const PATH_TO_SCREENSHOTS = 'test/puppeteer/screenshots/';

const screenshotsToCompare = [
	{ imageA: '01_intro.png', imageB: '01_intro_ref.png', imageDiff: '01_intro_diff.png' },
    { imageA: '02_registration.png', imageB: '02_registration_ref.png', imageDiff: '02_registration_diff.png' },
    { imageA: '03_login.png', imageB: '03_login_ref.png', imageDiff: '03_login_diff.png' },
    { imageA: '04_dashboard.png', imageB: '04_dashboard_ref.png', imageDiff: '04_dashboard_diff.png' },
    { imageA: '05_main-menu.png', imageB: '05_main-menu_ref.png', imageDiff: '05_main-menu_diff.png' },
    { imageA: '06_dropdown-menu.png', imageB: '06_dropdown-menu_ref.png', imageDiff: '06_dropdown-menu_diff.png' },
    { imageA: '07_user-articles.png', imageB: '07_user-articles_ref.png', imageDiff: '07_user-articles_diff.png' },
    { imageA: '08_article-basketball.png', imageB: '08_article-basketball_ref.png', imageDiff: '08_article-basketball_diff.png' },
    { imageA: '09_user-trades.png', imageB: '09_user-trades_ref.png', imageDiff: '09_user-trades_diff.png' }
];

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 750 });

    // Go to start page
    await page.goto('http://localhost:3000');
    await page.screenshot({
        path: PATH_TO_SCREENSHOTS + '01_intro.png'
    });

    // Go to registration page
    await page.click('button[data-button-id="registration"]');
    await page.click('.registration-form__hint-text');
    await page.waitFor(500);
    await page.screenshot({
        path: PATH_TO_SCREENSHOTS + '02_registration.png'
    });

    // Go back to start page and go to login page
    await page.goto('http://localhost:3000');
    await page.waitFor(1000);
    await page.click('button[data-button-id="login"]');
    await page.click('.login-form__hint-text');
    await page.waitFor(500);
    await page.screenshot({
        path: PATH_TO_SCREENSHOTS + '03_login.png'
    });

    // Login in order to go to the dashboard
    await page.type('input[type="text"][name="email"]','max@mustermann.com');
    await page.type('input[type="password"][name="currentPassword"]','max');
    await page.click('button[type="submit"]');
    await page.waitFor(2000);
    await page.screenshot({
        path: PATH_TO_SCREENSHOTS + '04_dashboard.png'
    });

    // Open the main menu
    await page.click('button[data-button-id="main-menu"]');
    await page.waitFor(1000);
    await page.screenshot({
        path: PATH_TO_SCREENSHOTS + '05_main-menu.png'
    });
    await page.mouse.click(600, 400);
    await page.waitFor(1000);

    // Open the user dropdown menu
    await page.click('.appbar__user-menu-text');
    await page.waitFor(1000);
    await page.screenshot({
        path: PATH_TO_SCREENSHOTS + '06_dropdown-menu.png'
    });

    // Go to user articles
    await page.click('button[data-button-id="user-articles"]');
    await page.waitFor(2000);
    await page.mouse.click(0, 0);
    await page.waitFor(1000);
    await page.screenshot({
        path: PATH_TO_SCREENSHOTS + '07_user-articles.png'
    });

    // Go to the article basketball
    await page.goto('http://localhost:3000/article/123456789');
    await page.waitFor(2000);
    await page.click('.article-fields__hint');
    await page.waitFor(500);
    await page.screenshot({
        path: PATH_TO_SCREENSHOTS + '08_article-basketball.png'
    });

    // Go to the dashboard and to user trades
    await page.click('.app-title__main');
    await page.waitFor(1000);
    await page.click('button[data-button-id="user-trades"]');
    await page.waitFor(2000);
    await page.screenshot({
        path: PATH_TO_SCREENSHOTS + '09_user-trades.png'
    });

	await browser.close();

	// Start screenshot comparison
    screenshotsToCompare.forEach(async screenshotToCompare => {
        let pixelDiff = new PixelDiff({
            imageAPath: PATH_TO_SCREENSHOTS + screenshotToCompare.imageA,
            imageBPath: PATH_TO_SCREENSHOTS + screenshotToCompare.imageB,
            thresholdType: PixelDiff.THRESHOLD_PERCENT,
            threshold: 0.01, // 1% threshold
            imageOutputPath: PATH_TO_SCREENSHOTS + screenshotToCompare.imageDiff
        });
        try {
            let result = await pixelDiff.runWithPromise();
            console.log(`'${screenshotToCompare.imageA}' compared (${result.differences} differences)`);
        } catch (error) {
            console.log('Error while comparing: ', error);
        }
    });
})();
