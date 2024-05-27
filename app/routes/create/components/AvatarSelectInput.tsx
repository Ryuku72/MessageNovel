import { useOutletContext } from '@remix-run/react';

import { useRef, useState } from 'react';
import { Component, PercentCrop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import DialogWrapper from '~/components/DialogWrapper';
import CloseIcon from '~/svg/CloseIcon/CloseIcon';
import LoadingClock from '~/svg/LoadingClock/LoadingClock';
import PlusIcon from '~/svg/PlusIcon/PlusIcon';

import Default_Avatar from '~/assets/default_avatar.jpeg';

export type AvatarInputProps = {
  title: string;
  id: string;
  setImage: (image: File) => void;
};

export default function AvatarInput({ title, id, setImage }: AvatarInputProps) {
  const { sceneReady } = useOutletContext<{ sceneReady: boolean }>();

  const [cropImage, setCropImage] = useState('');
  const [viewImage, setViewImage] = useState(Default_Avatar);
  const [open, setOpen] = useState(false);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [crop, setCrop] = useState<PercentCrop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0
  });
  const cropImageRef = useRef<HTMLImageElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleOnImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const [target] = e.target.files;
    if (target) {
      setOpen(true);
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const img = new Image();
        img.onload = () => {
          setCropImage(img.src);
        };
        img.onerror = () => {
          const sceneEvent = new CustomEvent('alertFromError', {
            detail: 'Failed to upload file. Please Check File Format'
          });
          window.dispatchEvent(sceneEvent);
          handleClose();
        };
        if (event.target) img.src = event.target.result as string;
      };

      reader.readAsDataURL(target);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalHeight: height, naturalWidth: width, offsetHeight, offsetWidth } = e.currentTarget;
    const percent = makeAspectCrop({ unit: '%', height: height }, 1 / 1, width, height);
    const cropPercent = centerCrop(percent, width, height);
    setCrop(cropPercent);
    const pixel = makeAspectCrop({ unit: 'px', height: offsetHeight }, 1 / 1, offsetWidth, offsetHeight);
    const cropPixel = centerCrop(pixel, offsetWidth, offsetHeight);
    setCompletedCrop(cropPixel);
  };

  const onCropChange = (_: PixelCrop, crop: PercentCrop) => {
    if (!crop) return;
    setCrop(crop);
  };

  const getCroppedImg = (image: HTMLImageElement) => {
    if (!completedCrop) return;
    const canvas = document?.createElement('canvas');
    const newCrop = completedCrop;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = newCrop.width;
    canvas.height = newCrop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;
    ctx.drawImage(
      image,
      newCrop.x * scaleX,
      newCrop.y * scaleY,
      newCrop.width * scaleX,
      newCrop.height * scaleY,
      0,
      0,
      newCrop.width,
      newCrop.height
    );

    canvas.toBlob(blob => {
      if (!blob) return;
      const file = new File([blob], 'avatar.png');
      setImage(file);
      const fileUrl = window?.URL.createObjectURL(blob);
      setViewImage(fileUrl);
      setOpen(false);
      setCropImage('');
      setCompletedCrop(null);
    }, 'png');
  };

  const onSave = () => {
    const image = cropImageRef.current;
    if (!image) return;
    if (crop?.width && crop?.height && image) getCroppedImg(image);
  };

  const imageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (e.type !== 'error') return;
    e.type = '';
    (e.target as HTMLImageElement).onerror = null;
    if (!cropImage) return;
    const sceneEvent = new CustomEvent('alertFromError', {
      detail: 'Failed to upload file'
    });
    window.dispatchEvent(sceneEvent);
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setCropImage('');
    setCompletedCrop(null);
    setOpen(false);
    setCrop({
      unit: '%',
      width: 100,
      height: 100,
      x: 0,
      y: 0
    });
  };

  const clearInput = () => {
    if (inputRef.current) inputRef.current.value = '';
    if (viewImage) window?.URL.revokeObjectURL(viewImage);
  };

  return (
    <div className="flex flex-shrink-0 flex-col justify-center items-center">
      <label
        htmlFor={id}
        className="flex flex-col items-center gap-2 font-mono font-medium text-sm text-gray-600 cursor-pointer hover:text-blue-500">
        <img alt="create-img" className="w-32 h-32 rounded-full object-cover" src={viewImage} />
        {title}
        <input
          id={id}
          name={id}
          className="hidden"
          type="file"
          ref={inputRef}
          onClick={() => clearInput()}
          onChange={handleOnImageChange}
        />
      </label>
      {sceneReady && (
        <DialogWrapper
          open={open}
          className="max-w-full max-h-full w-full h-full justify-center p-[36px] bg-transparent z-10">
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
            <div className={cropImage ? 'hidden' : 'w-full aspect-square flex items-center  justify-center'}>
              <LoadingClock className="w-24 h-24" svgColor="#fff" uniqueId="image-cropper-svg" />
            </div>
            {/** Due to crop cricle shadow this needs to be a ternary **/}
            {cropImage && (
              <Component
                minWidth={100}
                minHeight={100}
                keepSelection={true}
                crop={crop}
                circularCrop={false}
                className="flex w-full max-w-full max-h-full"
                onChange={onCropChange}
                onComplete={c => setCompletedCrop(c)}>
                <img
                  loading="lazy"
                  alt="Crop me"
                  className="max-w-full max-h-full m-auto"
                  ref={cropImageRef}
                  src={cropImage}
                  onLoad={onImageLoad}
                  onError={imageError}
                />
              </Component>
            )}
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
      )}
    </div>
  );
}
