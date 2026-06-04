/* eslint-disable @typescript-eslint/no-unused-expressions */
describe('Auth Test Suite', () => {
    const testRunId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const testEmail = `auth-test-${testRunId}@test.com`;
    const testPassword = 'SecurePassword123!';
    const testName = 'Auth Test User';

    before(() => {        cy.request({
            method: 'POST',
            url: '/api/register',
            body: {
                name: testName,
                email: testEmail,
                password: testPassword,
                company_name: 'Auth Testing Corp',
            },
        }).then((res) => {
            expect(res.status).to.eq(201);
        });
    });
    after(() => {
        cy.request({
            method: 'POST',
            url: '/api/register',
            body: {
                name: 'cleanup-marker',
                email: testEmail,
                password: testPassword,
            },
            failOnStatusCode: false, // Already exists = 400, that's fine
        });
      });

    beforeEach(() => {
        cy.visit('/login');
    });

    describe('1. Login Page UI & E2E Functionality', () => {
        it('should validate form fields on the client side', () => {
            // Attempt submission with empty fields
            cy.get('button[type="submit"]').click();
            cy.get('#email').then(($el) => {
                const el = $el[0] as HTMLInputElement;
                expect(el.checkValidity()).to.be.false;
                expect(el.validationMessage).to.not.be.empty;
            });

            // Enter an invalid email format and assert invalidity
            cy.get('#email').type('invalid-email-format');
            cy.get('#password').type(testPassword);
            cy.get('button[type="submit"]').click();
            cy.get('#email').then(($el) => {
                const el = $el[0] as HTMLInputElement;
                expect(el.checkValidity()).to.be.false;
                expect(el.validationMessage).to.contain('email');
            });
        });

        // Verify generic error messages for invalid login
        it('should show generic error messages for invalid login without revealing internal system details', () => {
            cy.intercept('POST', '**/api/auth/callback/credentials*').as('failedLoginReq');

            cy.get('#email').type(testEmail);
            cy.get('#password').type('WrongPassword999!');
            cy.get('button[type="submit"]').click();

            cy.wait('@failedLoginReq').then((interception) => {
                expect(interception.response?.statusCode).to.be.oneOf([401, 400, 200, 302]);
                const bodyStr = JSON.stringify(interception.response?.body || '');
                expect(bodyStr).to.not.contain('Stack Trace');
                expect(bodyStr).to.not.contain('at ');
                expect(bodyStr).to.not.contain('PrismaClient');
                expect(bodyStr).to.not.contain('SQL');
            });
            cy.get('[data-testid="error-message"]').should('be.visible').and(($el) => {
                const text = $el.text().toLowerCase();
                expect(text).to.satisfy((t: string) => {
                    return t.includes('configuration') || t.includes('salah') || t.includes('credentials') || t.includes('gagal');
                });
                expect(text).to.not.contain('stack');
                expect(text).to.not.contain('database');
            });
        });
        it('should disable the submit button during API network requests to prevent double-submission', () => {
            cy.intercept('POST', '**/api/auth/callback/credentials*', (req) => {
                req.on('response', (res) => {
                    res.setDelay(2000);
                });
            }).as('delayedLoginReq');

            cy.get('#email').type(testEmail);
            cy.get('#password').type(testPassword);
            cy.get('button[type="submit"]').click();
            cy.get('button[type="submit"]')
                .should('be.disabled')
                .and('contain', 'Masuk...');

                    cy.wait('@delayedLoginReq');
        });

        it('should successfully log in and redirect with valid credentials', () => {
            cy.get('#email').type(testEmail);
            cy.get('#password').type(testPassword);
            cy.get('button[type="submit"]').click();

            // Confirm redirect to dashboard/home page
            cy.url().should('eq', Cypress.config().baseUrl + '/');
        });
    });
    describe('2. API Data Exposure & Minimization', () => {
        it('should not expose sensitive user attributes in auth network responses', () => {
            cy.intercept('POST', '**/api/auth/callback/credentials*').as('credentialsReq');

            cy.get('#email').type(testEmail);
            cy.get('#password').type(testPassword);
            cy.get('button[type="submit"]').click();

            cy.wait('@credentialsReq').then((interception) => {
                const responseBody = interception.response?.body;
                if (responseBody) {
                    const verifyMinimization = (obj: any) => {
                        if (!obj || typeof obj !== 'object') return;

                        const blacklistedKeys = [
                            'password',
                            'password_hash',
                            'passwordHash',
                            'salt',
                            'reset_token',
                            'resetToken',
                            'reset_tokens',
                            'admin_flags',
                            'isAdmin',
                            'role'
                        ];

                        blacklistedKeys.forEach(key => {
                            expect(obj).to.not.have.property(key);
                            expect(obj[key]).to.be.undefined;
                        });

                        Object.keys(obj).forEach(k => {
                            if (typeof obj[k] === 'object') {
                                verifyMinimization(obj[k]);
                            }
                        });
                    };

                    verifyMinimization(responseBody);
                }
            });
        });

        it('should enforce data minimization and strict schema on registration endpoints', () => {
            const freshEmail = `api-test-${Date.now()}@test.com`;

            cy.request({
                method: 'POST',
                url: '/api/register',
                body: {
                    name: 'Schema Validator User',
                    email: freshEmail,
                    password: 'SuperSecurePassword456!',
                    company_name: 'Integrity Checking Co',
                }
            }).then((res) => {
                expect(res.status).to.eq(201);

                const body = res.body;
                expect(body).to.have.property('message', 'Akun Berhasil Dibuat!');
                expect(body).to.have.property('user');

                const user = body.user;
                expect(user).to.have.property('id');
                expect(user).to.have.property('email', freshEmail);
                expect(user).to.have.property('name', 'Schema Validator User');

                const sensitiveFields = ['password', 'password_hash', 'salt', 'passwordHash', 'company_name'];
                sensitiveFields.forEach((field) => {
                    expect(user).to.not.have.property(field);
                    expect(user[field]).to.be.undefined;
                });
            });
        });

        it('should mask detailed database errors on user endpoints', () => {
            cy.request({
                method: 'POST',
                url: '/api/register',
                body: {
                    name: 'Duplicate Register',
                    email: testEmail, // Already registered in 'before' block
                    password: 'some-password',
                },
                failOnStatusCode: false
            }).then((res) => {
                expect(res.status).to.eq(409);

                const responseString = JSON.stringify(res.body);
                expect(responseString).to.not.contain('PrismaClientValidationError');
                expect(responseString).to.not.contain('Unique constraint failed');
                expect(responseString).to.not.contain('pg_');
                expect(responseString).to.not.contain('user_email_key');
                expect(responseString).to.not.contain('stack');
            });
        });
    });

    describe('3. NextAuth Session Security', () => {
        
        beforeEach(() => {
            cy.loginProgrammatically(testEmail, testPassword);
        });

        it('should expose only safe identifiers in /api/auth/session payload', () => {
            cy.request('/api/auth/session').then((res) => {
                expect(res.status).to.eq(200);

                if (res.body && res.body.user) {
                    const user = res.body.user;

                    expect(user).to.have.property('name', testName);
                    expect(user).to.have.property('email', testEmail);
                    expect(user).to.have.property('id');

                    const blacklist = ['password', 'password_hash', 'salt', 'passwordHash', 'role', 'isAdmin'];
                    blacklist.forEach((key) => {
                        expect(user).to.not.have.property(key);
                        expect(user[key]).to.be.undefined;
                    });
                }
            });
        });

        it('should enforce strict security attributes on the NextAuth session token cookie', () => {
            cy.getCookies().then((cookies) => {
                const sessionCookie = cookies.find(
                    (c) => c.name.includes('session-token')
                );

                expect(sessionCookie).to.exist;

                if (sessionCookie) {
                    expect(sessionCookie.httpOnly).to.be.true;
                    expect(sessionCookie.sameSite).to.be.oneOf(['lax', 'strict']);

                    if (Cypress.config('baseUrl')!.startsWith('https')) {
                        expect(sessionCookie.secure).to.be.true;
                    }

                    const nowInSecs = Math.floor(Date.now() / 1000);
                    expect(sessionCookie.expiry).to.be.greaterThan(nowInSecs);

                    const thirtyDaysInSecs = 30 * 24 * 60 * 60;
                    expect(sessionCookie.expiry).to.be.lessThan(nowInSecs + thirtyDaysInSecs + 3600);
                }
            });
        });
    });
});
