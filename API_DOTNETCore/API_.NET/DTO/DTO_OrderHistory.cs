using System;
using System.ComponentModel.DataAnnotations;

namespace API_.NET.DTO
{
    public class DTO_OrderHistory
    {


        [Key]
        public int OrderId { get; set; }
        public int CustomerId { get; set; }
        public int ShipperId { get; set; }
        public int StoreId { get; set; }
        public string OrderCode { get; set; }
        public int OrderStatus { get; set; }
        public int OrderTotal { get; set; }
        public string DeliveryAddress { get; set; }
        public DateTime DeliveryDate { get; set; }
        public string ReceiverName { get; set; }
        public string ReceiverPhone { get; set; }
        public DateTime CreateDate { get; set; }
        public string ShipperName { get; set; }
        public string StoreName { get; set; }

        public DTO_OrderHistory() { }

        public DTO_OrderHistory(int orderId, int customerId, int shipperId, int storeId, string orderCode, int orderStatus, int orderTotal, string deliveryAddress, DateTime deliveryDate, string receiverName, string receiverPhone, DateTime createDate, string shipperName, string storeName)
        {
            OrderId = orderId;
            CustomerId = customerId;
            ShipperId = shipperId;
            StoreId = storeId;
            OrderCode = orderCode;
            OrderStatus = orderStatus;
            OrderTotal = orderTotal;
            DeliveryAddress = deliveryAddress;
            DeliveryDate = deliveryDate;
            ReceiverName = receiverName;
            ReceiverPhone = receiverPhone;
            CreateDate = createDate;
            ShipperName = shipperName;
            StoreName = storeName;
        }
    }
}
