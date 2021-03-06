package api.java.apis.admin;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import api.java.constants.AppConstants;
import api.java.dto.AccountDto;
import api.java.dto.OrderDetailDto;
import api.java.dto.OrderDetailInfoDto;
import api.java.dto.PaginationDto;
import api.java.entities.Account;
import api.java.entities.AppUser;
import api.java.entities.CusOrder;
import api.java.entities.ProductImage;
import api.java.entities.Shipper;
import api.java.entities.Payment;
import api.java.repositories.AccountRepository;
import api.java.repositories.AppUserRepository;
import api.java.repositories.CusOrderRepository;
import api.java.repositories.PaymentRepository;
import api.java.repositories.ProductImageRepository;
import api.java.repositories.ShipperRepository;
import api.java.repositories.StoreRepository;
import api.java.services.admin.ManageService;
import api.java.utils.Pagination;

@RestController
@RequestMapping(path = "/api/admin/management")
public class ManageApi {
    @Autowired
    private ManageService manageService;

    @Autowired
    private CusOrderRepository cOrderRepository;

    @Autowired
    private AppUserRepository cAppUserRepository;

    @Autowired
    private ShipperRepository cShipperRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private ShipperRepository shipperRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private PaymentRepository cPaymentRepository;

    @GetMapping(path = "/order")
    public PaginationDto<CusOrder> getOrderInfor(@RequestParam(name = "p", defaultValue = "1") int page) {
        Pagination<CusOrder> cpage = new Pagination<>();
        List<CusOrder> data = cOrderRepository.findAll();
        PaginationDto<CusOrder> result = cpage.paging(data, AppConstants.PAGE_SIZE, page);
        return result;
    }

    @GetMapping(path = "/orderDetail")
    public OrderDetailDto<OrderDetailInfoDto> getOrderInfo(@RequestParam(name = "oid", defaultValue = "1") int oid) {
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

    @GetMapping(path = "/order/shipping-money")
    public int getShippingMoney(@RequestParam int orderId) {
        Payment p = cPaymentRepository.findByOrderId(orderId);
        return p.getShippingMoney();
    }

    @GetMapping(path = "/account")
    public PaginationDto<Account> getAccounts(@RequestParam(defaultValue = "1") int userType,
            @RequestParam(defaultValue = "1") int page) {
        if (page <= 0) {
            page = 1;
        }
        Pagination<Account> accountPage = new Pagination<>();
        List<Account> accounts = accountRepository.findByAccountType(userType);
        PaginationDto<Account> result = accountPage.paging(accounts, AppConstants.PAGE_SIZE, page);
        return result;
    }

    @GetMapping(path = "/account/info")
    public Account getAccountInfo(@RequestParam(defaultValue = "1") int accountId) {
        try {
            return accountRepository.findByAccountId(accountId);
        } catch (Exception e) {
            return new Account();
        }
    }

    @GetMapping(path = "/account/detail")
    public <Any> Any getUserInfo(@RequestParam(defaultValue = "1") int accountId) {
        return (Any) manageService.getUserInfo(accountId);
    }

    @GetMapping(path = "/account/accept")
    public PaginationDto<AccountDto> getAccountNeedAccepting(@RequestParam(defaultValue = "2") int type,
            @RequestParam(defaultValue = "1") int page) {
        return manageService.getAccountNeedAccepting(type, page);
    }

    @GetMapping(path = "/account/accept/accepted")
    public int changeStatus(@RequestParam int status, @RequestParam int id, @RequestParam int type) {
        try {
            if (type == 2) {
                shipperRepository.updateStatus(status, id);
                return 1;
            } else {
                storeRepository.updateStatus(status, id);
                return 1;
            }
        } catch (Exception e) {
            System.out.println("----------" + e);
            return 0;
        }
    }

    @GetMapping(path = "/order/detail/image")
    public ProductImage getProductThumbnail(@RequestParam int productId) {
        try {
            List<ProductImage> images = productImageRepository.findAllByProductId(productId);
            for (ProductImage productImage : images) {
                if (productImage.getIsThumbnail() == true) {
                    return productImage;
                }
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }
}
