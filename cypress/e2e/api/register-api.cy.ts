describe('POST /api/register', () => {
    it('should create a new user', () => {
        cy.request({
            method: 'POST',
            url: '/api/register',
            body: {
                name: 'API User',
                email: `api-${Date.now()}@test.com`,
                password: 'password123',
                company_name: 'PT API Test',
            },
        }).then((res) => {
            expect(res.status).to.eq(201)
            expect(res.body.message).to.eq('Akun Berhasil Dibuat!')
            expect(res.body.user).to.have.property('email')
            expect(res.body.user).to.have.property('id')
            expect(res.body.user).to.not.have.property('password')
        })
    })
    it('should return 400 if email missing', () => {
        cy.request({
            method: 'POST',
            url: '/api/register',
            body: {
                password: 'password123',
            },
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(400)
            expect(res.body.message).to.eq('Data tidak Lengkap')
        })
    })
    it('should return 400 if password missing', () => {
        cy.request({
            method: 'POST',
            url: '/api/register',
            body: { email: 'nopass@test.com' },
            failOnStatusCode: false,
        }).then((res) => {
            expect(res.status).to.eq(400)
            expect(res.body.message).to.eq('Data tidak Lengkap')
        })
    })
    it('should return 400 for duplicate email', () => {
        const email = `dup-${Date.now()}@test.com`

        cy.request('POST', '/api/register', {
            email,
            password: 'pass123',
        })


        cy.request({
            method: 'POST',
            url: '/api/register',
            body: { email, password: 'pass123' },
            failOnStatusCode: false,
        }).then((res) => {
            expect(res.status).to.eq(400)
            expect(res.body.message).to.eq('akun sudah terdaftar')
        })
    })
    it('should handle optional fields', () => {
        cy.request({
            method: 'POST',
            url: '/api/register',
            body: {
                email: `minimal-${Date.now()}@test.com`,
                password: 'pass123',
            },
        }).then((res) => {
            expect(res.status).to.eq(201)
        })
    })
})