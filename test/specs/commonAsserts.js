function goToStartPage() {
    browser.url('http://localhost:3000');
    expect(browser.getTitle()).toBe('Tauschbörse');
}

function assertLogin(theName, theEmail, thePassword) {
    // Go to the login page and check the title on the login page
    browser.click('button[data-button-id="login"]');
    browser.waitForExist('.login-form__title', 5000);
    expect(browser.getText('.login-form__title')).toBe('Melde Dich mit deiner E-Mail-Adresse an:');

    // Fill the login form
    browser.setValue('input[type="text"][name="email"]', theEmail);
    expect(browser.getValue('input[type="text"][name="email"]')).toBe(theEmail);

    browser.setValue('input[type="password"][name="currentPassword"]', thePassword);
    expect(browser.getValue('input[type="password"][name="currentPassword"]')).toBe(thePassword);

    // Click submit button which opens the dashboard of the user
    browser.click('button[type="submit"]');

    // Check the greeting on the dashboard
    browser.waitForExist('.page-title', 5000);
    expect(browser.getText('.page-title')).toBe(`Hallo ${theName}`);
}

function assertLogout() {
    // Click the logout button which opens the home page (intro page) of the application
    browser.click('button[data-button-id="logout"]');

    // Check the general greeting on the home page
    browser.waitForExist('.page-title', 5000);
    expect(browser.getText('.page-title')).toBe('Willkommen bei der Tauschbörse!');
}

module.exports = {
    goToStartPage,
    assertLogin,
    assertLogout
};