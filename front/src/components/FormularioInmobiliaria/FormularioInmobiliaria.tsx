import type { FormEventHandler } from "react";
import type { FormularioInmobiliariaHook } from "../../hooks/useFormularioInmobiliaria";
import styles from "./FormularioInmobiliaria.module.css";

type Props = {
    formulario: FormularioInmobiliariaHook;
    onSubmit: FormEventHandler<HTMLFormElement>;
    guardando: boolean;
    error: string | null;
    mensaje: string | null;
};

export function FormularioInmobiliaria({ formulario, onSubmit, guardando, error, mensaje }: Props) {
    const {
        nombre, setNombre,
        descripcion, setDescripcion,
        logoUrl, setLogoUrl,
        telefonoContacto, setTelefonoContacto,
        emailContacto, setEmailContacto,
        direccionOficina, setDireccionOficina,
        errores,
    } = formulario;

    return (
        <form className={styles.formulario} onSubmit={onSubmit} noValidate>
            <div className={styles.campo}>
                <label htmlFor="nombre">Nombre</label>
                <input
                    id="nombre"
                    type="text"
                    value={nombre}
                    onChange={(event) => setNombre(event.target.value)}
                    required />

                {errores.nombre && (
                    <p className={styles.error}>
                        {errores.nombre}
                    </p>
                )}
            </div>

            <div className={styles.campo}>
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                    id="descripcion"
                    rows={5}
                    value={descripcion}
                    onChange={(event) => setDescripcion(event.target.value)}
                    required />

                {errores.descripcion && (
                    <p className={styles.error}>
                        {errores.descripcion}
                    </p>
                )}
            </div>

            <div className={styles.campo}>
                <label htmlFor="logo">URL del logo</label>
                <input
                    id="logo"
                    type="text"
                    placeholder="https://..."
                    value={logoUrl}
                    onChange={(event) => setLogoUrl(event.target.value)} />
            </div>

            {logoUrl.trim() && (
                <img
                    src={logoUrl}
                    alt={`Logo de ${nombre}`}
                    className={styles.logo} />
            )}

            <div className={styles.campo}>
                <label htmlFor="telefono">Teléfono de contacto</label>
                <input
                    id="telefono"
                    type="tel"
                    value={telefonoContacto}
                    onChange={(event) => setTelefonoContacto(event.target.value)}
                    pattern="[0-9]{4}-[0-9]{6}"
                    placeholder="2254-111111"
                    title="Ingresá el teléfono con el formato 2254-111111"
                    required />

                {errores.telefonoContacto && (
                    <p className={styles.error}>
                        {errores.telefonoContacto}
                    </p>
                )}
            </div>

            <div className={styles.campo}>
                <label htmlFor="email">Email de contacto</label>
                <input
                    id="email"
                    type="email"
                    value={emailContacto}
                    onChange={(event) => setEmailContacto(event.target.value)}
                    required />

                {errores.emailContacto && (
                    <p className={styles.error}>
                        {errores.emailContacto}
                    </p>
                )}
            </div>

            <div className={styles.campo}>
                <label htmlFor="direccion">Dirección de la oficina</label>
                <input
                    id="direccion"
                    type="text"
                    value={direccionOficina}
                    onChange={(event) => setDireccionOficina(event.target.value)} />
            </div>

            {error && (
                <p className={styles.error}>
                    {error}
                </p>
            )}

            {mensaje && (
                <p className={styles.mensaje}>{mensaje}</p>
            )}

            <div className={styles.acciones}>
                <button
                    type="submit"
                    className={styles.botonPrincipal}
                    disabled={guardando}>
                    {guardando ? "Guardando..." : "Guardar cambios"}
                </button>
            </div>
        </form>
    );
}