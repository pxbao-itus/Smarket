const commonRoute = require('express').Router();
const commonController = require('../controllers/common.controller.js');

commonRoute.get('/province-all', commonController.getProvince);

commonRoute.get('/district', commonController.getDistrict);

commonRoute.get('/ward', commonController.getWard);

commonRoute.get('/product/:productId', commonController.getProductPage);

commonRoute.get('/categories/:groupId', commonController.productEachType);
commonRoute.get(
  '/categories/:groupId/view-more',
  commonController.viewMoreProducts
);
commonRoute.get('/categories/:groupId/sort', commonController.sortProducts);

commonRoute.get('/search', commonController.searchProducts);
commonRoute.get('/search/more', commonController.viewMoreProductsSearch);

commonRoute.get('/store/:storeId', commonController.getStoreInfo);

commonRoute.get('/cart', commonController.getCartPage);
commonRoute.get('/cart/product', commonController.getProductForCart);
commonRoute.get('/purchase', commonController.getCartPurchase);

commonRoute.get('/product-by-region', commonController.getProductsByRegion);
commonRoute.get(
  '/product-by-region/more',
  commonController.moreProductsByRegion
);

commonRoute.get('/contract', (req, res) => res.render('contract'));

module.exports = commonRoute;
