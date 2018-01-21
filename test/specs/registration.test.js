/**
 * This end-to-end test goes through the registration process. It goes to the registration page, fills the
 * registration form and clicks the registration button. After successful creation process the user will be
 * logged out and it tries to login with the recently created user. After successful login the user will be
 * logged out again. During the registration it creates a random user name with the password 'super_secret'.
 * This test requires a running application on 'http://localhost:3000'.
 * According to the following links the 'browser' object should NOT be closed manually:
 * http://webdriver.io/guide/testrunner/browserobject.html
 * https://github.com/webdriverio/webdriverio/issues/1206
 */

const webdriverio = require('webdriverio');
const uuid = require('uuid');

const commonAsserts = require('./commonAsserts');

describe('Registration test (end-to-end)', () => {
    it('Test that a user can create an account', () => {
        const userUuid = uuid.v1();
        const name = `Benutzer ${userUuid}`;
        const email = `${userUuid}@user.com`;
        const password = 'super_secret';

        commonAsserts.goToStartPage();

        // Go to registration page and fill the registration form
        browser.click('button[data-button-id="registration"]');

        browser.waitForExist('.registration-form__title', 5000);
        expect(browser.getText('.registration-form__title')).toBe('Bitte gib zur Registrierung deine Benutzerdaten ein:');

        browser.setValue('input[type="text"][name="name"]', name);
        expect(browser.getValue('input[type="text"][name="name"]')).toBe(name);

        browser.setValue('input[type="text"][name="email"]', email);
        expect(browser.getValue('input[type="text"][name="email"]')).toBe(email);

        browser.setValue('input[type="password"][name="newPassword"]', password);
        expect(browser.getValue('input[type="password"][name="newPassword"]')).toBe(password);

        browser.setValue('input[type="password"][name="passwordConfirmation"]', password);
        expect(browser.getValue('input[type="password"][name="passwordConfirmation"]')).toBe(password);

        // Click submit button which opens the dashboard of the new user
        browser.click('button[type="submit"]');

        // Check the greeting on the dashboard
        browser.waitForExist('.page-title', 5000);
        expect(browser.getText('.page-title')).toBe(`Hallo ${name}`);

        // Logout by clicking the logout button on the dashboard
        commonAsserts.assertLogout();

        // Login and logout again with the newly created user
        commonAsserts.assertLogin(name, email, password);
        commonAsserts.assertLogout();
    });
});
