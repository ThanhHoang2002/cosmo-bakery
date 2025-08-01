export interface Product {
  id: number
  name: string
  description: string
  sellPrice: number
  quantity: number
  image: string
  status: string
  createdAt: string
  updatedAt: string | null
  createdBy: string
  updatedBy: string | null
  category: Category
  
  // Trường tương thích ngược cho component cũ
  slug?: string
  price?: number
  originalPrice?: number
  images?: string[]
  isOnSale?: boolean
  isBestSeller?: boolean
  isNewArrival?: boolean
}
export interface Category {
  id: number
  name: string
  image: string | null
  description: string
  createdAt: string
  updatedAt: string | null
  createdBy: string
  updatedBy: string | null
}
