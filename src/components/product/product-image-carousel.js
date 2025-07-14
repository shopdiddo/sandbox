"use client";

import { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";

import "swiper/css";
import "swiper/css/mousewheel";

import s from "./product-image-carousel.module.css";

export function ProductImageCarousel({ product }) {
  if (!product.images?.length) return <></>;

  const images = useMemo(() => {
    if (!product?.images.length) {
      return [];
    }

    let imgs = [];

    while (imgs.length < 5) {
      imgs.push(...product.images);
    }

    return imgs;
  }, [product]);

  return (
    <Swiper
      modules={[Mousewheel]}
      loop={true}
      centeredSlides={true}
      slidesPerView={1.3}
      spaceBetween={30}
      mousewheel={true}
      grabCursor={true}
      slideToClickedSlide={true}
      className={s.swiper}
    >
      {images.map((img, i) => (
        <SwiperSlide>
          <div key={`${product.external_id}-carousel-img-${i}`} className={s.imgContainer}>
            <img className={s.img} src={img} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
