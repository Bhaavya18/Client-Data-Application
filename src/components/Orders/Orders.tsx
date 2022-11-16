import * as React from "react";
import { order } from "../Form/Form";
import { Order } from "./Order";
interface Props {
  orders: order[];
  deleteOrder: Function;
  updateOrder: Function;
  updateOrderItems: Function;
  deleteOrderItem: Function;
}
export function Orders({
  orders,
  deleteOrder,
  updateOrder,
  updateOrderItems,
  deleteOrderItem,
}: Props) {
  return (
    <>
      {orders.map((order) => (
        <Order
          key={order.orderID}
          order={order}
          deleteOrder={deleteOrder}
          updateOrder={updateOrder}
          updateOrderItems={updateOrderItems}
          deleteOrderItem={deleteOrderItem}
        />
      ))}
    </>
  );
}
