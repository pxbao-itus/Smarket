const { axiosJava, axiosCSharp } = require('../apis/axiosClient');
const { JWT_HEADER } = require('../constants/index.constant');

const BASE_URL = '/auth';

const authApi = {
	login: (username, password) => {
		return axiosJava.post(`${BASE_URL}/login`, {
			username,
			password,
		});
	},

	authorization: (jwt) => {
		return axiosJava.get(`${BASE_URL}/authorization`, {
			headers: {
				[JWT_HEADER]: jwt,
			},
		});
	},

	signup: (account) => {
		return axiosCSharp.post(`${BASE_URL}/signup`, account);
	},

	createUser: (user) => {
		return axiosCSharp.post(`${BASE_URL}/user/create`, user);
	},

	createCustomer: (customer) => {
		return axiosCSharp.post(`${BASE_URL}/user/customer`, customer);
	},

	createShipper: (shipper) => {
		return axiosCSharp.post(`${BASE_URL}/user/shipper`, shipper);
	},

	createStore: (store) => {
		return axiosCSharp.post(`${BASE_URL}/user/store`, store);
	}
};

module.exports = authApi;
