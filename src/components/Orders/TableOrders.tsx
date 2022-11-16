import * as React from "react";
import { item } from "../Form/Form";
import { TableOrder } from "./TableOrder";
interface Props {
  orderID: number;
  tableOrders: item[];
  onDelete: Function;
  updateOrder: Function;
}
export function TableOrders({
  tableOrders,
  onDelete,
  updateOrder,
  orderID,
}: Props) {
  return (
    <>
      {tableOrders.map((tableOrder) => (
        <TableOrder
          key={tableOrder.itemID}
          orderID={orderID}
          tableOrder={tableOrder}
          onDelete={onDelete}
          updateOrder={updateOrder}
        />
      ))}
    </>
  );
}
