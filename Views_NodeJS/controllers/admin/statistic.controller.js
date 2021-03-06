const commonApi = require('../../apis/common.api');

const statisticApi = require('../../apis/admin/statistic.api');
const { GROUP_TYPES } = require('../../constants/index.constant');

exports.getRegionStatistic = async (req, res) => {
  try {
    const provinces = (await (await commonApi.getAllProvince())?.data) || [];

    return res.render('./admin/region.pug', {
      provinces,
    });
  } catch (error) {
    console.error('Function getRegionStatistic Error: ', error);
    return res.render('404');
  }
};

exports.getIncome = async (req, res) => {
  try {
    const resApi = (await (await statisticApi.getIncome())?.data) || [];
    const revenue = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const income = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var x in resApi) {
      const month = new Date(resApi[x].paymentTime).getMonth();
      revenue[month] += resApi[x].totalMoney;
      income[month] +=
        resApi[x].totalMoney - resApi[x].shippingMoney - resApi[x].orderTotal;
    }
    return res.render('./admin/income.pug', {
      revenue,
      income,
    });
  } catch (error) {
    console.error('Function getIncome Error: ', error);
    return res.render('404');
  }
};

exports.getProductStatistic = async (req, res) => {
  try {
    const labels = [
      'Thịt, cá, hải sản',
      'Rau, củ, trái cây',
      'Đồ uống',
      'Bánh kẹo',
      'Mì, cháo, phở, bún',
      'Dầu ăn, gia vị',
      'Gạo, bột, đồ khô',
      'Đồ gia dụng',
    ];

    return res.render('admin/product', {
      group: GROUP_TYPES,
    });
  } catch (error) {
    return res.render('404');
  }
};

exports.getProductEachType = async (req, res) => {
  try {
    const response = await commonApi.getProductEachType(req.query.group);
    return res.send(response.data);
  } catch (error) {
    return [];
  }
};

exports.getProductDemand = async (req, res) => {
  try {
    const apiRes = await statisticApi.getProductDemand();
    let products = [];
    let quantities = [];

    apiRes.data?.forEach((data) => {
      products.push(GROUP_TYPES.find((i) => i.id === Number(data[0])).label);
      quantities.push(Number(data[1]));
    });

    return res.render('./admin/product-demand-stats.pug', {
      products: JSON.stringify(products),
      quantities,
    });
  } catch (error) {
    console.error('Function getProductDemand Error: ', error);
    return res.render('404');
  }
};
