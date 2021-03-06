import { useState } from "react";
import "../styles/OrderBox.css";

export interface Order {
  index: number;
  name: string;
  imageURL: string;
  altText: string;
}

function delay(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function OrderBox({ index, name, imageURL, altText }: Order): JSX.Element {
  const [orderStatus, setOrderStatus] = useState("");

  // Fetch function with retry logic
  const sendOrderRequest = (index: number, count: number) => {
    if (count >= 5) {
      alert(`Product ${index} order failed, Try again later.`);
      setOrderStatus(`Product ${index} order failed, Try again later.`);
      return;
    }
    fetch(`/orders/${index}`, {
      method: "post",
    })
      .then((res) => {
        if (res.status !== 200) return false;
        return res.json();
      })
      .then((response) => {
        if (response === false) {
          alert(`Product ${index} order failed, Try again later.`);
          setOrderStatus(`Product ${index} order failed, Try again later.`);
        } else {
          alert(`Product ${index} ordered succesfully.`);
          setOrderStatus("");
        }
        return;
      })
      .catch(async (err) => {
        console.log(err);
        setOrderStatus(`Product ${index} order failed. Retrying ${count + 1}.`);
        await delay(1000);
        sendOrderRequest(index, count + 1);
      });
  };

  return (
    <div className="orderBox">
      <p>{name}</p>
      <img src={imageURL} alt={altText} height={300} width={300} />
      <p>{orderStatus}</p>
      <button type="submit" onClick={() => sendOrderRequest(index, 0)}>
        Order
      </button>
    </div>
  );
}

export default OrderBox;
