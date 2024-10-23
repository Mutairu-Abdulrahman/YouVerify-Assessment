describe('OpenCart E2E Test', () => {
  beforeEach(() => {
    cy.visit('https://demo.opencart.com'); // Navigate to the site
  });

  // Handle uncaught exceptions to prevent test failures
  Cypress.on('uncaught:exception', (err, runnable) => {
    console.error('Uncaught exception:', err.message);
    return false; // Prevent Cypress from failing the test
  });

  it('Validate logo and add product to cart', ()=>{

      // Assertions for logo and cart element 
      cy.get('img[title="Your Store"]').should('be.visible') 
      cy.get('.btn.btn-lg.btn-inverse.btn-block.dropdown-toggle').should('be.visible')

      // View first product and add to cart
      cy.get('.img-fluid[title="MacBook"]').click()
      cy.get("div[class='col-sm'] h1").should('contain', 'MacBook')
      cy.get('#button-cart').should('be.visible').click()

      // check to increase quantity
      cy.get('#button-cart').click()

      // Search to add to cart
      cy.get('input[name="search"]').type('iPhone{enter}')
      cy.get('[formaction="https://demo.opencart.com/en-gb?route=checkout/cart.add"]').click()
      
      // Assert that the product was added to the cart successfully
      cy.wait(1000)
      cy.get('.alert').should('contain', 'Success')
      cy.wait(1000)

      // Go to cart page
      cy.get('button[data-bs-toggle="dropdown"]').click({force:true}); // Open cart dropdown
      cy.contains('View Cart').click()
      cy.contains('Shopping Cart').should('be.visible')

      // go to checkout page
      cy.contains('Checkout').click()
      cy.contains('Checkout').should('be.visible')
      cy.get('#input-guest').check()  // to select checkout as guest

      // fill up personal details as guest
      cy.get('#input-firstname').type('Mutairu')
      cy.get('#input-lastname').type('Abdulrahman')
      cy.get('#input-email').type('mutty@gmail.com')

      // fill up shipping address
      cy.get('#input-shipping-company').type('YouVerify')
      cy.get('#input-shipping-address-1').type('Maryland')
      cy.get('#input-shipping-city').type('Ikeja')
      cy.get('#input-shipping-postcode').type(12345)
      cy.get('#input-shipping-country').select('Nigeria')
      cy.get('.form-select[name="shipping_zone_id"]').select('Lagos',{ force: true })
      cy.get('#button-register').click()

      // select shipping method
      cy.get('#button-shipping-methods').click()
      cy.get('#input-shipping-method-flat-flat').check({ force: true })
      cy.get('#button-shipping-method').click()

      // select payment method
      cy.get('#button-payment-methods').click()
      cy.get('#input-payment-method-cod-cod').check({ force: true })
      cy.get('#button-payment-method').click()
      cy.get('#input-comment').type('Please deliver withing two days so i can give a good rating....')

      // confirm order
      cy.get('#button-confirm').click()
      cy.get("div[id='content'] h1").should('have.text', 'Your order has been placed!')
      cy.get('.btn.btn-primary').click()
  })

  it('Should display error message for empty cart checkout', () => {
        // Navigate to checkout directly without adding products
        cy.visit('https://demo.opencart.com/index.php?route=checkout/checkout');
    
        // Verify the correct error message is displayed
        cy.get("div[id='content'] p").should('contain', 'Your shopping cart is empty!');
      });

});
