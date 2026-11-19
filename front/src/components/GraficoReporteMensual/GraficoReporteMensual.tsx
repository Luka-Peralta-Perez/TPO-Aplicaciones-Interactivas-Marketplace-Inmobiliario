import type { ReporteMensual } from "../../types";
import styles from "./GraficoMensual.module.css";

type Props = {
    mensual: ReporteMensual[];
};

export function GraficoReporteMensual({ mensual }: Props) {
    const maximoMensual = Math.max(1, ...mensual.flatMap((item) => [
        item.publicacionesNuevas,
        item.ventas,
        item.alquileres,
    ]));

    function formatearMes(mes: string) {
        const [anio, numeroMes] = mes.split("-");
        const fecha = new Date(Number(anio), Number(numeroMes) - 1);

        return fecha.toLocaleDateString("es-AR", {
            month: "short",
            year: "numeric",
        });
    }

    function alturaBarra(valor: number) {
        if (valor === 0) {
            return "0px";
        }

        const altura = (valor / maximoMensual) * 160;
        return `${Math.max(altura, 8)}px`;
    }

    return (
        <>
            <div className={styles.leyenda}>
                <span>Publicaciones nuevas</span>
                <span>Ventas</span>
                <span>Alquileres</span>
            </div>

            <div className={styles.grafico}>
                {mensual.map((item) => (
                    <div key={item.mes} className={styles.grupoMes}>
                        <div className={styles.barras}>
                            <div
                                className={`${styles.barra} ${styles.publicaciones}`}
                                style={{ height: alturaBarra(item.publicacionesNuevas) }}
                                title={`Publicaciones: ${item.publicacionesNuevas}`}>
                                {item.publicacionesNuevas > 0 && item.publicacionesNuevas}
                            </div>

                            <div
                                className={`${styles.barra} ${styles.ventas}`}
                                style={{ height: alturaBarra(item.ventas) }}
                                title={`Ventas: ${item.ventas}`}>
                                {item.ventas > 0 && item.ventas}
                            </div>

                            <div
                                className={`${styles.barra} ${styles.alquileres}`}
                                style={{ height: alturaBarra(item.alquileres) }}
                                title={`Alquileres: ${item.alquileres}`}>
                                {item.alquileres > 0 && item.alquileres}
                            </div>
                        </div>

                        <span className={styles.mes}>
                            {formatearMes(item.mes)}
                        </span>
                    </div>
                ))}
            </div>
        </>
    );
}