import { useRef, useState } from 'react';
import { Component, Crop, PercentCrop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import DialogWrapper from './DialogWrapper';

import CloseIcon from '~/svg/CloseIcon/CloseIcon';
import PlusIcon from '~/svg/PlusIcon/PlusIcon';

import Default_Avatar from '~/assets/default_avatar.jpeg';

export type AvatarInputProps = {
  title: string;
  id: string;
};

export default function AvatarInput({ title, id }: AvatarInputProps) {
  const [viewImage, setViewImage] = useState(Default_Avatar);
  const [cropImage, setCropImage] = useState('');
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
    const imageURL = URL.createObjectURL(target);
    setCropImage(imageURL);
    setOpen(true);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: width, naturalHeight: height, clientHeight, clientWidth } = e.currentTarget;
    const percent = makeAspectCrop({ unit: '%', width: 100 }, 1 / 1, width, height);
    const cropPercent = centerCrop(percent, width, height);
    setCrop(cropPercent);
    setCompletedCrop({ unit: 'px', width: clientWidth, height: clientHeight, x: 0, y: 0 });
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
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const fileUrl = await window?.URL.createObjectURL(blob);
        if (inputRef.current) inputRef.current.value = fileUrl;
        setViewImage(fileUrl);
        setOpen(false);
        setCropImage('');
        setCompletedCrop(null);
      };
    }, 'png');
  };

  const onSave = () => {
    const image = cropImageRef.current;
    if (!image) return;
    if (crop?.width && crop?.height && image) getCroppedImg(image);
  };

  const imageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).onerror = null;
    const sceneEvent = new CustomEvent('alertFromError', {
      detail: 'Failed to upload file'
    });
    window.dispatchEvent(sceneEvent);
  };

  return (
    <div className="flex flex-shrink-0 flex-col justify-center items-center">
      <label
        htmlFor={id}
        className="flex flex-col items-center gap-2 font-mono font-medium text-sm text-gray-600 cursor-pointer hover:text-blue-500">
        <img alt="create-img" className="w-32 h-32 rounded-full object-cover" src={viewImage} />
        {title}
        <input id={id} name={id} className="hidden" type="file" onChange={handleOnImageChange} />
        <input id={id + '_crop'} name={id + '_crop'} ref={inputRef} className="hidden" />
      </label>
      <DialogWrapper open={open} className="max-w-full max-h-full w-full h-full justify-center p-[36px] bg-transparent">
        {open && (
          <div className="w-full max-w-card-l bg-white rounded-b-md rounded-t-lg flex flex-col gap-3 self-center text-mono">
            <div className="w-full pt-4 px-6 flex flex-wrap justify-between items-center">
              <h3 className="font-medium text-xl text-gray-600 underline underline-offset-4">
                &#8197;New Novel Details&nbsp;&nbsp;&nbsp;
              </h3>
              <button
                className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-red-500 hover:border hover:border-red-500 rounded"
                onClick={() => setOpen(false)}>
                <CloseIcon className="w-3 h-3" uniqueId="dash-close" svgColor="currentColor" />
              </button>
            </div>
            <Component
              minWidth={50}
              minHeight={50}
              keepSelection={true}
              crop={crop}
              circularCrop={true}
              aspect={1 / 1}
              style={{ minHeight: cropImageRef?.current?.height, minWidth: cropImageRef?.current?.width }}
              onChange={onCropChange}
              onComplete={(c) => setCompletedCrop(c)}>
              <img
                loading="lazy"
                className="w-full"
                ref={cropImageRef}
                alt="Crop me"
                src={open ? cropImage : Default_Avatar}
                onLoad={onImageLoad}
                crossOrigin="anonymous"
                onError={imageError}
              />
            </Component>
            <div className="w-full flex gap-3 flex-wrap mt-2">
              <button
                type="button"
                className="text-gray-100 bg-blue-500 hover:bg-green-500 rounded-lg text-sm px-5 py-2.5 text-center flex items-center gap-2"
                onClick={() => onSave()}>
                <PlusIcon uniqueId="dash_plus" svgColor="#fff" className="w-3 h-3" />
                Ok
              </button>
            </div>
          </div>
        )}
      </DialogWrapper>
    </div>
  );
}
