import * as React from "react";
import { myFile } from "./FileUploader";
import { InputFile } from "./InputFile";
import "../../index.css"
interface Props{
    inputFiles: myFile[];
    onDelete: Function;
}
export function InputFiles({inputFiles,onDelete}:Props) {
    return (
      <>
        {inputFiles.map((inputfile) => (
          <InputFile
            key={inputfile.id}
            inputFile={inputfile}
            onDelete={onDelete}
          />
        ))}
      </>
    );
}