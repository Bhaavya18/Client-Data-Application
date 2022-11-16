import * as React from "react";
import { myFile } from "./FileUploader";
import { FaTimes } from "react-icons/fa";
import styles from "./FileUploader.module.css";
interface Props{
  inputFile: myFile;
  onDelete: Function;
}
export function InputFile({ inputFile,onDelete }: Props) {
  return (
    <div>
      <img src={inputFile.url} alt="file uploaded" className={styles.fileImage} />
      <p className={styles.fileDetails}>{inputFile.fileName}
        <FaTimes style={{ color: 'red', cursor: 'pointer', fontSize: "13px" }} onClick={()=>{onDelete(inputFile.id)}} />
      </p>
    </div>
  );
}
