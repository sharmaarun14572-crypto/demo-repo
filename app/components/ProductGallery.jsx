import {useMemo} from 'react';
import {Image} from '@shopify/hydrogen';

export function ProductGallery({images, selectedVariant}) {
  const allImages = images?.nodes || [];

  const selectedColor =
    selectedVariant?.selectedOptions?.find(
      (opt) => opt.name.toLowerCase() === 'color'
    )?.value?.toLowerCase() || '';

  const filteredImages = useMemo(() => {
    if (!selectedColor) return allImages;

    return allImages.filter((img) =>
      (img.altText || '').toLowerCase().includes(selectedColor)
    );
  }, [allImages, selectedColor]);

  if (!filteredImages.length) return null;

  return (
    <div className="gallery">
      <div className="main-slider">
        {filteredImages.map((img) => (
          <div className="cell" key={img.id}>
            <Image data={img} aspectRatio="1/1" />
          </div>
        ))}
      </div>
    </div>
  );
}
