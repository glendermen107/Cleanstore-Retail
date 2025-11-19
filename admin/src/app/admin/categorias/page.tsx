"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { categoriasApi, type Categoria } from "@/lib/api"
import { Plus, Edit, Trash2 } from "lucide-react"

export default function CategoriasPage() {
    const [categorias, setCategorias] = useState<Categoria[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null)
    const [formData, setFormData] = useState({ nombre: "" })

    useEffect(() => {
        fetchCategorias()
    }, [])

    const fetchCategorias = async () => {
        try {
            const response = await categoriasApi.getAll()
            setCategorias(response.data)
        } catch (error) {
            console.error("Error fetching categorias:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            if (editingCategoria) {
                await categoriasApi.update(editingCategoria.id, formData)
            } else {
                await categoriasApi.create(formData)
            }

            await fetchCategorias()
            setDialogOpen(false)
            setEditingCategoria(null)
            setFormData({ nombre: "" })
        } catch (error) {
            console.error("Error saving categoria:", error)
            alert("Error al guardar la categoría")
        }
    }

    const handleEdit = (categoria: Categoria) => {
        setEditingCategoria(categoria)
        setFormData({ nombre: categoria.nombre })
        setDialogOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de que quieres eliminar esta categoría?")) {
            return
        }

        try {
            await categoriasApi.delete(id)
            await fetchCategorias()
        } catch (error) {
            console.error("Error deleting categoria:", error)
            alert("Error al eliminar la categoría. Puede que tenga productos asociados.")
        }
    }

    const openCreateDialog = () => {
        setEditingCategoria(null)
        setFormData({ nombre: "" })
        setDialogOpen(true)
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Categorías</h1>
                </div>
                <Card>
                    <CardContent className="p-6">
                        <p>Cargando categorías...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Categorías</h1>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openCreateDialog}>
                            <Plus className="mr-2 h-4 w-4" />
                            Crear Categoría
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingCategoria ? "Editar Categoría" : "Crear Categoría"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nombre">Nombre de la Categoría</Label>
                                <Input
                                    id="nombre"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ nombre: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex space-x-2">
                                <Button type="submit">
                                    {editingCategoria ? "Actualizar" : "Crear"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setDialogOpen(false)}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Categorías</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Total Productos</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categorias.map((categoria) => (
                                <TableRow key={categoria.id}>
                                    <TableCell>{categoria.id}</TableCell>
                                    <TableCell className="font-medium">{categoria.nombre}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                            {categoria.totalProductos || 0} productos
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(categoria)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(categoria.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}