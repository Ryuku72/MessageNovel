import { useEffect, useRef, useState } from 'react';
import { Component, Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { canvasPreview } from '~/helpers/canvasPreview';

import DialogWrapper from '~/components/DialogWrapper';

import Default_Avatar from '~/assets/default_avatar.jpeg';
import CloseIcon from '~/svg/CloseIcon/CloseIcon';
import LoadingClock from '~/svg/LoadingClock/LoadingClock';
import PlusIcon from '~/svg/PlusIcon/PlusIcon';

export type AvatarInputProps = {
  title: string;
  id: string;
  setImage: (image: File) => void;
  imageSrc: string | null;
};

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function AvatarInput({ title, id, imageSrc, setImage }: AvatarInputProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageElRef = useRef<HTMLImageElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const blobUrlRef = useRef('');
  const timeOutRef = useRef<NodeJS.Timeout | null>(null);
  const hasImage = Boolean(imgSrc);

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    const [target] = e.target.files || [];
    if (!target) return handleClose();
    setShowDialog(true);
    const reader = new FileReader();
    reader.addEventListener('load', event => {
      const img = new Image();
      img.onload = () => setImgSrc(img.src);
      img.onerror = () => {
        const sceneEvent = new CustomEvent('alertFromError', {
          detail: 'Failed to upload file. Please Check File Format'
        });
        window.dispatchEvent(sceneEvent);
        handleClose();
      };
      if (event.target) img.src = event.target.result as string;
    });
    reader.readAsDataURL(target);
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  }

  async function onSave() {
    if (!completedCrop) return;
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error('Crop canvas does not exist');
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(completedCrop.width * scaleX, completedCrop.height * scaleY);
    const ctx = offscreen.getContext('2d');
    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height
    );
    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await offscreen.convertToBlob({
      type: 'image/png'
    });
    blobUrlRef.current = URL.createObjectURL(blob);
    const file = new File([blob], 'avatar.png');
    if (imageElRef.current) imageElRef.current.src = blobUrlRef.current;
    setImage(file);
    handleClose();
  }

  useEffect(() => {
    timeOutRef.current = setTimeout(() => {
      if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, 1, 0);
      }
    }, 100);

    return () => {
      if (timeOutRef.current) clearTimeout(timeOutRef.current);
    };
  }, [completedCrop]);

  const handleClose = () => {
    setImgSrc('');
    setCompletedCrop(undefined);
    setCrop(undefined);
    setShowDialog(false);
  };
  const clearInput = () => {
    if (inputRef.current) inputRef.current.value = '';
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
  };

  return (
    <div className="flex flex-shrink-0 flex-col max-h-full self-start m-auto">
      <label
        htmlFor={id}
        className="flex flex-col items-center gap-2 font-mono font-medium text-sm text-gray-600 cursor-pointer hover:text-blue-500">
        <img
          alt="create-img"
          className="w-32 h-32 rounded-full object-cover bg-gradient-to-b from-slate-500 to-fuchsia-600"
          ref={imageElRef}
          src={imageSrc || Default_Avatar}
          onError={event => event.currentTarget.src = Default_Avatar}
        />
        {title}
        <input
          id={id}
          name={id}
          accept="image/*"
          className="hidden"
          type="file"
          onChange={onSelectFile}
          ref={inputRef}
          onClick={() => clearInput()}
        />
      </label>
      <DialogWrapper open={showDialog}>
        <div className="w-full max-w-card-l bg-slate-300 bg-opacity-75 backdrop-blur-sm rounded-b-md rounded-t-lg flex flex-col gap-1 self-center text-mono">
          <div className="w-full pt-4 px-6 pb-2 flex flex-wrap rounded-t-[inherit] justify-between items-center bg-white bg-opacity-75 backdrop-blur-sm">
            <h3 className="font-medium text-xl text-gray-600 underline underline-offset-4">
              &#8197;New Novel Details&nbsp;&nbsp;&nbsp;
            </h3>
            <button
              className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-red-500 hover:border hover:border-red-500 rounded"
              type="button"
              onClick={() => handleClose()}>
              <CloseIcon className="w-3 h-3" uniqueId="dash-close" svgColor="currentColor" />
            </button>
          </div>
          <div className={hasImage ? 'hidden' : 'w-full aspect-square flex items-center justify-center'}>
            <LoadingClock className="w-24 h-24" svgColor="#fff" uniqueId="image-cropper-svg" />
          </div>
          {/** Due to crop cricle shadow this needs to be a ternary **/}
          <Component
            minHeight={200}
            minWidth={200}
            crop={crop}
            aspect={1}
            circularCrop={false}
            className={hasImage ? 'flex w-full max-w-full max-h-full' : '!hidden'}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={c => setCompletedCrop(c)}>
            <img
              alt="Crop me"
              className="w-full object-cover"
              ref={imgRef}
              src={imgSrc}
              onLoad={onImageLoad}
            />
          </Component>
          <div className="hidden">
            <canvas
              ref={previewCanvasRef}
              style={{
                objectFit: 'contain',
                width: completedCrop?.width || 0,
                height: completedCrop?.height || 0
              }}
            />
          </div>
          <div className="w-full flex gap-3 flex-wrap px-6 py-2 rounded-b-md bg-white bg-opacity-75">
            <button
              type="button"
              className="text-gray-100 bg-blue-500 hover:bg-green-500 rounded-lg text-sm px-5 py-2.5 text-center flex items-center gap-2"
              onClick={() => onSave()}>
              <PlusIcon uniqueId="dash_plus" svgColor="#fff" className="w-3 h-3" />
              Submit
            </button>
          </div>
        </div>
      </DialogWrapper>
    </div>
  );
}
