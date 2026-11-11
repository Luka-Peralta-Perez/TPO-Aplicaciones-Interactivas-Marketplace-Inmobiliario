import { Link } from "react-router-dom";

export default function NoEncontrada() {
    return (
        <main>
            <h1>404</h1>
            <p>
                La página que buscás no existe
            </p>

            <Link to="/">
                Volver al inicio
            </Link>
        </main>
    );
}