/**
 * This end-to-end test goes through the login process. It goes to the login page, fills the login form and clicks
 * the login button. After successful login process the user will be logged out again.
 * This test requires a running application on 'http://localhost:3000' and the user 'max@mustermann.com'
 * with the password '1234' must exist.
 * According to the following links the 'browser' object should NOT be closed manually:
 * http://webdriver.io/guide/testrunner/browserobject.html
 * https://github.com/webdriverio/webdriverio/issues/1206
 */

const webdriverio = require('webdriverio');

const commonAsserts = require('./commonAsserts');

describe('Login test (end-to-end)', () => {
    it('Test that a user can login', () => {
        commonAsserts.goToStartPage();
        commonAsserts.assertLogin('Max Mustermann', 'max@mustermann.com', '1234');
        commonAsserts.assertLogout();
    });
});
