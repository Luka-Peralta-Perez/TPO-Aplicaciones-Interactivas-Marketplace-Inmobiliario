import { useState } from "react";
import styles from "./GaleriaPropiedad.module.css";

type Props = {
    titulo: string;
    fotos: string[];
    fotoPortada: string;
};

export function GaleriaPropiedad({ titulo, fotos, fotoPortada }: Props) {
    const [fotoSeleccionada, setFotoSeleccionada] = useState(fotoPortada || fotos[0] || "");

    return (
        <div className={styles.galeria}>
            {fotoSeleccionada && (
                <img src={fotoSeleccionada}
                    alt={titulo}
                    className={styles.fotoPrincipal} />
            )}

            {fotos.length > 1 && (
                <div className={styles.miniaturas}>
                    {fotos.map((foto, index) => (
                        <button key={`${foto}-${index}`}
                            type="button"
                            className={styles.botonMiniatura}
                            onClick={() => setFotoSeleccionada(foto)}>
                            
                            <img src={foto}
                                alt={`${titulo} ${index + 1}`}
                                className={styles.miniatura} />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}