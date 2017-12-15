/**
 * This end-to-end test goes through the login process. It fills the login form and clicks the login button.
 * Expectation: The dashboard of the user should appear and says 'hello' to the user.
 * This test requires a running application on 'http://localhost:3000' and the user 'max@mustermann.com'
 * with the password 'max' must exist.
 * According to the following links the 'browser' object should NOT be closed manually:
 * http://webdriver.io/guide/testrunner/browserobject.html
 * https://github.com/webdriverio/webdriverio/issues/1206
 */

const webdriverio = require('webdriverio');

describe('Login test (end-to-end)', () => {
    it('Test that a user can login', () => {
        browser.url('http://localhost:3000/login');
        expect(browser.getTitle()).toBe('Tauschbörse');

        browser.setValue('input[type="text"][name="email"]', 'max@mustermann.com');
        expect(browser.getValue('input[type="text"][name="email"]')).toBe('max@mustermann.com');

        browser.setValue('input[type="password"][name="currentPassword"]', 'max');
        expect(browser.getValue('input[type="password"][name="currentPassword"]')).toBe('max');

        browser.click('button[type="submit"]');
        expect(browser.getText('.dashboard__text')).toBe('Hallo Max Mustermann');
    });
});
