import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Categoria } from "@/lib/api"
import { FolderOpen } from "lucide-react"

interface CategoryCardProps {
    categoria: Categoria
}

export function CategoryCard({ categoria }: CategoryCardProps) {
    return (
        <Link href={`/categorias/${categoria.id}`}>
            <Card className="group overflow-hidden transition-all hover:shadow-lg cursor-pointer">
                <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <FolderOpen className="h-8 w-8 text-primary" />
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                {categoria.nombre}
                            </h3>
                            {categoria.productos && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    {categoria.productos.length} productos
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}