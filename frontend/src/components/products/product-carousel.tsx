"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Package } from "lucide-react"
import { ProductoImagen } from "@/lib/api"
import { normalizeImageUrl } from "@/lib/utils"

interface ProductCarouselProps {
    images: ProductoImagen[]
    productName: string
}

export function ProductCarousel({ images, productName }: ProductCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <Package className="h-24 w-24 text-muted-foreground" />
            </div>
        )
    }

    const sortedImages = images.sort((a, b) => a.orden - b.orden)

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? sortedImages.length - 1 : prevIndex - 1
        )
    }

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === sortedImages.length - 1 ? 0 : prevIndex + 1
        )
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg border group">
                <Image
                    src={normalizeImageUrl(sortedImages[currentIndex].url)}
                    alt={`${productName} - Imagen ${currentIndex + 1}`}
                    fill
                    className="object-cover"
                    priority
                />

                {/* Navigation Arrows */}
                {sortedImages.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={goToPrevious}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={goToNext}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </>
                )}

                {/* Image Counter */}
                {sortedImages.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded text-xs">
                        {currentIndex + 1} / {sortedImages.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Images */}
            {sortedImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                    {sortedImages.map((image, index) => (
                        <button
                            key={image.id}
                            onClick={() => setCurrentIndex(index)}
                            className={`relative aspect-square overflow-hidden rounded border-2 transition-colors ${currentIndex === index
                                ? "border-primary"
                                : "border-transparent hover:border-muted-foreground"
                                }`}
                        >
                            <Image
                                src={normalizeImageUrl(image.url)}
                                alt={`${productName} - Miniatura ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}