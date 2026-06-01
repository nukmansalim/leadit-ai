describe('Register Page', () => {
    beforeEach(() => {
        cy.visit('/register')
    })
    it('should display registration form', () => {
        cy.get('h1').should('contain', 'Daftar Akun Baru')
        cy.get('#name').should('be.visible')
        cy.get('#companyName').should('be.visible')
        cy.get('#email').should('be.visible')
        cy.get('#password').should('be.visible')
        cy.get('button[type="submit"]').should('contain', 'Daftar')
    })
    it('should register and redirect to login', () => {
        const email = `reg-${Date.now()}@test.com`
        cy.get('#name').type('Test User')
        cy.get('#companyName').type('PT Test')
        cy.get('#email').type(email)
        cy.get('#password').type('password123')
        cy.get('button[type="submit"]').click()

        cy.contains('Akun Berhasil Dibuat').should('be.visible')
        cy.url().should('include', '/login', { timeout: 5000 })
    })
    it('should show error for duplicate email', () => {
        const email = `dup-ui-${Date.now()}@test.com`

        // Buat user dulu via API (lebih cepat)                                                                           
        cy.request('POST', '/api/register', {
            name: 'Existing',
            email,
            password: 'pass123',

        })
        cy.get('#name').type('Duplicate User')
        cy.get('#email').type(email)
        cy.get('#password').type('pass123')
        cy.get('button[type="submit"]').click()

        cy.contains('akun sudah terdaftar').should('be.visible')
    })
    it('should navigate to login page', () => {
        cy.contains('Masuk').click()
        cy.url().should('include', '/login')
    })
})