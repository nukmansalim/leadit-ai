/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Programmatic login via NextAuth credentials API.
             * Bypasses the UI entirely — sets the session cookie directly.
             */
            loginProgrammatically(email: string, password: string): Chainable<void>;
        }
    }
}

Cypress.Commands.add('loginProgrammatically', (email: string, password: string) => {
    // Step 1: Get the CSRF token from NextAuth
    cy.request('/api/auth/csrf').then((csrfRes) => {
        const csrfToken = csrfRes.body.csrfToken;

        // Step 2: POST to the credentials callback directly
        cy.request({
            method: 'POST',
            url: '/api/auth/callback/credentials',
            form: true,
            body: {
                email,
                password,
                csrfToken,
                json: true,
            },
            followRedirect: true,
        }).then(() => {
            // Session cookie is now set — verify it exists
            cy.getCookie('authjs.session-token').should('exist');
        });
    });
});

export {};
