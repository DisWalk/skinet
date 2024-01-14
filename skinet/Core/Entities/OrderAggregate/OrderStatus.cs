using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace Core.Entities.OrderAggregate
{
    public enum OrderStatus
    {
        [EnumMember(Value ="Pending")]//to oveeride default 0,1,2 value
        Pending,
        
        [EnumMember(Value ="PaymentReceived")]
        PaymentReceived,
        
        [EnumMember(Value ="PaymentFailed")]
        PaymentFailed
    }
}