import * as React from "react";
import { AiFillDelete } from "react-icons/ai";
import { item } from "../Form/Form";
import styles from "./Orders.module.css";
interface Props {
  orderID: number;
  tableOrder: item;
  onDelete: Function;
  updateOrder: Function;
}
export function TableOrder({
  orderID,
  tableOrder,
  onDelete,
  updateOrder,
}: Props) {
  return (
      <tr>
        <td>
          <input
            type="text"
            placeholder="Product"
            value={tableOrder.productName}
            name="item"
            onChange={(e) => {
              updateOrder(orderID, e, tableOrder.itemID, "productName");
            }}
            required
          />
        </td>
        <td>
          <input
            type="number"
            placeholder="20"
            value={tableOrder.price === 0 ? "" : tableOrder.price}
            name="item"
            onChange={(e) => {
              updateOrder(orderID, e, tableOrder.itemID, "price");
            }}
            required
          />
        </td>
        <td>
          <input
            type="number"
            placeholder="1"
            value={tableOrder.qty === 0 ? "" : tableOrder.qty}
            name="item"
            onChange={(e) => {
              updateOrder(orderID, e, tableOrder.itemID, "qty");
            }}
            required
          />
        </td>
        <td className={styles.orderInput}>
          {tableOrder.price * tableOrder.qty}
          <AiFillDelete
            style={{ fontSize: "120%", float: "right" }}
            onClick={() => {
              onDelete(tableOrder.itemID);
            }}
          />
        </td>
      </tr>
  );
}
