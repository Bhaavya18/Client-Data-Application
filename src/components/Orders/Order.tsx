import * as React from "react";
import { useState } from "react";
import { AiFillDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { order } from "../Form/Form";
import { TableOrders } from "./TableOrders";
import styles from "./Orders.module.css";
interface Props {
  order: order;
  deleteOrder: Function;
  updateOrder: Function;
  updateOrderItems: Function;
  deleteOrderItem: Function;
}
export function Order({
  order,
  deleteOrder,
  updateOrder,
  updateOrderItems,
  deleteOrderItem,
}: Props) {
  const [showOrders, setShowOrders] = useState(true);
  const onDelete = (id: number) => {
    deleteOrderItem(order.orderID, id);
  };
  const getButtonText = () => {
    if (showOrders) return "Hide";
    return "Show";
  };
  return (
    <div className={styles.orderBox}>
      <div>
        <button
          className={showOrders ? `${styles.hide}` : `${styles.show} `}
          onClick={(e) => {
            e.preventDefault();
            setShowOrders(!showOrders);
          }}
        >
          {getButtonText()}
        </button>
        <AiFillDelete
          className={styles.deleteIcon}
          onClick={() => {
            deleteOrder(order.orderID);
          }}
        />
      </div>
      <br />
      <div>
        <label>Date</label>
        <input
          type="date"
          style={{ width: "auto" }}
          name="date"
          value={order.date}
          className={styles.orderDate}
          onChange={(e) => {
            updateOrder(order.orderID, e, 0, "");
          }}
          required
        />
        {showOrders && (
          <table>
            <colgroup>
              <col span={1} style={{ width: "25%" }} />
              <col span={1} style={{ width: "25%" }} />
              <col span={1} style={{ width: "25%" }} />
              <col span={1} style={{ width: "25%" }} />
            </colgroup>
            <tbody>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>
                  Total Amount{" "}
                  <AiOutlinePlusCircle
                    onClick={() => {
                      updateOrderItems(order.orderID);
                    }}
                  />
                </th>
              </tr>
              <TableOrders
                orderID={order.orderID}
                tableOrders={order.items}
                onDelete={onDelete}
                updateOrder={updateOrder}
              />
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
