import { IconCloudUpload } from "@tabler/icons-react";
import { ICON_STROKE, ICON_SIZE } from "../../shared";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Checkbox from "../Checkbox/Checkbox";
import { TextButton } from "../../ui";
import { getTransformedFile } from "../../shared";

function Upload() {
  const [wrongFile, setWrongFile] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [selectPdf, setSelectPdf] = useState(true);
  const [selectPy, setSelectPy] = useState(true);
  const [selectDocx, setSelectDocx] = useState(false);
  const [enableSubmit, setEnableSubmit] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const fileExtension =
        file.name.split(".")[file.name.split(".").length - 1];
      console.log(fileExtension);
      if (fileExtension !== "ipynb") {
        setUploadFile(null);
        !wrongFile && setWrongFile(true);
      } else {
        setUploadFile(file);
        wrongFile && setWrongFile(false);
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (uploadFile) {
      const res = await getTransformedFile(uploadFile, {
        pdf: selectPdf,
        py: selectPy,
        docx: selectDocx,
      });
      console.log(res);
    }
  };

  useEffect(() => {
    if (uploadFile && (selectPdf || selectPy || selectDocx)) {
      console.log(uploadFile && (selectPdf || selectPy || selectDocx));
      setEnableSubmit(true);
    }
  }, [selectDocx, selectPdf, selectPy, uploadFile]);
  console.log([selectPdf, selectPy, selectDocx]);
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col items-start justify-center gap-6"
    >
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:hover:bg-bray-800 dark:bg-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:hover:border-slate-500 dark:hover:bg-slate-600"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <IconCloudUpload
            className="text-slate-500 dark:text-slate-400"
            size={ICON_SIZE + 30}
            stroke={ICON_STROKE - 0.6}
          />
          <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {uploadFile && !wrongFile ? (
              <span className="text-green-500 dark:text-green-400">
                {uploadFile.name}
              </span>
            ) : (
              ".ipynb files only"
            )}
          </p>
          {wrongFile && (
            <p className="text-sm text-red-500 dark:text-red-400">
              Wrong file type please select another file
            </p>
          )}
        </div>
        <input
          onChange={handleChange}
          id="dropzone-file"
          type="file"
          accept=".ipynb"
          className="hidden"
        />
      </label>
      <div className="flex w-full items-center justify-start gap-6">
        <Checkbox
          text=".pdf"
          disabled={!uploadFile}
          checked={selectPdf}
          onChange={(e) => setSelectPdf(e)}
        />
        <Checkbox
          text=".py"
          disabled={!uploadFile}
          checked={selectPy}
          onChange={(e) => setSelectPy(e)}
        />
        <Checkbox
          text=".docx"
          disabled={!uploadFile}
          checked={selectDocx}
          onChange={(e) => setSelectDocx(e)}
        />
      </div>
      <TextButton disabled={!enableSubmit} type="submit">
        Transform
      </TextButton>
    </form>
  );
}

export default Upload;
