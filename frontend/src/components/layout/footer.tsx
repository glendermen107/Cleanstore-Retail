import Link from "next/link"
import { Store, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-muted/50 border-t">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <Store className="h-8 w-8 text-primary" />
                            <span className="text-xl font-bold">Cleanstore</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Tu tienda de confianza para productos de limpieza y cuidado del hogar.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold">Enlaces Rápidos</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/productos" className="text-muted-foreground hover:text-foreground">
                                    Productos
                                </Link>
                            </li>
                            <li>
                                <Link href="/categorias" className="text-muted-foreground hover:text-foreground">
                                    Categorías
                                </Link>
                            </li>
                            <li>
                                <Link href="/ofertas" className="text-muted-foreground hover:text-foreground">
                                    Ofertas
                                </Link>
                            </li>
                            {/* TODO: Add authentication-based links */}
                            {/* <li>
                <Link href="/cuenta" className="text-muted-foreground hover:text-foreground">
                  Mi Cuenta
                </Link>
              </li> */}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold">Atención al Cliente</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/ayuda" className="text-muted-foreground hover:text-foreground">
                                    Centro de Ayuda
                                </Link>
                            </li>
                            <li>
                                <Link href="/envios" className="text-muted-foreground hover:text-foreground">
                                    Información de Envíos
                                </Link>
                            </li>
                            <li>
                                <Link href="/devoluciones" className="text-muted-foreground hover:text-foreground">
                                    Devoluciones
                                </Link>
                            </li>
                            <li>
                                <Link href="/contacto" className="text-muted-foreground hover:text-foreground">
                                    Contacto
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold">Contacto</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center space-x-2">
                                <Mail className="h-4 w-4" />
                                <span>info@cleanstore.cl</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Phone className="h-4 w-4" />
                                <span>+56 9 1234 5678</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4" />
                                <span>Santiago, Chile</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; 2024 Cleanstore Retail. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    )
}