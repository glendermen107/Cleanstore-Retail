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
import { productosApi, categoriasApi, type Categoria } from "@/lib/api"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CrearProductoPage() {
    const router = useRouter()
    const [categorias, setCategorias] = useState<Categoria[]>([])
    const [loading, setLoading] = useState(false)
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
        const fetchCategorias = async () => {
            try {
                const response = await categoriasApi.getAll()
                setCategorias(response.data)
            } catch (error) {
                console.error("Error fetching categorias:", error)
            }
        }

        fetchCategorias()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

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

            await productosApi.create(data)
            router.push("/admin/productos")
        } catch (error) {
            console.error("Error creating producto:", error)
            alert("Error al crear el producto")
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/admin/productos">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">Crear Producto</h1>
            </div>

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
                            <Button type="submit" disabled={loading}>
                                {loading ? "Creando..." : "Crear Producto"}
                            </Button>
                            <Link href="/admin/productos">
                                <Button variant="outline">Cancelar</Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}