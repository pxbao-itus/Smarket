const commonApi = require('../apis/common.api');
const constants = require('../constants/index.constant');
const {
  formatCurrency,
  cloudinaryOptimize,
  formatDate,
} = require('../helpers/index.helper');

exports.getProvince = async (req, res) => {
  try {
    const province = await commonApi.getAllProvince();
    if (province) {
      return res.send(province.data);
    } else {
      return res.send([]);
    }
  } catch (error) {
    return res.send([]);
  }
};

exports.getDistrict = async (req, res) => {
  try {
    const district = await commonApi.getDistrict(req.query.provinceid);
    if (district) {
      return res.send(district.data);
    } else {
      return res.send([]);
    }
  } catch (error) {
    return res.send([]);
  }
};

exports.getWard = async (req, res) => {
  try {
    const ward = await commonApi.getWard(req.query.districtid);
    if (ward) {
      return res.send(ward.data);
    } else {
      return res.send([]);
    }
  } catch (error) {
    return res.send([]);
  }
};

exports.getHomeGuest = async (req, res) => {
  try {
    const productCategories = [];
    const promises = [];

    constants.GROUP_TYPES.forEach((gp, index) => {
      promises.push(
        commonApi.getProductsByGroupType(gp.id, 1, 8).then((apiRes) => {
          productCategories.push({
            groupTypeName: gp.label,
            groupTypeId: gp.id,
            products: apiRes.data || [],
          });
        })
      );
    });

    await Promise.all(promises);

    return res.render('home.pug', {
      productCategories,
      helpers: {
        formatCurrency,
        cloudinaryOptimize,
      },
    });
  } catch (error) {
    console.error('Function getHomeGuest Error: ', error);
    return res.render('404');
  }
};

exports.getProductPage = async (req, res) => {
  try {
    const productId = req.params['productId'];
    const response = await commonApi.getDetailProduct(productId);
    const imagesRes = await commonApi.getImagesOfProduct(productId);
    const soldRes = await commonApi.getProductSold(productId);
    const feedbackRes = await commonApi.getProductFeedback(productId);
    const storeRes = await commonApi.getProductStore(productId);
    
    const product = response.data;
    const typeRes = await commonApi.getProductType(product.productTypeId);
    const type = typeRes.data;
    const groupCartRes = await commonApi.getProductsByGroupType(type.groupType, Math.floor(Math.random()*3), Math.floor(Math.random()*6) + 3);
    const products = groupCartRes.data;
    let group;
    for (const item of constants.GROUP_TYPES) {
      if(item.id == type.groupType) {
        group = item.label;
        break;
      }
    }
    const images = imagesRes.data;
    let index = -1;
    for (let item of images) {
      item.index = ++index;
    }

    const sold = soldRes.data;
    let quantitySold = 0;
    for (const item of sold) {
      quantitySold += item.quantity;
    }

    let feedback = feedbackRes.data;
    const statisticFeedback = [0, 0, 0, 0, 0] 
      
    
    for (const item of feedback) {
      const star = parseInt(item.rating);
      statisticFeedback[star-1]++;
      item.rating = star;
    }
    const store = storeRes.data;
    const rating = parseFloat(product.productRating).toFixed(1);
    const reRating = Math.round(rating);
    console.log(store)
    return res.render('common/product', {
      helpers: {
        formatCurrency,
        formatDate,
        cloudinaryOptimize,
      },
      group,
      product,
      images,
      store,
      feedback,
      rating,
      reRating,
      statisticFeedback,
      quantitySold,
      quantityFeedback: feedback.length,
      products,
      type,
      title: `Chi tiết sản phẩm ${product.productName}`,

    })
  } catch (error) {
    return res.render('404');
  }
}

exports.productEachType = async (req, res) => {
  try {
    const groupId = req.params['groupId'];
    const type = req.query.type || '0';
    const page = 1;
    let productsRes;
    if(type === '0') {
      productsRes = await commonApi.getProductsByGroupType(groupId, 1, 12);
    } else {
      productsRes = await commonApi.getProductByType(type, 1, 12);
    }
    const products = productsRes.data;
    let title;
    for (const item of constants.GROUP_TYPES) {
      if(item.id == groupId) {
        title = item.label;
        break;
      }
    }
    const typesRes = await commonApi.getTypeByGroup(groupId);
    const types = typesRes.data;
    return res.render('common/product-type', {
      helpers: {
        formatCurrency,
        cloudinaryOptimize,
      },
      products,
      title: `Smarket | ${title}`,
      groupName: title,
      groupId,
      page,
      pageSize: 12,
      total: 100,
      types,




    });
  } catch (error) {
    console.log(error)
    return res.render('404');
  }
}

exports.viewMoreProducts = async (req, res) => {
  try {
    const page = req.query.page;
    const groupId = req.params['groupId'];
    let productsRes;
    if(req.query.type) {
      productsRes = await commonApi.getProductByType(groupId, page, 12)
    } else {
      productsRes = await commonApi.getProductsByGroupType(req.query.type, page, 12);
    }
    if(productsRes) {
      let products = productsRes.data;
      for (let item of products) {
        item.unitPrice = formatCurrency(item.unitPrice);
      }
      return res.send(productsRes.data);
    } else {
      return res.send(null);
    }
  } catch (error) {
    return res.send(null);
  }
}

exports.sortProducts = async (req, res) => {
  try {
    const page = req.query.page;
    const groupId = req.params['groupId'];
    let productsRes;
    if(!req.query.type) {
      productsRes = await commonApi.getProductByType(groupId, 1, parseInt(page) * 12)
    } else {
      productsRes = await commonApi.getProductsByGroupType(req.query.type, page, parseInt(page) * 12);
    }
    if(productsRes) {
      let products = productsRes.data;
      products.sort((item1, item2) => {
        if(req.query.order === '0') {
          return item2.unitPrice - item1.unitPrice;
        }
        return item1.unitPrice - item2.unitPrice;
      })
      for (let item of products) {
        item.unitPrice = formatCurrency(item.unitPrice);
      }
      return res.send(products);
    } else {
      return res.send(null);
    }
  } catch (error) {
    return res.send(null);
  }
}


exports.searchProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const page = 1;
    const productsRes = await commonApi.getProductsBySeach(keyword, page, 12);
    let products = productsRes.data || [];

    return res.render('common/product-search', {
      helpers: {
        formatCurrency,
        cloudinaryOptimize,
      },
      title: `Smarket | Tìm kiếm = ${keyword}`,
      products,
      total: 100,
      pageSize: 12,
      page,
      keyword,

    });
  } catch (error) {
    
  }
}

exports.viewMoreProductsSearch = async (req, res) => {
  try {
    const page = req.query.page;
    const keyword = req.query.keyword;
    let productsRes = await commonApi.getProductsBySeach(keyword, page, 12);
    
    if(productsRes) {
      let products = productsRes.data;
      for (let item of products) {
        item.unitPrice = formatCurrency(item.unitPrice);
      }
      return res.send(productsRes.data);
    } else {
      return res.send(null);
    }
  } catch (error) {
    return res.send(null);
  }
}

