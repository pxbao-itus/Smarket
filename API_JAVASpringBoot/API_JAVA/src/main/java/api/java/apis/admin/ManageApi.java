package api.java.apis.admin;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import api.java.services.admin.ManageService;
import api.java.constants.AppConstants;
import api.java.dto.ManageOrderDto;
import api.java.dto.OrderDetailDto;
import api.java.dto.OrderDetailInfoDto;
import api.java.dto.PaginationDto;
import api.java.entities.AppUser;
import api.java.entities.CusOrder;
import api.java.entities.Shipper;
import api.java.repositories.AppUserRepository;
import api.java.repositories.CusOrderRepository;
import api.java.repositories.ShipperRepository;
import api.java.utils.Pagination;

@RestController
@RequestMapping(path = "/api/admin/management")
public class ManageApi {
    @Autowired
    private ManageService manageService;

	@Autowired
    private CusOrderRepository cOrderRepository;
    
	@Autowired
    private  AppUserRepository  cAppUserRepository;

    @Autowired
    private  ShipperRepository  cShipperRepository;

    

    
	@GetMapping(path = "/order")
	public PaginationDto<CusOrder> getOrderInfor(@RequestParam(name = "p", defaultValue = "1") int page) {
		if (page <= 0) {
            page = 1;
        }
		Pagination<CusOrder> cpage = new Pagination<>();
		List<CusOrder> data = cOrderRepository.findAll();
		PaginationDto<CusOrder> result = cpage.paging(data, AppConstants.PAGE_SIZE, page);
		return result;
	}

    @GetMapping(path = "/orderDetail")
    public OrderDetailDto getOrderInfo(@RequestParam(name = "oid", defaultValue = "1") int oid) {
        CusOrder orderInfor = cOrderRepository.findById(oid);
        LocalDateTime createDate = orderInfor.getCreateDate();
        int orderStatus = orderInfor.getOrderStatus();
        int shipperId = orderInfor.getShipperId();

        Shipper shipperInfor = cShipperRepository.getById(shipperId);

        
        AppUser userInfor = cAppUserRepository.getById(shipperInfor.getUserId());

        String receiverName = orderInfor.getReceiverName();
        String receiverPhone = orderInfor.getReceiverPhone();
        String orderCode = orderInfor.getOrderCode();
        String shipperName = userInfor.getName();
        String shipperPhone = userInfor.getPhone();


        List<OrderDetailInfoDto> listOrder;
        listOrder = manageService.getOrderInfo(oid);

        OrderDetailDto<OrderDetailInfoDto> result = new OrderDetailDto<>();

        result.setCusName(receiverName);
        result.setCusPhone(receiverPhone);
        result.setShipperName(shipperName);
        result.setShipperPhone(shipperPhone);
        result.setStatus(orderStatus);
        result.setCreateDate(createDate);
        result.setOrderCode(orderCode);
        result.setData(listOrder);

        return result;
    }
}