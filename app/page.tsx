'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'

interface Product {
  id: string
  title: string
  description: string
  price: number
  image_url: string
  category: string
  affiliate_link: string
}

export default function Home() {
  const [productsData, setProductsData] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [columns, setColumns] = useState(2)
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [activeProduct, setActiveProduct] = useState<Product | null>(null)

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      const list: Product[] = []
      snap.forEach(doc => list.push({ id: doc.id, ...doc.data() } as Product))
      setProductsData(list)
    }
    fetchProducts()
  }, [])

  // Responsive columns
  useEffect(() => {
    const resize = () => {
      if (window.innerWidth < 600) {
        setColumns(2)
        setIsMobile(true)
      } else if (window.innerWidth < 900) {
        setColumns(3)
        setIsMobile(false)
      } else if (window.innerWidth < 1200) {
        setColumns(4)
        setIsMobile(false)
      } else {
        setColumns(5)
        setIsMobile(false)
      }
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  const filteredProducts = productsData.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div style={{ maxWidth: 1600, margin: '0 auto', padding: 14 }}>
        <input
          placeholder="Search products..."
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: 12,
            marginBottom: 16,
            borderRadius: 10,
            border: '1px solid #ddd',
          }}
        />

        {/* Masonry */}
        <div style={{ columnCount: columns, columnGap: isMobile ? 10 : 16 }}>
          {filteredProducts.map(product => {
            const hovered = hoveredId === product.id

            return (
              <div
                key={product.id}
                onMouseEnter={() => !isMobile && setHoveredId(product.id)}
                onMouseLeave={() => !isMobile && setHoveredId(null)}
                onClick={() => setActiveProduct(product)}
                style={{
                  breakInside: 'avoid',
                  marginBottom: isMobile ? 10 : 16,
                  borderRadius: 14,
                  overflow: 'hidden',
                  background: '#1a1a1a',
                  cursor: 'pointer',
                  position: 'relative',
                  transform: hovered ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.25s ease',
                  zIndex: hovered ? 10 : 1,
                  boxShadow: hovered
                    ? '0 18px 40px rgba(0,0,0,0.4)'
                    : '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <img
                  src={product.image_url}
                  alt={product.title}
                  style={{ width: '100%', display: 'block' }}
                />

                {/* Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.75), transparent)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: isMobile ? 8 : 12,
                  }}
                >
                  <p
                    style={{
                      fontSize: isMobile ? 11 : 13,
                      color: '#fff',
                      fontWeight: 500,
                      lineHeight: 1.3,
                      marginBottom: 4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {product.title}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: isMobile ? 11 : 12,
                        color: '#fff',
                        fontWeight: 600,
                      }}
                    >
                      Rs. {product.price}
                    </span>

                    <a
  href={product.affiliate_link}
  target="_blank"
  rel="noopener noreferrer"
  onClick={(e) => e.stopPropagation()} // 🔥 THIS IS THE FIX
  style={{
    background: '#fff',
    color: '#000',
    padding: isMobile ? '3px 8px' : '5px 12px',
    borderRadius: 999,
    fontSize: isMobile ? 10 : 11,
    fontWeight: 700,
    textDecoration: 'none',
  }}
>
  Buy
</a>

                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* MODAL (BLACK THEME) */}
      {activeProduct && (
        <div
          onClick={() => setActiveProduct(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#000',
              color: '#fff',
              borderRadius: 18,
              maxWidth: 420,
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
            }}
          >
            <button
  onClick={() => setActiveProduct(null)}
  style={{
    position: 'absolute',
    top: 10,
    right: 10,
    background: 'rgba(0,0,0,0.6)',
    color: '#fff',
    border: 'none',
    width: 36,
    height: 36,
    borderRadius: '50%',
    fontSize: 18,
    fontWeight: 700,
    cursor: 'pointer',
    lineHeight: '36px',
  }}
>
  ×
</button>

            <img
              src={activeProduct.image_url}
              alt={activeProduct.title}
              style={{ width: '100%', display: 'block' }}
            />

            <div style={{ padding: 16 }}>
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>
                {activeProduct.title}
              </h3>

              <p
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  marginBottom: 16,
                  color: '#ddd',
                }}
              >
                Rs. {activeProduct.price}
              </p>

              <a
                href={activeProduct.affiliate_link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  background: '#fff',
                  color: '#000',
                  padding: 12,
                  borderRadius: 999,
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Buy Now
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
