const stripe = Stripe(
  'pk_test_51QweO1D8vJLqzde2Ht40l3XVxnNYARkkQV5Kbk9gq0ynNsI22DOWiTbmew7XZFHjjGHlMx2e9W3MhmGUvzHTJ8xs00dd5zfJSJ',
);
const bookTour = async (tourId) => {
  try {
    // 1) get checkout session from server
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`,
    );
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
    console.log(session);
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};

const bookBtn = document.getElementById('book-tour');

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
