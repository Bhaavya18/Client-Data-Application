import * as React from "react";
import { FileUploader, myFile } from "../FileUploader/FileUploader";
import styles  from "./Form.module.css";
import { useEffect, useRef, useState } from "react";
import { Orders } from "../Orders/Orders";
import { useNavigate, useParams } from "react-router-dom";
import { v4 } from "uuid";
import md5 from "md5";
import { HiPencil } from "react-icons/hi";
import { getDoc, setDoc } from "firebase/firestore";
import { db, storage } from "../../firebase-config";
import { doc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { InputFiles } from "../FileUploader/InputFiles";
interface Prop {
  isDisabled: boolean;
}
export interface item {
  itemID: number;
  productName: string;
  price: number;
  qty: number;
}
export interface order {
  orderID: number;
  date: string;
  items: item[];
}
interface formData {
  companyName?: string;
  ownerName?: string;
  receptionistName?: string;
  address1?: string;
  address2?: string;
  email?: string;
  mobileNumber?: string;
  landLineNumber?: string;
  website?: string;
  orders?: order[];
  businessCard?: myFile;
  orderImages?: myFile[];
  sid: string;
}
const toBeRemovedFromStorage: string[] = [];
function Form({ isDisabled }: Prop) {
  const [disabled, setDisabled] = useState(isDisabled);
  const [companyName, setCompanyName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [receptionistName, setReceptionistName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [landLineNumber, setLandLineNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [orderImages, setOrderImages] = useState<myFile[]>([]);
  const [businessCard, setBusinessCard] = useState<myFile | null>(null);
  const [sid, setSID] = useState(v4());
  const [businessCardURL, setBusinessCardURL] = useState<myFile | undefined>(
    undefined
  );
  const [orderImagesURL, setOrderImagesURL] = useState<myFile[]>([]);
  const orderImagesURLRef = useRef(orderImagesURL);
  const businessCardURLRef = useRef(businessCardURL);
  const [orders, setOrders] = useState<order[]>([
    {
      orderID: Math.floor(Math.random() * 100) + 1,
      date: "",
      items: [
        {
          itemID: Math.floor(Math.random() * 10000) + 1,
          productName: "",
          price: 0,
          qty: 0,
        },
      ],
    },
  ]);
  const uniqueFiles = useRef(new Set<String>());
  const { id } = useParams();
  const navigate = useNavigate();
  /**********UseEffect Hooks***********************************************************************************************/
  useEffect(() => {
    if (id !== undefined) {
      const getDocData = async () => {
        const docRef = doc(db, "Clients", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCompanyName(data.companyName);
          if (data.ownerName !== undefined) setOwnerName(data.ownerName);
          if (data.receptionistName !== undefined)
            setReceptionistName(data.receptionistName);
          if (data.email !== undefined) setEmail(data.email);
          setSID(data.sid);
          if (data.orderImages !== undefined) {
            setOrderImagesURL(data.orderImages);
            data.orderImages.forEach((oimg:myFile) => {
              uniqueFiles.current.add(md5(oimg.fileName));
            });
          }
          if (data.businessCard !== undefined)
            setBusinessCardURL(data.businessCard);
          if (data.orders !== undefined) setOrders(data.orders);
          if (data.website !== undefined) setWebsite(data.website);
          if (data.mobileNumber !== undefined)
            setMobileNumber(data.mobileNumber);
          if (data.landLineNumber !== undefined)
            setLandLineNumber(data.landLineNumber);
          if (data.address1 !== undefined) setAddress1(data.address1);
          if (data.address2 !== undefined) setAddress2(data.address2);
        }
      };
      getDocData();
    }
  }, [id]);
  useEffect(() => {
    orderImagesURLRef.current = orderImagesURL;
  }, [orderImagesURL]);
  useEffect(() => {
    businessCardURLRef.current = businessCardURL;
  },[businessCardURL])
  const getData = () => {
    const data: formData = {
      companyName: companyName,
      ownerName: ownerName,
      receptionistName: receptionistName,
      address1: address1,
      address2: address2,
      email: email,
      mobileNumber: mobileNumber,
      landLineNumber: landLineNumber,
      website: website,
      orders: orders,
      orderImages: orderImagesURLRef.current,
      businessCard: businessCardURLRef.current,
      sid: sid,
    };
    if (data.ownerName === "") delete data.ownerName;
    if (data.receptionistName === "") delete data.receptionistName;
    if (data.address1 === "") delete data.address1;
    if (data.address2 === "") delete data.address2;
    if (data.email === "") delete data.email;
    if (data.mobileNumber === "") delete data.mobileNumber;
    if (data.landLineNumber === "") delete data.landLineNumber;
    if (data.website === "") delete data.website;
    if (data.orderImages?.length === 0) delete data.orderImages;
    if (data.orders?.length === 0) delete data.orders;
    if (data.businessCard === undefined) delete data.businessCard;
    return data;
  };
  /******************************************Adding/Updating record in firebase DB******************************************************************************/
  const addOrUpdateUsers = async () => {
    const docRef = doc(db, "Clients", id === undefined ? v4() : id);
    await setDoc(docRef, getData());
};
  /**********************File Uploader Function****************************************************************************/
  const updateBusinessCard = (obj: myFile) => {
    setBusinessCard(obj);
  };

  const updateOrderImages = (obj: myFile) => {
    if (!uniqueFiles.current.has(md5(obj.fileName))) {
      uniqueFiles.current.add(md5(obj.fileName));
      setOrderImages((prevState) => [...prevState, obj]);
    }
  };
  const deleteBusinessCard = () => {
    setBusinessCard(null);
  };
  const deleteOrderImages = (id: number) => {
    for (let i = 0; i < orderImages.length; i++){
      if (orderImages[i].id === id) {
        uniqueFiles.current.delete(md5(orderImages[i].fileName));
        break;
      }
    }
    setOrderImages(orderImages.filter((orderImage) => orderImage.id !== id));
  };
  /****Storing Files in fireBase database**********************************************************************************/
  const allUploads = async () => {
    if (businessCard !== null) {
      try {
        if (businessCard.file !== undefined)
          await handleUpload(businessCard.file, true);
      } catch {
        console.log(Error);
        return;
      }
    }
    for (let i = 0; i < orderImages.length; i++) {
      //Don't use forEach loop as it doesn't support async and await
      const ofile = orderImages[i].file;
      if (ofile !== undefined) await handleUpload(ofile, false);
    }
  };
  const handleUpload = async (image: File, isBusinessCard: boolean) => {
    const name = md5(image.name);
    const storageRef = ref(storage, `images-${sid}/${name}`);
    try {
      await uploadBytes(storageRef, image);
      await getURL(`images-${sid}/${name}`, image.name, isBusinessCard);
    } catch {
      console.log(Error);
    }
  };

  const getURL = async (
    fileName: string,
    originalFileName: string,
    isBusinessCard: boolean
  ) => {
    try {
      const url = await getDownloadURL(ref(storage, fileName));
      if (isBusinessCard) {
        businessCardURLRef.current={
          id: Math.floor(Math.random() * 10000) + 1,
          fileName: originalFileName,
          url: url,
        };
      } else {
        const newOrderImagesURL = [...orderImagesURLRef.current];
        //We don't want re-render that is why we are not updating state
        newOrderImagesURL.push({
          id: Math.floor(Math.random() * 10000) + 1,
          fileName: originalFileName,
          url: url,
        });
        orderImagesURLRef.current = newOrderImagesURL;
      }
    } catch {
      console.log(Error);
    }
  };
  /************Deleting Files from firebase storage****************************************************************/
  const findOrderImageFile = (fid: number) => {
    for (let i = 0; i < orderImagesURL.length; i++) {
      if (orderImagesURL[i].id === fid) return orderImagesURL[i].fileName;
    }
    return "";
  };

  const deleteFromStorage = async (fileName: string) => {
    const storageRef = ref(storage, `images-${sid}/${md5(fileName)}`);
    try {
      await deleteObject(storageRef);
      console.log("successFully Deleted");
    } catch {
      console.log("not deleted");
    }
  };

  const onDeleteOrderImage = (fid: number) => {
    const fileName = findOrderImageFile(fid);
    toBeRemovedFromStorage.push(fileName);
    uniqueFiles.current.delete(md5(fileName));
    setOrderImagesURL(orderImagesURL.filter((oimg) => oimg.id !== fid));
  };

  const onDeleteBusinessCard = (id: Number) => {
    if (businessCardURL !== undefined)
      toBeRemovedFromStorage.push(businessCardURL.fileName);
    setBusinessCardURL(undefined);
  };
  const allDeletions = async () => {
    for (let i = 0; i < toBeRemovedFromStorage.length; i++) {
      await deleteFromStorage(toBeRemovedFromStorage[i]);
    }
    toBeRemovedFromStorage.length = 0;
  };
  /********************************************Orders Functions******************************************************************************* */
  const deleteOrder = (id: number) => {
    setOrders(orders.filter((order) => order.orderID !== id));
  };
  const updateOrder = (
    orderInp: number,
    e: React.ChangeEvent<HTMLInputElement>,
    itemID: number,
    itemProperty: string
  ) => {
    const values: order[] = [...orders];
    const idx = values.findIndex((value) => value.orderID === orderInp);
    if (idx !== null) {
      if (e.target.name === "date") values[idx].date = e.target.value;
      else if (e.target.name === "item") {
        const index = values[idx].items.findIndex(
          (item) => item.itemID === itemID
        );
        if (index !== null) {
          if (itemProperty === "productName") {
            values[idx].items[index].productName = e.target.value;
          } else if (itemProperty === "price") {
            values[idx].items[index].price =
              e.target.value === "" ? 0 : parseInt(e.target.value);
          } else {
            values[idx].items[index].qty =
              e.target.value === "" ? 0 : parseInt(e.target.value);
          }
        }
      }
      setOrders(values);
    }
  };

  const updateOrderItems = (orderID: number) => {
    const values: order[] = [...orders];
    const idx = values.findIndex((value) => value.orderID === orderID);
    if (idx !== null) {
      values[idx].items.push({
        itemID: Math.floor(Math.random() * 10000) + 1,
        productName: "",
        price: 0,
        qty: 0,
      });
      setOrders(values);
    }
  };

  const deleteOrderItem = (orderID: number, itemID: number) => {
    const values: order[] = [...orders];
    const idx = values.findIndex((value) => value.orderID === orderID);
    if (idx !== null) {
      values[idx].items = values[idx].items.filter(
        (item) => item.itemID !== itemID
      );
      setOrders(values);
    }
  };
  /*************************************Updating Email/MobileNo./LandLine/Website*********************************************************************************************** */
  const updateEmail = (newEmail: string) => {
    setEmail(newEmail);
  };
  const updateMobileNumber = (newMobileNo: string) => {
    setMobileNumber(newMobileNo);
  };
  const updateLandLineNumber = (newLandLineNo: string) => {
    setLandLineNumber(newLandLineNo);
  };
  const updateWebsite = (newWebsite: string) => {
    setWebsite(newWebsite);
  };
  return (
    <div className={styles.myForm}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await allDeletions();
            await allUploads();
            await addOrUpdateUsers();
          } catch {
            alert(Error);
          }
          navigate("/home", { replace: true });
        }}
      >
        {id !== undefined && (
          <div className={styles.editBox}>
            <button
              className={styles.edit}
              onClick={(e) => {
                e.preventDefault();
                setDisabled(!disabled);
              }}
            >
              <HiPencil /> Edit
            </button>
          </div>
        )}
        <fieldset disabled={disabled}>
          <FileUploader
            inputFiles={businessCard === null ? [] : new Array(businessCard)}
            uploadText="Upload Business Card"
            isBusinessCard={true}
            updateEmail={updateEmail}
            updateMobilePhone={updateMobileNumber}
            updateLandLine={updateLandLineNumber}
            updateWebsite={updateWebsite}
            updateBusinessCard={updateBusinessCard}
            updateOrderImages={updateOrderImages}
            deleteBusinessCard={deleteBusinessCard}
          />
          {id !== undefined && (
            <div className={styles.inputFiles}>
              <InputFiles
                inputFiles={
                  businessCardURL !== undefined
                    ? new Array(businessCardURL)
                    : []
                }
                onDelete={onDeleteBusinessCard}
              />
            </div>
          )}
          <br />
          <label>Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
          <label>Owner Name</label>
          <input
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />
          <label>Receptionist Name</label>
          <input
            type="text"
            value={receptionistName}
            onChange={(e) => setReceptionistName(e.target.value)}
          />
          <label>Mobile Number</label>
          <input
            type="tel"
            value={mobileNumber}
            onChange={(e) => {
              updateMobileNumber(e.target.value);
            }}
          />
          <label>LandLine</label>
          <input
            type="tel"
            placeholder="01127010780"
            value={landLineNumber}
            onChange={(e) => {
              updateLandLineNumber(e.target.value);
            }}
          />
          <label>Address 1</label>
          <input
            type="text"
            value={address1}
            onChange={(e) => setAddress1(e.target.value)}
          />
          <label>Address 2</label>
          <input
            type="text"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
          />
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              updateEmail(e.target.value);
            }}
          />
          <label>Website</label>
          <input
            type="text"
            value={website}
            onChange={(e) => {
              updateWebsite(e.target.value);
            }}
          />
          <label>
            Orders{" "}
            <button
              className={styles.Add}
              onClick={(e) => {
                e.preventDefault();
                setOrders([
                  ...orders,
                  {
                    orderID: Math.floor(Math.random() * 100) + 1,
                    date: "",
                    items: [
                      {
                        itemID: Math.floor(Math.random() * 10000) + 1,
                        productName: "",
                        price: 0,
                        qty: 0,
                      },
                    ],
                  },
                ]);
              }}
            >
              Add
            </button>
          </label>
          {orders.length > 0 && (
            <div className={styles.Orders}>
              <Orders
                orders={orders}
                deleteOrder={deleteOrder}
                updateOrder={updateOrder}
                updateOrderItems={updateOrderItems}
                deleteOrderItem={deleteOrderItem}
              />
            </div>
          )}
          <FileUploader
            inputFiles={orderImages}
            uploadText="Upload Order Images"
            isBusinessCard={false}
            updateBusinessCard={updateBusinessCard}
            updateOrderImages={updateOrderImages}
            deleteOrderImages={deleteOrderImages}
          />
          {id !== undefined && (
            <div className={styles.inputFiles}>
              <InputFiles
                inputFiles={orderImagesURL}
                onDelete={onDeleteOrderImage}
              />
            </div>
          )}
          <input type="submit" className={styles.submit} />
        </fieldset>
      </form>
    </div>
  );
}
export default Form;
