"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { productosApi, categoriasApi, imagenesApi, type Producto, type Categoria } from "@/lib/api"
import { ArrowLeft, Upload, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Props {
    params: { id: string }
}

export default function EditarProductoPage({ params }: Props) {
    const router = useRouter()
    const [producto, setProducto] = useState<Producto | null>(null)
    const [categorias, setCategorias] = useState<Categoria[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        tamano: "",
        imagenUrl: "",
        categoriaId: "",
        ofertaActiva: false,
        precioOferta: "",
        esDestacado: false,
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productoResponse, categoriasResponse] = await Promise.all([
                    productosApi.getById(params.id),
                    categoriasApi.getAll(),
                ])

                const prod = productoResponse.data
                setProducto(prod)
                setCategorias(categoriasResponse.data)

                setFormData({
                    nombre: prod.nombre,
                    descripcion: prod.descripcion,
                    precio: prod.precio.toString(),
                    stock: prod.stock.toString(),
                    tamano: prod.tamano || "",
                    imagenUrl: prod.imagenUrl || "",
                    categoriaId: prod.categoriaId.toString(),
                    ofertaActiva: prod.ofertaActiva,
                    precioOferta: prod.precioOferta?.toString() || "",
                    esDestacado: prod.esDestacado,
                })
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [params.id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const data = {
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                precio: parseFloat(formData.precio),
                stock: parseInt(formData.stock),
                tamano: formData.tamano,
                imagenUrl: formData.imagenUrl || undefined,
                categoriaId: parseInt(formData.categoriaId),
                ofertaActiva: formData.ofertaActiva,
                precioOferta: formData.precioOferta ? parseFloat(formData.precioOferta) : undefined,
                esDestacado: formData.esDestacado,
            }

            await productosApi.update(params.id, data)
            router.push("/admin/productos")
        } catch (error) {
            console.error("Error updating producto:", error)
            alert("Error al actualizar el producto")
        } finally {
            setSaving(false)
        }
    }

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleImageUpload = async (files: FileList) => {
        if (!files.length) return

        try {
            const fileArray = Array.from(files)
            await imagenesApi.upload(params.id, fileArray)

            // Refresh product data to show new images
            const response = await productosApi.getById(params.id)
            setProducto(response.data)
        } catch (error) {
            console.error("Error uploading images:", error)
            alert("Error al subir las imágenes")
        }
    }

    const handleDeleteImage = async (imagenId: string) => {
        if (!confirm("¿Estás seguro de que quieres eliminar esta imagen?")) {
            return
        }

        try {
            await imagenesApi.delete(params.id, imagenId)

            // Refresh product data
            const response = await productosApi.getById(params.id)
            setProducto(response.data)
        } catch (error) {
            console.error("Error deleting image:", error)
            alert("Error al eliminar la imagen")
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Cargando...</h1>
            </div>
        )
    }

    if (!producto) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Producto no encontrado</h1>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/admin/productos">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">Editar Producto</h1>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Product Form */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Producto</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="nombre">Nombre *</Label>
                                        <Input
                                            id="nombre"
                                            value={formData.nombre}
                                            onChange={(e) => handleInputChange("nombre", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="categoria">Categoría *</Label>
                                        <Select
                                            value={formData.categoriaId}
                                            onValueChange={(value) => handleInputChange("categoriaId", value)}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar categoría" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categorias.map((categoria) => (
                                                    <SelectItem key={categoria.id} value={categoria.id.toString()}>
                                                        {categoria.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="precio">Precio *</Label>
                                        <Input
                                            id="precio"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.precio}
                                            onChange={(e) => handleInputChange("precio", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="stock">Stock *</Label>
                                        <Input
                                            id="stock"
                                            type="number"
                                            min="0"
                                            value={formData.stock}
                                            onChange={(e) => handleInputChange("stock", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tamano">Tamaño</Label>
                                        <Input
                                            id="tamano"
                                            value={formData.tamano}
                                            onChange={(e) => handleInputChange("tamano", e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="imagenUrl">URL de Imagen</Label>
                                        <Input
                                            id="imagenUrl"
                                            type="url"
                                            value={formData.imagenUrl}
                                            onChange={(e) => handleInputChange("imagenUrl", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="descripcion">Descripción *</Label>
                                    <Textarea
                                        id="descripcion"
                                        value={formData.descripcion}
                                        onChange={(e) => handleInputChange("descripcion", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="ofertaActiva"
                                            checked={formData.ofertaActiva}
                                            onCheckedChange={(checked) => handleInputChange("ofertaActiva", checked)}
                                        />
                                        <Label htmlFor="ofertaActiva">Producto en oferta</Label>
                                    </div>

                                    {formData.ofertaActiva && (
                                        <div className="space-y-2">
                                            <Label htmlFor="precioOferta">Precio de Oferta</Label>
                                            <Input
                                                id="precioOferta"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={formData.precioOferta}
                                                onChange={(e) => handleInputChange("precioOferta", e.target.value)}
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="esDestacado"
                                            checked={formData.esDestacado}
                                            onCheckedChange={(checked) => handleInputChange("esDestacado", checked)}
                                        />
                                        <Label htmlFor="esDestacado">Producto destacado</Label>
                                    </div>
                                </div>

                                <div className="flex space-x-4">
                                    <Button type="submit" disabled={saving}>
                                        {saving ? "Guardando..." : "Guardar Cambios"}
                                    </Button>
                                    <Link href="/admin/productos">
                                        <Button variant="outline">Cancelar</Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Images Panel */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Imágenes del Producto</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Upload Area */}
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                <div className="mt-4">
                                    <Label htmlFor="image-upload" className="cursor-pointer">
                                        <span className="text-sm font-medium text-primary hover:text-primary/80">
                                            Subir imágenes
                                        </span>
                                        <Input
                                            id="image-upload"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                                        />
                                    </Label>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        PNG, JPG, WEBP hasta 5MB
                                    </p>
                                </div>
                            </div>

                            {/* Current Images */}
                            {producto.imagenes && producto.imagenes.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium">Imágenes actuales</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {producto.imagenes.map((imagen) => (
                                            <div key={imagen.id} className="relative group">
                                                <Image
                                                    src={imagen.url}
                                                    alt={imagen.originalName}
                                                    width={100}
                                                    height={100}
                                                    className="rounded-md object-cover w-full h-24"
                                                />
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => handleDeleteImage(imagen.id)}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}