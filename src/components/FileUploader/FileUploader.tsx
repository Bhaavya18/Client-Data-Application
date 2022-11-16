import * as React from "react";
import { useCallback} from "react";
import { useDropzone } from "react-dropzone";
import { InputFiles } from "./InputFiles";
import {FiUpload} from "react-icons/fi"
import styles from "./FileUploader.module.css";
import axios from "axios";
import md5 from "md5";
export interface myFile{
    id: number;
    fileName: string;
    url: string;
    file?:File;
}
interface Props {
  inputFiles: myFile[];
  uploadText: string;
  isBusinessCard: boolean;
  updateMobilePhone?: Function;
  updateEmail?: Function;
  updateLandLine?: Function;
  updateWebsite?: Function;
  updateBusinessCard: Function;
  updateOrderImages: Function;
  deleteBusinessCard?: Function;
  deleteOrderImages?: Function;
  updateUniqueFiles?: Function;
}
const mobilePhoneRegex = /^(\+91(\s|-)?)?[1-9][0-9]{4}\s?[0-9]{5}$/;
const landLineRegex = /^011(-|\s)?[1-9][0-9]{3}\s?[0-9]{4}$/;
const emailRegex = /^([a-zA-Z\d._-]+)@([a-z\d-]+)\.([a-z]{2,63})(\.[a-z]{2,63})?$/;
const websiteRegex = /^(www.)?([a-z\d-]+)\.([a-z]{2,63})(\.[a-z]{2,63})?$/;
export function FileUploader({
  inputFiles, uploadText, isBusinessCard,
  updateEmail, updateMobilePhone,
  updateLandLine, updateWebsite, updateBusinessCard, updateOrderImages,
  deleteOrderImages, deleteBusinessCard, updateUniqueFiles}: Props) {
  const checkFor = (s: string) => {
    if (mobilePhoneRegex.test(s)) {
      if(updateMobilePhone!==undefined)
        updateMobilePhone(s);
    } else if (landLineRegex.test(s)) {
      if (updateLandLine !== undefined)
        updateLandLine(s);
    } else if (emailRegex.test(s)) {
      if (updateEmail !== undefined)
        updateEmail(s);
    } else if (websiteRegex.test(s)) {
      if (updateWebsite !== undefined)
        updateWebsite(s);
    }
  }
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (isBusinessCard) {
      if (updateEmail !== undefined) updateEmail("");
      if (updateMobilePhone !== undefined) updateMobilePhone("");
      if (updateLandLine !== undefined) updateLandLine("");
      if (updateWebsite !== undefined) updateWebsite("");
      let formData = new FormData();
      formData.append('image', acceptedFiles[0]);
      axios
        .post("https://api.api-ninjas.com/v1/imagetotext", formData, {
          headers: { "X-Api-Key": process.env.REACT_APP_IMG_TO_TEXT_KEY },
        })
        .then((res) => {
          res.data.forEach((obj: any) => {
            checkFor(obj.text);
          });
        })
        .catch(Error);
    }
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        const binaryStr = reader.result;
        if (!isBusinessCard) {
            updateOrderImages({
              id: Math.floor(Math.random() * 10000) + 1,
              fileName: file.name,
              url: binaryStr as string,
              file: file,
            });
        } else {
            updateBusinessCard({
              id: Math.floor(Math.random() * 10000) + 1,
              fileName: file.name,
              url: binaryStr as string,
              file: file,
            });
        }
      };
      reader.readAsDataURL(file);
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const deleteFile = (id: number) => {
    if (isBusinessCard) {
      if (deleteBusinessCard !== undefined)
        deleteBusinessCard();
      if (updateEmail !== undefined)
        updateEmail("");
      if (updateMobilePhone !== undefined)
        updateMobilePhone("");
      if (updateLandLine !== undefined)
        updateLandLine("");
      if (updateWebsite !== undefined)
        updateWebsite("");
    } else if (deleteOrderImages !== undefined)
      deleteOrderImages(id);
  };
  return (
    <div>
      <div {...getRootProps()} className={styles.fileUploader}>
        <FiUpload className={styles.upload} />
        <input {...getInputProps()} multiple={isBusinessCard?false:true} />
        <p>{uploadText}</p>
      </div>
      {inputFiles.length > 0 && (
        <div className={styles.inputFiles}>
          <InputFiles inputFiles={inputFiles} onDelete={deleteFile} />
        </div>
      )}
    </div>
  );
}
//https://www.youtube.com/watch?v=S4zaZvM8IeI 
//https://www.youtube.com/watch?v=YOAeBSCkArA&t=948s
