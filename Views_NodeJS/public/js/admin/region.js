let userChart = null;
let shipperChart = null;
let storeChart = null;

const defaultChartData = [1, 1, 1, 1];

const chartOptions = (data = [], title) => ({
	type: 'pie',
	data: {
		labels: ['Vùng xanh', 'Vùng vàng', 'Vùng cam', 'Vùng đỏ'],
		datasets: [
			{
				data,
				backgroundColor: [
					'rgb(73, 231, 165)',
					'rgb(255, 205, 86)',
					'rgb(247, 92, 30)',
					'rgb(233, 51, 51)',
				],
				borderColor: 'transparent',
				hoverOffset: 4,
				spacing: 0,
			},
		],
	},
	options: {
		responsive: true,
		maintainAspectRatio: true,
		plugins: {
			title: {
				display: true,
				text: title,
				font: {
					size: 18,
				},
			},
		},
	},
});

function loadInitChart() {
	userChart = new Chart(
		document.getElementById('userChart').getContext('2d'),
		chartOptions(defaultChartData, 'Khách hàng'),
	);
	shipperChart = new Chart(
		document.getElementById('shipperChart').getContext('2d'),
		chartOptions(defaultChartData, 'Shipper'),
	);
	storeChart = new Chart(
		document.getElementById('storeChart').getContext('2d'),
		chartOptions(defaultChartData, 'Cửa hàng'),
	);
}

function renderChart(chartId, data, title) {
	switch (chartId) {
		case 'userChart':
			userChart && userChart.destroy();
			userChart = new Chart(
				document.getElementById(chartId).getContext('2d'),
				chartOptions(data, title),
			);
			break;
		case 'shipperChart':
			shipperChart && shipperChart.destroy();
			shipperChart = new Chart(
				document.getElementById(chartId),
				chartOptions(data, title),
			);
			break;
		case 'storeChart':
			storeChart && storeChart.destroy();
			storeChart = new Chart(
				document.getElementById(chartId),
				chartOptions(data, title),
			);
	}
}

function statisticData(charId, title, chartBoxId, userType, provinceId) {
	function handlerError() {
		const chart = Chart.getChart(charId);
		chart?.destroy();

		const canvas = document.getElementById(charId);
		const ctx = canvas.getContext('2d');
		ctx.textAlign = 'center';
		ctx.fillText('Không có dữ liệu', canvas.width / 2, canvas.height / 2);
	}

	myFetch(
		`${constant.JAVA_API_BASE_URL}/admin/statistic/region?userType=${userType}&provinceId=${provinceId}`,
	)
		.then(async (response) => {
			let userChartData = await response.json();
			if (!userChartData || userChartData.every((i) => i === 0)) {
				handlerError();
			} else {
				renderChart(charId, userChartData, title);
			}
		})
		.catch((e) => {
			handlerError();
		})
		.finally(() => {
			$(`#${chartBoxId}.chart-box`).removeClass('loading');
		});
}

function renderGreenRatioBox(greenRatioList) {
	let rateListHtml = '';

	greenRatioList.forEach((item) => {
		const { districtName, quantity, total } = item;
		const ratio = ((quantity / total) * 100).toFixed(0);
		rateListHtml += `<li class="rate-item">
					<div class="name">${districtName}</div>
					<div class="rate" style="width: ${ratio}%"> (${ratio}%) ${quantity} / ${total}</div>
				</li>`;
	});

	$('#greenRegionBox ul').html(rateListHtml);
}

async function statisticGreenRegionRatio(provinceId) {
	if (!provinceId || isNaN(Number(provinceId))) return;
	const msg = $('#msg');
	const box = $('#greenRegionBox.chart-box');

	msg.html('');

	try {
		const greenRatioList = await (
			await myFetch(
				`${constant.JAVA_API_BASE_URL}/admin/statistic/region/green-ratio/${provinceId}`,
			)
		)?.json();

		if (!greenRatioList || greenRatioList.length === 0) {
			msg.html('Thống kê dữ liệu thất bại, thử lại !');
			box.removeClass('loading');
		} else {
			box.removeClass('loading');
			renderGreenRatioBox(greenRatioList);
		}
	} catch (error) {
		msg.html('Thống kê dữ liệu thất bại, thử lại !');
		box.removeClass('loading');
	}
}

function onProvinceChange() {
	$('#province').change(async function () {
		const provinceId = Number($(this).val());
		$('.chart-box').addClass('loading');

		statisticData(
			'userChart',
			'Khách hàng',
			'userBox',
			constant?.USER_TYPES?.CUSTOMER || 1,
			provinceId,
		);

		statisticData(
			'shipperChart',
			'Shipper',
			'shipperBox',
			constant?.USER_TYPES?.SHIPPER || 2,
			provinceId,
		);

		statisticData(
			'storeChart',
			'Cửa hàng',
			'storeBox',
			constant?.USER_TYPES?.STORE || 3,
			provinceId,
		);

		statisticGreenRegionRatio(provinceId);
	});
}

$(document).ready(function () {
	$('select').selectize();
	onProvinceChange();
	loadInitChart();
});
