'use client';

import { useState, DragEvent } from "react";
import InputVal from "./components/inputVal";

export default function Home() {
  const [uploadUrl, setUrl] = useState<string>("")
  const [dataUrl, setDataUrl] = useState<string>("");
  const [created, setCreated] = useState<boolean>(false);
  const [pasteNum, setPasteNum] = useState<number>(100)
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadImage, setImage] = useState<HTMLImageElement | undefined>(undefined)

  type imageSize = {
    width: number
    height: number
  }
  const [resultSize, setSize] = useState<imageSize>({ width: 4000, height: 3200 })
  const [uploadSize, setUploadSize] = useState<imageSize>({width: 0, height: 0 })

  function loadImage(src: string): Promise<HTMLImageElement>{
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      processFile(target.files[0]);
    }
  };

  const processFile = async(file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください");
      return;
    }
    const url = URL.createObjectURL(file);
    setUrl(url);
    const image = await loadImage(url);
    setUploadSize({width:image.width, height:image.height})
    setImage(image)
  }

  const randomNum =(min: number, max: number) => {
    const minValue = min;
    const maxValue = max;
    const randomInt = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    return randomInt;
  }

  const getImageSize = (image: HTMLImageElement|undefined, type: "Val"| "string") =>{
    if (image === undefined || image === null){
      return
    }
    return (type === "Val" ? (image.width, image.height) : `${image.width} x ${image.height}`)
  }

  const handleSize = (e: React.ChangeEvent<HTMLInputElement>) =>{
    const { name, value } = e.target;
    setSize((prev) => ({
    ...prev,
    [name]: Number(value),
  }));};

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      processFile(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const  makeImage = async() =>{
    const image = uploadImage;
    if (!image) {
      alert("画像が読み込まれていません");
      return;
    }
    const canvas = document.createElement("canvas");
    const { width, height } = resultSize;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    ctx.fillRect(0, 0, width, height);
    for (let i:number=0; i < pasteNum; i++){
      ctx.drawImage(image, randomNum(-image.width , width),
                    randomNum(-image.height, height), image.width, image.height);
    }

    const dataUrl = canvas.toDataURL("image/png");
    setDataUrl(dataUrl)
    setCreated(true)
  }
  return (
    <div className="flex flex-col justify-center items-center">
      
      <div className="flex flex-col sm:flex-row w-full items-stretch justify-center">
        <div className={`p-5 m-5 font-semibold border-2
                         border-dashed flex flex-col justify-center ${!isDragging ? 'border-gray-400' : 'border-gray-600'}`}
              onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
          <label className={`p-3 m-5 text-2xl text-center transition-colors
                          hover:bg-amber-500 rounded-lg
                        ${!isDragging ? 'bg-amber-400' : 'bg-red-400'}`}>
            画像を選択
            <input className="hidden" type="file" onChange={handleFileSelect} ></input>
          </label>
          <div className="text-1xl">ここに画像をドロップしてもOK</div>
        </div>

        <div className="m-5 p-3 flex flex-col bg-emerald-400 rounded-lg items-center justify-center text-center">
          <InputVal labelMsg="width(px): " defaultVal={4000} elementName={"width"} handleEvent={e => handleSize(e)}/>
          <InputVal labelMsg="height(px): " defaultVal={3000} elementName={"height"} handleEvent={e => handleSize(e)}/>
          <InputVal labelMsg="張り付ける枚数: " defaultVal={1000} elementName={"num"} handleEvent={e => setPasteNum(Number(e.target.value))}/>
        </div>
      </div>
      {uploadUrl && 
        <div>画像の読み取りに成功しました。<br></br>(画像サイズ: {getImageSize(uploadImage, "string")})</div>
      }
      {uploadUrl &&
        <button className="p-5 m-5  font-semibold rounded-lg 
                          text-2xl bg-amber-400 hover:bg-amber-500 transition-colors" 
                onClick={makeImage} autoFocus>画像作成</button>
      }
      
      {created && 
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        <img
        src={dataUrl}
        className="m-2 border max-w-full max-h-[70vh] w-auto h-auto object-contain"
      />
      }
      
    </div>
  );
}
