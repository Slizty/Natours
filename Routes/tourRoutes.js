const express = require('express');
const Router = express.Router();
const authController = require('./../controllers/authController');
const tourController = require('./../controllers/tourController');
const reviewRouter = require('./../Routes/reviewRoutes');
// Router.param('id',tourController.checkID);

Router.use('/:tourId/reviews', reviewRouter);

Router.route('/top-5-cheap').get(
  tourController.aliasTopTours,
  tourController.GetAllTours,
);

Router.route('/tour-stats').get(tourController.getTourStats);

Router.route('/monthly-plan/:year').get(
  authController.protect,
  authController.restrictTo('admin', 'lead-guide', 'guide'),
  tourController.getMonthlyPlan,
);

Router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(
  tourController.getToursWithin,
);

Router.route('/')
  .get(tourController.GetAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.CreateTour,
  );

Router.route('/:id')
  .get(tourController.GetTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.UpdateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.DeleteTour,
  );

module.exports = Router;
