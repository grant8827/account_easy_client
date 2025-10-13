// Test Payment Flow - Console Script
// This can be run in the browser console to test payment functionality

// Function to simulate plan selection and navigate to payment
function testPaymentFlow(planName = 'Professional') {
    console.log('🧪 Testing payment flow...');
    
    // Clear any existing data
    localStorage.removeItem('selectedPlan');
    localStorage.removeItem('paymentDetails');
    
    // Create a test plan (simulating what PricingPage does)
    const testPlan = {
        name: planName,
        price: planName === 'Professional' ? 7500 : 2500,
        billing: 'monthly',
        features: [
            'Up to 25 employees',
            'Advanced payroll features',
            'All tax compliance features',
            'Advanced financial reports',
            'Priority email & phone support',
            'Up to 3 business registrations',
            'Employee self-service portal',
            'Data export capabilities'
        ]
    };
    
    // Store the plan
    localStorage.setItem('selectedPlan', JSON.stringify(testPlan));
    console.log('✅ Test plan stored:', testPlan);
    
    // Navigate to payment page
    if (window.location.pathname !== '/payment') {
        window.location.href = '/payment';
    } else {
        window.location.reload();
    }
}

// Function to test skip payment
function testSkipPayment() {
    console.log('🚀 Testing skip payment...');
    
    const skipPaymentDetails = {
        id: 'test_skip_payment',
        status: 'SKIPPED',
        payer: { email_address: 'test@example.com' },
        purchase_units: [{ 
            amount: { 
                value: '0.00', 
                currency_code: 'USD' 
            } 
        }],
        payment_method: 'setup_later',
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('paymentDetails', JSON.stringify(skipPaymentDetails));
    console.log('✅ Skip payment details stored:', skipPaymentDetails);
    
    // Navigate to register
    window.location.href = '/register';
}

// Function to check current storage state
function checkPaymentState() {
    console.log('🔍 Current payment state:');
    console.log('Selected Plan:', JSON.parse(localStorage.getItem('selectedPlan') || 'null'));
    console.log('Payment Details:', JSON.parse(localStorage.getItem('paymentDetails') || 'null'));
    console.log('Current Page:', window.location.pathname);
}

// Function to clear all payment data
function clearPaymentData() {
    localStorage.removeItem('selectedPlan');
    localStorage.removeItem('paymentDetails');
    console.log('🧹 Payment data cleared');
}

// Auto-run check on script load
console.log('💳 Payment Flow Test Script Loaded');
console.log('Available functions:');
console.log('- testPaymentFlow(planName?) - Test complete flow');
console.log('- testSkipPayment() - Test skip payment');
console.log('- checkPaymentState() - Check current state');
console.log('- clearPaymentData() - Clear all data');

// Check current state
checkPaymentState();