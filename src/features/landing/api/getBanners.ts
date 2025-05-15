import { Banner } from "../types/banner";

import {banner1, banner2, banner3} from '@/assets/images/index'
export const getBanners = (): Banner[] => {
  return [
    {
      id: '1',
      title: 'Bánh sinh nhật',
      subtitle: 'Đa dạng mẫu mã, hương vị đặc biệt',
      image: banner1,
      link: '/categories/banh-sinh-nhat'
    },
    {
      id: '2',
      title: 'Bánh ngọt và bánh mỳ',
      subtitle: 'Được làm từ các nguyên liệu tốt nhất',
      image: banner2,
      link: '/products'
    },
    {
      id: '3',
      title: 'Đặt hàng trực tuyến',
      subtitle: 'Giao hàng tận nơi trong vòng 2 giờ',
      image: banner3,
      link: '/contact'
    }
  ];
}; 